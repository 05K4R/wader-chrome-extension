const options = {};
(function() {
    this.getGroupsCallback = function(response) {
        const categories = response.categories;
        const labels = response.labels;

        options.clearChilds('categories');
        options.clearChilds('labels');
        options.addAvailableGroups('categories', categories);
        options.addAvailableGroups('labels', labels);
    }

    this.clearChilds = function(id) {
        const div = document.getElementById(id);

        while (div.firstChild) {
            div.removeChild(div.firstChild);
        }
    }

    this.addAvailableGroups = function(type, groups) {
        const div = document.getElementById(type);

        for (let key in groups) {
            // Only include if the group has a name
            if (groups[key].name) {
                const id = key;
                const name = groups[key].name;

                const groupDiv = document.createElement('div');
                groupDiv.setAttribute('id', key + '-container');
                groupDiv.appendChild(document.createTextNode(name));

                const renameButton = document.createElement('button');
                const deleteButton = document.createElement('button');

                renameButton.setAttribute('id', key + '-rename-button');
                deleteButton.setAttribute('id', key + '-delete-button');

                renameButton.appendChild(document.createTextNode('Rename'));
                deleteButton.appendChild(document.createTextNode('Delete'));

                renameButton.onclick = options.constructRenameFunction(type, id);
                deleteButton.onclick = options.constructDeleteFunction(type, id);

                //groupDiv.appendChild(renameButton); TODO NYI
                groupDiv.appendChild(deleteButton);

                div.appendChild(groupDiv);
            }
        }
    }

    this.setupAddButton = function(groupType) {
        const addButton = document.getElementById('add-' + groupType + '-button');
        addButton.onclick = options.constructAddFunction(groupType);
    }

    this.constructAddFunction = function(groupType) {
        return function() {
            const inputField = document.getElementById('new-' + groupType + '-input');
            const groupName = inputField.value;

            const message = {
                subject: 'addGroup',
                type: groupType,
                name: groupName,
            }

            chrome.runtime.sendMessage(message);
        };
    }

    this.constructDeleteFunction = function(type, id) {
        return function() {
            const message = {
                subject: 'deleteGroup',
                type: type,
                id: id,
            }

            chrome.runtime.sendMessage(message);
        }
    };

    // NYI
    this.constructRenameFunction = function(groupType, groupId) {
        return function() {
            const group = {
                id: groupId,
                name: 'Yoloswag' + Math.random() * 100 % 0.5,
            }

            const message = {
                subject: 'updateGroup',
                type: groupType,
                group: group,
            }

            chrome.runtime.sendMessage(message);
        };
    }

    window.onload = function() {
        const message = {
            subject: 'getAvailableGroups',
        }
        chrome.runtime.sendMessage(message, options.getGroupsCallback);
        options.setupAddButton('category');
        options.setupAddButton('label');
    }
}).apply(options);
