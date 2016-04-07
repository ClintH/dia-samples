var planet = null;

$(document).ready(function() {
  // Prevent normal iOS/Android touch gestures
  $('body').on('touchmove', function(e) {
    e.preventDefault()
  });

  // Initialise Hammer (important!)
  var hammertime = new Hammer($('body').get(0), {domEvents:true});
  hammertime.get('pinch').set({enable:true});
  hammertime.get('rotate').set({enable:true});

  // Listen for Hammer.js-provided events
  hammertime.on('tap', onTap);
  hammertime.on('pinch', onPinch);
  hammertime.on('rotate', onRotate);
  hammertime.on('pinchend', onPinchEnd);
  hammertime.on('press', onPress);
});


/*
 * Create a new star
*/
function onTap(e) {
   //Get the coordinates
  var top = e.center.y;
  var left = e.center.x;

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
  var top = e.center.y;
  var left = e.center.x;
  var scale = e.scale;

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
  var rotation = e.rotation;
  var hue = rotation + 127;

  // Make sure hue does not exceed 360 - the highest possible value
  hue = Math.min(hue, 360);

  if (planet) {
    planet.css({
      'background-color': 'hsl('+hue+',100%,20%)'
    });
  }
}

/* Cleanup references */
function onPinchEnd() {
  planet = null;
}

/*
 * Delete a planet
*/
function onPress(e) {
  var target = e.target;
  planet = null;
  // All the planets are made from HTML '<figure>' elements, so we can easily check
  // if it's a planet or not
  if (target.tagName === 'FIGURE') {
    // Yep, a planet - remove!
    $(target).remove();
  }
}
