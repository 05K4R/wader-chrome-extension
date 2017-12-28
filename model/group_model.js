class GroupModel {
    constructor() {
        this.categories = new Collection();
        this.labels = new Collection();
    }

    async addCategories(rawCategories) {
        const promises = [];
        for (let rawCategory of rawCategories) {
            promises.push(this.addCategory(rawCategory));
        }
        return Promise.all(promises);
    }

    async addCategory(rawCategory) {
        const category = new Group(rawCategory);
        this.categories.add(category);
        return this;
    }

    async removeCategory(categoryId) {
        this.categories.remove(categoryId);
        return this;
    }

    async getAllCategories() {
        return this.categories.getAll();
    }

    async getCategory(categoryId) {
        return this.categories.get(categoryId);
    }

    async addLabels(rawLabels) {
        const promises = [];
        for (let rawLabel of rawLabels) {
            promises.push(this.addLabel(rawLabel));
        }
        return Promise.all(promises);
    }

    async addLabel(rawLabel) {
        const label = new Grop(rawLabel);
        this.labels.add(label);
        return this;
    }

    async removeLabel(labelId) {
        this.labels.remove(labelId);
        return this;
    }

    async getAllLabels() {
        return this.labels.getAll();
    }

    async getLabel(labelId) {
        return this.labels.get(labelId);
    }
}
