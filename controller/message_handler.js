const messageHandler = {};
(function() {
	chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
		console.log('messageHandler: new message with subject "'
			+ request.subject + '"');

		if (request.subject == 'newCurrentTrack') {
			model.newCurrentTrack(request.track);
		} else if (request.subject == 'getAvailableGroups') {
			const response = {
				categories: model.getAvailableGroups('categories'),
				labels: model.getAvailableGroups('labels'),
			}
			sendResponse(response);
		} else if (request.subject == 'updateGroup') {
			model.updateGroup(request.type, request.group);
		} else if (request.subject == 'deleteGroup') {
			model.deleteGroup(request.type, request.id);
		} else if (request.subject == 'addGroup') {
			model.addGroup(request.type, request.name);
		} else {
			console.log('messageHandler: message subject "'
				+ request.subject + '" not found');
			return;
		}
	});
}).apply(messageHandler);
