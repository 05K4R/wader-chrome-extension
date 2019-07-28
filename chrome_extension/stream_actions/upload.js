class UploadAction extends StreamAction {
    constructor(track) {
        super('UPLOAD', track);
    }

    static fromJSON(json) {
        return new UploadAction(NewTrack.fromJSON(json.track));
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
