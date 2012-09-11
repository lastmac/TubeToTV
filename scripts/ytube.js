// ask extension how many buttons should be implemented
function Notifier() {}
 
// Request permission for this page to send notifications. If allowed,
// calls function "cb" with "true" as the first argument.
Notifier.prototype.RequestPermission = function(cb) {
  window.webkitNotifications.requestPermission(function() {
    if (cb) { cb(window.webkitNotifications.checkPermission() == 0); }
  });
}
 
// Popup a notification with icon, title, and body. Returns false if
// permission was not granted.
Notifier.prototype.Notify = function(icon, title, body) {
  if (window.webkitNotifications.checkPermission() == 0) {
    var popup = window.webkitNotifications.createNotification(
      icon, title, body);
    popup.show();
    return true;
  }
 
  return false;
}


chrome.extension.sendRequest({method: "getStatus"}, function(response) {
	var xbmc_count = response.status;
	console.log("count: "+xbmc_count);

chrome.extension.sendRequest({method: "getImage"}, function(response) {
	if (response.image)
		var imageNo = response.image;
	else
		var imageNo = "xx";
	//console.log("image: "+imageNo);

var imgURL = chrome.extension.getURL("/images/playbtn" + imageNo + ".png");

var cssURL = chrome.extension.getURL("/css/yttt.css");
// normal youtube UI
var ni = document.getElementById('watch-headline-user-info');
//css
var ncss = document.getElementById('www-core-css');

var css_ttt = document.createElement('link');
css_ttt.setAttribute('rel', 'stylesheet');
css_ttt.setAttribute('href', cssURL);
ncss.appendChild(css_ttt);

// first time only - no settings saved yet
if (!xbmc_count){
	var playbtn = document.createElement('button');
	playbtn.setAttribute('id','TubeToTV');
	playbtn.setAttribute('name','TubeToTV');

	if (imageNo=="xx"){
		playbtn.setAttribute('class','start yt-uix-button yt-uix-button-default');
		playbtn.innerHTML = '<span  selector="1337" class="yt-uix-button-content">XBMC Settings</span>';}
	else
		playbtn.innerHTML = '<img name="TubeToTV" selector="1337" id="btn_ttt" class="btn_ttt" src="' + imgURL + '"/>';
	ni.appendChild(playbtn);
}

for(y = 0; y < xbmc_count; y++){
	var playbtn = document.createElement('button');
	var addbtn = document.createElement('button');
	playbtn.setAttribute('id','TubeToTV');
	playbtn.setAttribute('name','TubeToTV');

	// special case without number for only 1 button
	if (xbmc_count>1)
		// text or image button
		if (imageNo=="xx"){
			playbtn.setAttribute('class','start yt-uix-button yt-uix-button-default');
			addbtn.setAttribute('class','start yt-uix-button yt-uix-button-default');
			playbtn.innerHTML = '<span class="yt-uix-button-content" selector="' + y + '" name="TubeToTV">XBMC</span>';
			addbtn.innerHTML = '<span name="TubeToTV_add" class="yt-uix-button-content" selector="' + y + '">+</span>';}
		else
			playbtn.innerHTML = '<span class="xbmc_no">'+ (y+1) +'</span><img name="TubeToTV" selector="' + y + '" id="btn_ttt' + y + '" class="btn_ttt" src="' + imgURL + '"/>';
	else
		if (imageNo=="xx"){
			playbtn.setAttribute('class','start yt-uix-button yt-uix-button-default');
			addbtn.setAttribute('class','start yt-uix-button yt-uix-button-default');
			playbtn.innerHTML = '<span class="yt-uix-button-content" name="TubeToTV">Send to XBMC</span>';
			addbtn.innerHTML = '<span name="TubeToTV_add" class="yt-uix-button-content">+</span>';}
		else{
			playbtn.innerHTML = '<img name="TubeToTV" id="btn_ttt' + y + '" class="btn_ttt" src="' + imgURL + '"/>';
			addbtn.innerHTML = '<span name="TubeToTV_add" class="yt-uix-button-content">+</span>';}

	ni.appendChild(addbtn);
	ni.appendChild(playbtn);
}
	// collect all PLAY buttons and wait for a click
    var playButtons = document.getElementsByName('TubeToTV');
		for (var i=0; i<playButtons.length; i++){
			playButtons[i].onclick = function(){playDetected();};
			}	
	
	// collect all ADD buttons and wait for a click
    var addButtons = document.getElementsByName('TubeToTV_add');
		for (var i=0; i<addButtons.length; i++){
			addButtons[i].onclick = function(){addDetected();};
			}
        
function playDetected(){
		console.log("playDetected");
		Notifier();
		var e = window.event;
		var player = document.getElementById('movie_player');

		// fade-in-out of button -- looks like it is working
		e.target.setAttribute('style', '-webkit-animation-name: blink;');
		// send request to play the video
        chrome.extension.sendRequest({play: Number(e.target.getAttribute("selector"))}, function(response) {
		// connection successful?
		if(response){
			console.log("Sent to XBMC: "+response);
			e.target.setAttribute('style','opacity: 1;');
			player.stopVideo();
			}
		/*else{
			console.log("Sent to XBMC: "+response);
			e.target.setAttribute('style','opacity: 1;');
			alert("Check your connection info in the options!");
			}*/
		}); 
		}
		
function addDetected(){
		console.log("addDetected");
		var e = window.event;
		var player = document.getElementById('movie_player');

		// send request to play the video
        chrome.extension.sendRequest({add: Number(e.target.getAttribute("selector"))}, function(response) {
		
		// connection successful?
		if(response){
			console.log("Sent to XBMC: "+response);
			player.stopVideo();
			}
		}); 
		}
		
});});