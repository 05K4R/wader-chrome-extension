// Initialize Firebase
var config = {
	apiKey: "AIzaSyBn753lEWxDjU9E_rCgF7Nrxjt1tdiA4TI",
	authDomain: "wader-d8a71.firebaseapp.com",
	databaseURL: "https://wader-d8a71.firebaseio.com",
	storageBucket: "wader-d8a71.appspot.com",
	messagingSenderId: "68541536183"
};
firebase.initializeApp(config);

/**
 * initApp handles setting up the Firebase context and registering
 * callbacks for the auth status.
 *
 * The core initialization is in firebase.App - this is the glue class
 * which stores configuration. We provide an app name here to allow
 * distinguishing multiple app instances.
 *
 * This method also registers a listener with firebase.auth().onAuthStateChanged.
 * This listener is called when the user is signed in or out, and that
 * is where we update the UI.
 *
 * When signed in, we also authenticate to the Firebase Realtime Database.
 */
function initApp() {
	// Listen for auth state changes.
	// [START authstatelistener]
	firebase.auth().onAuthStateChanged(function(user) {
		if (user) {
			// User is signed in.
			var displayName = user.displayName;
			var email = user.email;
			var emailVerified = user.emailVerified;
			var photoURL = user.photoURL;
			var isAnonymous = user.isAnonymous;
			var uid = user.uid;
			var providerData = user.providerData;
			// [START_EXCLUDE]
			document.getElementById('quickstart-button').textContent = 'Sign out';
			document.getElementById('quickstart-sign-in-status').textContent = 'Signed in';
			document.getElementById('quickstart-account-details').textContent = JSON.stringify(user, null, '  ');
			// [END_EXCLUDE]
		} else {
			// Let's try to get a Google auth token programmatically.
			// [START_EXCLUDE]
			document.getElementById('quickstart-button').textContent = 'Sign-in with Google';
			document.getElementById('quickstart-sign-in-status').textContent = 'Signed out';
			document.getElementById('quickstart-account-details').textContent = 'null';
			// [END_EXCLUDE]
		}
		document.getElementById('quickstart-button').disabled = false;
	});
	// [END authstatelistener]

	document.getElementById('quickstart-button').addEventListener('click', startSignIn, false);
}

/**
 * Start the auth flow and authorizes to Firebase.
 * @param{boolean} interactive True if the OAuth flow should request with an interactive mode.
 */
function startAuth(interactive) {
	// Request an OAuth token from the Chrome Identity API.
	chrome.identity.getAuthToken({interactive: !!interactive}, function(token) {
		if (chrome.runtime.lastError && !interactive) {
			console.log('It was not possible to get a token programmatically.');
		} else if(chrome.runtime.lastError) {
			console.error(chrome.runtime.lastError);
		} else if (token) {
			// Authrorize Firebase with the OAuth Access Token.
			var credential = firebase.auth.GoogleAuthProvider.credential(null, token);
			firebase.auth().signInWithCredential(credential).catch(function(error) {
				// The OAuth token might have been invalidated. Lets' remove it from cache.
				if (error.code === 'auth/invalid-credential') {
					chrome.identity.removeCachedAuthToken({token: token}, function() {
						startAuth(interactive);
					});
				}
			});
		} else {
			console.error('The OAuth Token was null');
		}
	});
}

/**
 * Starts the sign-in process.
 */
function startSignIn() {
	document.getElementById('quickstart-button').disabled = true;
	if (firebase.auth().currentUser) {
		firebase.auth().signOut();
	} else {
		startAuth(true);
	}
}

window.onload = function() {
	initApp();
};

chrome.runtime.sendMessage({'subject': 'getAllCategories'}, async function(response) {
	console.log(response);
	setupCategoryButtons(response.categories);
});

function setupCategoryButtons(categories) {
	categories.forEach(function(category) {
		var categoryElement = document.createElement('label');
		categoryElement.className = 'btn btn-default';
		categoryElement.innerHTML += category.name;

		var element = document.createElement('input');
		element.type = 'radio';
		element.name = 'category';
		element.value = category.id;
		element.id = 'category-' + category.id;
		element.autocomplete = 'off';
		element.onchange = function() {
			chrome.runtime.sendMessage({
				'subject': 'setCurrentTrackCategory',
				'categoryId': category.id
			}, function(response) {
				// TODO
			});
		};
		categoryElement.appendChild(element);

		document.getElementById('category-buttons').appendChild(categoryElement);
	});
}
