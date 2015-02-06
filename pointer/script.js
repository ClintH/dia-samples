var timer;

$(document).ready(function() {
	// Prevent normal iOS/Android touch gestures
	$('body').on('touchmove', function(e) { e.preventDefault() });

  // Listen to 'pointerdown' and 'pointerup' events within the <section></section> element
	$('section').on('pointerdown', onPointerDown);
	$('section').on('pointerup', onPointerUp);
});

// Change the background colour
// of the element <section></section>
//
// Tip: rather than repeating this background-changing code
//  all over, we make a function to do it so if we want to change
//  the behaviour there's only one place that needs to change  
function changeTo(colour) {
  $('section').css({
  	'background-color': colour
  });
}

// Change the color of the element when it is touched
function onPointerDown(e) {
	// Prevent default browser action
	e.stopPropagation();

  // Call our 'changeTo' function and use the colour 'orange'
  changeTo('orange');

  // After 1000 milliseconds (1 second), we'll run the code inside the function
  // block. This will change the colour to red. Note we keep track of the 'setTimeout'
  // return value, and assign it to the variable 'timer'. This way we can cancel the
  // timeout if the user releases the pointer
  timer = setTimeout(function() {
    changeTo('red');
  }, 1000);
}

//Change the color of the element when the touch ends
function onPointerUp() {
  // Call our 'changeTo' function and use the colour 'blue'
  changeTo('blue');

  // Cancel the 'long press' timer which would otherwise
  // turn it red
  clearTimeout(timer);
}

