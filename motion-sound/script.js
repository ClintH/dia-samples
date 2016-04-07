// Initialise a few variables
var socket = null;
var audio = null;
var gain = null;
var oscillator = null;
var volume = null;

// When the browser is ready
$(document).ready(function() {
  // Connect realtime stuff up
  socket = io.connect('/');

  if (kattegat.device.mobile() ) {
    // Mobile device, don't play here
    $('p').hide();
    $('#overlay').show();
  } else {
    // Not a mobile
    initAudio();
    socket.on('say', onSay);
  }

  if (window.DeviceMotionEvent) {
    $(window).on('devicemotion', onDeviceMotion);
  }
});

function initAudio() {
  audio = kattegatAudio.initialize();
  if (audio == null) {
    kattegat.notify("Web audio not supported");
    return;
  }

  oscillator = audio.createOscillator();
  gain = audio.createGain();

  // The Gain connects to the destination (speakers)
  gain.connect(audio.destination);

  // Set the volume to zero
  volume = 0;
  gain.gain.value = volume;

  // Setup the frequency
  oscillator.type = oscillator.TRIANGLE;

  // The oscillator connects to the Gain
  oscillator.connect(gain);

  // Start the oscillator immediatly
  oscillator.start(0);
}

// Collect data and send it to the server
function onDeviceMotion(e) {
  var motion = e.originalEvent;
  var accelerationIncludingGravity = {
    x: motion.accelerationIncludingGravity.x,
    y: motion.accelerationIncludingGravity.y,
    z: motion.accelerationIncludingGravity.z
  };

  socket.emit('say', accelerationIncludingGravity);
}

// Do something with the data from a third device (Phone, tablet etc.)
function onSay(motion) {
  updateSound(motion);
}

function updateSound(motion) {
  var z = motion.z;
  if (_.isNaN(z)) z = 0;
  if (_.isNaN(volume)) volume = 0;
  
  // Make it an integer: 1.111 = 1
  z = Math.round(z);

  // Make z less strong 1 = 0.002
  z = z / 500;

  // Apply data to the current volume
  volume = volume + z;

  // Keep sound with boundaries 1/0 (max/min)
  volume = Math.max(0, volume);
  volume = Math.min(1, volume);

  // Apply new values if web audio was initalised
  console.log("z: " + z + " vol: " + volume);
  if (gain) {
    gain.gain.value = volume;
  }
  $('#volume').html(Math.round( volume*100 ));
}
