chrome.extension.onRequest.addListener(
	function(request, sender, sendResponse) {
		// how many buttons?
		if (request.method == "getStatus"){
			if(localStorage["xbmc_count"])
				sendResponse({status: localStorage["xbmc_count"]});
			else
				sendResponse({status: 0});
		}
		if (request.method == "getImage")
			   sendResponse({image: localStorage["imageNo"]});

		// without settings
		if (request.play==1337){
			   alert("Please enter your XBMC IP in the options menu first.");
			   chrome.tabs.create({'url':
			   chrome.extension.getURL("/options.html")},function(){});
		}

		if (typeof(request.add)=='number'){
		console.log("in add...");
		var x=request.add;
		var str;
		var xbmc_ip = JSON.parse(localStorage["xbmc_ip"])[x].value;
		var xbmc_user = JSON.parse(localStorage["xbmc_user"])[x].value;
		var xbmc_pw = JSON.parse(localStorage["xbmc_pw"])[x].value;
		var myVideo;

		if (xbmc_ip){
		chrome.tabs.getSelected(null,function(tab) {
			   call_req(tab.url);
		});

		function call_req(str) {

					   myVideo = getVideo(str);
					   console.log("in add video=" + myVideo);
					   json_version = '{ "jsonrpc": "2.0", "method": "JSONRPC.Version", "id": 1 }';
					   xmlplay = connect(xbmc_user, xbmc_pw, xbmc_ip);
					   xmlversion = connect(xbmc_user, xbmc_pw, xbmc_ip);
					   xmlversion.send(json_version);
					   
					   xmlversion.onreadystatechange = function () {
					   if (xmlversion.readyState != 4) return;
					   if (xmlversion.responseText.match('"version":4'))
							   //new json 2012/03/08 - Eden
								json_add = '{"jsonrpc": "2.0", "method": "Playlist.Add", "params":{"playlistid":1,"item":{ "file" : "plugin://plugin.video.youtube/?action=play_video&videoid=' + myVideo + '"}}, "id" : 1}'
					   else if (xmlversion.responseText.match('"version":5'))
							   //new json 2012/05/09 - pre Frodo
								json_add = '{"jsonrpc": "2.0", "method": "Playlist.Add", "params":{"playlistid":1,"item":{ "file" : "plugin://plugin.video.youtube/?action=play_video&videoid=' + myVideo + '"}}, "id" : 1}'
					   xmlplay.send(json_add);
						notify = webkitNotifications.createNotification("images/browseraction.png","","Added to Playlist");
						   notify.show();
						   setTimeout(function(){
						   notify.cancel();
						   }, '2000');
					   }

		//                      alert("Can't connect to XBMC!";

			   xmlplay.onreadystatechange = function () {
			   if (xmlplay.readyState != 4) return;
					   console.log('responseText: ' + xmlplay.responseText);
					   if ((xmlplay.responseText.match('"result":"OK"')) || (xmlplay.responseText.match('"result" : "OK"'))){
							   sendResponse(true);
							   }
					   else{
							   sendResponse(false);
							   notify = webkitNotifications.createNotification("images/browseraction.png","","Something went wrong");
							   notify.show();
							   setTimeout(function(){
							   notify.cancel();
							   }, '4000');
							   }
			   }
		}
		 //sendResponse("Done");

		}
		else{
		alert("Please enter your XBMC IP in the options menu first.");
		chrome.tabs.create({'url':chrome.extension.getURL("options.html")},function(){});
		}
		}

		if (typeof(request.play)=='number'){
		console.log("in play..." + request.play);
		var x=request.play;
		var str;
		var xbmc_ip = JSON.parse(localStorage["xbmc_ip"])[x].value;
		var xbmc_user = JSON.parse(localStorage["xbmc_user"])[x].value;
		var xbmc_pw = JSON.parse(localStorage["xbmc_pw"])[x].value;
		var myVideo;

		if (xbmc_ip){
		chrome.tabs.getSelected(null,function(tab) {
			   call_reqp(tab.url);
		});

		function call_reqp(str) {
			   myVideo = getVideo(str);
			   json_version = '{ "jsonrpc": "2.0", "method": "JSONRPC.Version", "id": 1 }';
			   xmlplay = connect(xbmc_user, xbmc_pw, xbmc_ip);
			   xmlversion = connect(xbmc_user, xbmc_pw, xbmc_ip);
			   xmlversion.send(json_version);
			   xmlversion.onreadystatechange = function () {
			   if (xmlversion.readyState != 4) return;
			   if (xmlversion.responseText.match('"version":4'))
					   //new json 2012/03/08 - Eden
						json_play = '[{"jsonrpc": "2.0", "method": "Playlist.Clear", "params":{"playlistid":1}, "id": 1},{"jsonrpc": "2.0", "method": "Playlist.Add", "params":{"playlistid":1,"item":{ "file" : "plugin://plugin.video.youtube/?action=play_video&videoid=' + myVideo + '"} }, "id": 1},{"jsonrpc": "2.0", "method": "Player.Open", "params":{"item":{"playlistid":1, "position" : 0}}, "id": 1}]'				
			   else if (xmlversion.responseText.match('"version":5'))
					   //new json 2012/05/09 - pre Frodo
						json_play = '[{"jsonrpc": "2.0", "method": "Playlist.Clear", "params":{"playlistid":1}, "id": 1},{"jsonrpc": "2.0", "method": "Playlist.Add", "params":{"playlistid":1,"item":{ "file" : "plugin://plugin.video.youtube/?action=play_video&videoid=' + myVideo + '"} }, "id": 1},{"jsonrpc": "2.0", "method": "Player.Open", "params":{"item":{"playlistid":1, "position" : 0}}, "id": 1}]'				
			   else
					   json_play = '{"jsonrpc": "2.0", "method": "XBMC.Play", "params":{"file" : "plugin://plugin.video.youtube/?action=play_video&videoid=' + myVideo + '" }, "id" : "1"}';
				console.log("JP"+json_play);
				xmlplay.send(json_play);
				   notify = webkitNotifications.createNotification("images/browseraction.png","","Send to XBMC");
				   notify.show();
				   setTimeout(function(){
				   notify.cancel();
				   }, '2000');				
			   }

		//  alert("Can't connect to XBMC!";

			   xmlplay.onreadystatechange = function () {
			   if (xmlplay.readyState != 4) return;
					   console.log('responseText: ' + xmlplay.responseText);
					   if ((xmlplay.responseText.match('"result":"OK"')) || (xmlplay.responseText.match('"result" : "OK"'))){
							   sendResponse(true);
							   }
					   else{
							   sendResponse(false);
							   notify = webkitNotifications.createNotification("images/browseraction.png","","Something went wrong");
							   notify.show();
							   setTimeout(function(){
							   notify.cancel();
							   }, '4000');
							   }
			   }
		}
		 //sendResponse("Done");
		 //console.log(xmlplay.responseText);

		}
		else{
		alert("Please enter your XBMC IP in the options menu first.");
		chrome.tabs.create({'url':chrome.extension.getURL("/options.html")},function(){});
		}
		}
		}
);

function getVideo(str){
   if (str.match('&') && (str.indexOf("v=") < str.indexOf("&")))
		str   = str.slice((str.indexOf("v=")+2),(str.indexOf("&", str.indexOf("v=") + 2)));
   else
		str   = str.slice((str.indexOf("v=")+2));
	console.log(str);
return str;
}

function connect(usr, pw, ip){
	xmlrequest=new XMLHttpRequest();
	//need username + pw?
	if (usr){
		   xmlrequest.open('POST','http://' + usr + ':' + pw + '@' + ip + '/jsonrpc', true);
	}else{
		   xmlrequest.open('POST','http://' + ip + '/jsonrpc', true);
	}
		   xmlrequest.setRequestHeader('Content-type','application/json');

	return xmlrequest;
}