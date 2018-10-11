class FirebaseAuthenticator {
    constructor() {
        this.provider = new firebase.auth.GoogleAuthProvider();
        this.signedIn = false;
        firebase.auth().onAuthStateChanged(this.updateUserStatus.bind(this));
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
