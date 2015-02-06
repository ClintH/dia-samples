# pointer playground

This demo lets you get a bit of a feel for the different pointer events and when they get fired.

Like all playground demos, the intent is for you to get a feel for how the technology works. For your own sketching, it is much better to base your work on one of the other provided demos.

The kinds of pointer events you'll see (and which you can listen for in your own code) are:
- pointerdown
- pointerup
- pointermove
- pointerover
- pointerout
- pointerenter
- pointerleave

The general form is:

    ````js
    $("SELECTOR").on("NAME OF EVENT", function(e) {
      // Do stuff in here, use e for reading out event-data
    });
    ````

For example:

    ````js
    $("div").on("pointerdown", function(e) {
      // This will run whenever a 'pointerdown' happens inside any
      // <div> element on the page
    });
    ````

# More

A few useful notes on the events.  `e.type` tells you what kind of input device was used, eg mouse or touch. If you want to work with multitouch, `e.originalEvent.pointerId` will give each touch its own unique id, so you can track the movement of fingers. `e.originalEvent.button` will be a code the which button is pressed - mostly this will be 0, but if you can also detect secondary clicks (aka "right-clicks")

Another thing to keep in mind is that there are various coordinate systems. Sometimes you care where the pointer is in regard to another element, its containing element, the browser window, or the physical screen. You might need to take a closer look at the data given in the event to see what makes sense.

# Things to try

* If you put your cursor at the very top-left corner, the coordinate won't be 0, 0, but something like 24, 24. How can you get a coordinate relative to the section element?




