class Repost extends StreamAction {
    constructor(track, time, reposter) {
        if (track == null || time == null || reposter == null) {
            throw new Error('Repost does not have all required values');
        }

        super('REPOST', track);
        this.time = time;
        this.reposter = reposter;
        this.id = reposter.id + ';' + time + ';' + track.id;
    }

    static fromJSON(json) {
        return new Repost(Track.fromJSON(json.track), json.time, Profile.fromJSON(json.reposter));
    }

    asJSON() {
        const json = super.asJSON();
        json.time = this.time;
        json.reposter = this.reposter.asJSON();
        return json;
    }

    async update(backend) {
        return backend.updateRepost(this);
    }
}
