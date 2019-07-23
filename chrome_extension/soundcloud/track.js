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
