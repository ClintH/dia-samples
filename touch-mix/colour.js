// Initialise a few variables
var socket = null;
var timeout = null;
var hValue = 0;
var sValue = 0;
var lValue = 0;

$(document).ready(function() {
	// Prevent normal iOS/Android touch gestures
	$('body').on('touchmove', function(e) { e.preventDefault() });

	// Hammer time
	var hammer = new Hammer($('body').get(0));
	hammer.get('pan').set({ direction: Hammer.DIRECTION_ALL });
  hammer.get('pinch').set({enable:true});

	// Listen for some touch-oriented events
	hammer.on('panmove', onDrag);
	hammer.on('pinch', onPinch);

	$('body').on('dblclick', onDoubleClick);

	$('#swatches').on('dblclick', 'div', onSwatchDoubleClick);
	$('#swatches').on('click', 'div', onSwatchClick);

	// Connect realtime stuff up
	socket = io.connect('/');
	socket.on("say", onSay);

	// Set ourselves to a default value
	reset();
});

function onSwatchClick(e) {
	// Use the tinycolor library to parse the CSS colour
	//		Read more: http://bgrins.github.io/TinyColor/
	var c = tinycolor($(e.target).css("background-color"));
	var hsl = c.toHsl();
	
	// Set our values to be same as the tapped swatch colour,
	// ...but first normalise, because 'toHsl' gives us values
	// in the scale of 0.0-1.0, and we want 0-100
	updateValue(hsl.h, hsl.s * 100, hsl.l * 100);
	
	// Send out values via server
	emitValues();
}

function onSwatchDoubleClick(e) {	
	// This line prevents the body's doubletap event firing
	// as well (due to event bubbling)
	e.stopPropagation();
	
	// Shrink and fade out colour swatch, and then remove it from DOM
	$(e.target).transition({
		opacity: 0,
		scale: 0
	}, 500, function() {
		// Runs when transition is done
		this.remove();
	});
}

// Triggered when other hue+sat controllers change
// their value
function onSay(e) {
	if (e.type == "colour") {
		updateValue(e.hue, e.sat, e.lightness);
	}
}

function reset(e) {
	// Reset
	updateValue(100, 100, 50);
	emitValues();
}

function onDoubleClick(e) {
	// On touch devices, we sometimes get an extra doubletap
	// event that we don't want. It seems to have an abnormally
	// low deltaTime field, so we'll use that to filter them out
	if (e.deltaTime < 2) return;

	var h = '<div></div>';
	$(h).appendTo("#swatches").css("background-color", getColourString());
}

function onPinch(e) {
	
	// Divide by 1000 to make control much sloooower
	var newL = e.scale*100;
	updateValue(hValue, sValue, newL);
	emitValues();

}

function onDrag(e) {
	// Divide to make control sloooower
	var scaledDistance = e.distance / 100;
	var newH = hValue;
	var newS = sValue;

	// Directions are documented here: http://hammerjs.github.io/api/
	if (e.direction == 4) // right
	 	newH += scaledDistance;
	else if (e.direction == 2) // left
		newH -= scaledDistance
	else if (e.direction == 8) { // up
		newS -= scaledDistance;
		if (newS < 0) newS = 0;
	} else if (e.direction == 16) {// down
		newS += scaledDistance;
		if (newS >= 100) newS = 100;
	}
	updateValue(newH, newS, lValue);
	emitValues();
}

// Send our current values to the main page, 
// and all other palettes
function emitValues() {
	socket.emit("say", {
		type: "colour",
		hue: hValue,
		sat: sValue,
		lightness: lValue
	})
}
function normalise(input, min, max) {
	if (input < min) input = max + input;
	else if (input > max) input = max - input;
	return input
}
function updateValue(newH, newS, newL) {
	// Need to normalise hue values to 0-360
	newH = normalise(newH, 0, 360);
	
	// Need to normalise sat and lightness values to 0-100
	newS = normalise(newS, 0, 100);
	//newL = normalise(newL, 0, 100);

	// Set normalised values
	hValue = newH;
	sValue = newS;
	lValue = newL;

	// Update a info box
	// (useful for debugging, but hidden by default)
	$("#hValue").text(Math.round(hValue));
	$("#sValue").text(Math.round(sValue));
	$("#lValue").text(Math.round(lValue));

	$("body").css("background-color", getColourString());	
}

// Returns a CSS colour string for the currently set values
function getColourString() {
	return 'hsla(' + hValue + ', ' + sValue + '%, ' + lValue + '%, 1)';
}