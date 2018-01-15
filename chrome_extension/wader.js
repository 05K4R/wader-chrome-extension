class Wader {
    constructor() {
        firebase.initializeApp({
            apiKey: 'AIzaSyBn753lEWxDjU9E_rCgF7Nrxjt1tdiA4TI',
            authDomain: 'wader-d8a71.firebaseapp.com',
            databaseURL: 'https://wader-d8a71.firebaseio.com',
            projectId: 'wader-d8a71',
            storageBucket: 'wader-d8a71.appspot.com',
            messagingSenderId: '68541536183'
        });

        const authenticator = new FirebaseAuthenticator();
        const storageConnection = new FirestoreConnection(authenticator);
        const soundcloudModel = new FirestoreSoundcloudModel(storageConnection);
        const groupModel = new FirestoreGroupModel(storageConnection);
        this.messageDelegator = new MessageDelegator(soundcloudModel, groupModel, authenticator);
    }
}

let wader = new Wader();
