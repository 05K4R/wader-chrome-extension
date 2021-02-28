class Wader {
    constructor() {
        firebase.initializeApp({
            apiKey: 'AIzaSyCr4jpWCOzPF1dDLK7M0UclG6aks5XBUOw',
            authDomain: 'wader-development.firebaseapp.com',
            databaseURL: 'https://wader-development.firebaseio.com',
            projectId: 'wader-development',
            storageBucket: 'wader-development.appspot.com',
            messagingSenderId: '331883577665'
        });

        this.backend = new WaderBackend();
        this.controller = new WaderController(this.backend);
    }
}

let wader = new Wader();
