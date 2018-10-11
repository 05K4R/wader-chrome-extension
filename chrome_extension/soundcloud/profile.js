class Profile {
    constructor(rawProfile) {
        if (rawProfile.url == undefined) {
            throw new Error('Profile does not have all required values');
        }

        this.url = rawProfile.url;
        this.name = rawProfile.name;
    }

    getId() {
        return this.url;
    }

    asJSON() {
        return {
            id: this.getId(),
            url: this.url,
            name: this.name
        }
    }
}
