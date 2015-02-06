
$(document).ready(function() {
	// Prevent normal iOS/Android touch gestures
	$('body').on('touchmove', function(e) { e.preventDefault() });
	
	// Wire up event
	$('body').on('pointermove', onPointerMove);

});

function onPointerMove(e) {
  var pointerTop = e.originalEvent.clientY;
  var pointerLeft = e.originalEvent.clientX;
  var coordinates = '<div>X: '+ pointerLeft +'</div><div>Y: '+ pointerTop +'</div>';

  // Get the size of element with id 'dragBox'
  var size = $("#dragBox").size();

  // Move the element with id 'dragBox' to follow the cursor,
  // with the cursor in the middle
  $('#dragBox')
    .css({
    	left: pointerLeft - (size.width/2.0),
    	top: pointerTop - (size.height/2.0)
    })
    .html(coordinates);

  // Gets a list of elements with class 'targetBox' that intersect
  // with an element with id 'dragBox'
  var intersecting = $(".targetBox").findIntersecting("#dragBox");
  // 		Tip: you can also use 'findNotIntersecting' to get a list of those elements that DON'T intersect

  // Set some text for those that intersect
  // Note that 'intersecting' might be zero or more elements
  intersecting.text("I've been hit");

  // We could use a for loop to do something to each intersecting element if we wanted:
  /*
  for (var i=0; i<intersecting.length; i++) {
    var element = intersecting[i];
    $(element).text("Hit #" + (i+1));
  }
  */

  // 'intersects' simply returns true or false if anything with 
  // class 'targetBox' intersects with element of id 'dragBox'
  var isIntersecting = $('.targetBox').intersects('#dragBox');
  if (isIntersecting)
  	$("#dragBox").css("background-color", "red");
  else
  	$("#dragBox").css("background-color", ""); // Un-set colour so it goes back to the default
}
