class Repost extends StreamAction {
    time: number;
    reposter: Profile;
    id: string;

    constructor(track: Track, time: number, reposter: Profile) {
        if (track == null || time == null || reposter == null) {
            throw new Error('Repost does not have all required values');
        }

        super('REPOST', track);
        this.time = time;
        this.reposter = reposter;
        this.id = reposter.id + ';' + time + ';' + track.id;
    }

    static fromJSON(json: any) {
        return new Repost(Track.fromJSON(json.track), json.time, Profile.fromJSON(json.reposter));
    }

    asJSON(): any {
        const json = super.asJSON();
        json.time = this.time;
        json.reposter = this.reposter.asJSON();
        return json;
    }

    async update(backend: WaderBackend) {
        return backend.updateRepost(this);
    }
}
