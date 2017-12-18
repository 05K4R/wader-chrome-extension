class Profile {
    constructor(rawProfile, reposts, uploads) {
        if (rawProfile.url == undefined && rawProfile.id == undefined) {
            throw new Error('Profile does not have all required values');
        }

        this.url = rawProfile.url;
        this.name = rawProfile.name;
        this.id = Profile.getId(rawProfile);

        if (reposts != undefined) {
            this.reposts = reposts;
        } else {
            this.reposts = new Collection();
        }

        if (uploads != undefined) {
            this.uploads = uploads;
        } else {
            this.uploads = new Collection();
        }
    }

    static getId(rawProfile) {
        if (rawProfile.url != undefined ) {
            return rawProfile.url;
        } else {
            throw new Error('Profile URL is needed for ID generation.');
        }
    }

    addUpload(track) {
        this.uploads.add(track);
    }

    addRepost(repost) {
        this.reposts.add(repost);
    }
}
