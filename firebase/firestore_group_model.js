class FirestoreGroupModel {
    constructor(firestoreConnection) {
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

    async deleteCategory(categoryId) {
        return this.connection.deleteObject('categories', categoryId);
    }

    async addLabel(rawLabel) {
        const label = new Group(rawLabel);
        return this.connection.saveObject('labels', label.getId(), label);
    }

    async getLabel(labelId) {
        return new Group(await this.connection.getObject('labels', labelId));
    }

    async getAllLabels() {
        return this.connection.getCollection('labels');
    }

    async deleteLabel(labelId) {
        return this.connection.deleteObject('labels', labelId);
    }

    async deleteGroup(groupType, groupId) {
        if (groupType == 'category') {
            return this.deleteCategory(groupId);
        } else if (groupType == 'label') {
            return this.deleteLabel(groupId);
        }
    }
}
