class Profile {
    constructor(url, name, score) {
        if (url == null) {
            throw new Error('Profile does not have all required values');
        }

        this.url = url;
        this.name = name;
        this.score = score;
        this.id = url;
    }

    static fromJSON(json) {
        return new Profile(json.url, json.name, json.score);
    }

    asJSON() {
        return {
            url: this.url,
            name: this.name,
            score: this.score,
        }
    }

    async update(backend) {
        return backend.updateProfile(this);
    }
}
