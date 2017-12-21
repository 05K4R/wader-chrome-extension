class GroupModel {
    constructor() {
        this.categories = new Collection();
        this.labels = new Collection();

        this.addCategories([
            {id: 'test1', name: 'Like'},
            {id: 'test2', name: 'Okay'},
            {id: 'dislike', name: 'Dislike'}
        ]);
    }

    async addCategories(rawCategories) {
        for (let rawCategory of rawCategories) {
            this.addCategory(rawCategory);
        }
        return this;
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
        for (let rawLabel of rawLabels) {
            this.addLabel(rawLabel);
        }
        return this;
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
