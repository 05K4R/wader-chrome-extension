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
    constructor(waderFunctions) {
        this.functions = waderFunctions;
        chrome.runtime.onMessage.addListener(this.groupListener.bind(this));
    }

    groupListener(request, sender, sendResponse) {
        if (request.subject == 'getAllCategories') {
            sendResponse({ categories: this.getAllCategories() })
        }
    }

    getAllCategories() {
        return categories;
    }

    async getProfileScore(profileUrl) {
        return this.functions.getProfileScore(profileUrl);
    }
}
