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
	$('body').hammer({prevent_default:false});

	// Listen for some events
	$('body').on('drag', onDrag);
	$('body').on('pinch', onPinch);
	$('body').on('doubletap', onDoubletap);
	$('#swatches').on('doubletap', 'div', onSwatchDoubletap);
	$('#swatches').on('tap', 'div', onSwatchTap);

	// Connect realtime stuff up
	socket = io.connect("http://" + window.location.host);
	socket.on("say", onSay);

	// Set ourselves to a default value
	reset();
});

function onSwatchTap(e) {
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

function onSwatchDoubletap(e) {
	if (e.gesture.deltaTime < 2) return;
	
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

function onDoubletap(e) {
	// On touch devices, we sometimes get an extra doubletap
	// event that we don't want. It seems to have an abnormally
	// low deltaTime field, so we'll use that to filter them out
	if (e.gesture.deltaTime < 2) return;

	var h = '<div></div>';
	$(h).appendTo("#swatches").css("background-color", getColourString());
}

function onPinch(e) {
	var g = e.gesture;
	
	// Divide by 1000 to make control much sloooower
	var newL = g.scale*100;
	updateValue(hValue, sValue, newL);
	emitValues();

}
function onDrag(e) {
	// Gesture field has the juicy info
	var g = e.gesture;

	// Divide to make control sloooower
	var scaledDistance = g.distance / 100;

	var newH = hValue;
	var newS = sValue;

	if (g.interimDirection == "right")
	 	newH += scaledDistance;
	else if (g.interimDirection == "left")
		newH -= scaledDistance
	else if (g.interimDirection == "up")
		newS -= scaledDistance;
	else if (g.interimDirection == "down")
		newS += scaledDistance;
	
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