console.log('in search...');
chrome.extension.sendRequest({method: "getStatus"}, function (response) {
	var xbmc_count = response.status;
	console.log("Count::: "+xbmc_count);
	start(xbmc_count)
	});

function start(xbmc_count){
// normal youtube searchresult for videos, not channels
var ni = new Array();
var attachment_node = new Array();
ni = document.getElementsByClassName('yt-lockup2 yt-lockup2-video yt-uix-tile context-data-item clearfix');
//<data-video-ids="e1ebHThBdlY"

for(y = 0; y < ni.length; y++){
	
	var playbtn = document.createElement('a');
	var addbtn = document.createElement('a');
	//playbtn.setAttribute('id','TubeToTV');
	//playbtn.setAttribute('name','TubeToTV');
	video = ni[y].getAttribute('data-context-item-id');
	attachment_node = ni[y].getElementsByClassName('yt-lockup2-badges');
	if (!attachment_node)
		continue;
		
	console.log("VideoLoop: "+video);
	console.log("VideoLoop: "+attachment_node);
	
	if (ni.length>1)
		{
			for(x = 0; x < xbmc_count; x++){
				var playbtn = document.createElement('button');
				var addbtn = document.createElement('button');
				selector = video + x;
				playbtn.setAttribute('class','item-badge-line item-badge-label');
				playbtn.setAttribute('name','TubeToTV');
				playbtn.setAttribute('selector',selector+"p");
				addbtn.setAttribute('class','item-badge-line item-badge-label');
				addbtn.setAttribute('name','TubeToTV_add');
				addbtn.setAttribute('selector',selector+"a");
				playbtn.innerHTML = 'XBMC';
				addbtn.innerHTML = '+';
				attachment_node[0].appendChild(addbtn);
				attachment_node[0].appendChild(playbtn);
				//console.log("more: "+selector);
			}
		}
	else
		{
			playbtn.setAttribute('class','start yt-uix-button yt-uix-button-default');
			playbtn.setAttribute('name','TubeToTV');
			addbtn.setAttribute('class','start yt-uix-button yt-uix-button-default');
			addbtn.setAttribute('name','TubeToTV_add');
			
			playbtn.innerHTML = '<span>Send to XBMC</span>';
			addbtn.innerHTML = '<span>+</span>';
			attachment_node[0].appendChild(addbtn);
			attachment_node[0].appendChild(playbtn);
		}
}
	// collect all PLAY buttons and wait for a click
    var playButtons = document.getElementsByName('TubeToTV');
		for (var i=0; i<playButtons.length; i++){
			playButtons[i].onclick = function(){playDetected();};
			}	
	
	// collect all ADD buttons and wait for a click
    var addButtons = document.getElementsByName('TubeToTV_add');
		for (var i=0; i<addButtons.length; i++){
			addButtons[i].onclick = function(){playDetected();};
			}
}
        
function playDetected() {
	//console.log("playDetected");
	var e = window.event;
	var player = document.getElementById('movie_player');
	console.log("selector: " + e.target.getAttribute('selector'));

	// send request to play the video
	chrome.extension.sendRequest({play: e.target.getAttribute('selector')
	}, function (response) {
		// connection successful?
		if (response) {
			console.log('Sent to XBMC: ' + response);
			try{
				player.stopVideo();
				}
			catch(err){
				console.log("HTML5, can't stop video right now")
				}
		}
	});
}
