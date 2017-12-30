class MessageDelegator {
    constructor(soundcloudModel, groupModel) {
        this.soundcloudModel = soundcloudModel;
        this.groupModel = groupModel;
        console.log(this);
        this.startListenToMessages();
    }

    startListenToMessages() {
        chrome.runtime.onMessage.addListener(this.soundcloudListener.bind(this));
        chrome.runtime.onMessage.addListener(this.groupListener.bind(this));
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
        }
    }

    groupListener(request, sender, sendResponse) {
        if (request.subject == 'addLabels') {
            this.groupModel.addLabels(request.labels);
        } else if (request.subject == 'addCategories') {
            this.groupModel.addCategories(request.categories);
        } else if (request.subject == 'getAllCategories') {
            this.groupModel.getAllCategories()
                .then(function(categories) {
                    sendResponse({ categories: categories });
                });
            return true;
        }
    }
}
