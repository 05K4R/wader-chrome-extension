class ListeningScraper {
    constructor() {
        this.addCurrentlyPlayingTrackChangeObserver();
    }

    addCurrentlyPlayingTrackChangeObserver() {
        new MutationObserver(this.updateCurrentlyPlayingTrack.bind(this))
                .observe(document.querySelector('.playbackSoundBadge'), {
            subtree: true,
            childList: true
        });
    }

    updateCurrentlyPlayingTrack() {
        console.log('Wader: new currently playing track observed');
        const currentlyPlayingTrack = this.scrapeCurrentlyPlayingTrack();
        if (currentlyPlayingTrack) {
            const streamAction = this.findStreamActionFor(currentlyPlayingTrack);
            this.publishNewCurrentlyPlayingStreamAction(streamAction);
        } else {
            console.error('Wader: unable to scrape currently playing track');
        }
    }

    findStreamActionFor(track) {
        const allStreamActions = this.scrapeStreamActions();
        if (this.streamActionsContains(track, allStreamActions)) {
            return this.getStreamActionFor(track, allStreamActions);
        } else {
            // Even if we can't find the track in the stream, we know for sure that it has been uploaded so we fake an
            // 'Upload' stream action
            return this.createUploadStreamActionFor(track);
        }
    }

    streamActionsContains(track, streamActions) {
        if (this.getStreamActionFor(track, streamActions)) {
            return true;
        } else {
            return false;
        }
    }

    getStreamActionFor(track, streamActions) {
        for (let i = 0; i < streamActions.length; i++) {
            if (streamActions[i].track.url == track.url && streamActions[i].track.uploader.url == track.uploader.url) {
                return streamActions[i];
            }
        }
    }

    scrapeStreamActions() {
        const allStreamActionElements = document.querySelectorAll('.soundList__item');
        const allStreamActions = [];

        for (let i = 0; i < allStreamActionElements.length; i++) {
            const streamActionElement = allStreamActionElements[i];
            const isPlaylist = streamActionElement.querySelectorAll('.sound.playlist.streamContext').length === 1;
            const isRepost = streamActionElement.querySelectorAll('.soundContext__repost').length === 1;

            if (!isPlaylist && isRepost) {
                allStreamActions.push(this.scrapeTrackRepostStreamActionFrom(streamActionElement));
            } else if (isPlaylist && !isRepost) {
                allStreamActions.push(this.scrapePlaylistPostStreamActionFrom(streamActionElement));
            } else if (isPlaylist && isRepost) {
                allStreamActions.push(this.scrapePlaylistRepostStreamActionFrom(streamActionElement));
            }
        }
        return allStreamActions;
    }

    scrapeTrackRepostStreamActionFrom(streamActionElement) {
        const trackTitleElement = streamActionElement.querySelectorAll('.soundTitle__title')[0];
        const track = this.parseTrack(trackTitleElement);

        const reposterLinkElement = streamActionElement.querySelectorAll('.soundContext__usernameLink')[0];
        const reposterUrl = reposterLinkElement.getAttribute('href').replace('/', '');
        const reposterName = reposterLinkElement.innerText;

        const repostTimeElement = streamActionElement.querySelectorAll('.relativeTime')[0];
        const repostTimeInSeconds = (Date.parse(repostTimeElement.getAttribute('datetime')))/1000;

        const reposter = new Profile(reposterUrl, reposterName);

        return new Repost(track, repostTimeInSeconds, reposter);
    }

    scrapePlaylistPostStreamActionFrom(streamActionElement) {

    }

    scrapePlaylistRepostStreamActionFrom(streamActionElement) {

    }

    createUploadStreamActionFor(track) {
        return new Upload(track);
    }

    scrapeCurrentlyPlayingTrack() {
        const currentlyPlayingTrackElement = document.querySelector('.playbackSoundBadge__titleLink');
        if (currentlyPlayingTrackElement) {
            return this.parseTrack(currentlyPlayingTrackElement);
        }
    }

    publishNewCurrentlyPlayingStreamAction(streamAction) {
        chrome.runtime.sendMessage({
            subject: 'newCurrentlyPlayingStreamAction',
            streamAction: streamAction.asJSON(),
        });
    }

    parseTrack(currentTrackTarget) {
        // href attribute formatted as /uploaderUrl/trackUrl?in=playlist
        const splitTrackLink = currentTrackTarget.getAttribute('href').split('?');
        const uploaderUrl = splitTrackLink[0].split('/')[1];
        const trackUrl = splitTrackLink[0].split('/')[2];

        let name = null;
        if (currentTrackTarget.getAttribute('title')) {
            name = currentTrackTarget.getAttribute('title');
        } else if (currentTrackTarget.innerText) {
            name = currentTrackTarget.innerText;
        }

        const uploader = new Profile(uploaderUrl);

        return new Track(uploader, trackUrl, name);
    }
}

const scraper = new ListeningScraper();
