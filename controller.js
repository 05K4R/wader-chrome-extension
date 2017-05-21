var controller = {};
(function() {

	var currentUser = null;

	this.init = function() {
		console.log('controller: initializing')
		firebaseConn.listenToAuth(controller.userStateChangeCallback);
	}

	// Callback for when user state is changed in firebase connection
	this.userStateChangeCallback = function(user) {
		console.log('controller: user state change observed')
		if (user) {
			currentUser = user;
			firebaseConn.listenToValue(
				'/labels/' + currentUser.uid,
				controller.labelsChangedCallback
			);
			firebaseConn.listenToValue(
				'/categories/' + currentUser.uid,
				controller.categoriesChangedCallback
			);
		} else {
			currentUser = null;
			model.resetModel();
		}
	}

	// Callback for when the available labels has been changed
	this.labelsChangedCallback = function(data) {
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
	this.categoriesChangedCallback = function(data) {
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

	// Callback for when the current playing track has changed
	this.currentTrackChangedCallback = function(firebase_track) {
		console.log('controller: current track changed');

		if (firebase_track == null) return;

		var trackId = firebase_track.id;
		var trackUrl = firebase_track.url;
		var trackName = firebase_track.name;
		var uploaderId = firebase_track.uploader;

		profilesRef = '/profiles/' + currentUser.uid + '/';

		firebaseConn.getObject(
			profilesRef, uploaderId
		).then(function(uploader) {
			var uploaderUrl = uploader.url;
			var uploaderName = uploader.name;

			model.setCurrentTrack(trackId, trackUrl, trackName,
				uploaderId, uploaderUrl, uploaderName);
		});
	}

	// Update a track on the backend, then returns the track in a promise
	this.updateTrack = function(track) {
		console.log('controller: update track');
		var trackId = track.id;
		var trackUrl = track.url;
		var trackName = track.name;

		if (track.uploader != null) {
			var uploaderId = track.uploader.id;
			var uploaderUrl = track.uploader.url;
			var uploaderName = track.uploader.name;
		}

		if (track.reposter != null) {
			var reposterId = track.reposter.id;
			var reposterUrl = track.reposter.url;
			var reposterName = track.reposter.name;
		}

		var trackRef = '/tracks/' + currentUser.uid + '/' + trackId + '/';
		var uploaderRef = '/profiles/' + currentUser.uid + '/' + uploaderId + '/';
		var reposterRef = '/profiles/' + currentUser.uid + '/' + reposterId + '/';

		var updates = {};
		updates[trackRef + 'id'] = trackId;
		updates[trackRef + 'url'] = trackUrl;
		updates[trackRef + 'name'] = trackName;
		updates[trackRef + 'uploader'] = uploaderId;
		updates[uploaderRef + 'id'] = uploaderId;
		updates[uploaderRef + 'url'] = uploaderUrl;
		updates[uploaderRef + 'name'] = uploaderName;
		updates[uploaderRef + 'uploads/' + trackId] = true;
		if (reposterId !== uploaderId) {
			updates[reposterRef + 'id'] = reposterId;
			updates[reposterRef + 'url'] = reposterUrl;
			updates[reposterRef + 'name'] = reposterName;
		}
		updates[reposterRef + 'reposts/' + trackId] = true;

		// Remove all undefined fields
		updates = JSON.parse(JSON.stringify(updates))

		return firebaseConn.updateMultiple(updates).then(function() {
			return Promise.resolve(track);
		});
	}

	// Start listen to track changes on the backend, returns a promise
	this.listenToTrack = function(track) {
		console.log('controller: listen to track');

		var trackId = track.id;
		firebaseConn.listenToValue(
			'/tracks/' + currentUser.uid + '/' + trackId,
			controller.currentTrackChangedCallback
		);
		return Promise.resolve(true);
	}

	// Stop listen to track changes on the backend,
	// returns if a track was listened to previously in a promise
	this.stopListenToCurrentTrack = function() {
		console.log('controller: stop listen to current track');

		var track = model.getCurrentTrack();
		if (track != null) {
			firebaseConn.stopListenToValue(
				'/tracks/' + currentUser.uid + '/' + track.id,
				controller.currentTrackChangedCallback
			);
			return Promise.resolve(true);
		} else {
			return Promise.resolve(false);
		}
	}

	// Called when a new track request is recieved
	this.newCurrentTrackRequest = function(request) {
		console.log('controller: new track recieved from view');
		var track = request.track;

		// Catches both null and undefined
		if (track.url == null || track.uploader.url == null) {
			console.log('controller: trackUrl or uploaderUrl was null or undefined'
				+ ', not updating current track');
			return;
		}

		if (track.id == null) {
			track.id = track.uploader.url + ';' + track.url;
		}

		if (track.uploader.id == null) {
			track.uploader.id = track.uploader.url;
		}

		Promise.all([
			controller.updateTrack(track),
			controller.stopListenToCurrentTrack()
		]).then(function(results) {
			return controller.listenToTrack(results[0]);
		}).catch(function(error) {
			console.log('controller: an error occured: ' + error);
		});
	};

	// Handle all incoming messages
	chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
		if (request.subject == 'newCurrentTrack') {
			controller.newCurrentTrackRequest(request);
		} else {
			console.log('controller: message subject not found: ' + request.subject)
		}
	});

	window.onload = function() {
		controller.init();
	};
}).apply(controller);
