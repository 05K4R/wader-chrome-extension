class PlaylistRepost extends StreamAction {
    playlist: Playlist;
    time: number;
    reposter: Profile;
    id: string;

    constructor(track: Track, playlist: Playlist, time: number, reposter: Profile) {
        if (track == null || playlist == null || time == null || reposter == null) {
            throw new Error('Playlist repost does not have all required values');
        }

        super('PLAYLIST_REPOST', track);
        this.playlist = playlist;
        this.time = time;
        this.reposter = reposter;
        this.id = reposter.id + ';' + time + ';' + playlist.id;
    }

    asJSON(): any {
        const json = super.asJSON();
        json.playlist = this.playlist.asJSON();
        json.time = this.time;
        json.reposter = this.reposter.asJSON();
        return json;
    }

    static fromJSON(json: any) {
        return new PlaylistRepost(
            Track.fromJSON(json.track),
            Playlist.fromJSON(json.playlist),
            json.time,
            Profile.fromJSON(json.reposter)
        );
    }

    async update(backend: WaderBackend) {
        return backend.updatePlaylistRepost(this);
    }
}
