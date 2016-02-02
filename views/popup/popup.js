var matchUrl = '*://www.youtube.com/watch?v*';
var queryInfo = {url: matchUrl};
chrome.tabs.query(queryInfo, function(tabs) {
	var cl = $('#content-list');
	tabs.forEach(function(tab) {
		var imageClass = tab.audible ? 'pauseImage' : 'playImage';
		var x = `
			<div class="item" id=${tab.id}>
				<div class="tabimage" id="playpause${tab.id}">
					<img class="${imageClass}" id="playImage${tab.id}" border="0">
				</div>
				<div class="tabInfo" id="jump${tab.id}">
					<div class="close" id="close${tab.id}" title="close tab"></div>
					<div class="title">${tab.title}</div>
					<div class="url">${tab.url}</div>
				</div>
			</div>
		`
		cl.append($(x));

		$('#playpause'+tab.id).on('click', {tabId: tab.id}, function(event) {
			console.log('Clicked tab with event state ', event.data.tabId);
			chrome.tabs.sendMessage(event.data.tabId, {message: 'toggle_video_state', tabId: event.data.tabId}, function(response) {
				if (response.error) {
					console.log('No video found in tab');
				} else {
					if (response.paused) {
						$('#playpause' + response.tabId + ' img').attr('class', 'playImage');
					} else {
						$('#playpause' + response.tabId + ' img').attr('class', 'pauseImage');
					}
				}
			});
		});

		$('#jump'+tab.id).on('click', {tabId: tab.id, windowId: tab.windowId}, function(event) {
			console.log('Clicked tab with event state ', event.data.tabId);
			chrome.windows.update(event.data.windowId, {focused: true});
			chrome.tabs.update(event.data.tabId, {active: true});
		});

		$('#close'+tab.id).on('click', {tabId: tab.id}, function(event) {
			console.log('Clicked tab with event state ', event.data.tabId);
			chrome.tabs.remove(event.data.tabId);
		});
	});
	if (tabs.length == 0) {
		var x = `
			<div style="text-align: center">No active youtube tabs</div>
		`
		$('body').attr('style', 'margin: 0; padding: 0');
		$('html').attr('style', 'margin: 0; padding: 0');
		cl.append($(x));
	}
});
