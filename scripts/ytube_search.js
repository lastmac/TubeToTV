console.log('in search...');
chrome.extension.sendMessage({method: "getStatus"}, function (response) {
	var xbmc_count = response.status;
	var xbmc_name = response.name;
	//console.log("Count::: "+xbmc_count);
	__init__(xbmc_count);
	});

function __init__(xbmc_count){
// normal youtube searchresult for videos, not channels
var ni = new Array();
var attachment_node = new Array();
var temp_attachment_node = new Array();
ni = document.getElementsByClassName('yt-lockup2 yt-lockup2-video yt-uix-tile context-data-item clearfix');
//<data-video-ids="e1ebHThBdlY"

for(y = 0; y < ni.length; y++){
	
	var playbtn = document.createElement('a');
	var addbtn = document.createElement('a');
	video = ni[y].getAttribute('data-context-item-id');
	attachment_node = ni[y].getElementsByClassName('item-badge-line');
		
	// if no HD badges present
	if (!attachment_node[0]){
		var ul = document.createElement('ul');
		ul.setAttribute('class','item-badge-line'); // <div class="yt-lockup2-badges"><ul class="item-badge-line"><li class="item-badge-label ">HD</li></ul></div>
		temp_attachment_node = ni[y].getElementsByClassName('yt-lockup2-badges');
		temp_attachment_node[0].appendChild(ul);	
		}
		
	//console.log("VideoLoop: "+video);
	
	if (ni.length>1)
		{
			for(x = 0; x < xbmc_count; x++){
				var playbtn = document.createElement('a');
				var addbtn = document.createElement('a');
				selector = video + x;
				playbtn.setAttribute('class','item-badge-label guide-module-toggle');
				playbtn.setAttribute('name','TubeToTV');
				playbtn.setAttribute('selector',selector+"p");
				addbtn.setAttribute('class','item-badge-label guide-module-toggle');
				addbtn.setAttribute('name','TubeToTV');
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
			playbtn.setAttribute('class','item-badge-label');
			playbtn.setAttribute('name','TubeToTV');
			addbtn.setAttribute('class','item-badge-label');
			addbtn.setAttribute('name','TubeToTV');
			
			playbtn.innerHTML = 'Send to XBMC';
			addbtn.innerHTML = '+';
			attachment_node[0].appendChild(addbtn);
			attachment_node[0].appendChild(playbtn);
		}
}
	// collect all PLAY buttons and wait for a click
    var playButtons = document.getElementsByName('TubeToTV');
		for (var i=0; i<playButtons.length; i++){
			playButtons[i].onclick = function(){playDetected();};
			}	
};
        
function playDetected() {
	//console.log("playDetected");
	var e = window.event;
	// send request to play the video
	chrome.extension.sendMessage({play: e.target.getAttribute('selector')});
};
