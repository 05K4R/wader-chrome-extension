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
    constructor(firestoreConnection) {
        this.connection = firestoreConnection;
    }

    async getCategory(categoryId) {
        for (let category of categories) {
            if (category.id == categoryId) {
                return category;
            }
        }
    }

    async getAllCategories() {
        return categories;
    }

    async getProfileScore(profileUrl) {
        const args = {
            profileinfo: {
                url: profileUrl
            }
        };

        return this.connection.runcloudfunction('getProfileScore', args);
    }
}
