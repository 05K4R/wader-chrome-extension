class FirebaseAuthenticator {
    constructor() {
        this.provider = new firebase.auth.GoogleAuthProvider();
        this.signedIn = false;
        firebase.auth().onAuthStateChanged(this.updateUserStatus.bind(this));
        chrome.runtime.onMessage.addListener(this.authenticationListener.bind(this));
    }

    authenticationListener(request, sender, sendResponse) {
        if (request.subject == 'userIsSignedIn') {
            sendResponse({ userIsSignedIn: this.userIsSignedIn() });
        } else if (request.subject == 'signIn') {
            this.signIn()
                .then(function() {
                    sendResponse({ status: 'completed'});
                });
            return true;
        } else if (request.subject == 'signOut') {
            this.signOut()
                .then(function() {
                    sendResponse({ status: 'completed'});
                });
            return true;
        }
    }

    async signIn() {
        return firebase.auth().signInWithPopup(this.provider);
    }

    async signOut() {
        return firebase.auth().signOut();
    }

    userIsSignedIn() {
        return this.user != null;
    }

    getUserId() {
        if (this.userIsSignedIn()) {
            return this.user.uid;
        }
    }

    updateUserStatus(user) {
        if (user) {
            console.log('Wader: user signed in');
            this.user = user;
        } else {
            console.log('Wader: user signed out');
            this.user = null;
        }
    }
}
