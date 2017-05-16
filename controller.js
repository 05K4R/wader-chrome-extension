var controller = {};
(function() {

	var currentUser = null;

	this.init = function() {
		console.log('controller: initializing')
		firebaseConn.listenToAuth(controller.userStateChange);
	}

	// Callback for when user state is changed in firebase connection
	this.userStateChange = function(user) {
		console.log('controller: user state change observed')
		if (user) {
			console.log('controller: user logged in')
			currentUser = user;
			firebaseConn.listenToValue('/labels/' + currentUser.uid, controller.labelsChanged);
			firebaseConn.listenToValue('/categories/' + currentUser.uid, controller.categoriesChanged);
		} else {
			console.log('controller: no user logged in')
			currentUser = null;
			model.resetModel();
		}
	}

	// Callback for when the available labels has been changed
	this.labelsChanged = function(data) {
		console.log('controller: labels changed');

		var labels = [];
		for (var key in data) {
			// Only include if the label has a name
			if (data[key].name) {
				var obj = { id: key,
							name: data[key].name};

				labels.push(obj);
			}
		}
		model.setAvailableLabels(labels);
	}

	// Callback for when the available categories has been changed
	this.categoriesChanged = function(data) {
		console.log('controller: categories changed');

		var categories = []
		for (var key in data) {
			// Only include if the category has a name
			if (data[key].name) {
				var obj = {	id: key,
							name: data[key].name};

				categories.push(obj);
			}
		}
		model.setAvailableCategories(categories);
	}

	// TODO NYI
	this.newTrack = function(request) {
		console.log('controller: new track recieved');
		trackUrl = request.trackUrl
		uploaderUrl = request.uploaderUrl

		// Catches both null and undefined
		if (trackUrl == null || uploaderUrl == null) {
			console.log('controller: trackUrl or uploaderUrl was null or undefined'
				+ ', not updating current track');
			return;
		}

		trackId = uploaderUrl + '/' + trackUrl;

		firebaseConn.valueExists('/tracks/' + currentUser.uid, trackId)) {

		}
	}

	chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
		if (request.subject == 'newCurrentTrack') {
			console.log(request.trackUrl + ' by ' + request.uploaderUrl);
			controller.newTrack(request)
		} else {
			console.log('controller: message subject not found: ' + request.subject)
		}
	});

	window.onload = function() {
		controller.init();
	};
}).apply(controller);
