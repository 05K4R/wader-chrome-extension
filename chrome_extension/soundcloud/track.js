class Track {
    constructor(rawTrack, uploader) {
        if (rawTrack.url == undefined || uploader == undefined) {
            throw new Error('Track does not have all required values');
        }

        this.url = rawTrack.url;
        this.name = rawTrack.name;
        this.category = rawTrack.category;
        this.uploader = uploader;

        this.labels = new Collection();
        if (rawTrack.labels != undefined) {
            for (const rawLabel of rawTrack.labels) {
                this.labels.add(new Group(rawLabel));
            }
        }
    }

    getId() {
        return this.uploader.getId() + ';' + this.url;
    }

    setCategory(category) {
        this.category = category;
        return this;
    }

    addLabel(label) {
        this.labels.add(label);
        return this;
    }

    removeLabel(labelId) {
        this.labels.remove(labelId);
        return this;
    }

    asJSON() {
        return {
            id: this.getId(),
            url: this.url,
            name: this.name,
            category: this.category,
            labels: this.labels.getAll(),
            uploader: this.uploader.asJSON()
        }
    }
}
