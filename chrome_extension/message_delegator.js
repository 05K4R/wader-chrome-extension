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
            this.groupModel.getCategory(request.categoryId)
                .then(function(category) {
                    this.soundcloudModel.setCategoryOnCurrentlyPlayingTrack(category);
                }.bind(this));
            return true;
        } else if (request.subject == 'getCurrentlyPlayingTrack') {
            this.soundcloudModel.getCurrentlyPlayingTrack()
                .then(function(track) {
                    sendResponse({ track: track.asJSON() });
                });
            return true;
        } else if (request.subject == 'getCurrentRepost') {
            this.soundcloudModel.getCurrentRepost()
                .then(function(repost) {
                    sendResponse({ repost: repost.asJSON() });
                });
            return true;
        } else if (request.subject == 'currentlyPlayingTrackIsReposted') {
            this.soundcloudModel.currentlyPlayingTrackIsReposted()
                .then(function(result) {
                    sendResponse({ result: result });
                });
            return true;
        }
    }

    groupListener(request, sender, sendResponse) {
        if (request.subject == 'getAllCategories') {
            this.groupModel.getAllCategories()
                .then(function(categories) {
                    sendResponse({ categories: categories });
                });
            return true;
        } else if (request.subject == 'getProfileScore') {
            this.groupModel.getProfileScore(request.profileUrl)
                .then(function(score) {
                    sendResponse({ score: score});
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
