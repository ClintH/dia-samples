var planet = null;

$(document).ready(function() {
  // Prevent normal iOS/Android touch gestures
  $('body').on('touchmove', function(e) {
    e.preventDefault()
  });

  // Initialise Hammer (important!)
  $('body').hammer({prevent_default:true});

  // Enable extra debug on desktop browsers
  Hammer.plugins.showTouches();
  Hammer.plugins.fakeMultitouch();

  // Listen for Hammer.js-provided events
  $('body').on('tap', onTap);
  $('body').on('pinch', onPinch);
  $('body').on('rotate', onRotate);
  $('body').on('release', onRelease);
  $('body').on('hold', onHold);
});


/*
 * Create a new star
*/
function onTap(e) {
  //Get the coordinates
  var top = e.gesture.center.pageY;
  var left = e.gesture.center.pageX;

  //Create a star with the correct position
  var star = $('<aside></aside>')
    .css({
      'top': top,
      'left': left
    });

  //Insert the star
  $('body').append(star);
}

/*
 * Create a new planet
*/
function onPinch(e) {
  //Get the coordinates
  var size = 10;
  var top = e.gesture.center.pageY;
  var left = e.gesture.center.pageX;
  var scale = e.gesture.scale;

  if (planet) {
    //adjust the size
    scale = Math.pow(scale, 2);
    size = size * scale;

    planet
      .css({
        'width': size,
        'height': size,
        'margin-left': (-1 * (size/2)), // Center position
        'margin-top': (-1 * (size/2))   // Center position
      });
  } else {
    // Create the planet
    planet = $('<figure></figure>')
      .css({
        'top': top,
        'left': left,
        'width': size,
        'height': size
      });
    $('body').append(planet);
  }
}

/* Adjust the planet color based on rotation */
function onRotate(e) {
  var rotation = e.gesture.rotation;
  var hue = rotation + 360;

  // Make sure hue does not exceed 360 - the highest possible value
  hue = Math.min(hue, 360);

  if (planet) {
    // HSL values: http://hslpicker.com/
    planet.css({
      'background-color': 'hsl('+hue+',100%,20%)'
    });
  }
}

/* Cleanup references */
function onRelease() {
  //cleanup
  planet = null;
}

/*
 * Delete a planet
*/
function onHold(e) {
  var target = e.target;

  // All the planets are made from HTML '<figure>' elements, so we can easily check
  // if it's a planet or not
  if (target.tagName === 'FIGURE') {
    // Yep, a planet - remove!
    $(target).remove();
  }
}
