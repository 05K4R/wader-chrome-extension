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
        const updatedProfile = await this.getObject('profiles', profile.url);
        const profileScore = await this.getProfileScore(updatedProfile.url);
        return new Profile(updatedProfile.url, updatedProfile.name, profileScore);
    }

    async updateTrack(track) {
        await this.functions.updateTrack(track);
        const trackId = track.uploader.url + ';' + track.url;
        const updatedTrack = await this.getObject('tracks', trackId);
        const uploader = await track.uploader.update(this);
        return new Track(uploader, updatedTrack.url, updatedTrack.name, updatedTrack.category);
    }

    async updateRepost(repost) {
        await this.functions.updateRepost(repost);
        const track = await repost.track.update(this);
        const reposter = await repost.reposter.update(this);
        return new RepostAction(track, repost.time, reposter);
    }

    async objectExists(collectionName, objectId) {
        return this.connection.objectExists(collectionName, objectId);
    }

    async getObject(collectionName, objectId) {
        return this.connection.getObject(collectionName, objectId);
    }
}
