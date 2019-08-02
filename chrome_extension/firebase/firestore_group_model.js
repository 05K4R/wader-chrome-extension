class FirestoreGroupModel {
    constructor(backend) {
        this.backend = backend;
        chrome.runtime.onMessage.addListener(this.groupListener.bind(this));
    }

    groupListener(request, sender, sendResponse) {
        if (request.subject == 'getProfileScore') {
            this.getProfileScore(request.profileId)
                .then(function(score) {
                    sendResponse({ score: score});
                });
            return true;
        }
    }

    async getProfileScore(profileUrl) {
        return this.backend.functions.getProfileScore(profileUrl);
    }
}
