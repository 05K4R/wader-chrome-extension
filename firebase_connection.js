var firebaseConn = {};
(function() {
	// Initialize Firebase
	var config = {
		apiKey: "AIzaSyBn753lEWxDjU9E_rCgF7Nrxjt1tdiA4TI",
		authDomain: "wader-d8a71.firebaseapp.com",
		databaseURL: "https://wader-d8a71.firebaseio.com",
		storageBucket: "wader-d8a71.appspot.com",
		messagingSenderId: "68541536183"
	};
	firebase.initializeApp(config);

	this.valueExists = function(ref, value, callback) {
		firebase.database().ref(ref).child(value).once('value', function(snapshot) {
			var exists = (snapshot.val() !== null);
			callback(exists);
		})
	}

	this.listenToValue = function(ref, callback) {
		firebase.database().ref(ref).on('value', function(snapshot) {
			callback(snapshot.val());
		});
	}

	this.stopListenToValue = function(ref, callback) {
		firebase.database().ref(ref).on('value', function(snapshot) {
			callback(snapshot.val());
		});
	}

	this.listenToAuth = function(callback) {
		firebase.auth().onAuthStateChanged(callback);
	}
}).apply(firebaseConn);
