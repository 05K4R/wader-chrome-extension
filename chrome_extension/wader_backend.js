class WaderBackend {
    constructor() {
        this.authenticator = new FirebaseAuthenticator();
        this.connection = new FirestoreConnection(this.authenticator);
        this.functions = new WaderFunctions(this.connection);
    }

    async getProfileScore(profileUrl) {
        return this.functions.getProfileScore(profileUrl);
    }

    async setCategoryOnTrack(category, track) {
        return this.functions.setCategoryOnTrack(category, track);
    }

    async updateProfile(profile) {
        await this.functions.updateProfile(profile);
        return this.getProfile(profile.id);
    }

    async updateTrack(track) {
        await this.functions.updateTrack(track);
        return this.getTrack(track.id);
    }

    async updateRepost(repost) {
        await this.functions.updateRepost(repost);
        return this.getRepost(repost.id);
    }

    async updateUpload(upload) {
        await this.functions.updateTrack(upload.track);
        return this.getUpload(upload.track.id);
    }

    async updatePlaylist(playlist) {
        await this.updateProfile(playlist.poster);
        const playlistData = {
            id: playlist.id,
            url: playlist.url,
            poster: playlist.poster.id,
            tracks: []
        };
        const existingPlaylist = await this.getPlaylist(playlist.id);
        if (existingPlaylist) {
            playlistData.tracks = existingPlaylist.tracks;
        }
        await this.setObject('playlists', playlistData);
        return this.getPlaylist(playlist.id);
    }

    async updatePlaylistPost(post) {
        await this.updateTrack(post.track);
        const playlistData = {
            id: post.playlist.id,
            url: post.playlist.url,
            poster: post.playlist.poster.id
        };
        const existingPlaylist = await this.getPlaylist(post.playlist.id);
        if (existingPlaylist) {
            playlistData.tracks = [...(existingPlaylist.tracks).map((track) => track.id), post.track.id];
        } else {
            playlistData.tracks = [post.track.id];
        }
        await this.setObject('playlists', playlistData);
        const playlist = await this.getPlaylist(post.playlist.id);
        return new PlaylistPost(post.track, playlist);
    }

    async updatePlaylistRepost(repost) {
        await this.updatePlaylistPost(repost);
        await this.updateProfile(repost.reposter);
        const playlistData = {
            id: repost.id,
            reposter: repost.reposter.id,
            playlist: repost.playlist.id,
            time: repost.time
        };
        await this.setObject('playlistReposts', playlistData);
        const playlist = await this.getPlaylist(repost.playlist.id);
        const reposter = await this.getProfile(repost.reposter.id);
        return new PlaylistRepost(repost.track, playlist, repost.time, reposter);
    }

    async getProfile(profileId) {
        const profile = await this.getObject('profiles', profileId);
        const profileScore = await this.getProfileScore(profileId);
        return new Profile(profile.url, profile.name, profileScore);
    }

    async getTrack(trackId) {
        const track = await this.getObject('tracks', trackId);
        const uploader = await this.getProfile(track.uploader);
        return new Track(uploader, track.url, track.name, track.category);
    }

    async getRepost(repostId) {
        const repost = await this.getObject('reposts', repostId);
        const track = await this.getTrack(repost.track);
        const reposter = await this.getProfile(repost.reposter);
        return new Repost(track, repost.time, reposter);
    }

    async getUpload(trackId) {
        const track = await this.getTrack(trackId);
        return new Upload(track);
    }

    async getPlaylist(playlistId) {
        const playlist = await this.getObject('playlists', playlistId);
        if (!playlist) {
            return;
        }
        const poster = await this.getProfile(playlist.poster);
        const tracks = [];
        for await (const trackId of playlist.tracks) {
            tracks.push(await this.getTrack(trackId));
        }
        return new Playlist(poster, playlist.url, tracks);
    }

    async objectExists(collectionName, objectId) {
        return this.connection.objectExists(collectionName, objectId);
    }

    async getObject(collectionName, objectId) {
        return this.connection.getObject(collectionName, objectId);
    }

    async setObject(collectionName, object) {
        return this.connection.setObjectWithMerge(collectionName, object);
    }
}
