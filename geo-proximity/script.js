var startPos = null;
var timerId = null;
var ourColour = "green";
var socket = null;
var roomName = "geo-zones";
var ourName = "?";
var ourId = null;
var users = {};

$(document).ready(function() {
	$("#setButton").on("click", nameSetClick);
	$("#pulseButton").on("click", pulseClick);

	// Assign a random colour for ourselves
	ourColour = getRandomColour();
	$("#colourSwatch").css({
		"background-color": ourColour
	});
	
	// Connect realtime stuff up
	socket = io.connect("http://" + window.location.host);
	socket.on("hello", onHello);
	socket.on("say", onSay);
	socket.on("leave", onLeave);

	// Start location-fetching loop
	timerId = setTimeout(requestLocationLoop, 2000);

	// Set up vibration (not for iOS devices)
	navigator.vibrate = navigator.vibrate || navigator.webkitVibrate || navigator.mozVibrate || navigator.msVibrate;

})

// This function calls itself every 2000 milliseconds,
// looping until the timer is called
function requestLocationLoop() {
	navigator.geolocation.getCurrentPosition(onPositionReceived, onPositionError, {
		enableHighAccuracy: true,
		timeout: 10000 // how long to wait for a position
	});
	if (timerId == null) return;
	timerId = setTimeout(requestLocationLoop, 2000);
}

// Callback when an error occurs
function onPositionError(error) {
	kattegat.notifyError(error.message);
	$("#position").text(error.message);
}

// Called when our 'getCurrentPosition' request finishes and there is a position
function onPositionReceived(e) {
	var coords = _.toPlainObject(e.coords);

	// Show current info for debug use
	$("#position").text(JSON.stringify(coords));

	// Construct data to send
	var data = {
		room: roomName,
		coords: coords,
		name: ourName,
		colour: ourColour
	}

	// Send data
	socket.emit("say", data);

	// Calculate our relation to other users
	computeDistances(coords);

	// Update debug display to show live
	// and calculated data
	updateUsersDisplay();
}

function computeDistances(coords) {
	// For each user we know about
	_.each(users, function(user, id) {
		// Calculate their distance to us, and assign to the .distance field
		// (distance is in meters)
		user.distance = geolib.getDistance(coords, user.coords);
	})
}

function updateUsersDisplay() {
	// Update the graphical display for each user
	// (this is just for debugging purposes)
	_.each(users, function(user, id) {
		// We presume that each user has a corresponding HTML
		// element 'user-[id of user]', eg 'user-sdf'
		var selector = "#user-" + id;
		// Show calculated distance
		$(".info", selector).text(user.distance+"m away");
	});
}

function getSimpleId(e) {
	return e._clientId.replace("/", "").replace("#", "");
}

// Triggered when ever we receive data from another client
function onSay(e) { 
	var id = getSimpleId(e);
	if (e.coords) {
		// Got some coordinates

		// Keep track of location, by associating received
		// data with the 'users' array
		users[id] = e;

		// Update HTML element for user
		var selector = addOrGetUser(id);

		$(".swatch", selector).css("background-color", e.colour);
		$("h1", selector).text(e.name);	
	} else if (e.pulse) {
		// Received a pulse. Look up sender and
		// do something funky to their HTML element
		var selector = addOrGetUser(id);
		$(selector).transition({
			"background-color": "red"
		}, 500, function() {
			$(this).css("background-color", "white")			
		});
	
		// Vibrate if we can (Read more: http://www.sitepoint.com/use-html5-vibration-api/)
		if (navigator.vibrate) {
			navigator.vibrate([500,200,500]);
		}
	} else {
		// Some other type of message
		// Log it so we can figure it out
		console.dir(e);
	}
}

// 'Pulse' is clicked
function pulseClick(e) {
	e.preventDefault(); // Prevent form from submitting

	// Send the data using socket.emit
	socket.emit("say", {
		room:roomName,
		pulse: true
	});
}

// Returns a selector for the HTML element which
// holds user info. Creates HTML element if it doesn't
// already exist
function addOrGetUser(id) {
	// If we don't already have a HTML element
	if ($("#user-" +id).length == 0) {
		// ...append it to the #users DIV
		$("#users").append(
			'<div id="user-' + id + '" class="user">' +
				'<span class="swatch"></span><h1>' + id +'</h1>' +
				'<div class="info"></div>' +
			'</div');
	}

	// Finally, return a jQuery selector string
	return "#user-" + id;
}

// Another user has disconnected
function onLeave(e) {
	// Server provides an 'id' property for the user
	var id = e.id;

	// Delete id from users we are tracking
	delete users[id];

	// Delete associated HTML element
	$("#user-"+id).remove();
}

// Connected to server
function onHello(e) {
	// Join a named 'room'
	// We'll only send and receive messages to this room
	socket.emit("join", {room:roomName});
	ourId = e.id;
}


// Called when user clicks 'set'
function nameSetClick(e) {
	e.preventDefault(); // prevent form from submitting

	// Set typed value to the `ourName` variable
	ourName = $("form input[name='name']").val();
}


function getRandomColour() {
	// Construct random colour from r, g + b
	// components.

	// It will return a string like:
	// rgb(100,35,200)
	
	// We'll use lodash's random function.
	//	Read more: http://lodash.com/docs#random

	return "rgb(" + 
			_.random(0,255) + ", "+
			_.random(0,255) + ", " +
			_.random(0,255) + ")";
}

