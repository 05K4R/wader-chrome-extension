const CURRENTLY_PLAYING_TRACK_OBSERVER_TARGET = '.playbackSoundBadge';
const CURRENTLY_PLAYING_TRACK_SELECTOR = '.playbackSoundBadge__titleLink';
const STREAM_ACTIONS_SELECTOR = '.soundList__item';
const REPOST_SELECTOR = '.soundContext__repost';
const REPOST_TIME_SELECTOR = '.relativeTime';
const REPOSTER_LINK_SELECTOR = '.soundContext__usernameLink';
const TRACK_TITLE_SELECTOR = '.soundTitle__title';

class ListeningScraper {
    constructor() {
        this.addCurrentlyPlayingTrackChangeObserver();
    }

    addCurrentlyPlayingTrackChangeObserver() {
        new MutationObserver(this.updateCurrentlyPlayingTrack.bind(this))
                .observe(document.querySelector(CURRENTLY_PLAYING_TRACK_OBSERVER_TARGET), {
            subtree: true,
            childList: true
        });
    }

    updateCurrentlyPlayingTrack() {
        console.log('Wader: new currently playing track observed');
        const currentlyPlayingTrack = this.scrapeCurrentlyPlayingTrack();
        if (currentlyPlayingTrack) {
            const streamAction = this.findStreamActionFor(currentlyPlayingTrack);
            this.sendNewCurrentlyPlayingTrack(currentlyPlayingTrack, streamAction);
        } else {
            console.log('Wader: unable to scrape currently playing track');
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
        const allStreamActionElements = document.querySelectorAll(STREAM_ACTIONS_SELECTOR);
        const allStreamActions = [];

        for (let i = 0; i < allStreamActionElements.length; i++) {
            const streamActionElement = allStreamActionElements[i];
            const repostElements = streamActionElement.querySelectorAll(REPOST_SELECTOR);
            const isARepost = repostElements.length === 1;

            if (isARepost) {
                allStreamActions.push(this.scrapeRepostStreamActionFrom(streamActionElement));
            }
        }
        return allStreamActions;
    }

    scrapeRepostStreamActionFrom(streamActionElement) {
        const trackTitleElement = streamActionElement.querySelectorAll(TRACK_TITLE_SELECTOR)[0];
        const track = this.parseTrack(trackTitleElement);

        const reposterLinkElement = streamActionElement.querySelectorAll(REPOSTER_LINK_SELECTOR)[0];
        const reposterUrl = reposterLinkElement.getAttribute('href').replace('/', '');
        const reposterName = reposterLinkElement.innerText;

        const repostTimeElement = streamActionElement.querySelectorAll(REPOST_TIME_SELECTOR)[0];
        const repostTimeInSeconds = (Date.parse(repostTimeElement.getAttribute('datetime')))/1000;

        return {
            type: 'REPOST',
            time: repostTimeInSeconds,
            track: track,
            reposter: {
                url: reposterUrl,
                name: reposterName
            }
        };
    }

    createUploadStreamActionFor(track) {
        return {
            type: 'UPLOAD',
            track: track
        }
    }

    scrapeCurrentlyPlayingTrack() {
        const currentlyPlayingTrackElement = document.querySelector(CURRENTLY_PLAYING_TRACK_SELECTOR);
        if (currentlyPlayingTrackElement) {
            return this.parseTrack(currentlyPlayingTrackElement);
        }
    }

    sendNewCurrentlyPlayingTrack(track, streamAction) {
        chrome.runtime.sendMessage({
            subject: 'newCurrentlyPlayingTrack',
            track: track,
            streamAction: streamAction,
        });
    }

    parseTrack(currentTrackTarget) {
        // href attribute formatted as /uploaderUrl/trackUrl?in=playlist
        const splitTrackLink = currentTrackTarget.getAttribute('href').split('?');

        let name = null;
        if (currentTrackTarget.getAttribute('title')) {
            name = currentTrackTarget.getAttribute('title');
        } else if (currentTrackTarget.innerText) {
            name = currentTrackTarget.innerText;
        }

        return {
            url: splitTrackLink[0].split('/')[2],
            name: name,
            uploader: {
                url: splitTrackLink[0].split('/')[1],
            }
        }
    }
}

const scraper = new ListeningScraper();
