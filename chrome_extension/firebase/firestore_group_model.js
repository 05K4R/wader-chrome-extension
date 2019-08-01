const categories =
        [
            {
                id: 'great',
                name: 'Great'
            },
            {
                id: 'good',
                name: 'Good'
            },
            {
                id: 'okay',
                name: 'Okay'
            },
            {
                id: 'bad',
                name: 'Bad'
            }
        ];

class FirestoreGroupModel {
    constructor(backend) {
        this.backend = backend;
        chrome.runtime.onMessage.addListener(this.groupListener.bind(this));
    }

    groupListener(request, sender, sendResponse) {
        if (request.subject == 'getAllCategories') {
            sendResponse({ categories: this.getAllCategories() })
        } else if (request.subject == 'getProfileScore') {
            this.getProfileScore(request.profileId)
                .then(function(score) {
                    sendResponse({ score: score});
                });
            return true;
        }
    }

    getAllCategories() {
        return categories;
    }

    async getProfileScore(profileUrl) {
        return this.backend.functions.getProfileScore(profileUrl);
    }
}
