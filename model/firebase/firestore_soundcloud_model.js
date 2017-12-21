class FirestoreSoundcloudModel extends SoundcloudModel {
    constructor() {
        super();
        this.db = firebase.firestore();
    }

    async getOrCreateTrack(rawTrack) {
        const uploader = await this.getOrCreateProfile(rawTrack.uploader);
        const track = new Track(rawTrack, uploader);
        return this.db
            .collection('tracks')
            .doc(track.getId())
            .get()
            .then(function(trackDoc) {
                if (trackDoc.exists) {
                    return new Track(trackDoc.data(), uploader);
                } else {
                    return track;
                }
            });
    }

    async getOrCreateProfile(rawProfile) {
        const profile = new Profile(rawProfile);
        return this.db
            .collection('profiles')
            .doc(profile.getId())
            .get()
            .then(function(profileDoc) {
                if (profileDoc.exists) {
                    return new Profile(profileDoc.data());
                } else {
                    return profile;
                }
            });
    }

    async getOrCreateRepost(rawRepost, reposter, track) {
        const reposterAndTrack = await Promise.all([
            this.getOrCreateProfile(rawRepost.reposter),
            this.getOrCreateTrack(rawRepost.track)
        ]);
        const repost = new Repost(rawRepost, reposterAndTrack[0], reposterAndTrack[1]);
        return this.db
            .collection('reposts')
            .doc(repost.getId())
            .get()
            .then(function(repostDoc) {
                if (repostDoc.exists) {
                    return new Repost(repostDoc.data(), reposterAndTrack[0], reposterAndTrack[1]);
                } else {
                    return repost;
                }
            });
    }

    async saveRepost(repost) {
        const jsonRepost = JSON.parse(JSON.stringify(repost));
        return Promise.all([
            this.saveProfile(repost.reposter),
            this.saveTrack(repost.track),
            this.db
                .collection('reposts')
                .doc(repost.getId())
                .set(jsonRepost)
        ]);
    }

    async saveTrack(track) {
        const jsonTrack = JSON.parse(JSON.stringify(track));
        return Promise.all([
            this.saveProfile(track.uploader),
            this.db
                .collection('tracks')
                .doc(track.getId())
                .set(jsonTrack)
        ]);
    }

    async saveProfile(profile) {
        const jsonProfile = JSON.parse(JSON.stringify(profile));
        return this.db
            .collection('profiles')
            .doc(profile.getId())
            .set(jsonProfile);
    }
}
