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

        this.backend = new WaderBackend();
        this.soundcloudModel = new FirestoreSoundcloudModel(this.backend);
        this.groupModel = new FirestoreGroupModel(this.backend);
    }
}

let wader = new Wader();
