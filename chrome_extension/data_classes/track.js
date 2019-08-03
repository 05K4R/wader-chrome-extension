class Track {
    constructor(uploader, url, name, category) {
        if (uploader == null || url == null) {
            throw new Error('Track does not have all required values');
        }

        this.uploader = uploader;
        this.url = url;
        this.name = name;
        this.category = category;
    }

    static fromJSON(json) {
        return new Track(Profile.fromJSON(json.uploader), json.url, json.name, json.category);
    }

    asJSON() {
        return {
            uploader: this.uploader,
            url: this.url,
            name: this.name,
            category: this.category
        }
    }

    async update(backend) {
        return backend.updateTrack(this);
    }
}
