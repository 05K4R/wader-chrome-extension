const messageHandler = {};
(function() {
    firebase.initializeApp({
        apiKey: 'AIzaSyBn753lEWxDjU9E_rCgF7Nrxjt1tdiA4TI',
        authDomain: 'wader-d8a71.firebaseapp.com',
        databaseURL: 'https://wader-d8a71.firebaseio.com',
        projectId: 'wader-d8a71',
        storageBucket: 'wader-d8a71.appspot.com',
        messagingSenderId: '68541536183'
    });

    const connection = new FirestoreConnection();
    const soundcloudModel = new FirestoreSoundcloudModel(connection);
    const groupModel = new FirestoreGroupModel(connection);

    chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
        console.log('messageHandler: new message with subject "'
            + request.subject + '"');

        if (request.subject == 'setCurrentlyPlayingTrack') {
            soundcloudModel.setCurrentlyPlayingTrack(request.track);
        } else if (request.subject == 'setCurrentlyPlayingRepostedTrack') {
            soundcloudModel.setCurrentlyPlayingRepostedTrack(request.repost);
        } else if (request.subject == 'setCategoryOnCurrentlyPlayingTrack') {
            const category = groupModel.getCategory(request.categoryId);
            soundcloudModel.setCategoryOnCurrentlyPlayingTrack(category);
        } else if (request.subject == 'addLabelToCurrentlyPlayingTrack') {
            const label = groupModel.getLabel(request.labelId);
            soundcloudModel.addLabelToCurrentlyPlayingTrack(label);
        } else if (request.subject == 'removeLabelFromCurrentlyPlayingTrack') {
            const label = groupModel.getLabel(request.labelId);
            soundcloudModel.removeLabelFromCurrentlyPlayingTrack(label);
        } else if (request.subject == 'addLabels') {
            groupModel.addLabels(request.labels);
        } else if (request.subject == 'addCategories') {
            groupModel.addCategories(request.categories);
        } else if (request.subject == 'getAllCategories') {
            groupModel.getAllCategories()
                .then(function(categories) {
                    sendResponse({ categories: categories });
                });
            return true;
        } else {
            console.log('messageHandler: message subject "'
                + request.subject + '" not found');
            return;
        }
    });
}).apply(messageHandler);
