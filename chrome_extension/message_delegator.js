class MessageDelegator {
    constructor(soundcloudModel, groupModel) {
        this.soundcloudModel = soundcloudModel;
        this.groupModel = groupModel;
        this.startListenToMessages();
    }

    startListenToMessages() {
        chrome.runtime.onMessage.addListener(this.testListener);
    }

    testListener(request, sender, sendResponse) {
        console.log(request.subject);
        console.log('över detta var cool musik');
    }
}
