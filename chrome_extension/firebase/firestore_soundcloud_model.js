class FirestoreSoundcloudModel {
    constructor(firestoreConnection, waderFunctions) {
        this.connection = firestoreConnection;
        this.functions = waderFunctions;
        chrome.runtime.onMessage.addListener(this.newCurrentTrackListener.bind(this));
    }

    newCurrentTrackListener(request, sender, sendResponse) {
        if (request.subject == 'newCurrentlyPlayingStreamAction') {
            console.log(request.streamAction);
            const streamAction = StreamAction.fromJSON(request.streamAction);

            this.saveStreamAction(streamAction).then(() => {
                this.setCurrentlyPlayingStreamAction(streamAction);
            });
        }
    }

    async saveStreamAction(streamAction) {
        return streamAction.save(this.functions);
    }

    async setCurrentlyPlayingStreamAction(streamAction) {
        streamAction.update(this.connection);
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
        return this.functions.updateRepost(repost);
    }

    async saveTrack(track) {
        return this.functions.updateTrack(track);
    }

    async saveProfile(profile) {
        return this.functions.updateProfile(profile);
    }

    async setCategoryOnCurrentlyPlayingTrack(category) {
        return this.functions.setCategoryOnTrack(category.id, this.currentlyPlayingTrack);
    }
}
