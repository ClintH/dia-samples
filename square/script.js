var squareCount = 0; // Keep track of how many squares we've made

$(document).ready(function() {

	// Listen for keypress events in the text entry box
	$("#console input").on("keypress", onKeypress);
	
	// Listen for the 'OK' button to be pressed
	$("#console button").on("click", handleConsole);
	
	// Listen to click events on any squares
	// that might get created within the body element
	$("body").on("click", ".square", onClick);
	// (this is a bit different that the other event
	//	listener because we are dynamically creating the squares.)
})

function handleConsole(e) {
	// Read more on processing strings:
	// 	http://www.codecademy.com/glossary/javascript#strings
	var text = $("#console input").val();
	
	// Split text up into words
	var textLowercase = text.toLowerCase();
	var split = textLowercase.split(" "); // split() returns an array
	
	console.log("Command: " + split)
	
	// Loop through the array, printing out the word at each index
	// for (var i=0; i<split.length; i++) {
	// 	console.log("Index: " + i + " = " +  split[i]);
	// }

	if (split[0] == "square"){
		// Word at position 0 is 'square'
		
		// Demo: Making a square at 100,100 with lime green background
		// Note: dash in "background-color" means we have to put it in quote marks
		// Tip: You can look up colours here: http://html-color-codes.info/
		makeSquare({
			left: "100px",
			top: "100px",
			"background-color": "#BFFF00"
		})

		// Demo: Doing something with the last created square:
		// 	See more: http://ricostacruz.com/jquery.transit/
		$(getLastSquareSel()).css({
			left: "-=50" // Move to the left by 50 pixels
		})
	} else if (text.indexOf("random") > -1) {
		// Input text contains the word 'random' at some position
		// Insert a random fractal at a random location

		// Docs on random
		//	https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/random
		var min = 0;
		var max = 500;
		var css = {
			left: Math.random() * (max - min) + min,
			top: Math.random() * (max - min) + min,
			position: "absolute"
		}
		$('<img height="200" width="200" src="http://thecatapi.com/api/images/get?format=src&type=gif">')
			.appendTo("body")
			.css(css);

	} else {
		// Use the Kattegat helper function to display message
		kattegat.notifyError("Unknown command");
	}	$(e.target).select();
}

function onKeypress(e) {
	if (e.which == 13) {
		// Keycode 13 is the ENTER key
		handleConsole(e);
		return;
	}
}


// Makes a square, and assigns the CSS properties
// contained in the 'css' argument
function makeSquare(css) {
	console.log("makeSquare: " + JSON.stringify(css));
	squareCount++;
	var x = $('<div id="square-' + squareCount +'" class="square">' + squareCount + '</div>')
		.appendTo("body");
	
	// Set what ever CSS properties are given to us
	// as an argument
	x.css(css);
}

// Returns the jQuery selector for the most recently created square
// All it does is return a string such as "#square-3" if we've
// made three squares (since each square receives an incrementing id)
function getLastSquareSel() {
	return "#square-" + squareCount;
}

// Demo: uses Transit to animates the position 
// of the square when clicked
// 	Read more: http://ricostacruz.com/jquery.transit/)
function onClick(e) {
	if ($(e.target).data("clicked")) {
		// Has already been clicked, reset it back
		$(e.target).transition({
			x:'0px',
			skewX: '0deg',
			rotate: '0deg',
			rotateY: '0deg'
		})	
		$(e.target).data("clicked", false);
	} else {
		// Hasn't been clicked -- mess about with it it
		$(e.target).transition({
			x:'100px', 
			skewX: '10deg',
			rotate: '180deg',
			rotateY: '180deg'
		})
		$(e.target).data("clicked", true);		
	}
}
