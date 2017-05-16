var model = {};
(function() {
	var availableLabels;
	var availableCategories;
	var currentTrack;
	var trackUploader;
	var trackLabels;
	var trackCategory;

	// labels is an array with objects {id: String, name: String}
	this.setAvailableLabels = function(labels) {
		console.log("model: set available labels")
		availableLabels = labels;
	}

	// returns an array with objects {id: String, name: String}
	this.getAvailableLabels = function() {
		console.log("model: get available labels")
		return availableLabels;
	}

	// categories is an array with objects {id: String, name: String}
	this.setAvailableCategories = function(categories) {
		console.log("model: set available categories")
		availableCategories = categories;
	}

	// returns an array with objects {id: String, name: String}
	this.getAvailableCategories = function() {
		console.log("model: get available categories")
		return availableCategories;
	}

	// all parameters are strings
	this.setCurrentTrack = function(trackId, trackUrl, trackName, uploaderId, uploaderUrl, uploaderName) {
		console.log("model: set current track")
		currentTrack = {
			trackId: trackId,
			trackUrl: trackUrl,
			trackName: trackName,
			uploaderId: uploaderId,
			uploaderUrl: uploaderUrl,
			uploaderName: uploaderName
		}
	}

	// returns an object {trackId: String, trackUrl: String, trackName: String
	//  uploaderId: String, uploaderUrl: String, uploaderName: String}
	this.getCurrentTrack = function() {
		console.log("model: get current track")
		return currentTrack;
	}

	// labels is an array with objects {id: String, name: String}
	this.setActiveLabels = function(labels) {
		console.log("model: set active labels")
		activeLabels = labels;
	}

	// returns an array with objects {id: String, name: String}
	// if an active label doesn't exist in availableLabels, don't return it (NYI)
	this.getActiveLabels = function() {
		console.log("model: get active labels")
		return activeLabels;
	}

	// category is an object {id: String, name: String}
	this.setActiveCategory = function(category) {
		console.log("model: set active category")
		activeCategory = category;
	}

	// returns an object {id: String, name: String}
	// if no category is set or the active category isn't in availableCategories, return null (NYI)
	this.getActiveCategory = function() {
		console.log("model: get active category")
		return activeCategory;
	}

	// clear all model data, should be done if a user logs out
	this.resetModel = function() {
		console.log("model: reset model")
		availableLabels = null;
		availableCategories = null;
		currentTrack = null;
		trackUploader = null;
		trackLabels = null;
		trackCategory = null;
	}
}).apply(model);
