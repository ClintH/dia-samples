var audio = null;
var loopSource;
var loopFilter;
var playing = false;

$(document).ready(function() {
  // Listen for user interaction
  $("#startButton").on("click", onStartClick);
  $("#stopButton").on("click", onStopClick);

  // Set up audio and load samples
  audio = kattegatAudio.initialize();
  kattegatAudio.load('loop', 'loop0.mp3');

  $("#stopButton").hide();
});

function onStartClick() {
  playing = true;
  $("#startButton").hide();
  $("#stopButton").show();
  setupAndPlayLoop();

  // Start listening for pointer moves
  $("#pad").on("pointermove", onPointermove);

}

function onStopClick() {
  playing = false;
  // Stop listening for pointer moves
  $("#pad").off("pointermove", onPointermove);

  $("#startButton").show();
  $("#stopButton").hide();
  loopSource.stop(0);  
}

// Plays a sample
//  Connects the sample source to a filter, and then to the speakers
function setupAndPlayLoop() {
  // Get audio source node for the loaded sample
  loopSource = kattegatAudio.getSource('loop');
  loopSource.loop = true;

  // Create a a filter
  loopFilter = audio.createBiquadFilter();
  loopFilter.type = 0; // Low-pass. Read more: https://developer.mozilla.org/en-US/docs/Web/API/BiquadFilterNode
  loopFilter.frequency.value = 5000;
  
  // Connect source to filter
  loopSource.connect(loopFilter)

  // ...and connect filter to speakers
  loopFilter.connect(audio.destination);

  // Start it immediately
  loopSource.start(0);
  
  playing = true;
  $("#startButton").hide();
}

function onPointermove(e) {
  var e = e.originalEvent;
  
  // Get a relative X/Y position according to the
  // pointer position and the size of the box.
  var relativeX = e.x / $(e.target).outerWidth();
  var relativeY = e.y / $(e.target).outerHeight();

  // Make sure we're between 0 and 1.0 (100%)
  relativeX = Math.max(relativeX, 0);
  relativeY = Math.max(relativeY, 0);
  relativeX = Math.min(relativeX, 1.0);
  relativeY = Math.min(relativeY, 1.0);

  // This is the range we want to filter by
  var minFreq = 40;
  var maxFreq = 1800;

  // Use the x% to get between min and maxFreq
  loopFilter.frequency.value = (relativeX * (maxFreq - minFreq)) + minFreq;

  // Use the y% to set the Q (0.0001 - 10000)
  loopFilter.Q.value = relativeY * 100; // Using a max of 100 because 1000 is nuts
 
  // Show the numbers on the page for debugging  
  $("#filter").text(Math.round(loopFilter.frequency.value)); 
  $("#q").text(Math.round(loopFilter.Q.value));

}