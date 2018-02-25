class FirestoreConnection {
    constructor(authenticator) {
        this.db = firebase.firestore();
        this.authenticator = authenticator;
    }

    async getObject(collectionName, objectId) {
        return this.getFirebaseObject(collectionName, objectId)
            .then(function(document) {
                 return document.data();
            });
    }

    async getCollection(collectionName) {
        const documents = [];
        return this.getFirebaseCollection(collectionName)
            .then(function(collection) {
                collection.forEach(function(document) {
                    documents.push(document.data());
                });
                return documents;
            });
    }

    async objectExists(collectionName, objectId) {
        return this.getFirebaseObject(collectionName, objectId)
            .then(function(document) {
                 return document.exists;
            });
    }

    async getFirebaseObject(collectionName, objectId) {
        const userId = await this.authenticator.getUserId();
        return this.db
            .collection('users')
            .doc(userId)
            .collection(collectionName)
            .doc(objectId)
            .get();
    }

    async getFirebaseCollection(collectionName) {
        const userId = await this.authenticator.getUserId();
        return this.db
            .collection('users')
            .doc(userId)
            .collection(collectionName)
            .get();
    }

    async saveObject(collectionName, objectId, object) {
        const savableObject = await this.createSavableObject(object);
        const options = {
            merge: true
        }
        const userId = await this.authenticator.getUserId();
        return this.db
            .collection('users')
            .doc(userId)
            .collection(collectionName)
            .doc(objectId)
            .set(savableObject, options);
    }

    async deleteObject(collectionName, objectId) {
        const userId = await this.authenticator.getUserId();
        return this.db
            .collection('users')
            .doc(userId)
            .collection(collectionName)
            .doc(objectId)
            .delete();
    }

    async createSavableObject(object) {
        return this.removeInvalidAttributes(object);
    }

    async removeInvalidAttributes(object) {
        return JSON.parse(JSON.stringify(object));
    }
}
