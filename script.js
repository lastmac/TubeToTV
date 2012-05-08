chrome.extension.onRequest.addListener(function(request, sender, sendResponse) {
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
chrome.extension.getURL("options.html")},function(){});
}

if (typeof(request.play)=='number'){

var x=request.play;
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
       xmlplay=new XMLHttpRequest();
	   xmlversion=new XMLHttpRequest();

       //need username + pw?
       if (xbmc_user){
               xmlplay.open('POST','http://' + xbmc_user + ':' + xbmc_pw + '@' + xbmc_ip + '/jsonrpc', true);
               xmlversion.open('POST','http://' + xbmc_user + ':' + xbmc_pw + '@' + xbmc_ip + '/jsonrpc', true);
       }else{
               xmlplay.open('POST','http://' + xbmc_ip + '/jsonrpc', true);
               xmlversion.open('POST','http://' + xbmc_ip + '/jsonrpc', true);
		}
       //if (xmlplay.readyState == 1)
       //{
               xmlplay.setRequestHeader('Content-type','application/json');
               //regular "new" tube link or additional url parameter
               if (str.match('&') && (str.indexOf("v=") < str.indexOf("&")))
						myVideo   = str.slice((str.indexOf("v=")+2),(str.indexOf("&", str.indexOf("v=") + 2)));
               else
                       myVideo   = str.slice((str.indexOf("v=")+2));

					   //console.log(myVideo);
               // send request to xbmc
               json_version = '{ "jsonrpc": "2.0", "method": "JSONRPC.Version", "id": 1 }';
							   
               xmlversion.send(json_version);
			   xmlversion.onreadystatechange = function () {
			   if (xmlversion.readyState != 4) return;
               if (xmlversion.responseText.match('"version":4'))
                       //new json 2012/03/08 - Eden RC2
			json_play = '{"jsonrpc": "2.0", "method": "Player.Open", "params":{"item": {"file" : "plugin://plugin.video.youtube/?action=play_video&videoid=' + myVideo + '" }}, "id" : "1"}'
               if (xmlversion.responseText.match('"version":5'))
                       //new json 2012/05/09 - pre Frodo
			json_play = '{"jsonrpc": "2.0", "method": "Player.Open", "params":{"item": {"file" : "plugin://plugin.video.youtube/?action=play_video&videoid=' + myVideo + '" }}, "id" : "1"}'
               else
                       json_play = '{"jsonrpc": "2.0", "method": "XBMC.Play", "params":{"file" : "plugin://plugin.video.youtube/?action=play_video&videoid=' + myVideo + '" }, "id" : "1"}';
               xmlplay.send(json_play);
			   }
       //}
       //else
//                      alert("Can't connect to XBMC!";

       xmlplay.onreadystatechange = function () {
       if (xmlplay.readyState != 4) return;
               console.log('responseText: ' + xmlplay.responseText);
               if ((xmlplay.responseText.match('"result":"OK"')) || (xmlplay.responseText.match('"result" : "OK"')))
                       sendResponse(true);
               else
                       sendResponse(false);
       }
}
 //sendResponse("Done");
 //console.log(xmlplay.responseText);

}
else{
alert("Please enter your XBMC IP in the options menu first.");
chrome.tabs.create({'url':chrome.extension.getURL("options.html")},function(){});
}
}}
);