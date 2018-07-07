class FirestoreSoundcloudModel extends SoundcloudModel {
    constructor(firestoreConnection) {
        super();
        this.connection = firestoreConnection;
    }

    async getOrCreateRepost(rawRepost) {
        const reposterAndTrack = await Promise.all([
            this.getOrCreateProfile(rawRepost.reposter),
            this.getOrCreateTrack(rawRepost.track)
        ]);
        const reposter = reposterAndTrack[0];
        const track = reposterAndTrack[1];
        const repost = new Repost(rawRepost, reposter, track);
        if (await this.connection.objectExists('reposts', repost.getId())) {
            return new Repost(await this.connection.getObject('reposts', repost.getId()), reposter, track);
        } else {
            return repost;
        }
    }

    async getOrCreateTrack(rawTrack) {
        const uploader = await this.getOrCreateProfile(rawTrack.uploader);
        const track = new Track(rawTrack, uploader);
        if (await this.connection.objectExists('tracks', track.getId())) {
            return new Track(await this.connection.getObject('tracks', track.getId()), uploader);
        } else {
            return track;
        }
    }

    async getOrCreateProfile(rawProfile) {
        const profile = new Profile(rawProfile);
        if (await this.connection.objectExists('profiles', profile.getId())) {
            return new Profile(await this.connection.getObject('profiles', profile.getId()));
        } else {
            return profile;
        }
    }

    async saveRepost(repost) {
        return Promise.all([
            this.saveProfile(repost.reposter),
            this.saveTrack(repost.track),
            this.connection.saveObject('reposts', repost.getId(), repost)
        ]);
    }

    async saveTrack(track) {
        return Promise.all([
            this.saveProfile(track.uploader),
            this.connection.saveObject('tracks', track.getId(), track.saveable())
        ]);
    }

    async saveProfile(profile) {
        return this.connection.saveObject('profiles', profile.getId(), profile);
    }

    async setCategoryOnCurrentlyPlayingTrack(category) {
        await this.currentlyPlayingTrack.setCategory(category);
        return this.saveTrack(this.currentlyPlayingTrack);
    }

    async addLabelOnCurrentlyPlayingTrack(label) {
        await this.currentlyPlayingTrack.addLabel(label);
        return this.saveTrack(this.currentlyPlayingTrack);
    }

    async removeLabelFromCurrentlyPlayingTrack(labelId) {
        await this.currentlyPlayingTrack.removeLabel(labelId);
        return this.saveTrack(this.currentlyPlayingTrack);
    }
}
