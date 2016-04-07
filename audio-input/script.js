var audio = null;
var analyzer = null;
var g = null;
var fftValue = 512;

// Increase this to smooth even more, at the cost of responsiveness
var smoothSamples = 50;

// Keep track of high/low volume
var overallHigh = 0;
var overallLow = 0;
var overallSmoother;

var rangeHigh =0;
var rangeLow = 0;
var rangeSmoother;

var rangeStart = 0;
var rangeEnd = 256;

// Bits borrowed from:
//  http://www.smartjava.org/content/exploring-html5-web-audio-visualizing-sound

$(document).ready(function() {
  // Listen for user interaction
  $("#listenButton").on("click", onListenClick);
  $("#overall button[name='resetButton']").on("click", onOverallResetClick);
  $("#range button[name='resetButton']").on("click", onRangeResetClick);
  $("#range button[name='setRange']").on("click", onSetRangeClick);

  // Reset high/low to defaults
  onOverallResetClick();
  onRangeResetClick();

  // Set up audio
  // Take a look at /bower_components/kattegat-client/audio.js to see more
  audio = kattegatAudio.initialize();

  // Get a canvas context
  g = $("canvas").get(0).getContext("2d");
    
});


// Sets the range values typed into the two text boxes
function onSetRangeClick() {
  var newStart = parseInt($("#rangeStart").val());
  var newEnd = parseInt($("#rangeEnd").val());

  // Make sure user-provided numbers aren't too crazy
  if (newStart < 0) newStart = 0;
  if (newEnd < newEnd) newEnd = newStart + 1;
  if (newEnd > (fftValue/2)) newEnd = fftValue/2;

  // Assign
  rangeStart = newStart;
  rangeEnd = newEnd;

  // Reset and notify
  onRangeResetClick();
  kattegat.notify("Set new range to " + rangeStart +"-" +rangeEnd);
}

// Reset the range high/low/smoother
function onRangeResetClick() {
  rangeHigh = 0;
  rangeLow = 99999;
  rangeSmoother = new Smoother(smoothSamples); 
}

// Resets the overall high/low/smoother
function onOverallResetClick() {
  overallHigh = 0;
  overallLow = 99999;
  overallSmoother = new Smoother(smoothSamples); 
}

// User clicked the 'listen' button
function onListenClick(e) {
  $(e.target).attr("disabled", "disabled");

  navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia;
  navigator.getUserMedia({audio:true}, onStream, function(e) {
    // Failure
    console.log(e);
    kattegat.notifyError(e);
  });
}

// Called via onListenClick, when user has
// allowed our code to access the microphone
function onStream(s) {
  s = audio.createMediaStreamSource(s);

  analyzer = audio.createAnalyser();
  analyzer.smoothingTimeConstant = 0.3;
  analyzer.fftSize = fftValue;

  // Sets up the callback when there is data
  var jsNode = audio.createScriptProcessor(2048, 1, 1);
  
  // This runs every 2048 samples
  jsNode.onaudioprocess = onProcessData;

  // Wire up nodes
  jsNode.connect(audio.destination);
  analyzer.connect(jsNode);
  s.connect(analyzer);
}


// This is called everytime a new batch of
// data is available. (it's wired up in onStream)
function onProcessData() {
  // Grab data
  var array = new Uint8Array(analyzer.frequencyBinCount); // frequencyBinCount turns out to be fftSize/2
  analyzer.getByteFrequencyData(array);
  
  // Calculate volume across all frequency bins
  var average = Math.round(getAverage(array));
  overallSmoother.push(average);

  // Do something with calculated overall volume
  handleOverallAverage(average);

  // Draw pretty lines, highlighting the range
  drawRangeGraph(array, rangeStart, rangeEnd);

  // Calculate average over range
  var rangeAverage = Math.round(getRangeAverage(array, rangeStart, rangeEnd));
  rangeSmoother.push(rangeAverage);

  // Do something with the calculated value
  handleRangeAverage(rangeAverage);
}


// Updates the text labels to show calculated range values
function handleRangeAverage(average) {
  // At this point we could also do something if the volume
  // is higher or lower than a certain threshold
  
  // console.log(average);
  // if (average > 10) {
  //   kattegat.notify("Hit some threshold!");
  // }
  displayRangeAverage(average);

}

// ---- All the code below here relates to updating labels
//      and drawing the graph. It can be removed
// Draw all the data without highlighting
function drawSimpleGraph(array) {
  drawRangeGraph(array,999,999);
}

// Draws the data, highlighting a set
function drawRangeGraph(array, start, stop) {
  // Clear background (with nasty hard-coded sizes)
  g.clearRect(0,0,512,200);

  // Draw each frequency bin
  for (var i = 0; i < (array.length); i++) {
    var value = array[i];
    if (i >= start && i<stop) g.fillStyle = "rgb(200,0,0)";
    else g.fillStyle = "rgb(200,200,200)";
    g.fillRect(i*1,200-value,1,200);
  }
}

function displayRangeAverage(average) {
  if (average > rangeHigh) {
    rangeHigh = average;
    $("#range .rangeHigh").text(rangeHigh);
  }
  if (average < rangeLow && average >0) {
    rangeLow = average;
    $("#range .rangeLow").text(rangeLow);
  }
  $("#range .rangeSmoothed").text(Math.round(rangeSmoother.get()));  
  
  $("#range .liveValue").text(average);  
}

// Updates the text labels to show calculated overall values
function handleOverallAverage(average) {
  // At this point we could also do something if the volume
  // is higher or lower than a certain threshold
  if (average > overallHigh) {
    overallHigh = average;
    $("#overall .rangeHigh").text(overallHigh);
  }
  if (average < overallLow && average >0) {
    overallLow = average;
    $("#overall .rangeLow").text(overallLow);
  }
  $("#overall .rangeSmoothed").text(Math.round(overallSmoother.get()));  
  $("#overall .liveValue").text(average);  
}

// Calculates the average across the entire array
function getAverage(array) {
  return getRangeAverage(array, 0, array.length);
}

// Calculates the average across a range
function getRangeAverage(array, start, stop) {
  var values = 0;
  var average;

  // Add up total across all frequency bins
  for (var i=start; i<stop; i++) {
    values += array[i];
  }

  // Calculate average
  average = values/(stop-start);
  return average;
}