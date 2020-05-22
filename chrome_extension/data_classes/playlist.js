class Playlist {
    constructor(poster, url) {
        if (poster == null || url == null) {
            throw new Error('Playlist does not have all required values');
        }

        this.poster = poster;
        this.url = url;
        this.id = poster.id + ';' + url;
    }

    static fromJSON(json) {
        return new Playlist(Profile.fromJSON(json.poster), json.url);
    }

    asJSON() {
        return {
            poster: this.poster.asJSON(),
            url: this.url
        }
    }

    async update(backend) {
        return backend.updatePlaylist(this);
    }
}
