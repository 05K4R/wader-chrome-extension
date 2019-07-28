class UploadAction extends StreamAction {
    constructor(track) {
        if (track == undefined) {
            throw new Error('Upload does not have all required values');
        }

        super('UPLOAD', track);
    }

    static fromJSON(json) {
        return new UploadAction(Track.fromJSON(json.track));
    }

    asJSON() {
        return super.asJSON();
    }

    async save(functions) {
        return this.track.save(functions);
    }

    async update(connection) {
        return new UploadAction(await this.track.update(connection));
    }
}
