class MessageDelegator {
    constructor(soundcloudModel, groupModel, authenticator) {
        this.soundcloudModel = soundcloudModel;
        this.groupModel = groupModel;
        this.authenticator = authenticator;
        this.startListenToMessages();
    }

    startListenToMessages() {
        chrome.runtime.onMessage.addListener(this.soundcloudListener.bind(this));
        chrome.runtime.onMessage.addListener(this.groupListener.bind(this));
        chrome.runtime.onMessage.addListener(this.authenticationListener.bind(this));
    }

    soundcloudListener(request, sender, sendResponse) {
        if (request.subject == 'setCurrentlyPlayingTrack') {
            this.soundcloudModel.setCurrentlyPlayingTrack(request.track);
        } else if (request.subject == 'setCurrentlyPlayingRepostedTrack') {
            this.soundcloudModel.setCurrentlyPlayingRepostedTrack(request.repost);
        } else if (request.subject == 'setCategoryOnCurrentlyPlayingTrack') {
            const category = this.groupModel.getCategory(request.categoryId);
            this.soundcloudModel.setCategoryOnCurrentlyPlayingTrack(category);
        } else if (request.subject == 'addLabelToCurrentlyPlayingTrack') {
            const label = this.groupModel.getLabel(request.labelId);
            this.soundcloudModel.addLabelToCurrentlyPlayingTrack(label);
        } else if (request.subject == 'removeLabelFromCurrentlyPlayingTrack') {
            const label = this.groupModel.getLabel(request.labelId);
            this.soundcloudModel.removeLabelFromCurrentlyPlayingTrack(label);
        } else if (request.subject == 'getCurrentlyPlayingTrack') {
            this.soundcloudModel.getCurrentlyPlayingTrack()
                .then(function(track) {
                    sendResponse({ track: track });
                });
            return true;
        }
    }

    groupListener(request, sender, sendResponse) {
        if (request.subject == 'addNewCategory') {
            this.groupModel.addCategory(request.category)
                .then(function() {
                    sendResponse();
                });
            return true;
        } else if (request.subject == 'getAllCategories') {
            this.groupModel.getAllCategories()
                .then(function(categories) {
                    sendResponse({ categories: categories });
                });
            return true;
        } else if (request.subject == 'addNewLabel') {
            this.groupModel.addLabel(request.label)
                .then(function() {
                    sendResponse();
                });
            return true;
        } else if (request.subject == 'getAllLabels') {
            this.groupModel.getAllLabels()
                .then(function(labels) {
                    sendResponse({ labels: labels });
                });
            return true;
        } else if (request.subject == 'deleteGroup') {
            this.groupModel.deleteGroup(request.groupType, request.groupId)
                .then(function() {
                    sendResponse();
                });
            return true;
        }
    }

    authenticationListener(request, sender, sendResponse) {
        if (request.subject == 'userIsSignedIn') {
            this.authenticator.userIsSignedIn()
                .then(function(userIsSignedIn) {
                    sendResponse({ userIsSignedIn: userIsSignedIn });
                });
            return true;
        } else if (request.subject == 'signIn') {
            this.authenticator.signIn()
                .then(function() {
                    sendResponse({ status: 'completed'});
                });
            return true;
        } else if (request.subject == 'signOut') {
            this.authenticator.signOut()
                .then(function() {
                    sendResponse({ status: 'completed'});
                });
            return true;
        } else if (request.subject == 'getUserDisplayName') {
            this.authenticator.getUserDisplayName()
                .then(function(displayName) {
                    sendResponse({ displayName: displayName });
                });
            return true;
        }
    }
}
