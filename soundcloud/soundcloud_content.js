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
                const linkElement = trackElement.querySelectorAll('.soundContext__targetLink')[0];
                const targetLink = linkElement.getAttribute('href');

                if (targetLink === trackLink) {
                    streamTrackElement = trackElement;
                    break;
                }
        	}

            let uploaderName = null;
            let reposterUrl = null;
            let repost = null;
            if (streamTrackElement) {
                const uploaderNameElement = streamTrackElement.querySelectorAll('.soundTitle__usernameText')[0];
                uploaderName = uploaderNameElement.innerHTML;

                const usernameLinkElement = streamTrackElement.querySelectorAll('.soundContext__usernameLink')[0];
                const usernameLink = usernameLinkElement.getAttribute('href');
                const username = usernameLinkElement.innerHTML;

                const repostElements = streamTrackElement.querySelectorAll('.soundContext__repost');
                const reposted = repostElements.length !== 0;
                if (reposted) {
                    reposterUrl = usernameLink.replace('/', '');
                    reposterName = username;

                    const timeElement = streamTrackElement.querySelectorAll('.relativeTime')[0];
                    repostTime = timeElement.getAttribute('datetime');

                    repost = {
                        time: repostTime,
                        reposter: {
                            url: reposterUrl,
                            name: reposterName,
                        }
                    }
                }
            }

            const track = {
                url: trackUrl,
                name: trackName,
                uploader: {
                    url: uploaderUrl,
                    name: uploaderName,
                },
                repost: repost,
            }

            console.log(track);

            const message = {
                subject: 'newCurrentTrack',
                track: track,
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
