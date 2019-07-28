class FirestoreSoundcloudModel {
    constructor(firestoreConnection, waderFunctions) {
        this.connection = firestoreConnection;
        this.functions = waderFunctions;
        chrome.runtime.onMessage.addListener(this.streamActionListener.bind(this));
    }

    streamActionListener(request, sender, sendResponse) {
        if (request.subject == 'newCurrentlyPlayingStreamAction') {
            const streamAction = StreamAction.fromJSON(request.streamAction);

            this.saveStreamAction(streamAction).then(() => {
                this.setCurrentlyPlayingStreamAction(streamAction);
            });
        } else if (request.subject == 'getCurrentlyPlayingStreamAction') {
            sendResponse({ streamAction: this.currentlyPlayingStreamAction.asJSON() });
        } else if (request.subject == 'setCategoryOnCurrentlyPlayingTrack') {
            this.functions.setCategoryOnTrack(request.categoryId, this.currentlyPlayingStreamAction.track).then(() => {
                this.setCurrentlyPlayingStreamAction(this.currentlyPlayingStreamAction);
            });
        }
    }

    async saveStreamAction(streamAction) {
        return streamAction.save(this.functions);
    }

    async setCurrentlyPlayingStreamAction(streamAction) {
        const updatedAction = await streamAction.update(this.connection);
        this.currentlyPlayingStreamAction = updatedAction;
        this.publishUpdatedCurrentlyPlayingStreamAction();
    }

    publishUpdatedCurrentlyPlayingStreamAction() {
        chrome.runtime.sendMessage({
            subject: 'updatedCurrentlyPlayingStreamAction',
            streamAction: this.currentlyPlayingStreamAction.asJSON(),
        });
    }
}
