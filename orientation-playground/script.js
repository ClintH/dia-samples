// Initialise a few variables
var socket = null;

//When the browser is ready
$(document).ready(function() {

  // Connect realtime stuff up
  socket = io.connect('/');
  socket.on('say', onSay);
  //Attach eventlisteners to window
  $(window).on('devicemotion', onDeviceMotion);
});


function onDeviceOrientation(e) {
  var motion = e.originalEvent;
  var rotation = {
    alpha: motion.alpha,
    beta: motion.beta,
    gamma: motion.gamma
  };

  socket.emit('say', {
    rotation: rotation
  });
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