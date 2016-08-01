// Initialise a few variables
var socket = null;
var timeout = null;
var xValue = 0;
var yValue = 0;
var zValue = 0;

$(document).ready(function() {
	// Prevent normal iOS/Android touch gestures
	$('body').on('touchmove', function(e) { e.preventDefault() });

	// Hammer time!
	var hammer = new Hammer($('body').get(0));
	hammer.get('pan').set({ direction: Hammer.DIRECTION_ALL });
  hammer.get('pinch').set({enable:true});


	// Listen for some events
	hammer.on('panmove', onDrag);
	hammer.on('pinch', onPinch);
	
	$('body').on('dlbclick', reset);

	// Connect realtime stuff up
	socket = io.connect('/');
	socket.on("say", onSay);

	reset();
});

// Triggered when other transform controllers change
// their value
function onSay(e) {
	if (e.type == "transform") {
		updateValue(e.x, e.y, e.z);
	}
}

function reset(e) {
	// Reset
	updateValue(0, 0, 1);
	emitValues();
}

function onDoubletap(e) {
	
	// On touch devices, we sometimes get an extra doubletap
	// event that we don't want. It seems to have an abnormally
	// low deltaTime field, so we'll use that to filter them out
	if (e.deltaTime < 2) return;

	var swatchCount = $("#swatches").children().length +1;

	var h = '<div>' + swatchCount + '</div>';
	$(h).appendTo("#swatches").css('background-color', 'silver');
}

function onPinch(e) {
	var newZ = e.scale;
	updateValue(xValue, yValue, newZ);
	emitValues();

}
function onDrag(e) {

	// Divide by 1000 to make control much sloooower
	var scaledDistance = e.distance / 100;
	var newX = xValue;
	var newY = yValue;
	if (e.direction == 4) // right
	 	newY += scaledDistance;
	else if (e.direction == 2) // left
		newY -= scaledDistance;
	else if (e.direction == 8) // up
		newX += scaledDistance;
	else if (e.direction == 16) // down
		newX -= scaledDistance;
	
	updateValue(newX, newY, zValue);
	emitValues();
}

// Send our current values to the main page, 
// and all other palettes
function emitValues() {
	socket.emit("say", {
		type: "transform",
		x: xValue,
		y: yValue,
		z: zValue
	})
}
function normalise(input, min, max) {
	if (input < min) input = max + input;
	else if (input > max) input = max - input;
	return input
}
function updateValue(newX, newY, newZ) {
	newX = normalise(newX, 0, 360);
	newY = normalise(newY, 0, 360);
	if (newZ < 0) newZ = 0;

	// Set normalised values
	xValue = newX;
	yValue = newY;
	zValue = newZ;
	
	// Update a info box (useful for debugging)
	$("#xValue").text(Math.round(xValue));
	$("#yValue").text(Math.round(yValue));
	$("#zValue").text(Math.round(zValue));

	$("#demoTransform").css({
		'rotateY': yValue +'deg',
		'rotateX': xValue +'deg',
		'scale': zValue
	})
}