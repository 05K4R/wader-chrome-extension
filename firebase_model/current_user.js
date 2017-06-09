const currentUser = {};
(function() {
    let user;

    this.initialize = function() {
		console.log('currentUser: initializing');
        fbConn.listenToAuth(currentUser.userStateChangeCallback);
    };

	// Callback for when user state is changed in firebase connection
	this.userStateChangeCallback = function(user) {
		if (user) {
            console.log('currentUser: user logged in')
			currentUser.setCurrentUser(user);
			model.userInitialized(true);
		} else {
            console.log('currentUser: user not logged in')
			currentUser.setCurrentUser(null);
			model.userInitialized(false);
		}
	}

    this.setCurrentUser = function(user) {
        console.log('currentUser: set current user');
        this.user = user;
    }

    this.getUid = function() {
        return this.user.uid;
    }
}).apply(currentUser);
