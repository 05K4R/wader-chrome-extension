const groups = {};
(function() {
    let availableCategories;
    let availableLabels;

    this.initialize = function() {
        console.log('groups: initializing');
        fbConn.listenToValue(
            '/labels/' + currentUser.getUid(),
            groups.labelsChangedCallback
        );
        fbConn.listenToValue(
            '/categories/' + currentUser.getUid(),
            groups.categoriesChangedCallback
        );
    };

	// Callback for when the available labels has been changed
	this.labelsChangedCallback = function(labels) {
		console.log('groups: labels changed');
        groups.setAvailableGroups('labels', labels);
        model.labelsInitialized(true);
	}

	// Callback for when the available categories has been changed
	this.categoriesChangedCallback = function(categories) {
		console.log('groups: categories changed');
		groups.setAvailableGroups('category', categories);
        model.categoriesInitialized(true);
	}

    this.getAvailableGroups = function(group) {
        if (group == 'categories' || group == 'category') {
            return this.availableCategories;
        } else if (group == 'labels' || group == 'label') {
            return this.availableLabels;
        } else {
            console.log('groups: type "' + group + '" not recognized');
            return;
        }
    }

    this.setAvailableGroups = function(type, groups) {
        console.log('groups: set available groups');
        let newGroups = {};
        for (let key in groups) {
            // Only include if the group has a name
            if (groups[key].name) {
                newGroups[key] = {
                    id: key,
                    name: groups[key].name,
                };
            }
        }

        if (type == 'category' || type == 'categories') {
            this.availableCategories = newGroups;
        } else if (type == 'label' || type == 'labels') {
            this.availableLabels = newGroups;
        } else {
            console.log('groups: type "' + type + '" not recognized');
            return;
        }
    }

    this.deleteGroup = function(type, id) {
        console.log('groups: delete group');

        return fbConn.deleteRef(
            '/' + type + '/' + currentUser.getUid() + '/' + id
        );
    }

    this.updateGroup = function(type, group) {
        console.log('groups: update group');

        storage.updateGroup(type, group);
    }

    this.addGroup = function(type, name) {
        console.log('groups: add group');
        storage.addGroup(type, name);
    }
}).apply(groups);
