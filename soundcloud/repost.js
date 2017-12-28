class Repost {
    constructor(rawRepost, reposter, track) {
        if (rawRepost.time == undefined || track == undefined || reposter == undefined) {
            throw new Error('Repost does not have all required values');
        }

        this.time = rawRepost.time;
        this.track = track;
        this.reposter = reposter;
    }

    getId() {
        return this.reposter.getId() + ';' + this.time + ';' + this.track.getId();
    }
}
