/*
* This script is used only by canvas.html
**/

var squareCount = 0; // Keep track of how many squares we've made
var socket = null;

$(document).ready(function() {
	socket = io.connect('/');
	socket.on("say", onSay);
	
	// Listen to click events on any squares
	// that might get created within the body element
	$("body").on("click", ".square", onClick);
	// (this is a bit different that the other event
	//	listener because we are dynamically creating the squares.)
})

// Event handler called when we receive data
function onSay(e) {
	if (e.command == "make") {
		makeSquare(e.square);
	} else {
		kattegat.notifyError("Unknown command: " + e.command);
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
