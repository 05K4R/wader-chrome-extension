class PopupController {
    constructor() {
        this.updateTrackInformation();
        this.updateAvailableCategories();
        this.whenDocumentIsReady(this.showSignInMessage.bind(this));
        chrome.runtime.onMessage.addListener(this.currentlyPlayingListener.bind(this));
    }

    currentlyPlayingListener(request, sender, sendResponse) {
        if (request.subject == 'updatedCurrentlyPlayingStreamAction') {
            const streamAction = StreamAction.fromJSON(request.streamAction);
            this.updateTrackName(streamAction.track.name);
            this.updateTrackUploader(streamAction.track.uploader);
            this.updateTrackReposter(streamAction.reposter);
        }
    }

    whenDocumentIsReady(functionToCall) {
        $(document).ready(functionToCall);
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

    updateAvailableCategories() {
        chrome.runtime.sendMessage({'subject': 'getAllCategories'}, function(response) {
            this.listenToCategoryClicks();
            this.updateCategoryButtonStates();
        }.bind(this));
    }

    listenToCategoryClicks() {
        $(".category").click(function (button) {
            const categoryId = button.target.id;
            const message = {
                subject: 'setCategoryOnCurrentlyPlayingTrack',
                categoryId: categoryId,
            }
            chrome.runtime.sendMessage(message) ;
            this.updateCategoryButtonStates();
        }.bind(this));
    }

    updateCategoryButtonStates() {
        chrome.runtime.sendMessage({'subject': 'getCurrentlyPlayingTrack'}, function(response) {
            const track = response.track;
            const activeCategory = track.category;
            console.log(track);
            if (activeCategory != undefined) {
                $('.category').removeClass('is-active')
                $('.category').addClass('is-outlined')
                $('#' + activeCategory.toLowerCase()).addClass('is-active');
                $('#' + activeCategory.toLowerCase()).removeClass('is-outlined');
            }
        }.bind(this));
    }

    updateTrackInformation() {
        chrome.runtime.sendMessage({'subject': 'getCurrentlyPlayingStreamAction'}, function(response) {
            const streamAction = StreamAction.fromJSON(response.streamAction);
            this.updateTrackName(streamAction.track.name);
            this.updateTrackUploader(streamAction.track.uploader);
            this.updateTrackReposter(streamAction.reposter);
        }.bind(this));
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
    }

    updateTrackReposter(reposter) {
        if (reposter.name != null) {
            document.getElementById('track-reposter').innerHTML = reposter.name;
        } else {
            document.getElementById('track-reposter').innerHTML = reposter.url;
        }
    }
}

new PopupController();
