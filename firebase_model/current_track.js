const currentTrack = {};
(function() {
    let track;

    this.new = function(newTrack) {
        console.log('currentTrack: set new track');

        storage.updateTrack(newTrack).then(function() {
            this.track = {
                id: newTrack.id,
                url: newTrack.url,
                name: newTrack.name,
                uploader: {
                    id: newTrack.uploader.id,
                    url: newTrack.uploader.url,
                    name: newTrack.uploader.name,
                },
            }
            if (newTrack.repost != null) {
                this.track.repost = {
                    id: newTrack.repost.id,
                    time: newTrack.repost.time,
                    reposter: {
                        id: newTrack.repost.reposter.id,
                        url: newTrack.repost.reposter.url,
                        name: newTrack.repost.reposter.name,
                    },
                }
            }
        });
    };
}).apply(currentTrack);
