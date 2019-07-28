class Track {
    constructor(uploader, url, name, category) {
        if (uploader == undefined || url == undefined) {
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

    async save(functions) {
        return functions.updateTrack(this);
    }

    async update(connection) {
        const trackId = this.uploader.url + ';' + this.url;
        if (await connection.objectExists('track', trackId)) {
            const track = await connection.getObject('track', trackId);
            const uploader = await this.uploader.update(connection);
            return new Track(uploader, track.url, track.name, track.category);
        } else {
            return this;
        }
    }
}
