var audio = null;
var playing = false;
var samples= {};
var panners = {};
var sources = {};

var autoPanValue = 0;
var autoPanIncrement = 0.1;
var autoPanTimer = null;
var autoPanSpeedMs = 200;

$(document).ready(function() {
    //Prevent normal iOS/Android touch gestures
  $('body').on('touchmove', function(e) {
    e.preventDefault();
  });

  // Set up audio and load samples
  samples = {
    bass:  'bass.mp3',
    drums: 'drums.mp3',
    hats:  'hats.mp3',
    pad:   'pad.mp3',
    piano: 'piano.mp3'
  }
  // Insert boxes to control each sample
  _.forIn(samples, function(url, name) {
    var html = '<div class="source" id="' + name + '">' + name + '</div>';
    $("#panArea").append(html);

  })

  audio = kattegatAudio.initialize();
  kattegatAudio.loadSet(samples);

  $(".source").hammer();

  // Listen for user interaction
  $("#startButton").on("pointerup", onStartClick);
  $("#stopButton").on("pointerup", onStopClick);
  $("#autoPanButton").on("pointerup", onAutopanClick);

  $(".source").on("pan", onSourceDrag);
  $(".source").on("doubletap", onSourceDoubletap);
 
  

  $("#stopButton").hide();
});

// Start/stop autopan
function onAutopanClick() {
  if (autoPanTimer !== null) {
    // We seem to have already started, so stop
    clearTimeout(autoPanTimer);
    autoPanTimer = null;
    return;
  }

  // Haven't started, so begin
  autoPanValue = -1;
  autoPanTimer = setTimeout(doAutoPan, autoPanSpeedMs);
}

// This function runs every autoPanSpeedMs (eg, every 200milliseconds)
// and each time it runs it calculates a new pan value and sets it
// to all sounds.
// It cycles back and forth -1 to 1.0
function doAutoPan() {
  if (autoPanTimer == null) return;
  autoPanValue += autoPanIncrement;
  if (autoPanValue >= 1.0) {
    // too high, flip sign of increment to start falling
    //  eg, from 0.1 to -0.1
    autoPanIncrement *= -1;
    autoPanValue = 1;
  } else if (autoPanValue <= -1) {
    // too low, flip sign of increment to start increasing
    //  eg, from -0.1 to 0.1
    autoPanIncrement *= -1;
    autoPanValue = -1;
  }
  _.forIn(samples, function(url, name) {
    // Set the X which corresponds to left/right panning
    setPan(name, autoPanValue, 0, 0);
  });

  autoPanTimer = setTimeout(doAutoPan, autoPanSpeedMs);
}

function onSourceDrag(e) {
  // Get position of pointer
  // (this is in absolute page coordinates)
  var pos = e.gesture.center;

  // Get relative position
  var relativePixelPos = $(e.target).convertToRelative(pos.x, pos.y);

  // Update box position, and move it so the cursor appears in the middle
  $(e.target).css({
    left: relativePixelPos.left - $(e.target).outerWidth()/2,
    top: relativePixelPos.top - $(e.target).outerHeight()/2
  })

  // Update pan values depending on position
  updatePan(e.target.id);
}

function onSourceDoubletap(e) {
  // Since we assigned a CSS class to show playing state,
  // we can sort of check playing status by checking for the class
  if ($(e.target).hasClass("playing")) {
    sources[e.target.id].stop(0);
    $(e.target).removeClass("playing");
  } else {
    setupAndPlayLoop(e.target.id);
  }
}

function onStartClick() {
   // Start all the samples
  _.forIn(samples, function(url, name) {
    setupAndPlayLoop(name);  
  });
}

function onStopClick() {
  playing = false;

  $("#startButton").show();
  $("#stopButton").hide();

  // Stop all the samples
  _.forIn(samples, function(value, name) {
    // Stop only if the sample is playing]
    if ($("#" + name).hasClass("playing")) {
      sources[name].stop(0);
      $("#" + name).removeClass("playing");
    }
 });
}

function updatePan(name) {
  if (_.isUndefined(name)) {
    _.forIn(samples, function(url, name) {
      updatePan(name);
    });
    return;
  }

  // We assume there is a HTML element with the same id as the sample
  var selector = "#" + name;
  var pos = $(selector).position();

  // Figure out pan settings based on position
  // This will calculate a range of 0.0 to 1.0
  var relativePos = {
    left: pos.left / $(selector).parent().outerWidth(),
    top: pos.top / $(selector).parent().outerHeight(),
  }

  // Now change it so we get a range of -1 to 1.0, with 0,0 being the middle
  relativePos = {
    left: relativePos.left*2 - 1.0,
    top: relativePos.top*2 - 1.0
  }

  // Make sure we're not going under -1 or over 1.0
  relativePos = {
    left: kattegat.rangeClip(relativePos.left, -1, 1.0),
    top: kattegat.rangeClip(relativePos.top, -1, 1.0)
  }
  setPan(name, relativePos.left, relativePos.top, 0);

}


function setPan(name, x, y, z) {
  if (_.isUndefined(panners[name])) return;

  panners[name].setPosition(x, y, z);
  $("#pan").text(name + " x: "+ x +", y: " + y + ", z: " + z);
}

// Plays a sample
//  Connects the sample source to a filter, and then to the speakers
function setupAndPlayLoop(name) {
  // Get audio source node for the loaded sample
  sources[name] = kattegatAudio.getSource(name);
  sources[name].loop = true;

  // Create a panner
  panners[name] = audio.createPanner();
  
  // Connect source to panner
  sources[name].connect(panners[name])

  // ...and connect panner to speakers
  panners[name].connect(audio.destination);

  // Start it immediately
  sources[name].start(0);
  
  playing = true;
  $("#startButton").hide();
  $("#stopButton").show();

  $("#" + name).addClass("playing");
}
