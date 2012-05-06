// ask extension how many buttons should be implemented
chrome.extension.sendRequest({method: "getStatus"}, function(response) {
	var xbmc_count = response.status;
	console.log("count: "+xbmc_count);
	
chrome.extension.sendRequest({method: "getImage"}, function(response) {
	if (response.image)
		var imageNo = response.image;
	else
		var imageNo = "xx";
	//console.log("image: "+imageNo);
	
var imgURL = chrome.extension.getURL("playbtn" + imageNo + ".png");

var cssURL = chrome.extension.getURL("yttt.css");
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
	playbtn.setAttribute('id','TubeToTV');
	playbtn.setAttribute('name','TubeToTV');
		
	// special case without number for only 1 button
	if (xbmc_count>1)
		// text or image button
		if (imageNo=="xx"){
			playbtn.setAttribute('class','start yt-uix-button yt-uix-button-default');
			playbtn.innerHTML = '<span class="yt-uix-button-content" name="TubeToTV">XBMC</span>';}
		else
			playbtn.innerHTML = '<span class="xbmc_no">'+ (y+1) +'</span><img name="TubeToTV" selector="' + y + '" id="btn_ttt' + y + '" class="btn_ttt" src="' + imgURL + '"/>';
	else
		if (imageNo=="xx"){
			playbtn.setAttribute('class','start yt-uix-button yt-uix-button-default');
			playbtn.innerHTML = '<span class="yt-uix-button-content" name="TubeToTV">Send to XBMC</span>';}
		else
			playbtn.innerHTML = '<img name="TubeToTV" id="btn_ttt' + y + '" class="btn_ttt" src="' + imgURL + '"/>';
			
	ni.appendChild(playbtn);
}
	// collect all buttons and wait for a click
    var xbuttons = document.getElementsByName('TubeToTV');
		for (var i=0; i<xbuttons.length; i++){
			xbuttons[i].onclick = function(){playDetected();};
			}
        
function playDetected(){
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

});});