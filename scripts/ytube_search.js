console.log('in search...');
// normal youtube seachresult for videos, not channels
var ni = new Array();
var vi = new Array();
//ni = document.getElementsByClassName('username-prepend');
ni = document.getElementsByClassName('yt-lockup2 yt-lockup2-video yt-uix-tile context-data-item clearfix');
//<data-video-ids="e1ebHThBdlY"
//vi = document.getElementsByClassName('addto-button video-actions addto-watch-later-button yt-uix-button yt-uix-button-default yt-uix-button-short yt-uix-tooltip');


for(y = 0; y < ni.length; y++){
	
	var playbtn = document.createElement('a');
	var addbtn = document.createElement('a');
	//playbtn.setAttribute('id','TubeToTV');
	//playbtn.setAttribute('name','TubeToTV');
	video=ni[y].getAttribute('data-context-item-id');
	if (!video)
		continue;
		
	console.log("VideoLoop: "+video);
	
	if (ni.length>1)
		{
			playbtn.setAttribute('class','yt-badge-std');
			playbtn.setAttribute('name','TubeToTV');
			playbtn.setAttribute('selector',video);
			addbtn.setAttribute('class','yt-badge-std');
			addbtn.setAttribute('name','TubeToTV_add');
			addbtn.setAttribute('selector',video);
			playbtn.innerHTML = 'XBMC';
			addbtn.innerHTML = '+';
		}
	else
		{
			playbtn.setAttribute('class','start yt-uix-button yt-uix-button-default');
			playbtn.setAttribute('name','TubeToTV');
			addbtn.setAttribute('class','start yt-uix-button yt-uix-button-default');
			addbtn.setAttribute('name','TubeToTV_add');
			
			playbtn.innerHTML = '<span>Send to XBMC</span>';
			addbtn.innerHTML = '<span>+</span>';
		}

	ni[y].appendChild(addbtn);
	ni[y].appendChild(playbtn);
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
		var e = window.event;
		//var player = document.getElementById('movie_player');

		// send request to play the video
        chrome.extension.sendRequest({play: e.target.getAttribute("selector")}, function(response) {
		// connection successful?
		if(response){
			console.log("Sent to XBMC: "+response);
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