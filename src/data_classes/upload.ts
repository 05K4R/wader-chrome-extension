class Upload extends StreamAction {
    constructor(track: Track) {
        if (track == null) {
            throw new Error('Upload does not have all required values');
        }

        super('UPLOAD', track);
    }

    static fromJSON(json: any) {
        return new Upload(Track.fromJSON(json.track));
    }

    asJSON(): any {
        return super.asJSON();
    }

    async update(backend: WaderBackend) {
        return backend.updateUpload(this);
    }
}