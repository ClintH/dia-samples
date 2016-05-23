$(document).ready(function() {
  // Prevent normal iOS/Android touch gestures
  $('body').on('touchmove', function(e) {
    e.preventDefault();
  });

  // Important! Initialise Hammer
  var hammertime = new Hammer($('body').get(0));

  // Listen for 'swipe' events
  hammertime.on('swipe', onSwipe);

  // By default, Hammer only recognises horizonal swipes. If you want to
  // also recognise vertical swipes, be sure to use this:
  //  hammertime.get('swipe').set({ direction: Hammer.DIRECTION_ALL });
  // Read more: https://hammerjs.github.io/getting-started/
});


// Change color based on velocity
function onSwipe(e) {
  var max = 6; // The highest allowed velocity value
  var percentage = e.velocityX / max;
  
  // Make sure we don't exceed 1
  percentage = Math.min(percentage, 1);
  
  // Convert velocity (which is now 0.0-1.0) to the rgb scale.
  // In the basic way of expressing colour, each part of colour
  // can be expressed from 0-255, with 255 being the maximum
  var red = 255 * percentage;

  // Round to an integer value
  red = Math.round(red);

  // Set our red amount to the background
  // and use 0 for the green and blue values
  $('body').css({
    'background-color': 'rgb('+ red +',0,0)'
  });
}
