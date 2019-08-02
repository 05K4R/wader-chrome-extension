class StreamAction {
    constructor(type, track) {
        this.type = type;
        this.track = track;
    }

    static fromJSON(json) {
        if (json.type == 'UPLOAD') {
            return UploadAction.fromJSON(json);
        } else if (json.type == 'REPOST') {
            return RepostAction.fromJSON(json);
        }
    }

    asJSON() {
        return {
            type: this.type,
            track: this.track.asJSON()
        }
    }
}
