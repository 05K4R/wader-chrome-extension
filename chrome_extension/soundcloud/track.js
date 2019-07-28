class Track {
    constructor(rawTrack, uploader) {
        if (rawTrack.url == undefined || uploader == undefined) {
            throw new Error('Track does not have all required values');
        }

        this.url = rawTrack.url;
        this.name = rawTrack.name;
        this.category = rawTrack.category;
        this.uploader = uploader;
    }

    getId() {
        return this.uploader.getId() + ';' + this.url;
    }

    setCategory(category) {
        this.category = category.id;
        return this;
    }

    asJSON() {
        return {
            id: this.getId(),
            url: this.url,
            name: this.name,
            category: this.category,
            uploader: this.uploader.asJSON()
        }
    }
}

class NewTrack {
    constructor(uploader, url, name, category) {
        this.uploader = uploader;
        this.url = url;
        this.name = name;
        this.category = category;
    }

    static fromJSON(json) {
        return new NewTrack(NewProfile.fromJSON(json.uploader), json.url, json.name, json.category);
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
            return new NewTrack(uploader, track.url, track.name, track.category);
        } else {
            return this;
        }
    }
}
