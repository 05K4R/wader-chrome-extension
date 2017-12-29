class Wader {
    constructor() {
        const storageConnection = new FirestoreConnection();
        const soundcloudModel = new FirestoreSoundcloudModel(storageConnection);
        const groupModel = new FirestoreGroupModel(storageConnection);
        this.messageDelegator = new MessageDelegator(soundcloudModel, groupModel);
    }
}

let wader = new Wader();
