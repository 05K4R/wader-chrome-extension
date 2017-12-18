class Track {
    constructor(rawTrack, category, labels) {
        if (rawTrack.id == undefined && rawTrack.url == undefined) {
            throw new Error('Track does not have all required values');
        }

        this.url = rawTrack.url;
        this.name = rawTrack.name;
        this.category = category;
        this.id = Track.getId(rawTrack);

        if (labels != undefined) {
            this.labels = labels;
        } else {
            this.labels = new Collection();
        }
    }

    static getId(rawTrack) {
        if (rawTrack.url != undefined) {
            return Profile.getId(rawTrack.uploader) + ';' + rawTrack.url;
        } else {
            throw new Error('Track URL is needed for ID generation.');
        }
    }

    setCategory(category) {
        this.category = category;
    }

    addLabel(label) {
        this.labels.add(label);
    }

    removeLabel(label) {
        this.labels.remove(label.id);
    }
}
