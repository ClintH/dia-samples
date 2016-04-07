// Initialise a few variables
var socket = null;

//When the browser is ready
$(document).ready(function() {

  // Connect realtime stuff up
  socket = io.connect('/');
  socket.on('say', onSay);

  // Trigger is mobile show overlay
  if (kattegat.device.mobile()) {
    //Attach eventlisteners to window
    $('.displayInfo').hide();
    $('#overlay').show();
  }

  $(window).on('deviceorientation', onDeviceOrientation);
});

function onDeviceOrientation(e) {
  var motion = e.originalEvent;

  // Grab the motion data
  // (we could of course send other data instead)
  var data = {
    rotation: {
      alpha: motion.alpha,
      beta: motion.beta,
      gamma: motion.gamma
    }
  };

  // Send it to the server
  socket.emit('say', data);
}

//Do something with the data from a third device (Phone, tablet etc.)
function onSay(motion) {
  if (motion.rotation) {
    rotationHandler(motion.rotation);
  }
}

//Handle rotation
function rotationHandler(rotation) {
  //Update HTML
  $('#ra').html(rotation.alpha);
  $('#rb').html(rotation.beta);
  $('#rg').html(rotation.gamma);
}
