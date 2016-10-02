// Initialise a few variables
var socket = null;
var timeout = null;
var objectId = {"pointer-mix":true}; // This is our 'key' to get/set to the server
var autoSave = null;

// Keep track of the values we are receiving and changing
var state = {
	hue: 100,
	sat: 100,
	lightness: 100,
	x: 0,
	y: 0,
	z: 1.0
}

$(document).ready(function() {
	// Prevent normal iOS/Android touch gestures
	$('body').on('touchmove', function(e) { e.preventDefault() });

	// Connect realtime stuff up
	socket = io.connect('/');
	socket.on("say", onSay);

	// Load the last saved value using Kattegat
	//	See http://localhost:3000/demos/store.html for more
	$.post("/store/find", objectId, function(data,status,xhd) {
		if (data.length == 0) return; // No data
		
		// Data is returned to us an array, but we only care about first
		// (and only) item
		data = data[0];
		state = data;
		update();
	})

	// "Debounce" is from lodash: http://lodash.com/docs#debounce
	// It's a handy way of only running a function (in this case 'save')
	// every X milliseconds
	autoSave = _.debounce(save, 2000);

});

// Called when ever we receive a message from
// another page
function onSay(e) {
	// Copy received data to 'state' variable we are using
	// to keep track of everything
	if (e.type == "colour") {
		state.hue = e.hue;
		state.sat = e.sat;
		state.lightness = e.lightness;
	} else if (e.type == "transform") {
		state.x = e.x;
		state.y = e.y;
		state.z = e.z;
	}
	else
		console.dir(e);
	
	// Update CSS based on the state
	update();

	// Because we 'debounced' the function, we can call autoSave
	// as much as we like, but it will only actually run 'save'
	// every 2 seconds
	autoSave();
}

// Saves the state to the server
function save() {
	state["pointer-mix"] = true;
	$.post("/store/update", {
		query: objectId,
		update: state,
		options: { upsert: true }
	});
}

// Set whatever values we currently have to the element
// we are moving about
function update() {
	$("#thing").css({
		'background-color': 'hsla(' + state.hue + ', ' + state.sat + '%, ' + state.lightness + '%, 1)',
		'rotateY': state.y +'deg',
		'rotateX': state.x +'deg',
		'scale': state.z
	})
}