var isPointerPressed = false;
var audio = null;
var oscillator = null;
var gain = null;
var interval = null;

$(document).ready(function() {
  //Listen once for a pointerdown event and setup the sound
  //This is important for working with iOS
  $('body').one('pointerdown', setupSound);

  //Listen for pointerevents to update sound and visuals
  $('body').on('pointerdown', onPointerDown);
  $('body').on('pointerup', onPointerUp);
  $('body').on('pointermove', onPointerMove);
});

//Setup audio, gain (volume), oscillator
function setupSound() {
  audio = kattegatAudio.initialize();
  oscillator = audio.createOscillator();
  gain = audio.createGain();

  //The Gain connects to the destination (speakers)
  gain.connect(audio.destination);

  //Set the volume to zero
  gain.gain.value = 0;

  //Setup the frequency
  oscillator.type = oscillator.SINE;
  oscillator.frequency.value = 280;

  //The oscillator connects to the Gain
  oscillator.connect(gain);

  //Start the oscillator immediatly
  oscillator.start(0);
}

//When the user clicks/touches the screen
function onPointerDown(e) {
  //Save reference for the onPointerMove
  isPointerPressed = true;

  //Trigger a fake move so the box moves instantly
  onPointerMove(e);
}

//When the user stops clicking/touching the screen
function onPointerUp() {
  //Save reference for the onPointerMove
  isPointerPressed = false;
}

function onPointerMove(e) {
  //Stop isn't pressed down
  if (!isPointerPressed) { return; }

  var pointerTop = e.originalEvent.clientY; //Get Y coordinate from the pointer
  var pointerLeft = e.originalEvent.clientX; //Get X coordinate from the pointer
  var boxsize = $('aside').size(); //Get the box size (width and height)
  var bodysize = $('body').size(); //Get the screen size (width and height)

  //Get center coordinates for the screen
  var centerTop = bodysize.height/2;
  var centerLeft = bodysize.width/2;

  //Move the box according to the pointer
  //Do calculations(/2) center the box according to the pointer
  $('aside').css({
    top: pointerTop - boxsize.height/2,
    left: pointerLeft - boxsize.width/2
  });

  // How far is the box from the center of screen (linear algebra)
  // http://www.purplemath.com/modules/distform.htm
  var top = pointerTop - centerTop;
  var left = pointerLeft - centerLeft;
  // Square root: http://www.w3schools.com/jsref/jsref_sqrt.asp
  var delta = Math.sqrt( (top * top) + (left * left) );

  // Find the max distance (top-left corner to center of screen) - same formular.
  var topMax = 0 - centerTop;
  var leftMax = 0 - centerLeft;
  var deltaMax = Math.sqrt( (topMax * topMax) + (leftMax * leftMax) );

  //Get the delta value
  var percentage = delta/deltaMax;

  //Start the tremolo effect (turn volume up and down continuously)
  var absolute = percentage * 1;
  var stopAfterSeconds = absolute; //Me be in seconds
  var loopEveryMs = absolute * 2000; //Must be the double of stopAfterSeconds and in ms (milliseconds)

  //Stop the existing loop
  clearInterval(interval);

  function loop() {
    //Set volume to 1 immediately
    gain.gain.setValueAtTime(1, audio.currentTime);
    //Set volume to 0 after "stopAfterSeconds"
    gain.gain.setValueAtTime(0, audio.currentTime + stopAfterSeconds);
  }

  // Start the new loop
  interval = setInterval(loop, loopEveryMs);
}
