$(document).ready(function() {
	// Prevent browser's default touch gestures
	$('section').on('touchmove', function(e) {
		e.preventDefault();
	});

	// Initialise Hammer on the SECTION element
	var hammertime = new Hammer($('section').get(0), {});
	// Enable pinch and rotate gesture recognisers
	hammertime.get('pinch').set({enable:true});
	hammertime.get('rotate').set({enable:true});


	// Name of events should be logged
	var events = [
	'panstart', 'panmove', 
	'rotatestart', 'rotatemove',
	'pinchstart', 'pinchmove',
	'swipe',
	'tap',
	'doubletap'
	]
	// This converts the array above to one long string with each name separated by a space
	// eg: "touch release hold tap ..."
	var eventNames = events.join(' ');

	// Listen to all these events, but only within the <section> element
	hammertime.on(eventNames, onEvent);

	// If you wanted to respond to a particular event, use syntax:
	// hammertime.on('swipe', myEvent);
});

// Fires whenever one of the events happens
function onEvent(e) {
	var data = '<div>' +
		'<div><strong>'+ e.type + '</strong></div>' +
		'<div>angle: ' + e.angle + '  direction: ' + e.direction + '</div>' +
		'<div>velocity: ' + e.velocityX + ', ' + e.velocityY + '</div>' +
		'</div>';

	// Show the very last event in one element
	$("#lastEvent").html(data);
	
	// Add to the log
	$('aside').prepend(data);
}
