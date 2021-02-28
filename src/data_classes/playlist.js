class Playlist {
    constructor(poster, url, tracks) {
        if (poster == null || url == null) {
            throw new Error('Playlist does not have all required values');
        }

        this.poster = poster;
        this.url = url;
        this.tracks = tracks;
        this.id = poster.id + ';' + url;
    }

    static fromJSON(json) {
        return new Playlist(Profile.fromJSON(json.poster), json.url, json.tracks);
    }

    asJSON() {
        return {
            poster: this.poster.asJSON(),
            url: this.url,
            tracks: this.tracks
        };
    }

    async update(backend) {
        return backend.updatePlaylist(this);
    }
}
