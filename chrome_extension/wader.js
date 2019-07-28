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

        this.authenticator = new FirebaseAuthenticator();
        this.storageConnection = new FirestoreConnection(this.authenticator);
        this.waderFunctions = new WaderFunctions(this.storageConnection);
        this.soundcloudModel = new FirestoreSoundcloudModel(this.storageConnection, this.waderFunctions);
        this.groupModel = new FirestoreGroupModel(this.waderFunctions);
    }
}

let wader = new Wader();
