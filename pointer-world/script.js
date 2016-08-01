// Initialise a few variables
var ourColour = "green";
var socket = null;
var timeout = null;

$(document).ready(function() {
	// Prevent normal iOS/Android touch gestures
	$('body').on('touchmove', function(e) { e.preventDefault() });

	// Listen for pointermove anywhere in the body
	$('body').on('pointermove', onPointerMove);

	// Assign a random colour for ourselves
	ourColour = getRandomColour();

	// Set our background accordingly
	$('body').css({
		"background-color": ourColour
	})

	// Connect realtime stuff up
	socket = io.connect('/');
	socket.on("say", onSay);

	// Every two seconds, "age" the cursors so they get removed
	timeout = setInterval(ageCursors, 2000);
});

// Fires when the pointer moves
function onPointerMove(e) {
	// Use the 'say' command to broadcast a few 
	// interesting fields from the event to all
	// other pages
	var orig = e.originalEvent;

	// Get the dimensions of the window
	var windowWidth = $(window).innerWidth();
	var windowHeight = $(window).innerHeight();

	// Construct a lightweight object to emit
 	var data = {
		name: e.type,
		type: orig.pointerType,
		x: orig.x / windowWidth, // Use a relative x,y
		y: orig.y / windowHeight,// depending on screen size
		id: orig.pointerId,
		colour: ourColour
	}

	// Send it!
	socket.emit("say", data);

	// We want to process the data the same as if
	// it was sent by another page. The server doesn't
	// send our own data back to us, so we have to trigger
	// the onSay function manually
	data._clientId = "0"; // Normally received data has a _clientId, so we need to fake it
	onSay(data);
}

// Remove / and # characters that appear in the client id
function getSimpleId(e) {
	return e._clientId.replace("/","").replace("#", "");
}

// Called when ever we receive a message
// from another page
function onSay(e) {
	// Hide tip if the user seems to have got it
	if (getSimpleId(e) !== "0") $("#tip").fadeOut();

	// Get the window dimensions
	var windowWidth = $(window).innerWidth();
	var windowHeight = $(window).innerHeight();

	if (e.name == "pointermove") {
		// Match relative positions to our
		// window size. We -50 because the
		// width of the cursor circle is 100.
		// This centers it.
		var x = (e.x * windowWidth) - 50;
		var y = (e.y * windowHeight) - 50; 

		// Construct or reuse an element for the cursor
		var element = getOrCreateCursor(e);

		// Set its location, scale and opacity
		$(element).css({
			left: x,
			top: y,
			opacity: 1.0,
			scale: 1.0
		})
	}
	// TODO: else if: handle other kinds of events??
}

// Returns an element for a particular cursor
// If there is no element for a particular cursor id,
// create it and add it to the page.
function getOrCreateCursor(e) {
	// Cursors have an id of something like:
	//	cursor-1-TiF7PmuoDrlXPRWYsuyx
	// This is based on their server id, and the id of the pointer (necessary for multitouch)
	var cursorId = "cursor-" +e.id+"-"+ getSimpleId(e);
	var cursorSelector = "#" + cursorId;

	// Check to see if an element exists:
	if ($(cursorSelector).length == 0) {
		// Ok, not found - add it!
		var html = '<div class="cursor" id="' +  cursorId + '"></div>';
		$(html).appendTo('body');
		$(cursorSelector).css("background-color", e.colour);

		// If it is our user's own cursor, add an extra CSS class
		// so it is rendered differently
		if (getSimpleId(e) == "0") {
			$(cursorSelector).addClass("ownCursor");
		}
	} 

	// Return the cursor we found or created
	return $(cursorSelector);
}

// 'Age' cursors to remove them from the screen.
// This runs every two seconds thanks to the 'setInterval'
// used at the top of the page.
function ageCursors() {
	// The jQuery .each function loops through all
	// elements that match the selector, and let us
	// run some logic for each thing independently
	$(".cursor").each(function(index, cursor) {
		// Decrease opacity, increase scale
		var newOpacity = $(cursor).css("opacity") - 0.4;
		var newScale = $(cursor).css("scale") + 0.8;

		// If opacity drops to a limit, remove it from the page
		if (newOpacity <= 0.1) {

			// Remove element in a fancy way
			// Transition to invisible and quite large really quick
			$(cursor).transition({
				opacity: 0.0,
				scale: 10
			}, 500, function() {
				// Remove element after transition has completed
				$(cursor).remove();
			})
			return;
		}

		// Set new opacity and scale
		$(cursor).transition({
			opacity: newOpacity,
			scale: newScale
		}, 2000)
	});	
}

// Construct random colour from r, g + b
// components.
function getRandomColour() {
	// It will return a string like:
	// rgb(100,35,200)
	
	// We'll use lodash's random function.
	//	Read more: http://lodash.com/docs#random
	return "rgb(" + 
			_.random(0,255) + ", "+
			_.random(0,255) + ", " +
			_.random(0,255) + ")";
}