// Config
var paddleHeight = 200;
var paddleOffset = 50;
var ballSize = 30;
var maxSpeed = 30;

// State
var ourId = null;
var teams = {};
var winHeight = 0;
var winWidth = 0;
var winMid = 0;
var running = false;
var ball = {
	vectorX: 0,
	vectorY: 0,
	posX: 0,
	posY: 0,
};

$(document).ready(function() {
	socket = io.connect('/');
	socket.on("say", onSay);
	socket.on("hello", onHello);
	resetGame();
	resetBall();
	onResize();
	$(window).on("resize", onResize);
	$(window).on("keyup", onKeyUp);

	// Set up elements to match game config
	$(".paddle").css({
		height: 
		paddleHeight
	});
	$("#ball").css({
		width: ballSize,
		height: ballSize,
		"border-radius": ballSize
	})
	$("#pong-1Stats .name").text(teams["pong-1"].name);
	$("#pong-2Stats .name").text(teams["pong-2"].name);

	// Start game loop
	window.requestAnimationFrame(tick);
});

function resetBall() {
	running = false;
	ball = {
		posX: window.innerWidth / 2.0,
		posY: window.innerHeight / 2.0,
		vectorY: Math.random() - 0.5,
		vectorX: Math.random() - 0.5
	}
	$("#ball").css({
		left: ball.posX,
		top: ball.posY
	})
}
function resetGame() {
	teams["pong-1"] = { x:0.5, score: 0, name: "Llamas"};
	teams["pong-2"] = { x:0.5, score: 0, name: "Ferrets"};
	resetBall();
	updateScore(0,0);
}

function updateScore(team1, team2) {
	teams["pong-1"].score += team1;
	teams["pong-2"].score += team2;
	$("#pong-1Stats .score").text(teams["pong-1"].score);
	$("#pong-2Stats .score").text(teams["pong-2"].score);
}

function onKeyUp(e) {
	e.preventDefault(); 
	running = true;
}

function onResize() {
	winMid = (window.innerHeight/2.0) - (paddleHeight/2.0);
	winHeight = window.innerHeight;
	winWidth = window.innerWidth;

	$("#pong-2Paddle").css({
		left: window.innerWidth - paddleOffset
	});
	$("#pong-1Paddle").css({
		left: paddleOffset
	});
}
function onHello(data) {
	// Keep track of our own id
	ourId = data.id;
	socket.emit("join", {room:"pong-1"});
	socket.emit("join", {room:"pong-2"});
	socket.emit("join", {room:"pong-orientation"});
}

function onDeviceOrientation(e) {
  var motion = e.originalEvent;
  var rotation = {
    alpha: motion.alpha,
    beta: motion.beta,
    gamma: motion.gamma
  };

  // Transmit orientation data
  socket.emit('say', {
  		room: "pong-orientation",
  		team: room,
 		rotation: rotation
  });
}

function onSay(e) {
	if (e.vector) {
		// Scale vector
		var v =  e.vector / 10.0;
		var newX = teams[e.team].x + v;
		if (newX > 1.0) newX = 1.0;
		else if (newX < -1.0) newX = -1.0;
		teams[e.team].x = newX;
	}
}

function jitter(input, amt) {
	var j = Math.random() * amt;
	return input + (j/2.0);
}

function recalcBall() {
	// Move ball
	var x = ball.posX +(maxSpeed*ball.vectorX);
	var y = ball.posY + (maxSpeed*ball.vectorY);
	var hit = false;

	// Calculate for screen edges
	if (x < 0) {
		// Left edge
		updateScore(0,1);
		resetBall();
		return;
	} else if (x + ballSize >= winWidth) {
		// Right edge
		updateScore(1,0);
		resetBall();
		return;
	} else if (y < 0) {
		// Top edge
		ball.vectorY *= -1.0;
		y = 0;
	} else if (y + ballSize >= winHeight) {
		// Bottom
		ball.vectorY *= -1.0;
		y = winHeight - ballSize;
	}

	// Calculate for paddles
	if ($("#ball").intersects("#pong-1Paddle")) {
		ball.vectorX *= -1.0;
		x = ball.posX + ballSize;
		ball.vectorY = jitter(ball.vectorY, 0.2);
	} else if ($("#ball").intersects("#pong-2Paddle")) {
		ball.vectorX *=-1.0;
		x = ball.posX - ballSize;
		ball.vectorY = jitter(ball.vectorY, 0.2);
	}

	// Make sure we're sane
	ball.vectorX = Math.max(-1.0, ball.vectorX);
	ball.vectorX = Math.min(1.0, ball.vectorX);
	ball.vectorY = Math.max(-1.0, ball.vectorY);
	ball.vectorY = Math.min(1.0, ball.vectorY);

	$("#ball").css({
		left: x,
		top: y
	})
	ball.posX = x;
	ball.posY = y;
}
function tick() {
	var top = (winMid * teams["pong-1"].x) + winMid;
	$("#pong-1Paddle").css({
		top: top
	});
	top = (winMid * teams["pong-2"].x) + winMid;
	$("#pong-2Paddle").css({
		top: top
	});

	// Only calculate new ball position if we are
	// in the 'running' state
	if (running)
		recalcBall();

	// Keep loop running
	window.requestAnimationFrame(tick);
}



function chooseTeam(team) {
	$("#chooseTeam").hide();
	$("#joining").fadeIn();
	
	room = "pong-" + team;

	// Joins room "pong-1" or "pong-2" depending on button click
	socket.emit("join", {room:room});
}
