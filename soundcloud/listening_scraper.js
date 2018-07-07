const soundcloudContent = {};
(function() {
    const soundBadgeObserver = new MutationObserver(function (mutations) {
        console.log('soundcloudContent: track change observed');

        const currentTrackTarget = document.querySelector('.playbackSoundBadge__titleLink');
        if (currentTrackTarget) {

            // trackLink formatted as /uploaderUrl/trackUrl?in=playlist
            const trackLink = currentTrackTarget.getAttribute('href');
            const splitTrackLink = trackLink.split('?');

            let playlist = null;
            if (splitTrackLink.length > 1) {
                playlist = splitTrackLink[1];
            }

            const uploaderUrl = splitTrackLink[0].split('/')[1];
            const trackUrl = splitTrackLink[0].split('/')[2];
            const trackName = currentTrackTarget.getAttribute('title');

            const allStreamTrackElements = document.querySelectorAll('.soundList__item');

            let streamTrackElement = null;
            for (let i = 0; i < allStreamTrackElements.length; i++) {
                const trackElement = allStreamTrackElements[i];
                const linkElement = trackElement.querySelectorAll('.soundTitle__title')[0];
                const targetLink = linkElement.getAttribute('href');

                if (targetLink === trackLink) {
                    streamTrackElement = trackElement;
                    break;
                }
        	}

            const track = {
                url: trackUrl,
                name: trackName,
                uploader: {
                    url: uploaderUrl,
                }
            }

            let uploaderName = null;
            let reposterUrl = null;
            let repost = null;
            if (streamTrackElement) {
                const uploaderNameElement = streamTrackElement.querySelectorAll('.soundTitle__usernameText')[0];
                uploaderName = uploaderNameElement.innerText;

                track.uploader.uploaderName = uploaderName;

                const usernameLinkElement = streamTrackElement.querySelectorAll('.soundContext__usernameLink')[0];
                const usernameLink = usernameLinkElement.getAttribute('href');
                const username = usernameLinkElement.innerText;

                const repostElements = streamTrackElement.querySelectorAll('.soundContext__repost');
                const reposted = repostElements.length !== 0;
                if (reposted) {
                    reposterUrl = usernameLink.replace('/', '');
                    reposterName = username;

                    const timeElement = streamTrackElement.querySelectorAll('.relativeTime')[0];
                    repostTime = Date.parse(timeElement.getAttribute('datetime'));

                    repost = {
                        time: repostTime,
                        track: track,
                        reposter: {
                            url: reposterUrl,
                            name: reposterName,
                        }
                    }
                }
            }

            let message = null;
            if (repost) {
                message = {
                    subject: 'setCurrentlyPlayingRepostedTrack',
                    repost: repost,
                }
            } else {
                message = {
                    subject: 'setCurrentlyPlayingTrack',
                    track: track,
                }
            }

            chrome.runtime.sendMessage(message);
        }
    });

    const observerTarget = document.querySelector('.playbackSoundBadge');
    soundBadgeObserver.observe(observerTarget, {
        subtree: true,
        childList: true
    });
}).apply(soundcloudContent);
