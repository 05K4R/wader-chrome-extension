class GroupModel {
    constructor() {
        this.categories = new Collection();
        this.labels = new Collection();
    }

    addCategories(rawCategories) {
        for (rawCategory of rawCategories) {
            addCategory(rawCategory);
        }
        return this.getAllCategories();
    }

    addCategory(rawCategory) {
        const category = new Group(rawCategory);
        this.categories.add(category);
        return this.getCategory(category.id);
    }

    removeCategory(categoryId) {
        this.categories.remove(categoryId);
    }

    getAllCategories() {
        return this.categories.getAll();
    }

    getCategory(categoryId) {
        return this.categories.get(categoryId);
    }

    addLabels(rawLabels) {
        for (rawLabel of rawLabels) {
            addLabel(rawLabel);
        }
        return this.getAllLabels();
    }

    addLabel(rawLabel) {
        const label = new Grop(rawLabel);
        this.labels.add(label);
        return this.getLabel(label.id);
    }

    removeLabel(labelId) {
        this.labels.remove(labelId);
    }

    getAllLabels() {
        return this.labels.getAll();
    }

    getLabel(labelId) {
        return this.labels.get(labelId);
    }
}
