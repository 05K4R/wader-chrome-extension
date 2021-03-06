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
                allStreamActions.push(...this.scrapePlaylistPostStreamActionsFrom(streamActionElement));
            } else if (isPlaylist && isRepost) {
                allStreamActions.push(...this.scrapePlaylistRepostStreamActionsFrom(streamActionElement));
            }
        }
        return allStreamActions;
    }

    scrapeTrackRepostStreamActionFrom(streamActionElement) {
        const trackTitleElement = streamActionElement.querySelectorAll('.soundTitle__title')[0];
        const track = this.parseTrack(trackTitleElement);

        const reposter = this.scrapeActorProfileFromStreamAction(streamActionElement);

        const repostTimeElement = streamActionElement.querySelectorAll('.relativeTime')[0];
        const repostTimeInSeconds = (Date.parse(repostTimeElement.getAttribute('datetime')))/1000;

        return new Repost(track, repostTimeInSeconds, reposter);
    }

    scrapePlaylistPostStreamActionsFrom(streamActionElement) {
        const playlistPoster = this.scrapeActorProfileFromStreamAction(streamActionElement);
        const playlistUrl = this.scrapePlaylistUrlFromStreamAction(streamActionElement);
        const playlist = new Playlist(playlistPoster, playlistUrl);

        const playlistTrackActions = [];
        const allTrackElements = streamActionElement.querySelectorAll('.compactTrackList__item');
        allTrackElements.forEach((trackElement) => {
            const trackTitleElement = trackElement.querySelectorAll('.compactTrackListItem__trackTitle')[0];
            const track = this.parseTrack(trackTitleElement);
            playlistTrackActions.push(new PlaylistPost(track, playlist));
        });
        return playlistTrackActions;
    }

    scrapePlaylistRepostStreamActionsFrom(streamActionElement) {
        const playlistReposter = this.scrapeActorProfileFromStreamAction(streamActionElement);

        const posterLinkElement = streamActionElement.querySelectorAll('.soundTitle__username')[0];
        const posterUrl = posterLinkElement.getAttribute('href').replace('/', '');
        const playlistPoster = new Profile(posterUrl);

        const playlistUrl = this.scrapePlaylistUrlFromStreamAction(streamActionElement);
        const playlist = new Playlist(playlistPoster, playlistUrl);

        const repostTimeElement = streamActionElement.querySelectorAll('.relativeTime')[0];
        const repostTimeInSeconds = (Date.parse(repostTimeElement.getAttribute('datetime')))/1000;

        const playlistTrackActions = [];
        const allTrackElements = streamActionElement.querySelectorAll('.compactTrackList__item');
        allTrackElements.forEach((trackElement) => {
            const trackTitleElement = trackElement.querySelectorAll('.compactTrackListItem__trackTitle')[0];
            if (trackTitleElement) {
                const track = this.parseTrack(trackTitleElement);
                playlistTrackActions.push(new PlaylistRepost(track, playlist, repostTimeInSeconds, playlistReposter));
            }
        });
        return playlistTrackActions;
    }

    scrapeActorProfileFromStreamAction(streamActionElement) {
        const profileLinkElement = streamActionElement.querySelectorAll('.soundContext__usernameLink')[0];
        const profileUrl = profileLinkElement.getAttribute('href').replace('/', '');
        const profileName = profileLinkElement.innerText;
        return new Profile(profileUrl, profileName);
    }

    scrapePlaylistUrlFromStreamAction(streamActionElement) {
        const playlistElement = streamActionElement.querySelectorAll('.soundTitle__title')[0];
        return playlistElement.getAttribute('href').split('/')[3];
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
        // href/data-permalik-path attribute formatted as /uploaderUrl/trackUrl?in=playlist
        let trackLink = currentTrackTarget.getAttribute('href');
        if (!trackLink) {
            trackLink = currentTrackTarget.getAttribute('data-permalink-path');
        }
        const splitTrackLink = trackLink.split('?');
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
