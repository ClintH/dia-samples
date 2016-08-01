var map;
var currentPositionCircle;
var watchId;

$(document).ready(function() {
	// Wire up buttons
	$("#updateLocationButton").on("click", requestLocation);
	$("#clearClickedButton").on("click", clearClicked);
	$("#startWatchingButton").on("click", startWatching);
	$("#stopWatchingButton").on("click", stopWatching);
	
	// Set up the map
	map = L.map('map');
	L.tileLayer('http://tiles.ibikecph.dk/webtiles/{z}/{x}/{y}.png', {
		maxZoom: 18,
		attribution: '"Map data &copy 2012 OpenStreetMap contributors, Imagery &copy 2012 IBikeCPH'
	}).addTo(map);


	// Create a circle for our current position
	// ...we use dummy values because it gets changed when we receive a location
	currentPositionCircle = L.circle([0,0], 10, {
		color: 'blue',
		fillColor: 'blue',
		fillOpacity: 0.5
	}).addTo(map);

	// Listen for clicks on map
	map.on('click', onMapClick);

	// Request location when we first start
	requestLocation();
})


function requestLocation() {
	$("#locationData").text("Fetching location...");

	navigator.geolocation.getCurrentPosition(onPositionReceived, onPositionError, {
		enableHighAccuracy: true,
		timeout: 10000
	});		

}

// Callback when an error occurs
function onPositionError(error) {
	console.log(error);
	var errString = error.message;
	kattegat.notifyError(errString);
	$("#locationData").text('Error: ' + errString);
}

// Called when our 'getCurrentPosition' request finishes and there is a position
function onPositionReceived(e) {
	// For debug purposes, print out location data to console and page
	// (JSON.stringify is useful for printing out the contents of an object)
	var coords = _.toPlainObject(e.coords);
	$("#locationData").html("Timestamp: " + e.timestamp +"<br />Coords: " + JSON.stringify(coords));

	// Extract some useful parameters
	var location = [coords.latitude, coords.longitude];
	var zoomLevel = 16;

	// Use Leaflet's "setView" command to move the map (http://leafletjs.com/examples/quick-start.html)
	map.setView(location, zoomLevel);
	
	// Show our current position as a circle
	var radiusMeters = coords.accuracy; // Accuracy is measured in meters
	currentPositionCircle.setLatLng(location);
	currentPositionCircle.setRadius(radiusMeters);
}

function onMapClick(e) {
	console.log("Map clicked:");
	console.dir(e);
	var location = e.latlng;

	$("#clickData").prepend("[" + location.lat+ ", " + location.lng + "]<br />");
}

function clearClicked() {
	$("#clickData").html("");
}

function startWatching() {
	$("#stopWatchingButton").show();
	$("#startWatchingButton").hide();
	watchId = navigator.geolocation.watchPosition(onPositionReceived, onPositionError, {
		enableHighAccuracy: true
	});
	kattegat.notify("Started location tracking");
}

function stopWatching() {
	$("#stopWatchingButton").hide();
	$("#startWatchingButton").show();
	navigator.geolocation.clearWatch(watchId);
	kattegat.notify("Stopped location tracking");
}