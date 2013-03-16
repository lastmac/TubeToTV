// Saves options to localStorage.
function save_options() {
	var y=1;
	localStorage["xbmc_name"] = JSON.stringify($("input.name").serializeArray());
	localStorage["xbmc_ip"] = JSON.stringify($("input.ip").serializeArray());
	localStorage["xbmc_user"] = JSON.stringify($("input.user").serializeArray());
	localStorage["xbmc_pw"] = JSON.stringify($("input.pw").serializeArray());

	while (typeof(JSON.parse(localStorage["xbmc_ip"])[(y-1)])=='object') {
		if (JSON.parse(localStorage["xbmc_ip"])[(y-1)].value)
			localStorage["xbmc_count"]=y;
		y++;
	}

	localStorage["imageNo"] = $('input[name=buttonimg]:checked').val();

	// Update status to let user know options were saved.
	statusUpdate("Saved.", 1500);
}

// Restores select box state to saved value from localStorage.
function restore_options() {
	console.log("restoring...");
	var y=0
	try {
		while((typeof(JSON.parse(localStorage["xbmc_ip"])[y]) == 'object') && (JSON.parse(localStorage["xbmc_ip"])[y].value)){
			if (y>0) {
				addElement();
			}

			if (localStorage["xbmc_name"]) {
				$("input#name" + (y+1)).val(JSON.parse(localStorage["xbmc_name"])[y].value);
			}
			if (localStorage["xbmc_ip"]) {
				$("input#ip" + (y+1)).val(JSON.parse(localStorage["xbmc_ip"])[y].value);
			}
			if (localStorage["xbmc_user"]) {
				$("input#user" + (y+1)).val(JSON.parse(localStorage["xbmc_user"])[y].value);
			}
			if (localStorage["xbmc_pw"]) {
				$("input#pw" + (y+1)).val(JSON.parse(localStorage["xbmc_pw"])[y].value);
			}
			y++;
			localStorage["xbmc_count"]=y;
		}

		//$('input[value=' + localStorage["imageNo"] + ']').prop('checked', true);
		console.log("Done!");
	}
	catch(err) {
		console.log("No worries, all good!");
	}
}

var x=1;
function addElement() {
	x = x + 1;
		$('input#name' + (x-1)).after('<input tabindex="' + (((x-1)*4)+1) + '" id="name' + x + '" class="name" type="text" size="20" name="Namevalue' + x + '" />');
		$('input#ip' + (x-1)).after('<input tabindex="' + (((x-1)*4)+2) + '" id="ip' + x + '" class="ip" type="text" size="20" name="IPvalue' + x + '" />');
		$('input#user' + (x-1)).after('<input tabindex="' + (((x-1)*4)+3) + '" id="user' + x + '" class="user" type="text" size="20" name="Uservalue' + x + '" />');
		$('input#pw' + (x-1)).after('<input tabindex="' + (((x-1)*4)+4) + '" id="pw' + x + '" class="pw" type="password" size="20" name="PWvalue' + x + '" />');
}

// test connection for first XBMC
function checkSettings(){
	statusUpdate("Testing...", 600000);
	var xbmc_ip = JSON.parse(localStorage["xbmc_ip"])[0].value;
	var xbmc_user = JSON.parse(localStorage["xbmc_user"])[0].value;
	var xbmc_pw = JSON.parse(localStorage["xbmc_pw"])[0].value;

	json_ping = '{"jsonrpc": "2.0", "method": "JSONRPC.ping", "id": 1}';
	tubetotv.connect(xbmc_user, xbmc_pw, xbmc_ip, function (callback) {
		xmlping = callback;
	});
	xmlping.send(json_ping);
	
	xmlping.onreadystatechange = function(){
		if (xmlping.readyState != 4) 
			return;
		else if (xmlping.response){
			statusUpdate("Connected", 1500);
			alert("Connection to " + xbmc_ip + " successful!");
			}
		else{
			statusUpdate("Failed", 3000);
			alert("Couldn't connect with these settings!");
		}
	}
}

function statusUpdate(info, timeout){
	// Update status to let user know options were saved.
	var status = document.getElementById("status");
	status.innerHTML = info;
	setTimeout(function() {
		status.innerHTML = "";
	}, timeout);
}

document.addEventListener('DOMContentLoaded', function () {
	restore_options();
	document.querySelector('button#addxbmc').addEventListener('click', addElement);
	document.querySelector('button#save').addEventListener('click', save_options);
	document.querySelector('button#check').addEventListener('click', checkSettings);
});
