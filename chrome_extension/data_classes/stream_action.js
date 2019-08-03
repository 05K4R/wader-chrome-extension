class StreamAction {
    constructor(type, track) {
        if (type == null || track == null) {
            throw new Error('StreamAction does not have all required values');
        }

        this.type = type;
        this.track = track;
    }

    static fromJSON(json) {
        if (json.type == 'UPLOAD') {
            return Upload.fromJSON(json);
        } else if (json.type == 'REPOST') {
            return Repost.fromJSON(json);
        }
    }

    asJSON() {
        return {
            type: this.type,
            track: this.track.asJSON()
        }
    }
}
