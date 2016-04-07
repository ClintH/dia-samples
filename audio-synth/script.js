var audio = null;
var oscillator = null;
var gain = null;
var isPointerActive = false;
// Notes
var lowNote = 261.63; // C4
var highNote = 493.88; // B4

$(document).ready(function() {
  //Listen once for a pointerdown event and setup the sound
  //This is important for working with iOS
  $('section').one('pointerdown', setupSound);

  //Listen for pointerevents to update sound and visuals
  $('section').on('pointerdown', onPointerDown);
  $('section').on('pointerup pointerleave', onPointerUp);
  $('section').on('pointermove', onPointerMove);
});

//This function setups and instance of kattegatAudio for later use.
function setupSound() {
  audio = kattegatAudio.initialize();
  oscillator = audio.createOscillator();
  gain = audio.createGain();

  //The Gain connects to the destination (speakers)
  gain.connect(audio.destination);

  //Set the volume to zero
  gain.gain.value = 0;

  //Setup the frequency
  oscillator.type = oscillator.TRIANGLE;

  //The oscillator connects to the Gain
  oscillator.connect(gain);

  //Start the oscillator immediatly
  oscillator.start(0);
}

//When use clicks or touches the screen
function onPointerDown(e) {
  //This reference is used w/ onPointerMove
  isPointerActive = true;

  //Add visual aid
  $('section').addClass('crosshair');

  //Update the pointer to provide instant feedback
  onPointerMove(e);
}

function onPointerUp() {
  //This reference is used w/ onPointerMove
  isPointerActive = false;

  //Add visual aid
  $('section').removeClass('crosshair');

  //Turn volume down to zero
  gain.gain.value = 0;
}

function onPointerMove(e) {
  //Stop if the user isn't clicking/touching the screen
  if (!isPointerActive) { return; }

  var org = e.originalEvent;
  var x = org.x; //The x coordinate for the pointer on pad
  var y = org.y; //The y coordinate for the pointer on pad
  var noteValue = calculateNote(x); //Get the note based on the X value
  var volumeValue = calculateVolume(y); //Get the volume based on the Y value

  //Set note and volume
  oscillator.frequency.value = noteValue;
  gain.gain.value = volumeValue;

  //Write the data on screen
  $('#frequency').text( Math.floor(noteValue) + ' Hz' );
  $('#volume').text(  Math.floor(volumeValue * 100) + '%' );
}

// Calculate the note
function calculateNote(posX) {
  var noteDifference = highNote - lowNote;
  var noteOffset = (noteDifference / $('section').width()) * posX;
  return lowNote + noteOffset;
}

// Calculate the volume
function calculateVolume(posY) {
  // Since posY is relative to the page, we need to subtract where the element (the white box)
  // appears on the page
  posY -= $('section').offset().top;
  // Calculate the volume level of the pointer Y in relation to the height of the element
  // And then flip the value so high pointer == high volume
  var volumeLevel = 1-(posY / $('section').height());
  return volumeLevel;
}
