const messageHandler = {};
(function() {
	chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
		console.log('messageHandler: new message with subject "'
			+ request.subject + '"');

		if (request.subject == 'newCurrentTrack') {
			model.newCurrentTrack(request.track);
		} else {
			console.log('messageHandler: message subject "'
				+ request.subject + '" not found');
			return;
		}
	});
}).apply(messageHandler);
