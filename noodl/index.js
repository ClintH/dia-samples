$(document).ready(function() {
	socket = io.connect("http://" + window.location.host);
	socket.on("say", onSay);
	
	$("#sendButton").on("click", onSendClick);
})

function onSendClick(e) {	
	e.preventDefault(); // Stop the form from submitting
	var formElement = e.target.parentElement;

	// Grab data from the form
	var data = {
		testString: $("input[name='testString']", formElement).val(),
		testNumber: $("input[name='testNumber']", formElement).val(),
		testColour: $("input[name='testColour']", formElement).val(),
	}

	// Just pick out fields that have a value
	data = _.pickBy(data, function(v,k) { return v.length > 1 });

	// Convert colour user typed in to a hexadecimal version
	if (data.testColour)
		data.testColour = tinycolor(data.testColour).toHexString();


	// Clear form data
	$("input[name='testString']", formElement).val("");
	$("input[name='testNumber']", formElement).val("");
	$("input[name='testColour']", formElement).val("");

	socket.emit("say", data);
	kattegat.notify("Sent!");
}

// Event handler called when we receive data
function onSay(e) {
	console.dir(e);
	if (e.x) {
		$("#receivedX").text(e.x);
	}
	if (e.y) {
		$("#receivedY").text(e.y);
	}
}

