var max_work_size = 160;
var ctx,canvasWidth,canvasHeight;
var img_u8,work_canvas,work_ctx;

// Sample is a port of jsfeat's sample_bbf_face' demo
//  https://github.com/inspirit/jsfeat/blob/gh-pages/sample_bbf_face.html
$(document).ready(function() {
	// Prevent normal iOS/Android touch gestures
	$('body').on('touchmove', function(e) { e.preventDefault() });
  $("#previewButton").on("click", togglePreview);
  $("#stopButton").on("click", stopProcessing);
  $("#startButton").on("click", startProcessing);

  // Handle when the window unloads
  $(window).unload(onUnload);

  //console.log(kattegat.rangeScale(0.1, 0, 0.2, 0, 1.0));

  initVideo();
});

function togglePreview() {
  preview.hidden = !preview.hidden; 
  if (preview.hidden) {
    $("#canvas").hide();
  } else {
    $("#canvas").show();
  }

}

function stopProcessing() {
  video.pause();
  $("#stopButton").hide();
  $("#startButton").show();

}

function startProcessing() {
  video.play();
  $("#stopButton").show();
  $("#startButton").hide();
}

function initVideo() {
  // Initialise video
  c = kattegat.compatibility; // A little compatibility layer to simplify coding
  video = $("#video").get(0); // This gets the underlying HTML element rather than a jQuery wrapper

  // Try to get the user's webcam stream
  try {
    var attempts = 0;
    var readyListener = function(event) {
      findVideoSize();
    };
    var findVideoSize = function() {
      if (video.videoWidth > 0 && video.videoHeight > 0) {
        video.removeEventListener('loadeddata', readyListener);
        onDimensionsReady(video.videoWidth, video.videoHeight);
      } else {
          if (attempts < 10) {
            attempts++;
            setTimeout(findVideoSize, 200);
          } else {
            onDimensionsReady(640, 480);
          }
      }
    };
    var onDimensionsReady = function(width, height) {
      initCanvas(width, height);
      c.requestAnimationFrame(calculate);
    };
    video.addEventListener('loadeddata', readyListener);
    c.getUserMedia({video: true}, function(stream) {
      try {
        video.src = c.URL.createObjectURL(stream);
      } catch (error) {
        video.src = stream;
      }
      setTimeout(function() {
        video.play();
      }, 500);
    }, function (error) {
        kattegat.notifyError("Webcam not available on this platform");
        console.log(error);
    });
  } catch (error) {
    kattegat.notifyError("Webcam not available on this platform");
    console.log(error);
  }
}

// Sets up the canvas
function initCanvas(videoWidth, videoHeight) {
  canvasWidth  = canvas.width;
  canvasHeight = canvas.height;
  ctx = canvas.getContext('2d');
  ctx.fillStyle = "rgb(0,255,0)";
  ctx.strokeStyle = "rgb(0,255,0)";
  var scale = Math.min(max_work_size/videoWidth, max_work_size/videoHeight);
  var w = (videoWidth*scale)|0;
  var h = (videoHeight*scale)|0;
  img_u8 = new jsfeat.matrix_t(w, h, jsfeat.U8_t | jsfeat.C1_t);
  work_canvas = document.createElement('canvas');
  work_canvas.width = w;
  work_canvas.height = h;
  work_ctx = work_canvas.getContext('2d');
  jsfeat.bbf.prepare_cascade(jsfeat.bbf.face_cascade);
}

// Triggered when ever we start tracking a face
function onGotFace() {
  $("#tracking").addClass("active");
}

// Triggered when we can no longer track a face
function onLostFace() {
    $("#tracking").removeClass("active");
    
}

