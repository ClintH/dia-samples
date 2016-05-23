$(document).ready(function() {
  // Prevent normal iOS/Android touch gestures
  $('body').on('touchmove', function(e) {
    e.preventDefault();
  });

  // Prevent normal force gestures (eg dictionary popping up)
  $('body').on('webkitmouseforcewillbegin', function(e) {
    e.preventDefault();
  });

  if (navigator.vendor.toLowerCase().indexOf('apple computer') > -1) {
    // User seems to be using Safari browser, hide warning
    $("#info").hide();
  }

  $('body').on('webkitmouseforcedown', onForceDown);
  $('body').on('webkitmouseforceup', onForceUp);
  $('body').on('webkitmouseforcechanged', onForceChanged);
});

function onForceDown(e) {
  console.log("onForceDown: Force used:  " + e.originalEvent.webkitForce);

}

function onForceUp(e) {
  console.log("onForceUp: Force used for press: " + e.originalEvent.webkitForce);
}

function onForceChanged(e) {
  var maxForce = 3.0;
  var force = e.originalEvent.webkitForce;
  console.log("onForceChanged: Force: " +  force);

  var relativeForce = force / maxForce;

  // Make sure we don't exceed 1.0 (100%)
  relativeForce = Math.min(relativeForce, 1.0);

  // Set the background colour according to percentage
  setBackground(relativeForce);
}

// Change color based on velocity
function setBackground(percentage) {   
  // Convert percentage (0.0-1.0) to the RGB scale.
  // In this scale, colour is made of up red, green and blue,
  // each expressed with a value between 0-255.
  var red = 255 * percentage;

  // Round to an integer value
  red = Math.round(red);

  // Set our red amount to the background
  // and use 0 for the green and blue values
  $('body').css({
    'background-color': 'rgb('+ red +',0,0)'
  });
}
