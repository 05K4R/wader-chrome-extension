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
        return this.functions.updateProfile(profile);
    }

    async updateTrack(track) {
        return this.functions.updateTrack(track);
    }

    async updateRepost(repost) {
        return this.functions.updateRepost(repost);
    }

    async objectExists(collectionName, objectId) {
        return this.connection.objectExists(collectionName, objectId);
    }

    async getObject(collectionName, objectId) {
        return this.connection.getObject(collectionName, objectId);
    }
}
