class FirebaseGroupModel extends GroupModel {
    constructor() {
        super();
        this.db = firebase.firestore();
    }

    addCategories(rawCategories) {
        // TODO
        return super.addCategories(rawCategories);
    }

    addCategory(rawCategory) {
        // TODO
        return super.addCategory(rawCategory);
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
