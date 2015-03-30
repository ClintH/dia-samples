// Initialise a few variables
var socket = null;

// How many samples to average data over
// Make this smaller or larger if you want to be more or less responsive
var sampleSize = 100;

var options = null;
var data = [];
var timeSeries = [
  new TimeSeries(),
  new TimeSeries(),
  new TimeSeries()
];
var selectedData = "";
var selectedProcessing = "raw";

// When the browser is ready
$(document).ready(function() {
  setupChart();

  // Select default data source and initialise smoothers
  changeDataSource('acceleration');
  
  // Connect realtime stuff up
  socket = io.connect('/');
  socket.on('say', onSay);

  $('.mobile').hide();
  $('.notMobile').hide();

  if (kattegat.device.mobile()) {
    $('.mobile').show();
  } else {
    $('.notMobile').show();
  }

  // Device supports 'devicemotion' event
  if (kattegat.device.mobile() && window.DeviceMotionEvent) {
    $(window).on('devicemotion', onDeviceMotion);
  }

  // If the user selects a different data source
  $('#whichData').on('change', function(e) {
    changeDataSource($(this).val());
  });

  $("#whichProcessing").on('change', function(e) {
    selectedProcessing = $(this).val();
    changeDataSource(selectedData);    
  })
});

function changeDataSource(sel) {
  selectedData = sel;
  
  // Set up an array of three data smoothers (x,y,z or alpha,beta,gamma)
  data = [
    new Smoother(sampleSize),
    new Smoother(sampleSize),
    new Smoother(sampleSize)
  ];

  if (sel == "rotationRate") {
    $("#data0 h3").text("alpha");
    $("#data1 h3").text("beta");
    $("#data2 h3").text("gamma");  
  } else {
    $("#data0 h3").text("x");
    $("#data1 h3").text("y");
    $("#data2 h3").text("z");
  }
  for (var i = timeSeries.length - 1; i >= 0; i--) {
    timeSeries[i].clear();
  };
}

// Collect data and send it to the server
function onDeviceMotion(e) {
  var motion = e.originalEvent;
  
  // Extract properties from the event we are interested in
  var acceleration = {
    x: motion.acceleration.x,
    y: motion.acceleration.y,
    z: motion.acceleration.z
  };
  
  var accelerationIncludingGravity = {
    x: motion.accelerationIncludingGravity.x,
    y: motion.accelerationIncludingGravity.y,
    z: motion.accelerationIncludingGravity.z
  };

  var rotationRate = {
    alpha: motion.rotationRate.alpha,
    beta: motion.rotationRate.beta,
    gamma: motion.rotationRate.gamma
  };

  // Send it all off
  socket.emit('say', {
    acceleration: acceleration,
    accelerationIncludingGravity: accelerationIncludingGravity,
    rotationRate: rotationRate
  });
}

// Do something with the data comming in from a device (phone, tablet etc.)
function onSay(motion) {
  var d = motion[selectedData];
  $("#loadPrompt").hide();

  // Keep track of the data
  var timeStamp = new Date().getTime();

  for (var i = _.keys(d).length - 1; i >= 0; i--) {
    var dataKey = _.keys(d)[i];
    var smoother = data[i];
    smoother.push(d[dataKey]);

    var sel = $("#data" + i);
    
    // Update data display
    $("span", sel).html(
      d[dataKey].toFixed(3) + '<br>' +
      'high: ' + smoother.getHigh().toFixed(3) + '<br>' +
      'low: ' + smoother.getLow().toFixed(3) + '<br>' +
      'smoothed: ' + smoother.get().toFixed(3)+ '<br>' +
      'gradient:'  +smoother.getGradient().toFixed(3)
    );

    // Add data to time series shown by chart
    if (selectedProcessing == "raw") {
      timeSeries[i].append(timeStamp, d[dataKey]);
    } else if (selectedProcessing = "smoothed") {
      timeSeries[i].append(timeStamp, smoother.get());
    } else if (selectedProcessing == "gradient") {
      timeSeries[i].append(timeStamp, smoother.getGradient());
    }
  };
}

function setupChart() {
  var chart = new SmoothieChart({
    grid: {
      fillStyle: '#F3F3F3',
      strokeStyle: 'rgba(0,0,0,0.1)',
      borderVisible: false
    },
    labels: {
      fillStyle: 'rgba(0,0,0,0.5)'
  }});
  var width = 2;
  chart.addTimeSeries(timeSeries[0], { 
    strokeStyle: 'red', 
    lineWidth: width
  });
  chart.addTimeSeries(timeSeries[1], { 
    strokeStyle: 'blue', 
    lineWidth: width
  });
  chart.addTimeSeries(timeSeries[2], { 
    strokeStyle: 'green', 
    lineWidth: width
  });
  
  chart.streamTo($("#chart").get(0), 500);
}