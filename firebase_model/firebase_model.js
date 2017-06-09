const model = {};
(function() {
    let userInitialized = false;
    let categoriesInitialized = false;
    let labelsInitialized = false;

    this.initialize = function() {
        console.log('model: initializing');
        currentUser.initialize();
    };

    this.userInitialized = function(initialized) {
        if (!initialized) {
            this.userInitialized = false;
            this.categoriesInitialized = false;
            this.labelsInitialized = false;
        } else {
            console.log('model: user initialized');
            this.userInitialized = true;
            groups.initialize();
        }
    };

    this.categoriesInitialized = function(initialized) {
        console.log('model: categories initialized');
        this.categoriesInitialized = initialized;
    };

    this.labelsInitialized = function(initialized) {
        console.log('model: labels initialized');
        this.labelsInitialized = initialized;
    };

    this.isInitialized = function() {
        return this.userInitialized
            && this.categoriesInitialized
            && this.labelsInitialized;
    };

    this.newCurrentTrack = function(track) {
        console.log('model: new current track');
        if (!model.isInitialized()) {
            console.log('model: not yet initialized, please wait');
            return;
        }

		if (track.url == null || track.uploader.url == null) {
			console.log('model: trackUrl or uploaderUrl was null or undefined'
				+ ', not updating current track');
			return;
		}

		if (track.id == null) {
			track.id = track.uploader.url + ';' + track.url;
		}

		if (track.uploader.id == null) {
			track.uploader.id = track.uploader.url;
		}

		if (track.repost != null) {
            track.repost.time = Date.parse(track.repost.time);
            if (track.repost.reposter.id == null) {
                track.repost.reposter.id = track.repost.reposter.url;
            }
            if (track.repost.id == null) {
                track.repost.id = track.repost.reposter.id
                    + ';' + track.repost.time
                    + ';' + track.id;
            }
		}

        currentTrack.new(track);
    }

    window.onload = function() {
        model.initialize();
    };
}).apply(model);
