var room = null;
var ourId = null;
var teamSize = 0;

$(document).ready(function() {
	socket = io.connect('/');
	socket.on("say", onSay);
	socket.on("join", onJoin);
	socket.on("list", onList);
	socket.on("hello", onHello);

	$("#btnTeam1").on("click", function() {
		chooseTeam(1);
	})
	$("#btnTeam2").on("click", function() {
		chooseTeam(2);
	})
	
	$(document).on("keyup", onKeyUp);
	//chooseTeam(1);
})

function onKeyUp(e) {
	if (e.which == 37) {
		//Left
		setVector(-0.5)
	} else if (e.which == 39) {
		// Right
		setVector(0.5);
	} else {
		setVector(0.0);
	}
}

function onHello(data) {
	// Keep track of our own id
	ourId = data.id;
}

function setVector(vector) {
	// Scale vector according to size of team

	// Team size of 1 means we'll contribute 100% of the movement
	// Team size of 10 means we'll contribute 10% of the movement, etc
	if (vector != 0.0) {
		vector = vector / teamSize;
	}
	$("#vector").text(Math.floor(vector*100));

	// Transmit orientation data
	socket.emit('say', {
			room: "pong-orientation",
			team: room,
			vector: vector
	});
}

function onDeviceOrientation(e) {
	// Since this event fires at a high rate,
	// only process every so often
	//if (Date.now() % 3 !== 0) return;

  var motion = e.originalEvent;
  var rotation = {
    alpha: motion.alpha,
    beta: motion.beta,
    gamma: motion.gamma
  };

  var vector = 0;
  if (motion.gamma < -10) {
	// Is it toward the left?
	vector = Math.max(-1.0, motion.gamma / 90);
  } else if (motion.gamma > 10) {
  	// Right?
  	vector = Math.min(1.0, motion.gamma / 90);
  } else {
  	vector = 0.0;
  }
  
  setVector(vector);
}

function onList(data) {
	// Keep track of how many players on our team
	// so we can scale the movement accordingly
	// (meaning that lots of players need to work together)
	teamSize = data.length;
	$("#teamSize").text(teamSize);
}

function onSay(e) {
	console.dir(e);
}

function onJoin(data) {
	console.log("Joined: " + JSON.stringify(data));
	if (data.id == ourId) {
		// We've joined the team
		$("#joining").fadeOut(function() {
			$("#controller").fadeIn();
		});

  		$(window).on('deviceorientation', onDeviceOrientation);

	} else {
		// Someone else has joined our team
	}
	
	// Request size of team from server
	socket.emit("list", data);
}

function chooseTeam(team) {
	$("#chooseTeam").hide();
	$("#joining").fadeIn();
	if (team == 1)
		$("body").css("background-color", "#e21c7a");
	else
		$("body").css("background-color", "#3375c8");

	room = "pong-" + team;

	// Joins room "pong-1" or "pong-2" depending on button click
	socket.emit("join", {room:room});
}
