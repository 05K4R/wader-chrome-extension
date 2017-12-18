class Repost {
    constructor(rawRepost, reposter, track) {
        if (track == undefined || reposter == undefined || rawRepost.time == undefined) {
            throw new Error('Repost does not have all required values');
        }

        this.track = track;
        this.reposter = reposter;
        this.time = rawRepost.time;
        this.id = Repost.getId(rawRepost);
    }

    static getId(rawRepost) {
        if (rawRepost.time != undefined) {
            return Profile.getId(rawRepost.reposter) + ';' + rawRepost.time + ';' + Track.getId(rawRepost.track);
        } else {
            throw new Error('Repost time is needed for ID generation.');
        }
    }
}
