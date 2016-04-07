var timerId = null;
var circleZones = {}; // Keeps track of the zones

$(document).ready(function() {
	// Define zones to detect. Coordinates can be figured out
	// using geo-playground and clicking on the map

	// We're using simple circles to define the zones, but you can
	// specify a polygon shape to be more specific.

	// Add a zone for all of Copenhagen
	circleZones["copenhagen"] = {
		coords: [55.676097, 12.568337],
		radiusMeters: 5000
	};

	// Add a zone for all of Malmö
	circleZones["malmo"] = {
		coords: [55.60612973931359, 13.000516891479492],
		radiusMeters: 5000
	};

	// Add a zone for Niagara
	circleZones["niagara"] = {
		coords: [55.60782588262548, 12.996429204940796],
		radiusMeters: 400
	};

	// Add a zone for whole of Orkanen
	circleZones["orkanan"] = {
		coords: [55.61075892385922, 12.995409965515137],
		radiusMeters: 400
	};

	// Add a zone for west side of Niagara
	circleZones["west"] = {
		coords: [55.60771073810238, 12.99606442451477],
		radiusMeters: 30
	};


	// Add each zone to page for debugging purposes
	_.each(circleZones, function(zone, name) {
		$("#zones").append(
			'<div id="zone-' + name + '" class="zone circle">' +
				'<h1>' + name +'</h1>' +
				'<div class="info"></div>' +
			'</div');
	})
		
	// Start location-fetching loop
	timerId = setTimeout(requestLocationLoop, 1000);
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
		kattegat.notifyError(error);
		$("#position").text(error);
}

// Called when our 'getCurrentPosition' request finishes and there is a position
function onPositionReceived(e) {
	var coords = _.toPlainObject(e.coords);

	// Show current info
	$("#position").text(JSON.stringify(coords));

	// Run some calculations
	computeCircleZones(coords);

	// At this point we could do some logic, eg:
	/*
	if (circleZones["copenhagen"].inside) {
		console.log("We are in Copenhagen");
	}

	or 

	if (circleZones["kong-kaffe"].distance < 5) {
		console.log("Less than 5 meters away from coffee!")
	}
	*/

	// Update our debug helper
	updateCircleZoneDisplay();

}


// Update the graphical display for each zone
// (this is just for debugging purposes)
function updateCircleZoneDisplay() {
	// For each zone in circleZones...
	_.each(circleZones, function(zone, name) {
		// We presume that each zone has a corresponding HTML
		// element 'zone-[name of zone]', eg 'zone-itu'
		var id = "#zone-" + name;

		// Toggle class if we're inside circle or not
		if (zone.inside) $(id).addClass("inside");
		else $(id).removeClass("inside");

		// Show calculated distance
		$(".info", id).text(zone.distance+"m away");
	});
}

// Computes distance and is in/out for each zone
function computeCircleZones(coords) {
	// For each zone in circleZones...
	_.each(circleZones, function(zone, name) {
		// Get center of zone and put into a object
		var center = {
			latitude: zone.coords[0],
			longitude: zone.coords[1]
		};

		// Calculate distance and a boolean of whether
		// we are inside or not, and assign to zone object
		zone.distance = geolib.getDistance(coords, center);
		zone.inside = geolib.isPointInCircle(coords, center, zone.radiusMeters)
	});
}

