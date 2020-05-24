class PlaylistRepost extends StreamAction {
    constructor(track, playlist, time, reposter) {
        if (track == null || playlist == null || time == null || reposter == null) {
            throw new Error('Playlist repost does not have all required values');
        }

        super('PLAYLIST_REPOST', track);
        this.playlist = playlist;
        this.time = time;
        this.reposter = reposter;
        this.id = reposter.id + ';' + time + ';' + playlist.id;
    }

    asJSON() {
        const json = super.asJSON();
        json.playlist = this.playlist.asJSON();
        json.time = this.time;
        json.reposter = this.reposter.asJSON();
        return json;
    }

    static fromJSON(json) {
        return new PlaylistRepost(
            Track.fromJSON(json.track),
            Playlist.fromJSON(json.playlist),
            json.time,
            Profile.fromJSON(json.reposter)
        );
    }

    async update(backend) {
        return backend.updatePlaylistRepost(this);
    }
}
