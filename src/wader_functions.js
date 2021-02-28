class WaderFunctions {
    constructor(firebaseConnection) {
        this.connection = firebaseConnection;
    }

    async updateProfile(profile) {
        const args = {
            profileInfo: profile.asJSON()
        };

        return this.connection.runCloudFunction('updateProfile', args);
    }

    async updateTrack(track) {
        const args = {
            trackInfo: track.asJSON()
        }

        args.trackInfo.uploaderInfo = track.uploader.asJSON();
        return this.connection.runCloudFunction('updateTrack', args);
    }

    async updateRepost(repost) {
        const args = {
            repostInfo: repost.asJSON()
        }

        args.repostInfo.reposterInfo = repost.reposter.asJSON();
        args.repostInfo.trackInfo = repost.track.asJSON();
        args.repostInfo.trackInfo.uploaderInfo = repost.track.uploader.asJSON();
        return this.connection.runCloudFunction('updateRepost', args);
    }

    async setCategoryOnTrack(categoryId, track) {
        const args = {
            category: categoryId,
            trackInfo: track.asJSON()
        }

        args.trackInfo.uploaderInfo = track.uploader.asJSON();
        return this.connection.runCloudFunction('setCategoryOnTrack', args);
    }

    async getProfileScore(profileUrl) {
        const args = {
            profileInfo: {
                url: profileUrl
            }
        };
        return this.connection.runCloudFunction('getProfileScore', args);
    }
}
