class WaderController {
    constructor(backend) {
        this.backend = backend;
        this.currentlyPlayingStreamAction = null;
        this.isLoadingTrackData = false;
        chrome.runtime.onMessage.addListener(this.streamActionListener.bind(this));
    }

    streamActionListener(request, sender, sendResponse) {
        if (request.subject == 'newCurrentlyPlayingStreamAction') {
            const streamAction = StreamAction.fromJSON(request.streamAction);
            this.setCurrentlyPlayingStreamAction(streamAction);
        } else if (request.subject == 'currentTrackIsLoading') {
            sendResponse({ isLoading: this.isLoadingTrackData });
        } else if (request.subject == 'getCurrentlyPlayingStreamAction') {
            sendResponse({ streamAction: this.currentlyPlayingStreamAction.asJSON() });
        } else if (request.subject == 'setCategoryOnCurrentlyPlayingTrack') {
            this.backend.setCategoryOnTrack(request.categoryId, this.currentlyPlayingStreamAction.track).then(() => {
                this.setCurrentlyPlayingStreamAction(this.currentlyPlayingStreamAction);
            });
        }
    }

    async setCurrentlyPlayingStreamAction(streamAction) {
        this.isLoadingTrackData = true;
        const updatedAction = await streamAction.update(this.backend);
        this.currentlyPlayingStreamAction = updatedAction;
        this.isLoadingTrackData = false;
        this.publishUpdatedCurrentlyPlayingStreamAction();
    }

    publishUpdatedCurrentlyPlayingStreamAction() {
        chrome.runtime.sendMessage({
            subject: 'updatedCurrentlyPlayingStreamAction',
            streamAction: this.currentlyPlayingStreamAction.asJSON(),
        });
    }
}
