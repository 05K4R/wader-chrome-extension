class Playlist {
    poster: Profile;
    url: string;
    tracks: Array<Track>;
    id: string;

    constructor(poster: Profile, url: string, tracks: Array<Track>) {
        if (poster == null || url == null) {
            throw new Error('Playlist does not have all required values');
        }

        this.poster = poster;
        this.url = url;
        this.tracks = tracks;
        this.id = poster.id + ';' + url;
    }

    static fromJSON(json: any) {
        return new Playlist(Profile.fromJSON(json.poster), json.url, json.tracks);
    }

    asJSON(): any {
        return {
            poster: this.poster.asJSON(),
            url: this.url,
            tracks: this.tracks
        };
    }

    async update(backend: WaderBackend) {
        return backend.updatePlaylist(this);
    }
}
