var soundcloudContent = {};
(function() {
    var soundBadgeObserver = new MutationObserver(function (mutations) {
        console.log('soundcloudContent: track change observed');

        var currentTrackTarget = document.querySelector('.playbackSoundBadge__title');
        if (currentTrackTarget) {

            // trackLink formatted as /uploaderUrl/trackUrl?otherstuff
            var trackLink = currentTrackTarget.getAttribute('href');

            // remove potential playlist or other things
            var trackLink = trackLink.split('?')[0];

            var split = trackLink.split('/');
            var uploaderUrl = split[1];
            var trackUrl = split[2];
            var trackName = currentTrackTarget.getAttribute('title');

            var allStreamTracks = document.querySelectorAll('.soundList__item');

            for (var i = 0; i < allStreamTracks.length; i++) {
                var item = allStreamTracks[i];
                // Find if the track is the current playing, if so get reposter
        	}
            // uploaderName
            // reposterUrl
            // reposterName

            var track = {
                url: trackUrl,
                name: trackName,
                uploader: {
                    url: uploaderUrl
                }
            }

            var message = {
                subject: 'newCurrentTrack',
                track: track,
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
