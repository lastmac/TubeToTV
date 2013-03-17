// ask extension how many buttons should be implemented
chrome.extension.sendMessage({method: "getStatus"}, function (response) {
	var xbmc_count = response.status;
	var xbmc_name = response.name;
	if (!xbmc_name)
		xbmc_name = '[{"value":""}]'
		
	__init__(xbmc_count, xbmc_name);
});

function __init__(xbmc_count, xbmc_name){
	var ni = document.getElementById('playlist-actions');
	var ytbcss = 'yt-uix-button-playlist-action yt-uix-button yt-uix-button-default yt-uix-tooltip';
	
	// run for each xbmc in the settings to add buttons
	for (y = 0; y < xbmc_count; y++) {
		var playbtn = document.createElement('button');
		playbtn.setAttribute('id', 'TubeToTV');
		playbtn.setAttribute('name', 'TubeToTV');
		playbtn.setAttribute('class', ytbcss);
		
		// more than 1 XBMC in the settings
		if (xbmc_count > 1) {
			var default_name = JSON.parse(xbmc_name)[y].value;
			if (!default_name)
				default_name = 'XBMC';

			playbtn.setAttribute('title', 'Start playing this video on ' + default_name);
			// l for list
			playbtn.innerHTML = '<span class="yt-uix-button-content" selector="list' + y + 'l">' + default_name + '</span>';
		}
		// only 1 XBMC in the settings
		else {
			var default_name = JSON.parse(xbmc_name)[0].value;
			if (!default_name)
				default_name = 'Send to XBMC';
			
			playbtn.setAttribute('title', 'Start playing this video on ' + default_name);
			playbtn.innerHTML = '<span class="yt-uix-button-content" selector="list0l">' + default_name + '</span>';
		}

		// inject button
		ni.appendChild(playbtn);
	}
	// collect all buttons and wait for a click
	var playButtons = document.getElementsByName('TubeToTV');
	for (var i = 0; i < playButtons.length; i++) {
		playButtons[i].onclick = function () {
			playDetected();
		};
	};
};

function playDetected() {
	//console.log("playDetected");
	var e = window.event;
	// send request to play the video
	chrome.extension.sendMessage({play: e.target.getAttribute('selector')});
};
