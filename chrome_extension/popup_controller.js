class PopupController {
    constructor() {
        //this.updateGroups();
        console.log('yolo');
        this.updateTrackInformation();
    }

    updateTrackInformation() {
        chrome.runtime.sendMessage({'subject': 'getCurrentlyPlayingTrack'}, function(response) {
            const track = response.track;
            this.updateTrackName(track.name);
            this.updateTrackUploader(track.uploader);
            this.updateTrackReposter(track.reposter);
            // categories, labels
        }.bind(this));
    }

    updateTrackName(name) {
        document.getElementById('track-name').innerHTML = name;
    }

    updateTrackUploader(uploader) {
        console.log(uploader);
        document.getElementById('track-uploader').innerHTML = uploader.name;
    }

    updateTrackReposter(reposter) {
        console.log(reposter);
        document.getElementById('track-reposter').innerHTML = reposter.name;
    }
}

new PopupController();
