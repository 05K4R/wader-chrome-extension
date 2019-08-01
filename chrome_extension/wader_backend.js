class WaderBackend {
    constructor() {
        this.authenticator = new FirebaseAuthenticator();
        this.connection = new FirestoreConnection(this.authenticator);
        this.functions = new WaderFunctions(this.connection);
    }
}
