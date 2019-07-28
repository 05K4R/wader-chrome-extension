class FirebaseAuthenticator {
    constructor() {
        this.provider = new firebase.auth.GoogleAuthProvider();
        this.signedIn = false;
        firebase.auth().onAuthStateChanged(this.updateUserStatus.bind(this));
        chrome.runtime.onMessage.addListener(this.authenticationListener.bind(this));
    }

    authenticationListener(request, sender, sendResponse) {
        if (request.subject == 'userIsSignedIn') {
            this.userIsSignedIn()
                .then(function(userIsSignedIn) {
                    sendResponse({ userIsSignedIn: userIsSignedIn });
                });
            return true;
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
        } else if (request.subject == 'getUserDisplayName') {
            this.getUserDisplayName()
                .then(function(displayName) {
                    sendResponse({ displayName: displayName });
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

    async userIsSignedIn() {
        return this.user != null;
    }

    async getUserId() {
        if (this.userIsSignedIn()) {
            return this.user.uid;
        }
    }

    async getUserDisplayName() {
        if (this.userIsSignedIn()) {
            return this.user.displayName;
        }
    }

    async updateUserStatus(user) {
        if (user) {
            console.log('Wader: user signed in');
            this.user = user;
        } else {
            console.log('Wader: user signed out');
            this.user = null;
        }
    }
}
