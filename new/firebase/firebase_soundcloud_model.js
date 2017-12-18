class FirebaseSoundcloudModel extends SoundcloudModel {
    constructor() {
        super();
        this.db = firebase.firestore();
    }

    setCurrentlyPlayingTrack(rawTrack) {
        // TODO
        return super.setCurrentlyPlayingTrack(rawTrack);
    }

    setCurrentlyPlayingRepostedTrack(rawRepost) {
        // TODO
        return super.setCurrentlyPlayingRepostedTrack(rawRepost);
    }

    getOrCreateTrack(rawTrack) {
        // TODO
        return super.getOrCreateTrack(rawTrack);
    }

    getOrCreateProfile(rawProfile) {
        // TODO
        return super.getOrCreateProfile(rawProfile);
    }

    getOrCreateRepost(rawRepost, reposter, track) {
        // TODO
        return super.getOrCreateRepost(rawRepost, reposter, track);
    }

    setCategoryOnCurrentlyPlayingTrack(category) {
        // TODO
        return super.setCategoryOnCurrentlyPlayingTrack(category);
    }

    saveRepost(repost) {
        repost = JSON.parse(JSON.stringify(repost));
        return this.db
            .collection('reposts')
            .doc(repost.id)
            .set(repost, { merge:true });
    }

    saveTrack(track) {
        track = JSON.parse(JSON.stringify(track));
        return this.db
            .collection('tracks')
            .doc(track.id)
            .set(track, { merge:true });
    }

    saveProfile(profile) {
        profile = JSON.parse(JSON.stringify(profile));
        return this.db
            .collection('profiles')
            .doc(profile.id)
            .set(profile, { merge:true });
    }
}
