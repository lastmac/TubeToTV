chrome.extension.onRequest.addListener(
function (request, sender, sendResponse) {
	// how many buttons?
	if (request.method == "getStatus") {
		if (localStorage["xbmc_count"]) sendResponse({
			status: localStorage["xbmc_count"],
			name: localStorage["xbmc_name"]
		});
		else sendResponse({
			status: 0,
			name: "[]"
		});
	}
	// without settings
	if (request.play == 1337) {
		alert("Please enter your XBMC IP in the options menu first.");
		chrome.tabs.create({
			'url': chrome.extension.getURL("/options.html")
		}, function () {});
	}
	
	if (typeof (request.play) == "object") {
		console.log(JSON.parse(request.play));
		console.log("yo: "+ request.play);
	}
	
	// search page request -- request.play= 1-11=video 12=which xbmc 13=play or add (p or a)
	if (typeof (request.play) == "string") {
		// search page request length = 13, only 2 for normal 
		// TODO - use JSON
		//console.log(JSON.parse(request.play));
		if (request.play.length == 13){
			var x = request.play.slice(11,12);
			var myVideo = request.play.slice(0, 11);
			var state = request.play.slice(12);
		}
		else{
			var x = request.play.slice(0,1);
			var state = request.play.slice(1);
			var myVideo;
		}
			
			var xbmc_ip = JSON.parse(localStorage["xbmc_ip"])[x].value;
			var xbmc_user = JSON.parse(localStorage["xbmc_user"])[x].value;
			var xbmc_pw = JSON.parse(localStorage["xbmc_pw"])[x].value;

		if (xbmc_ip) {
			chrome.tabs.getSelected(null, function (tab) {
				cal_req(tab.url);
			});

			function cal_req(str) {
				if (!myVideo){
				getVideo(str, function (callback) {
					myVideo = callback;
				});};
				
				json_version = '{ "jsonrpc": "2.0", "method": "JSONRPC.Version", "id": 1 }';
				connect(xbmc_user, xbmc_pw, xbmc_ip, function (callback) {
					xmlplay = callback;
				});
				connect(xbmc_user, xbmc_pw, xbmc_ip, function (callback) {
					xmlversion = callback;
				});
				xmlversion.send(json_version);

				xmlversion.onreadystatechange = function(){
					if (xmlversion.readyState != 4) 
						return;
					else
						sendJSON(state, myVideo, xmlversion, xmlplay);
				}

				xmlplay.onreadystatechange = function () {
					if (xmlplay.readyState != 4) return;

					console.log('responseText: ' + xmlplay.responseText);
					if ((xmlplay.responseText.match('"result":"OK"')) || (xmlplay.responseText.match('"result" : "OK"'))) {
						sendResponse(true);
					} else {
						sendResponse(false);
						browsertooltip(4000, "Something went wrong");
					}
				}
			}
			// sendResponse("Done");
		}
		else {
			// alert("Please enter your XBMC IP in the options menu first.");
			chrome.tabs.create({
				'url': chrome.extension.getURL("/options.html")
			}, function () {});
		}
	}
});

function getVideo(str, callback){
   if (str.match('&') && (str.indexOf("v=") < str.indexOf("&")))
		str   = str.slice((str.indexOf("v=")+2),(str.indexOf("&", str.indexOf("v=") + 2)));
   else
		str   = str.slice((str.indexOf("v=")+2));
	console.log("Video: "+str);
	callback(str);
	}

function connect(usr, pw, ip, callback){
	xmlrequest=new XMLHttpRequest();
	//need username + pw?
	if (usr){
		   xmlrequest.open('POST','http://' + usr + ':' + pw + '@' + ip + '/jsonrpc', true);
	}else{
		   xmlrequest.open('POST','http://' + ip + '/jsonrpc', true);
	}
		   xmlrequest.setRequestHeader('Content-type','application/json');
	callback(xmlrequest);
}

function sendJSON(state, video, version, xmlplay){
	if (!version.response) {
		browsertooltip(3000, "Connection Error");
		console.log("version.responseText: " + version.responseText);
		return;
	}
	
	json = JSON.parse(version.response);
	json_version = json.result.version.major;
	
	//catch older versions of XBMC
	if (typeof(json_version) == "undefined")
		json_version = json.result.version;
	
	// supported versions 4,5 and 6
	if ([4,5,6].indexOf(json_version) >= 0) {
		// XBMC 11.0 + 12.0
		if (state == "a")
			json = '{"jsonrpc": "2.0", "method": "Playlist.Add", "params":{"playlistid":1,"item":{ "file" : "plugin://plugin.video.youtube/?action=play_video&videoid=' + video + '"}}, "id" : 1}'
		else
			json = '[{"jsonrpc": "2.0", "method": "Playlist.Clear", "params":{"playlistid":1}, "id": 1},{"jsonrpc": "2.0", "method": "Playlist.Add", "params":{"playlistid":1,"item":{ "file" : "plugin://plugin.video.youtube/?action=play_video&videoid=' + video + '"} }, "id": 1},{"jsonrpc": "2.0", "method": "Player.Open", "params":{"item":{"playlistid":1, "position" : 0}}, "id": 1}]'
	}
	else{
		browsertooltip(5000, "XBMC version not supported");
		console.log("version.responseText: " + version.responseText);
		return;
	}
	
	if (state == "p")
		browsertooltip(2000, "Sent to XBMC");
	else
		browsertooltip(2000, "Added to Playlist");
	
	xmlplay.send(json);
}

function browsertooltip(timeout, text){
	notify = webkitNotifications.createNotification("images/browseraction.png", "", text);
	notify.show();
	setTimeout(function () {
		notify.cancel();
	}, timeout);
}