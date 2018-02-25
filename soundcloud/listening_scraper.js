class ListeningScraper {
    constructor() {
        this.startObserveCurrentTrackChange();

        const currentTrackElement = this.getElementFromSelector('.playbackSoundBadge');
        const currentTrackChangedObserver = this.createObserverWithCallback(this.currentTrackChange());
        this.startObserve(currentTrackElement, currentTrackChangedObserver);
    }





    currentTrackChange() {
        const newTrack = this.getCurrentTrack();
        if (this.trackIsReposted(newTrack)) {
        } else {
        }
    }

    getCurrentTrack() {
        const currentTrack = {
            url: getCurrentTrackUrl(),
            name: getCurrentTrackName(),
            uploader: getCurrentTrackUploader(),
            reposter: getCurrentTrackReposter()
        }

        return currentTrack;
    }

    getCurrentTrackUrl() {
        const currentlyPlayingTrackLinkElement = this.getCurrentlyPlayingTrackLinkElement();
        return getTrackUrlFromTrackLinkElement(currentlyPlayingTrackLinkElement);
    }

    getCurrentlyPlayingTrackLinkElement() {
        return this.getElement('.playbackSoundBadge__titleLink');
    }








    static getElementFromSelector(selector) {
        return document.querySelector(selector);
    }

    static createObserverWithCallback(callback) {
        return new MutationObserver(callback);
    }

    static startObserveTargetWithObserver(target, observer) {
        observer.observe(target, {
            subtree: true,
            childList: true
        });
    }

    static sendMessageToBackground(message) {
        // TODO later
    }

}

new ListeningScraper();
