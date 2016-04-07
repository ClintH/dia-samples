/*
* This script is used only by canvas.html
**/

var squareCache = [];
var socket = null;
// Our way of identifying the object we store on the server:
//  it has a particular field set to true.
var objectId = {"square-store-canvas": true};

// Keep track of whether we have new data to save
var shouldSave = true;

$(document).ready(function() {
	socket = io.connect("http://" + window.location.host);
	socket.on("say", onSay);
	
	$("#clearCanvas").on("click", onClearClick);

	// Listen to click events on any squares
	// that might get created within the body element
	$("body").on("click", ".square", onClick);
	// (this is a bit different that the other event
	//	listener because we are dynamically creating the squares.)

	// Try to load from server.

	// We simply try to fetch an object with
	// square-store-canvas set to 'true'
	$.post("/store/find", objectId, function(data, status, xhr) {
		if (data.length == 0) return;
		// Data returned is an array, let's just grab the first,
		// because there should never be more than one
		data = data[0];
		
		// If the object from the server has a 'squares' field,
		// use it. Otherwise keep the empty array we initialized up top.
		if (data.squares) squareCache = data.squares;

		// Add squares we got from server
		for (var i=0;i<squareCache.length; i++) {
			makeSquare(squareCache[i]);
		}
		shouldSave = false; // Just got data from server
	});

	// setTimout will call the function after a delay (millisecs)
	//	Read more: https://developer.mozilla.org/en/docs/Web/API/window.setTimeout
	setTimeout(autoSave, 15000); // 15 seconds

})

// Demo: clear all squares from DOM, from our cache, and the database
function onClearClick(e) {
	// Remove squares we added to the DOM
	$(".square").remove();

	// Empty cache (which is auto-saved to server periodically)
	squareCache = [];
	shouldSave = false; // because we are removing manually, below

	// Note: we don't have to manually delete from the server because
	// we're doing the period automatic save, which writes everything
	// to the database


	// ...but lets do it anyway for demo purposes
	var data = {
		query: objectId,
		options: { multi: true} // Setting to 'true' means we'll delete more than one thing if it matches our query
	}
	$.post("/store/remove", data, function(data, status, xhr) {
		if (data.removed == 1) {
			kattegat.notify("Removed canvas from server");
		}
	})
}
function autoSave() {
	// Only hit the server if something seems to have changed
	if (shouldSave) {
		console.log("Auto save!");
		// Assume update happened ok
		shouldSave = false;

		// query:  is the object to save/update. We presume there's only one!
		// update: data to save
		// options: upsert: true -- this will insert if it doesn't already exist
		var data = {
			query: objectId,
			update: {
				"square-store-canvas": true,
				squares: squareCache
			},
			options: { upsert: true }
		}

		console.dir(data);
		$.post("/store/update", data, function(data, status, xhr) {
			// We don't really care about the response...
		})		
	}

	// Call setTimout again after 10s, so it runs continuously
	setTimeout(autoSave, 10000);
}

// Event handler called when we receive data
function onSay(e) {
	if (e.command == "make") {
		// Save square in our cache
		squareCache.push(e.square);
		// Since something has changed, we should save!
		//	The autoSave() function will now save the data next time it is run
		shouldSave = true;

		makeSquare(e.square);
	} else {
		kattegat.notifyError("Unknown command: " + e.command);
	}
}

// Makes a square, and assigns the CSS properties
// contained in the 'css' argument
function makeSquare(css) {
	console.log("makeSquare: " + JSON.stringify(css));
	console.dir(squareCache);
	var x = $('<div id="square-' + (squareCache.length) +'" class="square">' + (squareCache.length)  + '</div>')
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
