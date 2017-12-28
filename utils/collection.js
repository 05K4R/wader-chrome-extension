class Collection {
    constructor() {
        this.allObjects = new Map();
    }

    add(object) {
        this.allObjects.set(object.getId(), object);
        return this;
    }

    get(objectId) {
        return this.allObjects.get(objectId);
    }

    getAll() {
        return Array.from(this.allObjects.values());
    }

    has(objectId) {
        return this.allObjects.has(objectId);
    }

    remove(objectId) {
        this.allObjects.delete(objectId);
        return this;
    }
}
