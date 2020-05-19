class PopupController {
    constructor() {
        this.whenDocumentIsReady(this.updatePopup.bind(this));
        this.whenDocumentIsReady(this.showSignInMessage.bind(this));
        this.whenDocumentIsReady(this.listenToCategoryClicks.bind(this));
        chrome.runtime.onMessage.addListener(this.currentlyPlayingListener.bind(this));
    }

    currentlyPlayingListener(request, sender, sendResponse) {
        if (request.subject == 'updatedCurrentlyPlayingStreamAction') {
            this.updatePopup();
        } else if (request.subject == 'newCurrentlyPlayingStreamAction') {
            this.updatePopup();
        }
    }

    listenToCategoryClicks() {
        $(".category").click(function(button) {
            const categoryId = button.target.id;
            const message = {
                subject: 'setCategoryOnCurrentlyPlayingTrack',
                categoryId: categoryId,
            }
            $('#' + categoryId).removeClass('is-active');
            $('#' + categoryId).removeClass('is-outlined');
            $('#' + categoryId).addClass('is-loading');
            chrome.runtime.sendMessage(message) ;
        }.bind(this));
    }

    updatePopup() {
        chrome.runtime.sendMessage({'subject': 'currentTrackIsLoading'}, function(response) {
            if (response.isLoading) {
                this.showLoadingMessage();
            } else {
                this.updateCurrentStreamAction();
            }
        }.bind(this));
    }

    updateCurrentStreamAction() {
        chrome.runtime.sendMessage({'subject': 'getCurrentlyPlayingStreamAction'}, function(response) {
            this.updateTrackInformation(StreamAction.fromJSON(response.streamAction));
            this.hideLoadingMessage();
        }.bind(this));
    }

    showSignInMessage() {
        chrome.runtime.sendMessage({'subject': 'userIsSignedIn'}, function(response) {
            if (!response.userIsSignedIn) {
                const message = 'You need to sign in to use Wader, please do so from the <a id="options-link" href="chrome://extensions/?options=gjjdinpmbhdnnhoegfdaamjcmjaekcok">options page</a>.';
                document.getElementById('message').innerHTML = message;
                const optionsLink = document.getElementById('options-link');
                optionsLink.onclick = function() {
                    chrome.runtime.openOptionsPage();
                    return false;
                };
            }
        });
    }

    updateTrackInformation(streamAction) {
        this.updateTrackName(streamAction.track.name);
        this.updateTrackUploader(streamAction.track.uploader);
        this.updateTrackReposter(streamAction.reposter);
        this.updateTrackCategory(streamAction.track);
    }

    updateTrackName(name) {
        document.getElementById('track-name').innerHTML = name;
    }

    updateTrackUploader(uploader) {
        if (uploader.name != null) {
            document.getElementById('track-uploader').innerHTML = uploader.name;
        } else {
            document.getElementById('track-uploader').innerHTML = uploader.url;
        }
        this.updateTrackUploaderRating(uploader);
    }

    updateTrackReposter(reposter) {
        if (reposter != null && reposter.name != null) {
            document.getElementById('track-reposter').innerHTML = reposter.name;
            $('#track-reposter-section').show();
        } else if (reposter && reposter.url != null) {
            document.getElementById('track-reposter').innerHTML = reposter.url;
            $('#track-reposter-section').show();
        } else {
            document.getElementById('track-reposter').innerHTML = '';
            $('#track-reposter-section').hide();
        }
        this.updateTrackReposterRating(reposter);
    }

    updateTrackUploaderRating(uploader) {
        const score = uploader.score;
        if (score > 0) {
            $('#track-uploader').removeClass();
            $('#track-uploader').addClass('has-text-info');
        } else if (score < 0) {
            $('#track-uploader').removeClass();
            $('#track-uploader').addClass('has-text-danger');
        } else {
            $('#track-uploader').removeClass();
            $('#track-uploader').addClass('has-text-black');
        }
    }

    updateTrackReposterRating(reposter) {
        if (reposter) {
            const score = reposter.score;
            console.log(score);
            if (score > 0) {
                $('#track-reposter').removeClass();
                $('#track-reposter').addClass('has-text-info');
            } else if (score < 0) {
                $('#track-reposter').removeClass();
                $('#track-reposter').addClass('has-text-danger');
            } else {
                $('#track-reposter').removeClass();
                $('#track-reposter').addClass('has-text-black');
            }
        }
    }

    updateTrackCategory(track) {
        $('.category').removeClass('is-active')
        $('.category').removeClass('is-loading')
        $('.category').addClass('is-outlined')
        const activeCategory = track.category;
        if (activeCategory != null) {
            $('#' + activeCategory.toLowerCase()).addClass('is-active');
            $('#' + activeCategory.toLowerCase()).removeClass('is-outlined');
        }
    }

    showLoadingMessage() {
        document.getElementById('loading-track').innerHTML = 'Loading track...';
    }

    hideLoadingMessage() {
        document.getElementById('loading-track').innerHTML = '';
    }

    whenDocumentIsReady(functionToCall) {
        $(document).ready(functionToCall);
    }
}

new PopupController();
