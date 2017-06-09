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

    this.getAvailableCategories = function() {
        return this.availableCategories;
    }

    this.getAvailableLabels = function() {
        return this.availableLabels;
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
            console.log('groups: type not recognized: ' + type);
            return;
        }
    }
}).apply(groups);
