class Group {
    constructor(rawGroup) {
        if (rawGroup.id != undefined) {
            this.id = rawGroup.id;
            this.name = rawGroup.name;
        } else {
            throw new Error('Cannot create group without an ID');
        }
    }
}
