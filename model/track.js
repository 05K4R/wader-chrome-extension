class Track {
    constructor(rawTrack, uploader, category, labels) {
        if (rawTrack.url == undefined || uploader == undefined) {
            throw new Error('Track does not have all required values');
        }

        this.url = rawTrack.url;
        this.name = rawTrack.name;
        this.uploader = uploader;
        this.category = category;

        if (labels != undefined) {
            this.labels = labels;
        } else {
            this.labels = new Collection();
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
}
