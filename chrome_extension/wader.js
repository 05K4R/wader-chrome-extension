class Wader {
    constructor() {
        firebase.initializeApp({
            apiKey: '[Your apiKey]',
            authDomain: '[Your authDomain]',
            databaseURL: '[Your databaseURL]',
            projectId: '[Your projectId]',
            storageBucket: '[Your storageBucket]',
            messagingSenderId: '[Your messagingSenderId]'
        });

        const authenticator = new FirebaseAuthenticator();
        const storageConnection = new FirestoreConnection(authenticator, true);
        const soundcloudModel = new FirestoreSoundcloudModel(storageConnection);
        const groupModel = new FirestoreGroupModel(storageConnection);
        this.messageDelegator = new MessageDelegator(soundcloudModel, groupModel, authenticator);
    }
}

let wader = new Wader();
