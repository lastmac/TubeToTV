// ask extension how many buttons should be implemented
chrome.extension.sendMessage({method: "getStatus"}, function (response) {
	var xbmc_count = response.status;
	var xbmc_name = response.name;
	if (!xbmc_name)
		xbmc_name = '[{"value":""}]'
	console.log("count: " + xbmc_count);
	//console.log("names: " + xbmc_name);

	//youtube layout until 10/2012
	var ytbcss_old = "start yt-uix-button yt-uix-button-default"
	//layout from 10/2012
	// var ytbcss_new = "yt-uix-button yt-uix-button-text"
	var ytbcss_new = "yt-uix-button yt-uix-button-text yt-uix-tooltip"

	//var cssURL = chrome.extension.getURL("/css/yttt.css");
	// normal youtube UI
	var ni = document.getElementById('watch7-headline');
	//css
	//var ncss = document.getElementById('www-core-css');

	//new or old youtube layout?
	if (!ni) {
		var ni = document.getElementById('watch-headline-user-info');
		ytbcss = ytbcss_old;
	}
	else {
		ytbcss = ytbcss_new;
	}

	// first time only - no settings saved yet
	if (!xbmc_count) {
		var playbtn = document.createElement('button');
		playbtn.setAttribute('id', 'TubeToTV');
		playbtn.setAttribute('name', 'TubeToTV');
		playbtn.setAttribute('class', ytbcss);
		playbtn.setAttribute('title', 'Configure TubeToTV with your XBMC settings');
		playbtn.innerHTML = '<span selector="1337" class="yt-uix-button-content">XBMC Settings</span>';
		ni.appendChild(playbtn);
	}

	// run for each xbmc in the settings to add buttons
	for (y = 0; y < xbmc_count; y++) {
		var playbtn = document.createElement('button');
		var addbtn = document.createElement('button');
		playbtn.setAttribute('id', 'TubeToTV');
		playbtn.setAttribute('name', 'TubeToTV');
		playbtn.setAttribute('class', ytbcss);
		playbtn.setAttribute('style', 'margin-right: 10px;');
		addbtn.setAttribute('class', ytbcss);
		addbtn.setAttribute('name', 'TubeToTV');

		// more than 1 XBMC in the settings
		if (xbmc_count > 1) {
			var default_name = JSON.parse(xbmc_name)[y].value;
			if (!default_name)
				default_name = 'XBMC';

			playbtn.setAttribute('title', 'Start playing this video on ' + default_name);
			playbtn.setAttribute('selector', y);
			addbtn.setAttribute('title', 'Add to ' + default_name + ' playlist');
			addbtn.setAttribute('selector', y);
			// add a or p for add or play
			playbtn.innerHTML = '<span class="yt-uix-button-content" selector="' + y + 'p">' + default_name + '</span>';
			addbtn.innerHTML = '<span class="yt-uix-button-content" selector="' + y + 'a">&#10010;</span>';
		}
		// only 1 XBMC in the settings
		else {
			var default_name = JSON.parse(xbmc_name)[0].value;
			if (!default_name)
				default_name = 'Send to XBMC';
			
			play = "{'index': '0', 'state': 'p'}";
			add  = {"index": "0", "state": "a"};
			
			playbtn.setAttribute('title', 'Start playing this video on ' + default_name);
			addbtn.setAttribute('title', 'Add to ' + default_name + ' playlist');

			playbtn.innerHTML = '<span class="yt-uix-button-content" selector="0p">' + default_name + '</span>';
			addbtn.innerHTML = '<span class="yt-uix-button-content" selector="0a">&#10010;</span>';
		}

		// inject buttons
		ni.appendChild(addbtn);
		ni.appendChild(playbtn);
	}
	// collect all buttons and wait for a click
	var playButtons = document.getElementsByName('TubeToTV');
	for (var i = 0; i < playButtons.length; i++) {
		playButtons[i].onclick = function () {
			playDetected();
		};
	};
});

function playDetected() {
	//console.log("playDetected");
	var e = window.event;
	document.getElementById('movie_player').stopVideo();
	// send request to play the video
	chrome.extension.sendMessage({play: e.target.getAttribute('selector')});
};
