class SoundcloudModel {
    constructor() {
        this.reposts = new Collection();
        this.tracks = new Collection();
        this.profiles = new Collection();
    }

    async setCurrentlyPlayingTrack(rawTrack) {
        const track = await this.getOrCreateTrack(rawTrack);
        this.currentlyPlayingTrack = track;
        return this.saveTrack(track);
    }

    async setCurrentlyPlayingRepostedTrack(rawRepost) {
        const repostAndTrack = await Promise.all([
            this.getOrCreateRepost(rawRepost),
            this.setCurrentlyPlayingTrack(rawRepost.track)
        ]);
        return this.saveRepost(repostAndTrack[0]);
    }

    async getOrCreateTrack(rawTrack) {
        const uploader = await this.getOrCreateProfile(rawTrack.uploader);
        const track = new Track(rawTrack, uploader);
        if (this.tracks.has(track.getId())) {
            return this.tracks.get(track.getId());
        } else {
            return track;
        }
    }

    async getOrCreateProfile(rawProfile) {
        const profile = new Profile(rawProfile);
        if (this.profiles.has(profile.getId())) {
            return this.profiles.get(profile.getId());
        } else {
            return profile;
        }
    }

    async getOrCreateRepost(rawRepost) {
        const reposterAndTrack = await Promise.all([
            this.getOrCreateProfile(rawRepost.reposter),
            this.getOrCreateTrack(rawRepost.track)
        ]);
        const repost = new Repost(rawRepost, reposterAndTrack[0], reposterAndTrack[1]);
        if (this.reposts.has(repost.getId())) {
            return this.reposts.has(repost.getId());
        } else {
            return repost;
        }
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
        this.currentlyPlayingTrack.removeLabel(labelId);
        return this.saveTrack(this.currentlyPlayingTrack);
    }

    async saveRepost(repost) {
        this.reposts.add(repost);
        return Promise.all([
            this.saveProfile(repost.reposter),
            this.saveTrack(repost.track)
        ]);
    }

    async saveTrack(track) {
        this.tracks.add(track);
        return this.saveProfile(track.uploader);
    }

    async saveProfile(profile) {
        this.profiles.add(profile);
        return this;
    }
}
