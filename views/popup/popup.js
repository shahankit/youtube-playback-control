var matchUrl = '*://www.youtube.com/watch?v*';
var queryInfo = {url: matchUrl};


chrome.tabs.query(queryInfo, function(tabs) {
	var cl = $('#content-list');
	tabs.forEach(function(tab) {
		var imageName = tab.audible ? 'pause.png' : 'play.png';
		var x = `
			<div class="item tab open" id=${tab.id}>
				<div id=${tab.id+"playpause"} class="listinfo">
					<div class="tabimage">
						<img src="/assets/${imageName}" width="16" height="16" border="0">
					</div>
					<div>
						<div class="title">${tab.title}</div>
						<div class="url">${tab.url}</div>
					</div>
				</div>
				<div id=${tab.id+"inc_volume"} class="tabimage volume_plus volume_style"></div>
				<div id=${tab.id+"dec_volume"} class="tabimage volume_minus volume_style"></div>
			</div>
		`
		//Appending to DOM
		cl.append($(x));
		
		//onClick of Click of Play-pause button
		$('#'+tab.id+"playpause").on('click', {tabId: tab.id}, function(event) {
			console.log('Clicked tab with event state ', event.data.tabId);
			chrome.tabs.sendMessage(event.data.tabId, {message: 'toggle_video_state', tabId: event.data.tabId}, function(response) {
				if (response.error) {
					console.log('No video found in tab');
				} else {
					if (response.paused) {
						$('#' + response.tabId + ' img').attr('src', '/assets/play.png');
					} else {
						$('#' + response.tabId + ' img').attr('src', '/assets/pause.png');
					}
				}
			});
		});
		
		// Volume Increment click event
		$('#'+tab.id+"inc_volume").on('click', {tabId: tab.id}, function(event) {
			chrome.tabs.sendMessage(event.data.tabId, {message: 'increment_volume', tabId: event.data.tabId}, function(response) {
				if (response.error) {
					console.log('Cannot increment video volume');
				} 
			});
		});
		
		// Volume Decrement click event
		$('#'+tab.id+"dec_volume").on('click', {tabId: tab.id}, function(event) {
			chrome.tabs.sendMessage(event.data.tabId, {message: 'decrement_volume', tabId: event.data.tabId}, function(response) {
				if (response.error) {
					console.log('Cannot decrement video volume');
				} 
			});
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
