class WaderBackend {
    constructor() {
        this.authenticator = new FirebaseAuthenticator();
        this.connection = new FirestoreConnection(this.authenticator);
        this.functions = new WaderFunctions(this.connection);
    }

    async getProfileScore(profileUrl) {
        return this.functions.getProfileScore(profileUrl);
    }

    async setCategoryOnTrack(category, track) {
        return this.functions.setCategoryOnTrack(category, track);
    }

    async updateProfile(profile) {
        await this.functions.updateProfile(profile);
        const updatedProfile = await this.getObject('profiles', profile.url);
        const profileScore = await this.getProfileScore(updatedProfile.url);
        return new Profile(updatedProfile.url, updatedProfile.name, profileScore);
    }

    async updateTrack(track) {
        await this.functions.updateTrack(track);
        const trackId = track.uploader.url + ';' + track.url;
        const updatedTrack = await this.getObject('tracks', trackId);
        const uploader = await this.updateProfile(track.uploader);
        return new Track(uploader, updatedTrack.url, updatedTrack.name, updatedTrack.category);
    }

    async updateRepost(repost) {
        await this.functions.updateRepost(repost);
        const track = await this.updateTrack(repost.track);
        const reposter = await this.updateProfile(repost.reposter);
        return new Repost(track, repost.time, reposter);
    }

    async updateUpload(upload) {
        const track = await this.updateTrack(upload.track);
        return new Upload(track);
    }

    async objectExists(collectionName, objectId) {
        return this.connection.objectExists(collectionName, objectId);
    }

    async getObject(collectionName, objectId) {
        return this.connection.getObject(collectionName, objectId);
    }
}
