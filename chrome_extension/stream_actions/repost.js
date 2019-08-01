class RepostAction extends StreamAction {
    constructor(track, time, reposter) {
        if (track == undefined || time == undefined || reposter == undefined) {
            throw new Error('Repost does not have all required values');
        }

        super('REPOST', track);
        this.time = time;
        this.reposter = reposter;
    }

    static fromJSON(json) {
        return new RepostAction(Track.fromJSON(json.track), json.time, Profile.fromJSON(json.reposter));
    }

    asJSON() {
        const json = super.asJSON();
        json.time = this.time;
        json.reposter = this.reposter.asJSON();

        return json;
    }

    async save(backend) {
        return backend.functions.updateRepost(this);
    }

    async update(backend) {
        const track = await this.track.update(backend);
        const reposter = await this.reposter.update(backend);
        return new RepostAction(track, this.time, reposter);
    }
}
