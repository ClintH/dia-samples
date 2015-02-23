// Generated on 2015-02-02
// This code runs when the sketch is loaded
// (NOTE: by default, sketch reloading happens automatically when you edit the source files)
console.log("Loaded the template script!");


$(document).ready(function() {
	// Stuff here runs when the sketch is ready for action.
	// This is when we wire-up events, like the following.
	
	// Here, we wire up the 'click' event for the selector
	// #clickMe (which corresponds to an element with id 'clickMe')
	// to a function named 'clickHandler' (which we define later)
	$("#clickMe").on("click", clickHandler);

	// p.s. all these statements beginning with $ is jQuery
	// Learn more: http://www.codecademy.com/tracks/jquery
})

// This is a function we've called 'clickHandler'
//
// It won't run unless it gets called. In this case
// it gets called by the event handling (above)
function clickHandler() {
	alert("Yep, you clicked the button in template!");		
}