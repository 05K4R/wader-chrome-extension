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

class NewProfile {
    constructor(url, name) {
        this.url = url;
        this.name = name;
    }

    static fromJSON(json) {
        return new NewProfile(json.url, json.name);
    }

    asJSON() {
        return {
            url: this.url,
            name: this.name,
        }
    }

    async save(functions) {
        return functions.updateProfile(this);
    }

    async update(connection) {
        if (await connection.objectExists('profiles', this.url)) {
            const profile = await connection.getObject('profiles', this.url);
            return new NewProfile(profile.url, profile.name);
        } else {
            return this;
        }
    }
}
