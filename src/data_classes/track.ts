class Track {
    uploader: Profile;
    url: string;
    name: string;
    category: string;
    id: string;

    constructor(uploader: Profile, url: string, name: string, category: string) {
        if (uploader == null || url == null) {
            throw new Error('Track does not have all required values');
        }

        this.uploader = uploader;
        this.url = url;
        this.name = name;
        this.category = category;
        this.id = uploader.id + ';' + url;
    }

    static fromJSON(json: any) {
        return new Track(Profile.fromJSON(json.uploader), json.url, json.name, json.category);
    }

    asJSON(): any {
        return {
            uploader: this.uploader.asJSON(),
            url: this.url,
            name: this.name,
            category: this.category
        };
    }

    async update(backend: WaderBackend) {
        return backend.updateTrack(this);
    }
}