// Triggered when there is are face rectangle(s)
function onFaceRectangles(rects) {
  // Each rectangle contains:
  //  confidence, height, neighbors, width, x, y
  for(var i = 0; i < rects.length; ++i) {
    r = rects[i];
    
    // Calculate size of face relative to camera size
    var area = (r.width*r.height)/(video.width*video.height);
    
    // Area never seems to get beyond 0.0-0.07
    // Scale up to 0.0-1.0
    //area = kattegat.rangeScale(area, 0, 0.07, 0, 1.0);
    area = area / 0.007;
  
    // Do stuff with just the highest confidence face       
    if (i == 0) {
      // Show the face size (area)
      $("#faceArea").text(area.toFixed(2));
      // Map the face size to font size
      area = area * 200;
      $("#box").css("font-size", area+ "%");

      // Get current position of the box
      var offset = $("#box").offset();

      // Calculate how far we are from the middle
      // and get a relative measure
      var fromMiddle = (r.x + (r.width/2) - work_canvas.width/2) / work_canvas.width;
      
      // If we're pretty close to the middle, don't move
      // Math.abs gives us the 'absolute number', changing negative to postive
      if (Math.abs(fromMiddle) < 0.04) fromMiddle = 0; 
    
      // Move box to left/right based on how far face is
      // from the middle. Since it's a percentage, we apply that
      // to 50px (which will be the maximum distance at which the box will jump)
      // (To make it slower and smoother, reduce 50 to a smaller number)
      offset.left += fromMiddle*50;
      
      // Make sure we stay on the screen
      if (offset.left < 0) offset.left = 0;
      if (offset.left + r.width > window.innerWidth) {
          offset.left = window.innerWidth - r.width;
      }
      // Set the left property
      $("#box").css("left", offset.left + "px");
    }
    
    // ...we could do stuff with the other rects we get though!

    // Draw a rectangle to help our debugging
    ctx.strokeRect(r.x,r.y,r.width,r.height);  
  }
}

function onUnload() {
  video.pause();
  video.src = null;
}


// Does the work of processing video frames
// This is complicated stuff, the most interesting thing is that
// 'onFaceRectangles' is called when it has recognised some faces!
function calculate() {
  c.requestAnimationFrame(calculate); // Get function to be called again
  if (video.readyState == video.HAVE_ENOUGH_DATA) {
    ctx.drawImage(video, 0, 0, canvasWidth, canvasHeight);
    work_ctx.drawImage(video, 0, 0, work_canvas.width, work_canvas.height);
    var imageData = work_ctx.getImageData(0, 0, work_canvas.width, work_canvas.height);
    jsfeat.imgproc.grayscale(imageData.data, work_canvas.width, work_canvas.height, img_u8);
   
    // possible options
    //jsfeat.imgproc.equalize_histogram(img_u8, img_u8);
    var pyr = jsfeat.bbf.build_pyramid(img_u8, 24*2, 24*2, 4);
    var rects = jsfeat.bbf.detect(pyr, jsfeat.bbf.face_cascade);
    rects = jsfeat.bbf.group_rectangles(rects, 1);
   
    // draw only most confident one
    drawFaces(ctx, rects, canvasWidth/img_u8.cols, 1);

    // Sort in order of confidence
    jsfeat.math.qsort(rects, 0, rects.length-1, function(a,b){return (b.confidence<a.confidence);})
    if (rects.length == 0) {
      // No faces
      if (tracking) {
        tracking = false;
        setTimeout(onLostFace, 200);
      }
    } else if (!tracking) {
      tracking = true;
      setTimeout(onGotFace, 200);
    }
    onFaceRectangles(rects);
  }
}

function drawFaces(ctx, rects, sc, max) {
    var on = rects.length;
    if (on && max) {
      jsfeat.math.qsort(rects, 0, on-1, function(a,b){return (b.confidence<a.confidence);})
    }
    var n = max || on;
    n = Math.min(n, on);
    var r;
    for (var i = 0; i < n; ++i) {
      r = rects[i];
      ctx.strokeRect((r.x*sc)|0,(r.y*sc)|0,(r.width*sc)|0,(r.height*sc)|0);
    }
}
