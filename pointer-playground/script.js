$(document).ready(function() {
	//Prevent normal iOS/Android touch gestures
	$('body').on('touchmove', function(e) { e.preventDefault() });

  // Listen for all the pointerevents within the <section> element
	$('section').on("pointerdown pointerup pointermove pointerover pointerout pointerenter pointerleave", onEvent);
});

// Runs when a pointer event happens
function onEvent(e) {
	
	// e.originalEvent contains a lot of the useful data
  var orig = e.originalEvent;


  // Prepend some useful information to a DIV
  var data = '<div>' +
  					 '<div><strong>'+ e.type + '</strong></div>' +
  					 '<div>' + orig.pointerType + ' x: ' + Math.floor(orig.x) + 
                  " y: " + Math.floor(orig.y) + 
                  " button: " + orig.button + 
                  " id: " +  orig.pointerId + '</div>' +
  					 '</div>'

  // Show the very last event in one element
  $("#lastEvent").html(data);

  // And prepend it to the log
  $('aside').prepend(data);
}
