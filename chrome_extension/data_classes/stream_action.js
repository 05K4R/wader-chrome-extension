class StreamAction {
    constructor(type, track) {
        if (type == null || track == null) {
            throw new Error('StreamAction does not have all required values');
        }

        this.type = type;
        this.track = track;
    }

    static fromJSON(json) {
        if (json.type === 'UPLOAD') {
            return Upload.fromJSON(json);
        } else if (json.type === 'REPOST') {
            return Repost.fromJSON(json);
        } else if (json.type === 'PLAYLIST_POST') {
            return PlaylistPost.fromJSON(json);
        } else if (json.type === 'PLAYLIST_REPOST') {
            return PlaylistRepost.fromJSON(json);
        } else {
            throw new Error('Unrecognized action type: ' + json.type);
        }
    }

    asJSON() {
        return {
            type: this.type,
            track: this.track.asJSON()
        }
    }
}
