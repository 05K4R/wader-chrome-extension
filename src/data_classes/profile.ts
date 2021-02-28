class Profile {
    url: string;
    name: string;
    score: number;
    id: string;

    constructor(url: string, name: string, score: number) {
        if (url == null) {
            throw new Error('Profile does not have all required values');
        }

        this.url = url;
        this.name = name;
        this.score = score;
        this.id = url;
    }

    static fromJSON(json: any) {
        return new Profile(json.url, json.name, json.score);
    }

    asJSON(): any {
        return {
            url: this.url,
            name: this.name,
            score: this.score,
        };
    }

    async update(backend: WaderBackend) {
        return backend.updateProfile(this);
    }
}
