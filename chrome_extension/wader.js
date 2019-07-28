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
        const storageConnection = new FirestoreConnection(authenticator);
        const waderFunctions = new WaderFunctions(storageConnection);
        const soundcloudModel = new FirestoreSoundcloudModel(storageConnection, waderFunctions);
        const groupModel = new FirestoreGroupModel(waderFunctions);
        this.messageDelegator = new MessageDelegator(soundcloudModel, groupModel, authenticator);
    }
}

let wader = new Wader();
