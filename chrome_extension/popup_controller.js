class PopupController {
    constructor() {
        this.updateAvailableGroups();
        this.updateTrackInformation();
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

    listenToCheckboxChanges() {
        $("input[type=checkbox]").change(function (checkbox) {
            const fullCheckboxId = checkbox.target.id;
            const groupId = fullCheckboxId.substring(fullCheckboxId.indexOf('-') + 1);
            const message = {
                subject: 'addLabelToCurrentlyPlayingTrack',
                labelId: groupId,
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

        chrome.runtime.sendMessage({'subject': 'getAllLabels'}, function(response) {
            this.addGroupElements(response.labels, 'label');
            this.listenToCheckboxChanges();
            this.updateCheckboxButtonStates();
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

    updateCheckboxButtonStates() {
        chrome.runtime.sendMessage({'subject': 'getCurrentlyPlayingTrack'}, function(response) {
            const track = response.track;
            const activeLabels = track.labels;
            if (activeLabels != undefined) {
                for (const label of activeLabels) {
                    $('#group-' + label.id).click();
                }
            }
        }.bind(this));
    }

    updateTrackInformation() {
        chrome.runtime.sendMessage({'subject': 'getCurrentlyPlayingTrack'}, function(response) {
            const track = response.track;
            this.updateTrackName(track.name);
            this.updateTrackUploader(track.uploader);

            if (track.reposter != null) {
                this.updateTrackReposter(track.reposter);
            }

            this.updateRatios(track.id);
        }.bind(this));
    }

    updateRatios(trackId) {
        chrome.runtime.sendMessage({'subject': 'getTrackCategoryRatios', 'trackId': trackId}, function(response) {
            this.addGroupRatios(response.ratios, 'category');
        }.bind(this));

        chrome.runtime.sendMessage({'subject': 'getTrackLabelRatios', 'trackId': trackId}, function(response) {
            this.addGroupRatios(response.ratios, 'label');
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

    addGroupRatios(ratios, groupType) {
        for (const group of ratios.uploader) {
            const element = document.getElementById('uploader-' + groupType + '-ratios');
            element.innerHTML += group.name + ': ' + group.ratio + '% ';
        }

        for (const group of ratios.reposter) {
            const element = document.getElementById('reposter-' + groupType + '-ratios');
            element.innerHTML += group.name + ': ' + group.ratio + '% ';
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
