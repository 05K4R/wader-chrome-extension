class Collection {
    constructor() {
        this.allObjects = new Map();
    }

    add(object) {
        this.allObjects.set(object.id, object);
        return this.get(object.id);
    }

    get(objectId) {
        return this.allObjects.get(objectId);
    }

    getAll() {
        return Array.from(this.allObjects);
    }

    has(objectId) {
        return this.allObjects.has(objectId);
    }

    remove(objectId) {
        this.allObjects.delete(objectId);
    }
}
