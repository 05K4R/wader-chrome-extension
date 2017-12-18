class SoundcloudModel {
    constructor() {
        this.reposts = new Collection();
        this.tracks = new Collection();
        this.profiles = new Collection();
    }

    setCurrentlyPlayingTrack(rawTrack) {
        const track = this.getOrCreateTrack(rawTrack);
        const uploader = this.getOrCreateProfile(rawTrack.uploader);
        uploader.addUpload(track);
        this.saveTrack(track);
        this.saveProfile(uploader);
        this.currentlyPlayingTrack = track;
        return track;
    }

    setCurrentlyPlayingRepostedTrack(rawRepost) {
        const track = this.setCurrentlyPlayingTrack(rawRepost.track);
        const reposter = this.getOrCreateProfile(rawRepost.reposter);
        const repost = this.getOrCreateRepost(rawRepost, reposter, track);
        reposter.addRepost(repost);
        this.saveRepost(repost);
        this.saveProfile(reposter);
        return repost;
    }

    getOrCreateTrack(rawTrack, category, labels) {
        const trackId = Track.getId(rawTrack);
        if (this.tracks.has(trackId)) {
            return this.tracks.get(trackId);
        } else {
            return new Track(rawTrack, category, labels);
        }
    }

    getOrCreateProfile(rawProfile) {
        const profileId = Profile.getId(rawProfile);
        if (this.profiles.has(profileId)) {
            return this.profiles.get(profileId);
        } else {
            return new Profile(rawProfile);
        }
    }

    getOrCreateRepost(rawRepost, reposter, track) {
        const repostId = Repost.getId(rawRepost);
        if (this.reposts.has(repostId)) {
            return this.reposts.get(repostId);
        } else {
            return new Repost(rawRepost, reposter, track);
        }
    }

    setCategoryOnCurrentlyPlayingTrack(category) {
        this.currentlyPlayingTrack.setCategory(category);
        return category;
    }

    saveRepost(repost) {
        this.reposts.add(repost);
    }

    saveTrack(track) {
        this.tracks.add(track);
    }

    saveProfile(profile) {
        this.profiles.add(profile);
    }
}
