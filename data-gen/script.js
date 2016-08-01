var socket = null;
var timeSeries = new TimeSeries();
var computeTimer = null;
var computeSpeedMs = 1000;
var computeDepth = 5;
var computeRandomness = 0;
var trendShort, trendLong;
var tick = 0;

$(document).ready(function() {
	// Set up chart
	var chart = new SmoothieChart({
		grid: {
			fillStyle: '#F3F3F3',
			strokeStyle: 'rgba(0,0,0,0.1)',
			borderVisible: false
		},
		labels: {
			fillStyle: 'rgba(0,0,0,0.5)'
		}});
	chart.addTimeSeries(timeSeries, { 
		strokeStyle: '#FF0080', 
		lineWidth: 4
	});
	chart.streamTo($("#chart").get(0), 500);

	$("#btnRun").on("click", function() {
		if (computeTimer == null) startComputing();
		else stopComputing();
	})

	$("#configRate").on("change", onConfigRateChange);
	$("#configDepth").on("change", onConfigDepthChange);
	$("#configRandomness").on("change", onConfigRandomnessChange);
	
	// Update initial UI to reflect default values
	$("#configRate").val(computeSpeedMs);
	$("#configDepth").val(computeDepth);
	$("#configRandomness").val(computeRandomness);

	// Connect realtime stuff up
	socket = io.connect('/');

	// Start!
	trendShort = new Smoother(10);
	trendLong = new Smoother(100);
	startComputing();
})


function computeValue() {
	tick += computeDepth;
	var timeStamp = new Date().getTime();
	var millis = new Date().getMilliseconds();
	var v = Math.sin(tick/(2*Math.PI)); //(1000.0/millis));
	
	// Scale from -1.0/1.0 to 0/100
	v = (v + 1.0) * 50;
	
	if (computeRandomness > 0) {
		var r = (computeRandomness/100.0*Math.abs(v))*Math.random();
		if (millis % 2 == 0)
			v = v - r;
		else
			v = v + r;
	}

	if (v < 0) v= 0;
	if (v > 100) v = 100;
	trendShort.push(v);
	trendLong.push(v);
	timeSeries.append(timeStamp, v);
	$("#lastValue").text(Math.floor(v));
	if (tick >= 360) tick = 0;

	var packet = {
		value: v,
		gradientShort: trendShort.getGradient(),
		gradientLong: trendLong.getGradient,
		avgShort: trendShort.get(),
		avgLong: trendLong.get(),
		room: "tessel"
	}
	$("#trendShort").text(Math.floor(packet.gradientShort));
	$("#trendLong").text(Math.floor(packet.avgLong));
	socket.emit("say", packet);
	computeTimer = setTimeout(computeValue, computeSpeedMs);

}

function onConfigDepthChange(e) {
	computeDepth = parseFloat($(e.target).val());
	$("#configDepthDisplay").text(computeDepth);
}

function onConfigRandomnessChange(e) {
	computeRandomness = parseFloat($(e.target).val());
	$("#configRandomnessDisplay").text(computeRandomness);
}

function onConfigRateChange(e) {
	computeSpeedMs = parseFloat($(e.target).val());
	$("#configRateDisplay").text(computeSpeedMs + " ms");
}


function startComputing() {
	computeTimer = setTimeout(computeValue, computeSpeedMs);
	$("#btnRun").text("Stop");
}

function stopComputing() {
	clearTimeout(computeTimer);
	computeTimer = null;
	$("#btnRun").text("Start");
}
