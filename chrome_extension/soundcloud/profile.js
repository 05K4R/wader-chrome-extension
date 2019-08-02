class Profile {
    constructor(url, name) {
        if (url == undefined) {
            throw new Error('Profile does not have all required values');
        }

        this.url = url;
        this.name = name;
    }

    static fromJSON(json) {
        return new Profile(json.url, json.name);
    }

    asJSON() {
        return {
            url: this.url,
            name: this.name,
        }
    }

    async save(backend) {
        return backend.updateProfile(this);
    }

    async update(backend) {
        if (await backend.objectExists('profiles', this.url)) {
            const profile = await backend.getObject('profiles', this.url);
            return new Profile(profile.url, profile.name);
        } else {
            return this;
        }
    }
}
