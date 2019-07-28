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
        console.log('Updated currently playing stream action');
        console.log(this.currentlyPlayingStreamAction);
        chrome.runtime.sendMessage({
            subject: 'updatedCurrentlyPlayingStreamAction',
            streamAction: this.currentlyPlayingStreamAction.asJSON(),
        });
    }
}
