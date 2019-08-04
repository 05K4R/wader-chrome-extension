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
        return this.getProfile(profile.id);
    }

    async updateTrack(track) {
        await this.functions.updateTrack(track);
        return this.getTrack(track.id);
    }

    async updateRepost(repost) {
        await this.functions.updateRepost(repost);
        return this.getRepost(repost.id);
    }

    async updateUpload(upload) {
        const track = await this.getTrack(upload.track.id);
        return new Upload(track);
    }

    async getProfile(profileId) {
        const profile = await this.getObject('profiles', profileId);
        const profileScore = await this.getProfileScore(profileId);
        return new Profile(profile.url, profile.name, profileScore);
    }

    async getTrack(trackId) {
        const track = await this.getObject('tracks', trackId);
        const uploader = await this.getProfile(track.uploader);
        return new Track(uploader, track.url, track.name, track.category);
    }

    async getRepost(repostId) {
        const repost = await this.getObject('reposts', repostId);
        const track = await this.getTrack(repost.track);
        const reposter = await this.getProfile(repost.reposter);
        return new Repost(track, repost.time, reposter);
    }

    async objectExists(collectionName, objectId) {
        return this.connection.objectExists(collectionName, objectId);
    }

    async getObject(collectionName, objectId) {
        return this.connection.getObject(collectionName, objectId);
    }
}
