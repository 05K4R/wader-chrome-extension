class PopupController {
    constructor() {
        this.updateTrackInformation();
        this.updateAvailableCategories();
        this.whenDocumentIsReady(this.showSignInMessage.bind(this));
        chrome.runtime.onMessage.addListener(this.currentlyPlayingListener.bind(this));
    }

    currentlyPlayingListener(request, sender, sendResponse) {
        if (request.subject == 'updatedCurrentlyPlayingStreamAction') {
            this.updatePage(StreamAction.fromJSON(request.streamAction));
        }
    }

    updateTrackInformation() {
        chrome.runtime.sendMessage({'subject': 'getCurrentlyPlayingStreamAction'}, function(response) {
            this.updatePage(StreamAction.fromJSON(response.streamAction));
        }.bind(this));
    }

    updatePage(streamAction) {
        this.updateTrackName(streamAction.track.name);
        this.updateTrackUploader(streamAction.track.uploader);
        this.updateTrackReposter(streamAction.reposter);
        this.currentlyPlayingStreamAction = streamAction;
        this.updateCategoryButtonStates();
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
        const track = this.currentlyPlayingStreamAction.track;
        const activeCategory = track.category;
        if (activeCategory != undefined) {
            $('.category').removeClass('is-active')
            $('.category').addClass('is-outlined')
            $('#' + activeCategory.toLowerCase()).addClass('is-active');
            $('#' + activeCategory.toLowerCase()).removeClass('is-outlined');
        }
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

    updateTrackUploaderRating(uploader) {
        chrome.runtime.sendMessage({'subject': 'getProfileScore', 'profileId': uploader.url}, function(response) {
            const score = response.score;
            if (score > 0) {
                document.getElementById('track-uploader-rating').innerHTML = 'Good quality tracks, keep following!';
            } else if (score < 0) {
                document.getElementById('track-uploader-rating').innerHTML = 'Bad quality tracks, unfollow!';
            } else {
                document.getElementById('track-uploader-rating').innerHTML = 'Keep categorizing tracks to get a rating';
            }
        }.bind(this));
    }

    updateTrackReposter(reposter) {
        if (reposter && reposter.name != null) {
            document.getElementById('track-reposter').innerHTML = reposter.name;
        } else if (reposter && reposter.url != null){
            document.getElementById('track-reposter').innerHTML = reposter.url;
        } else {
            document.getElementById('track-reposter').innerHTML = '';
        }

        this.updateTrackReposterRating(reposter);
    }

    updateTrackReposterRating(reposter) {
        if (reposter) {
            chrome.runtime.sendMessage({'subject': 'getProfileScore', 'profileId': reposter.url}, function(response) {
                const score = response.score;
                if (score > 0) {
                    document.getElementById('track-reposter-rating').innerHTML = 'Good quality tracks, keep following!';
                } else if (score < 0) {
                    document.getElementById('track-reposter-rating').innerHTML = 'Bad quality tracks, unfollow!';
                } else {
                    document.getElementById('track-reposter-rating').innerHTML = 'Keep categorizing tracks to get a rating';
                }
            }.bind(this));
        } else {
            document.getElementById('track-reposter-rating').innerHTML = '';
        }
    }

    async getProfileRating(profile) {
    }

    whenDocumentIsReady(functionToCall) {
        $(document).ready(functionToCall);
    }
}

new PopupController();
