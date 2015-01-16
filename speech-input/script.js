// Initialise variable for keeping track of the recognition engine
var recognition = null;

// A simple system for responding to speech.
// Keys are the trigger phrases, and the values are functions to execute for a phrase
var commands = {
  'lights on': onLightOn,
  'lights off': onLightOff,
  'dance time': onRandom
};

// Initialise event handlers when document is ready
$(document).ready(function() {
  // Initialise speech recogniser
  recognition = new webkitSpeechRecognition();
  recognition.continuous = false;
  recognition.interimResults = false;
  recognition.lang = 'en-US';

  // Wire up events fired from the recogniser
  $(recognition).on('start', onStart);
  $(recognition).on('end', onEnd);
  $(recognition).on('result', onResult);

  // Wire up event when user clicks listen button
  $('#startListeningButton').on('click', onClick);
});

// User has clicked the "Listen" button
function onClick() {
  // Start recogniser
  recognition.start();
}

// Recogniser has started listening for speech
function onStart() {
  console.log('Started listening');

  $('aside').fadeIn(); // Show status
}

// Recogniser tells us that speech has stopped
function onEnd() {
  console.log('Stopped listening');

  $('aside').fadeOut(); // Hide status
}

// When we have a match from the voice-recognition engine
function onResult(e) {
  // Get the results
  var results = e.originalEvent.results;

  // Loop through all the results
  for (var i=0;i<results.length; i++) {
    var result = results[i];

    // If isFinal is true, this particular result is good enough to use
    if (result.isFinal) {
      // Get the transcript of the text
      var text = result[0].transcript;

      // Look up the same text in our little 'commands' dictionary
      if (commands[text]) {
        // Found it! Add the text to the transcription panel in green
        $('section').prepend('<div class="green">'+ text +'</div>');

        // ...and execute corresponding function
        commands[text].call();
      } else {
        // Text is unknown, add it to the transcription panel in red
        $('section').prepend('<div class="red">'+ text +'</div>');
      }
    }
  }
}

// Triggered when person says "lights on"
function onLightOn() {
  $('.light').show(); // Show the light image
}

// Triggered when person says "lights off"
function onLightOff() {
  $('.light').hide(); // Hide the light image
}

// Triggered when the person says "dance time"
function onRandom() {
  // Start a video  with the Nyancat by adding the appropriate tag to the page
  $('body').append('<iframe width="420" height="315" src="//www.youtube.com/embed/QH2-TGUlwu4?autoplay=1" frameborder="0" allowfullscreen></iframe>');
}

