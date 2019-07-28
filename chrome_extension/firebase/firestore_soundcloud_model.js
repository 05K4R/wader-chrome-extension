class FirestoreSoundcloudModel {
    constructor(firestoreConnection) {
        this.connection = firestoreConnection;
    }

    async setCurrentlyPlayingTrack(rawTrack, reposted) {
        const track = await this.getOrCreateTrack(rawTrack);
        this.currentlyPlayingTrack = track;

        if (!reposted) {
            this.currentRepost = undefined;
        }

        return this.saveTrack(track);
    }

    async setCurrentlyPlayingRepostedTrack(rawRepost) {
        const repostAndTrack = await Promise.all([
            this.getOrCreateRepost(rawRepost),
            this.setCurrentlyPlayingTrack(rawRepost.track, true)
        ]);
        this.currentRepost = repostAndTrack[0];
        return this.saveRepost(repostAndTrack[0]);
    }

    async getCurrentlyPlayingTrack() {
        return this.currentlyPlayingTrack;
    }

    async getCurrentRepost() {
        return this.currentRepost;
    }

    async currentlyPlayingTrackIsReposted() {
        return this.currentRepost != null;
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
        const args = {
            repostInfo: repost.asJSON()
        }

        args.repostInfo.reposterInfo = repost.reposter.asJSON();
        args.repostInfo.trackInfo = repost.track.asJSON();
        args.repostInfo.trackInfo.uploaderInfo = repost.track.uploader.asJSON();
        return this.connection.runCloudFunction('updateRepost', args);
    }

    async saveTrack(track) {
        const args = {
            trackInfo: track.asJSON()
        }

        args.trackInfo.uploaderInfo = track.uploader.asJSON();
        return this.connection.runCloudFunction('updateTrack', args);
    }

    async saveProfile(profile) {
        const args = {
            profileInfo: profile.asJSON()
        };

        return this.connection.runCloudFunction('updateProfile', args);
    }

    async setCategoryOnCurrentlyPlayingTrack(category) {
        const args = {
            category: category.id,
            trackInfo: this.currentlyPlayingTrack.asJSON()
        }

        args.trackInfo.uploaderInfo = this.currentlyPlayingTrack.uploader.asJSON();
        return this.connection.runCloudFunction('setCategoryOnTrack', args);
    }
}
