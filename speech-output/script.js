// Initialise events when document is ready
$(document).ready(function() {
  // Listen for a click on the button
  $('#speakButton').on('click', onClick);
});

// User has clicked the speak button
function onClick() {
  // Setup a new message object
  var msg = new SpeechSynthesisUtterance();
  
  // Get all available voices
  var voices = speechSynthesis.getVoices();
  
  // Assign the text from the input box
  msg.text = $('input').val();
  
  // Get the selected voice (based on index)
  var index = $('select').val();
  msg.voice = voices[index]; // ...and assign it to the message

  // Speak the message we've constructed
  speechSynthesis.speak(msg);
}

/*
 * The following code is only used to build the dropdown
 * getVoices is still a bit buggy.
*/
var voices = speechSynthesis.getVoices();
setTimeout(buildDropdown, 1000);
function buildDropdown() {
  var voices = speechSynthesis.getVoices();
  voices.forEach(function(voice, index) {
    console.log(index + ". '" + voice.name + "' (" + voice.lang +")");
    var $option = $('<option value="'+ index +'">'+ voice.name +' (index: '+index+')</option>');
    if (voice.default) { $option.prop('default', true); }
    $('select').append($option);
  });
}
