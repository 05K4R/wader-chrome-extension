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

    async save(functions) {
        return functions.updateRepost(this);
    }

    async update(connection) {
        return new RepostAction(await this.track.update(connection), this.time, await this.reposter.update(connection));
    }
}
