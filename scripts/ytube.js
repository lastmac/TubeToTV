// ask extension how many buttons should be implemented
chrome.extension.sendRequest({method: "getStatus"}, function(response) {
	var xbmc_count = response.status;
	console.log("count: "+xbmc_count);

//youtube layout until 10/2012
var ytbcss_old = "start yt-uix-button yt-uix-button-default"	
//layout from 10/2012
var ytbcss_new = "yt-uix-button yt-uix-button-text"		
	
var cssURL = chrome.extension.getURL("/css/yttt.css");
// normal youtube UI
var ni = document.getElementById('watch7-headline');
//css
var ncss = document.getElementById('www-core-css');

//new or old youtube layout?
if (!ni){
		var ni = document.getElementById('watch-headline-user-info');
		ytbcss=ytbcss_old;
		}
		else
		{
		ytbcss=ytbcss_new;
		}

		
var css_ttt = document.createElement('link');
css_ttt.setAttribute('rel', 'stylesheet');
css_ttt.setAttribute('href', cssURL);
//ncss.appendChild(css_ttt);

// first time only - no settings saved yet
if (!xbmc_count){
	var playbtn = document.createElement('button');
	playbtn.setAttribute('id','TubeToTV');
	playbtn.setAttribute('name','TubeToTV');
	playbtn.setAttribute('class',ytbcss);
	playbtn.innerHTML = '<span  selector="1337" class="yt-uix-button-content">XBMC Settings</span>';
	ni.appendChild(playbtn);
}

for(y = 0; y < xbmc_count; y++){
	var playbtn = document.createElement('button');
	var addbtn = document.createElement('button');
	playbtn.setAttribute('id','TubeToTV');
	playbtn.setAttribute('name','TubeToTV');

	// special case without number for only 1 button
	if (xbmc_count>1)
		// text / image button scrapped
		{
			playbtn.setAttribute('class',ytbcss);
			playbtn.setAttribute('name','TubeToTV');
			playbtn.setAttribute('selector',y);
			addbtn.setAttribute('class',ytbcss);
			addbtn.setAttribute('name','TubeToTV_add');
			addbtn.setAttribute('selector',y);
			
			playbtn.innerHTML = '<span selector="' + y + '">XBMC</span>';
			addbtn.innerHTML = '<span selector="' + y + '">+</span>';
		}

	else
		{
			//playbtn.setAttribute('class','start yt-uix-button yt-uix-button-default');
			playbtn.setAttribute('class',ytbcss);
			playbtn.setAttribute('name','TubeToTV');
			addbtn.setAttribute('class',ytbcss);
			addbtn.setAttribute('name','TubeToTV_add');
			
			playbtn.innerHTML = '<span>Send to XBMC</span>';
			addbtn.innerHTML = '<span>+</span>';
		}


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
		var e = window.event;
		var player = document.getElementById('movie_player');

		// send request to play the video
        chrome.extension.sendRequest({play: Number(e.target.getAttribute("selector"))}, function(response) {
		// connection successful?
		if(response){
			console.log("Sent to XBMC: "+response);
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
}
)