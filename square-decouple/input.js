/*
* This script is used only by input.html
**/

var squareCount = 0; // Keep track of how many squares we've made
var socket = null;

$(document).ready(function() {
	// Connect realtime stuff up
	socket = io.connect('/');

	// Listen for keypress events in the text entry box
	$("#console input").on("keypress", onKeypress);
	
	// Listen for the 'OK' button to be pressed
	$("#console button").on("click", handleConsole);
});

function handleConsole(e) {
	var text = $("#console input").val();
	var split = text.split(" "); 

	if (split[0] == "square"){
		requestSquare({
			left: "100px",
			top: "100px",
			"background-color": "#BFFF00"
		})
	} else {
		// Use the Kattegat helper function to display message
		kattegat.notifyError("Unknown command");
	}	$(e.target).select();
}

function onKeypress(e) {
	if (e.which == 13) { // Keycode 13 is the ENTER key
		handleConsole(e);
		return;
	}
}

// Instead of making a square on this page,
// we send the data to the server
function requestSquare(css) {
	console.log("requestSquare: " + JSON.stringify(css));
	socket.emit("say", {
		command: "make",
		square: css
	});
}

