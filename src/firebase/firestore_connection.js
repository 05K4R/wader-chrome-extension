class FirestoreConnection {
    constructor(authenticator) {
        this.db = firebase.firestore();
        this.authenticator = authenticator;
    }

    async getObject(collectionName, objectId) {
        const document = await this.getFirebaseObject(collectionName, objectId);
        return document.data();
    }

    async objectExists(collectionName, objectId) {
        const document = await this.getFirebaseObject(collectionName, objectId);
        return document.exists;
    }

    async setObjectWithMerge(collectionName, object) {
        return this.setFirebaseObject(collectionName, object, { merge: true });
    }

    async getFirebaseObject(collectionName, objectId) {
        const userId = this.authenticator.getUserId();
        return this.db
            .collection(this.getUserCollection())
            .doc(userId)
            .collection(collectionName)
            .doc(objectId)
            .get();
    }

    async setFirebaseObject(collectionName, object, options) {
        const userId = this.authenticator.getUserId();
        return this.db
            .collection(this.getUserCollection())
            .doc(userId)
            .collection(collectionName)
            .doc(object.id)
            .set(object, options);
    }

    async runCloudFunction(functionName, args) {
        const cloudFunction = firebase.functions().httpsCallable(functionName);
        const result = await cloudFunction(args);
        return result.data;
    }

    createSavableObject(object) {
        return this.removeInvalidAttributes(object);
    }

    removeInvalidAttributes(object) {
        return JSON.parse(JSON.stringify(object));
    }

    getUserCollection() {
        return 'users';
    }
}
