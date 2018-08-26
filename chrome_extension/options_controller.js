class OptionsController {
    constructor() {
        this.updateAccountElements();
        this.updateCategoryElements();
        this.updateLabelElements();
        this.whenDocumentIsReady(this.setupSignInButton.bind(this));
        this.whenDocumentIsReady(this.setupSignOutButton.bind(this));
        this.whenDocumentIsReady(this.setupAddCategoryButton.bind(this));
        this.whenDocumentIsReady(this.setupAddLabelButton.bind(this));
    }

    updateAccountElements() {
        this.updateSignInStatus();
        this.updateAccountButtonStates();
    }

    whenDocumentIsReady(functionToCall) {
        $(document).ready(functionToCall);
    }

    updateSignInStatus() {
        chrome.runtime.sendMessage({'subject': 'userIsSignedIn'}, function(response) {
            if (response.userIsSignedIn) {
                const text = 'You\'re signed in!';
                document.getElementById('sign-in-status').innerHTML = text;
            } else {
                const text = 'You\'re not signed in.';
                document.getElementById('sign-in-status').innerHTML = text;
            }
        });
    }

    setupSignInButton() {
        $('#sign-in-button').click(function() {
            chrome.runtime.sendMessage({'subject': 'signIn'}, this.updateAccountElements.bind(this));
            this.disableSignInButton.bind(this)();
            this.updateCategoryElements.bind(this)();
            this.updateLabelElements.bind(this)();
        }.bind(this));
    }

    setupSignOutButton() {
        $('#sign-out-button').click(function() {
            chrome.runtime.sendMessage({'subject': 'signOut'}, this.updateAccountElements.bind(this));
            this.disableSignOutButton.bind(this)();
            this.updateCategoryElements.bind(this)();
            this.updateLabelElements.bind(this)();
        }.bind(this));
    }

    setupAddCategoryButton() {
        $('#add-new-category-button').click(function() {
            const newCategoryName = this.getNameOfNewGroup('category');
            const message = {
                subject: 'addNewCategory',
                category: {
                    id: newCategoryName,
                    name: newCategoryName
                }
            };
            this.clearNewCategoryField();
            chrome.runtime.sendMessage(message, this.updateCategoryElements.bind(this));
        }.bind(this));
    }

    setupAddLabelButton() {
        $('#add-new-label-button').click(function() {
            const newLabelName = this.getNameOfNewGroup('label');
            const message = {
                subject: 'addNewLabel',
                label: {
                    id: newLabelName,
                    name: newLabelName
                }
            };
            this.clearNewLabelField();
            chrome.runtime.sendMessage(message, this.updateLabelElements.bind(this));
        }.bind(this));
    }

    updateAccountButtonStates() {
        chrome.runtime.sendMessage({'subject': 'userIsSignedIn'}, function(response) {
            if (response.userIsSignedIn) {
                this.disableSignInButton();
                this.enableSignOutButton();
            } else {
                this.disableSignOutButton();
                this.enableSignInButton();
            }
        }.bind(this));
    }

    updateCategoryElements() {
        chrome.runtime.sendMessage({'subject': 'getAllCategories'}, function(response) {
            this.clearAvailableCategoriesDiv();
            this.addGroupElements(response.categories,'category');
        }.bind(this));
    }

    updateLabelElements() {
        chrome.runtime.sendMessage({'subject': 'getAllLabels'}, function(response) {
            this.clearAvailableLabelsDiv();
            this.addGroupElements(response.labels, 'label');
        }.bind(this));
    }

    clearAvailableLabelsDiv() {
        $('#available-label-groups').empty();
    }

    clearAvailableCategoriesDiv() {
        $('#available-category-groups').empty();
    }

    clearNewCategoryField() {
        $('#new-category-name').val('');
    }

    removeAllCategoryElements() {
        $('.category').remove();
    }

    clearNewLabelField() {
        $('#new-label-name').val('');
    }

    removeAllLabelElements() {
        $('.label').remove();
    }

    getNameOfNewGroup(groupType) {
        return $('#new-' + groupType + '-name').val();
    }

    addGroupElements(groups, groupType) {
        for (const group of groups) {
            this.addGroupElement(group, groupType);
        }
    }

    addGroupElement(group, groupType) {
        $('<div/>', {
            "class": groupType,
            id: 'group-' + group.id,
            text: group.name
        }).appendTo('#available-' + groupType + '-groups');

        $('<button/>', {
            text: 'Delete',
            click: function () {
                const message = {
                    subject: 'deleteGroup',
                    groupType: groupType,
                    groupId: group.id
                }
                chrome.runtime.sendMessage(message, this.updateCategoryElements.bind(this));
            }.bind(this)
        }).appendTo('#group-' + group.id);
    }

    enableSignInButton() {
        this.enableElement('#sign-in-button');
    }

    enableSignOutButton() {
        this.enableElement('#sign-out-button');
    }

    disableSignInButton() {
        this.disableElement('#sign-in-button');
    }

    disableSignOutButton() {
        this.disableElement('#sign-out-button');
    }

    enableElement(selector) {
        $(selector).prop("disabled", false);
    }

    disableElement(selector) {
        $(selector).prop("disabled", true);
    }
}

new OptionsController();
