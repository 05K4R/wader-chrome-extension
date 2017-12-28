class FirestoreGroupModel extends GroupModel {
    constructor(firestoreConnection) {
        super();
        this.connection = firestoreConnection;
    }

    async addCategory(rawCategory) {
        const category = new Group(rawCategory);
        return this.connection.saveObject('categories', category.getId(), category);
    }

    async getCategory(categoryId) {
        return this.connection.getObject('categories', categoryId);
    }

    async getAllCategories() {
        return this.connection.getCollection('categories');
    }

    async addLabel(rawLabel) {
        const label = new Group(rawLabel);
        return this.connection.saveObject('labels', label.getId(), label);
    }

    async getLabel(labelId) {
        return this.connection.getObject('labels', labelId);
    }

    async getAllLabels() {
        return this.connection.getCollection('labels');
    }
}
