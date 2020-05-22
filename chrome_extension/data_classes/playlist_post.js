class PlaylistPost extends StreamAction {
    constructor(track, playlist) {
        if (track == null || playlist == null) {
            throw new Error('Playllist does not have all required values');
        }

        super('PLAYLIST_POST', track);
        this.playlist = playlist;
    }

    static fromJSON(json) {
        return new PlaylistPost(Track.fromJSON(json.track), Playlist.fromJSON(json.playlist));
    }

    asJSON() {
        const json = super.asJSON();
        json.playlist = this.playlist.asJSON();
        return json;
    }

    async update(backend) {
        return backend.updatePlaylistPost(this);
    }
}
