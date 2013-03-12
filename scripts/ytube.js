// ask extension how many buttons should be implemented
chrome.extension.sendRequest({
	method: "getStatus"
}, function (response) {
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


	//var css_ttt = document.createElement('link');
	//css_ttt.setAttribute('rel', 'stylesheet');
	//css_ttt.setAttribute('href', cssURL);
	// ncss.appendChild(css_ttt);

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

	for (y = 0; y < xbmc_count; y++) {
		var playbtn = document.createElement('button');
		var addbtn = document.createElement('button');
		playbtn.setAttribute('id', 'TubeToTV');
		playbtn.setAttribute('name', 'TubeToTV');
		playbtn.setAttribute('class', ytbcss);
		playbtn.setAttribute('style', 'margin-right: 10px;');
		addbtn.setAttribute('class', ytbcss);
		addbtn.setAttribute('name', 'TubeToTV_add');

		// special case without number for only 1 button
		// text / image button scrapped
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
		else {
			var default_name = JSON.parse(xbmc_name)[0].value;
			if (!default_name)
				default_name = 'Send to XBMC';

			playbtn.setAttribute('title', 'Start playing this video on ' + default_name);
			addbtn.setAttribute('title', 'Add to ' + default_name + ' playlist');

			playbtn.innerHTML = '<span class="yt-uix-button-content" selector="p">' + default_name + '</span>';
			addbtn.innerHTML = '<span class="yt-uix-button-content" selector="a">&#10010;</span>';
		}

		ni.appendChild(addbtn);
		ni.appendChild(playbtn);
	}
	// collect all PLAY buttons and wait for a click
	var playButtons = document.getElementsByName('TubeToTV');
	for (var i = 0; i < playButtons.length; i++) {
		playButtons[i].onclick = function () {
			playDetected();
		};
	}

	// collect all ADD buttons and wait for a click
	var addButtons = document.getElementsByName('TubeToTV_add');
	for (var i = 0; i < addButtons.length; i++) {
		addButtons[i].onclick = function () {
			playDetected();
		};
	}
})
