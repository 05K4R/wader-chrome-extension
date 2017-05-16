var soundcloudContent = {};
(function() {
    var soundBadgeObserver = new MutationObserver(function (mutations) {
        console.log('soundcloudContent: track change observed');

        var currentTrackTarget = document.querySelector('.playbackSoundBadge__title');
        if (currentTrackTarget) {

            // trackLink formatted as /uploaderUrl/trackUrl(?in=playlist)
            var trackLink = currentTrackTarget.getAttribute('href');

            // remove potential playlist
            var trackLink = trackLink.split('?')[0];

            var split = trackLink.split('/');
            var uploaderUrl = split[1];
            var trackUrl = split[2];

            var message = {
                subject: 'newCurrentTrack',
                uploaderUrl: uploaderUrl,
                trackUrl: trackUrl
            }

            chrome.runtime.sendMessage(message);
        }
    });
    var observerTarget = document.querySelector('.playbackSoundBadge');
    soundBadgeObserver.observe(observerTarget, {
        subtree: true,
        childList: true
    });
}).apply(soundcloudContent);
