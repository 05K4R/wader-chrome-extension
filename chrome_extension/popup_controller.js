class PopupController {
    constructor() {
        this.updateAvailableGroups();
        this.updateTrackInformation();
        this.whenDocumentIsReady(this.showSignInMessage.bind(this));
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

    listenToRadioChanges() {
        $("input[type=radio]").change(function (radioButton) {
            const fullButtonId = radioButton.target.id;
            const groupId = fullButtonId.substring(fullButtonId.indexOf('-') + 1);
            const message = {
                subject: 'setCategoryOnCurrentlyPlayingTrack',
                categoryId: groupId,
            }
            chrome.runtime.sendMessage(message);
        });
    }

    updateAvailableGroups() {
        chrome.runtime.sendMessage({'subject': 'getAllCategories'}, function(response) {
            this.addGroupElements(response.categories, 'category');
            this.listenToRadioChanges();
            this.updateRadioButtonStates();
        }.bind(this));
    }

    updateRadioButtonStates() {
        chrome.runtime.sendMessage({'subject': 'getCurrentlyPlayingTrack'}, function(response) {
            const track = response.track;
            const activeCategory = track.category;
            if (activeCategory != undefined) {
                $('#group-' + activeCategory.id).click();
            }
        }.bind(this));
    }

    updateTrackInformation() {
        chrome.runtime.sendMessage({'subject': 'currentlyPlayingTrackIsReposted'}, function(response) {
            if (response.result) {
                chrome.runtime.sendMessage({'subject': 'getCurrentRepost'}, function(response) {
                    const repost = response.repost;
                    const track = repost.track;
                    this.updateTrackName(track.name);
                    this.updateTrackUploader(track.uploader);
                    this.updateTrackReposter(repost.reposter);
                }.bind(this));
            } else {
                chrome.runtime.sendMessage({'subject': 'getCurrentlyPlayingTrack'}, function(response) {
                    const track = response.track;
                    this.updateTrackName(track.name);
                    this.updateTrackUploader(track.uploader);
                }.bind(this));
            }
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

    addGroupElements(groups, groupType) {
        for (const group of groups) {
            this.addGroupElement(group, groupType);
        }
    }

    addGroupElement(group, groupType) {
        let inputType;
        if (groupType == 'category') {
            inputType = 'radio';
        } else {
            inputType = 'checkbox';
        }

        $('#available-' + groupType + '-groups').append(
             $('<label />', {
                'text': group.name,
                'class': 'btn btn-primary'
             }).append(
                $('<input />', {
                    type: inputType,
                    name: group.name,
                    id: 'group-' + group.id,
                    value: group.id,
                    click: function() {
                        const message = {
                            subject: 'toggleGroup',
                            groupType: groupType,
                            groupId: group.id,
                        }
                        chrome.runtime.sendMessage(message);
                    }
                })
            )
        );
    }
}

new PopupController();
