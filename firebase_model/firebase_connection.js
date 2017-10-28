const fbConn = {};
(function() {
	// Initialize Firebase
	const config = {
		apiKey: "AIzaSyBn753lEWxDjU9E_rCgF7Nrxjt1tdiA4TI",
		authDomain: "wader-d8a71.firebaseapp.com",
		databaseURL: "https://wader-d8a71.firebaseio.com",
		storageBucket: "wader-d8a71.appspot.com",
		messagingSenderId: "68541536183"
	};
	firebase.initializeApp(config);

	this.valueExists = function(ref, value) {
		return this.getObject(ref, value)
			.then(function(result) {
				return Promise.resolve(result !== null);
			});
	}

	this.getObject = function(ref, value) {
		return firebase.database().ref(ref).child(value).once('value')
			.then(function(snapshot) {
				return snapshot.val()
			});
	}

	this.pushObject = function(ref, object) {
		return firebase.database().ref(ref).push(object);
	}

	this.setObject = function(ref, object) {
		return firebase.database().ref(ref).set(object);
	}

	this.updateObject = function(ref, object) {
		return firebase.database().ref(ref).update(object);
	}

	this.updateMultiple = function(updates) {
		return firebase.database().ref().update(updates);
	}

	this.deleteRef = function(ref) {
		return firebase.database().ref(ref).remove();
	}

	this.listenToValue = function(ref, callback) {
		firebase.database().ref(ref).on('value', function(snapshot) {
			callback(snapshot.val());
		});
	}

	this.stopListenToValue = function(ref, callback) {
		firebase.database().ref(ref).off('value', function(snapshot) {
			callback(snapshot.val());
		});
	}

	this.listenToAuth = function(callback) {
		firebase.auth().onAuthStateChanged(callback);
	}
}).apply(fbConn);
