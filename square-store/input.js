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

	if (split[0] == "square") {
		// Grab colour preference from localStorage
		var colourPreference = localStorage["colour"];

		// If there was no preference, use a default
		// 	Note here we are using 'isUndefined' from the lodash library
		//	Read more: http://lodash.com/docs#isUndefined
		if (_.isUndefined(colourPreference)) colourPreference = "#BFFF00";

		requestSquare({
			left: "100px",
			top: "100px",
			"background-color": colourPreference
		})
	} else if (split[0] == "colour") {
		// If there's an extra word afterward, it might be a colour
		if (split.length == 2) {
			kattegat.notify("Set colour to '" +  split[1] + "'");
			// Set colour to localStorage
			localStorage["colour"] = split[1];
		} else {
			var existing = localStorage["colour"];
			if (_.isUndefined(existing))
				kattegat.notify("No colour set, use 'colour [colour]' to set.");
			else
				kattegat.notify("Colour is '" + existing);
		}
	} else if (text == "clear colour") {
		localStorage.removeItem("colour");
		kattegat.notify("Colour setting cleared");
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

