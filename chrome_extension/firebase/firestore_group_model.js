class FirestoreGroupModel {
    constructor(backend) {
        this.backend = backend;
        chrome.runtime.onMessage.addListener(this.groupListener.bind(this));
    }

    groupListener(request, sender, sendResponse) {
        if (request.subject == 'getProfileScore') {
            this.backend.getProfileScore(request.profileId)
                .then(function(score) {
                    sendResponse({ score: score});
                });
            return true;
        }
    }
}
