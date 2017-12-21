class FirestoreGroupModel extends GroupModel {
    constructor() {
        super();
        this.db = firebase.firestore();
    }

    addCategories(rawCategories) {
        // TODO
        return super.addCategories(rawCategories);
    }

    async addCategory(rawCategory) {
        const category = new Group(rawCategory);
        const jsonCategory = JSON.parse(JSON.stringify(jsonCategory));
        return this.db
            .collection('categories')
            .doc(category.id)
            .set(jsonCategory);
    }

    removeCategory(categoryId) {
        // TODO'
        return super.removeCategory(categoryId);
    }

    getCategory(categoryId) {
        return super.getCategory(categoryId);
    }

    addLabels(rawLabels) {
        // TODO labels
        return super.addLabels(rawLabels);
    }

    addLabel(rawLabel) {
        // TODO shit
        return super.addLabel(rawLabel);
    }

    removeLabel(labelId) {
        // TODO
        return super.removeLabel(labelId);
    }

    getLabel(labelId) {
        return super.getLabel(labelId);
    }
}
