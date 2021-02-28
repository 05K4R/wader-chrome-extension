class PlaylistPost extends StreamAction {
    playlist: Playlist;

    constructor(track: Track, playlist: Playlist) {
        if (track == null || playlist == null) {
            throw new Error('Playllist does not have all required values');
        }

        super('PLAYLIST_POST', track);
        this.playlist = playlist;
    }

    static fromJSON(json: any) {
        return new PlaylistPost(Track.fromJSON(json.track), Playlist.fromJSON(json.playlist));
    }

    asJSON(): any {
        const json = super.asJSON();
        json.playlist = this.playlist.asJSON();
        return json;
    }

    async update(backend: WaderBackend) {
        return backend.updatePlaylistPost(this);
    }
}
