const model = {};
(function() {
    let isUserInitialized = false;
    let areCategoriesInitialized = false;
    let areLabelsInitialized = false;

    this.initialize = function() {
        console.log('model: initializing');
        currentUser.initialize();
    };

    this.userInitialized = function(initialized) {
        if (!initialized) {
            this.isUserInitialized = false;
            this.areCategoriesInitialized = false;
            this.areLabelsInitialized = false;
        } else {
            console.log('model: user initialized');
            this.isUserInitialized = true;
            groups.initialize();
        }
    };

    this.categoriesInitialized = function(initialized) {
        console.log('model: categories initialized');
        this.areCategoriesInitialized = initialized;
    };

    this.labelsInitialized = function(initialized) {
        console.log('model: labels initialized');
        this.areLabelsInitialized = initialized;
    };

    this.isInitialized = function() {
        return this.isUserInitialized
            && this.areCategoriesInitialized
            && this.areLabelsInitialized;
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

    this.getAvailableGroups = function(type) {
        console.log('model: get available groups');
        if (!model.isInitialized()) {
            console.log('model: not yet initialized, please wait');
            return;
        }

        return groups.getAvailableGroups(type);
    };

    this.addGroup = function(type, name) {
        console.log('model: add group');
        if (!model.isInitialized()) {
            console.log('model: not yet initialized, please wait');
            return;
        }

        if (type != 'label'
                && type != 'labels'
                && type != 'category'
                && type != 'categories') {

            console.log('model: type "' + type + '" not recognized');
            return;
        }

        if (name == null) {
            console.log('model: name is null');
            return;
        }

        groups.addGroup(type, name);
    }

    this.deleteGroup = function(type, id) {
        console.log('model: delete group');
        if (!model.isInitialized()) {
            console.log('model: not yet initialized, please wait');
            return;
        }

        if (type != 'label'
                && type != 'labels'
                && type != 'category'
                && type != 'categories') {

            console.log('model: type "' + type + '" not recognized');
            return;
        }

        if (id == null) {
            console.log('model: id is null');
            return;
        }

        groups.deleteGroup(type, id);
    }

    this.updateGroup = function(type, group) {
        console.log('model: update group name');
        if (!model.isInitialized()) {
            console.log('model: not yet initialized, please wait');
            return;
        }

        if (type != 'label'
                && type != 'labels'
                && type != 'category'
                && type != 'categories') {

            console.log('model: type "' + type + '" not recognized');
            return;
        }

        if (group.id == null || group.name == null) {
            console.log('model: group id or group name is null');
            return;
        }

        groups.updateGroup(type, group);
    }

    window.onload = function() {
        model.initialize();
    };
}).apply(model);
