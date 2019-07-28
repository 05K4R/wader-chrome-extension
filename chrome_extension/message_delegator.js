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
    }

    soundcloudListener(request, sender, sendResponse) {
        if (request.subject == 'setCategoryOnCurrentlyPlayingTrack') {
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
}
