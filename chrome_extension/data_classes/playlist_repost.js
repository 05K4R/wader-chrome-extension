class PlaylistRepost extends StreamAction {
    constructor(track, playlist, reposter) {
        if (track == null || playlist == null || reposter == null) {
            throw new Error('Playlist repost does not have all required values');
        }

        super('PLAYLIST_REPOST', track);
        this.playlist = playlist;
        this.reposter = reposter;
    }

    asJSON() {
        const json = super.asJSON();
        json.playlist = this.playlist.asJSON();
        json.reposter = this.reposter.asJSON();
        return json;
    }

    static fromJSON(json) {
        return new PlaylistRepost(
            Track.fromJSON(json.track),
            Playlist.fromJSON(json.playlist),
            Profile.fromJSON(json.reposter)
        );
    }

    async update(backend) {
        return backend.updatePlaylistRepost(this);
    }
}
