var startPos = null;
var lastPos = null;
var timerId = null;

$(document).ready(function() {
	// Wire up buttons
	$("#startButton").on("click", startTrip);
	$("#stopButton").on("click", stopTrip);
})

// This function calls itself every 1000 milliseconds,
// looping until the timer is called
function requestLocationLoop() {
	navigator.geolocation.getCurrentPosition(onPositionReceived, onPositionError, {
		enableHighAccuracy: true,
		timeout: 10000
	});
	if (timerId == null) return;
	timerId = setTimeout(requestLocationLoop, 1000);
}

// Callback when an error occurs
function onPositionError(error) {
	kattegat.notifyError(error.message);
	$("#locationData").text(error.message);
}

// Called when our 'getCurrentPosition' request finishes and there is a position
function onPositionReceived(e) {
	var coords = _.toPlainObject(e.coords);
	coords.time = e.timestamp; // Keep track of when measurement was made
	
	if (startPos == null) {
		// Haven't got a position yet, so use this one as the start
		lastPos = startPos = coords;
		$("#startDetails").text(JSON.stringify(coords));
	}

	// Update 'current' info. We use Geolib to do calculations (https://github.com/manuelbieh/Geolib)
	var distanceMeters = geolib.getDistance(startPos, coords);
	$("#distance").text(distanceMeters);

	// getSpeed works because both lastPos and coords have latitude, longitude and time fields
	//	var speedKmh = geolib.getSpeed(lastPos, coords);

    var metersPerSec = geolib.getDistance(lastPos,coords) / ( (coords.time-lastPos.time)/1000);
    lastPos = coords;
	$("#speed").text(metersPerSec);
}

function startTrip() {
	$("#stopButton").show();
	$("#startButton").hide();

	// Call requestLocationLoop after 1000 milliseconds
	timerId = setTimeout(requestLocationLoop, 1000);

	kattegat.notify("Trip started");
}

function stopTrip() {
	$("#stopButton").hide();
	$("#startButton").show();

	// Cancel timer
	clearTimeout(timerId);
	timerId = null;

	startPos = null;
	kattegat.notify("Trip stopped");

	// Make final calculation based on startPos and last location
	var speedKmh = geolib.getSpeed(startPos, lastPos);
	var speedMetersPerSec = speedKmh * 60 * 60 * 1000
	$("#speed").text(speedMetersPerSec);
}