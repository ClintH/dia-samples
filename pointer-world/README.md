# pointer-world

Shows how to send and receive pointer events across different clients. In this set up, `pointermove` events are sent to all other clients, so you can see the combined touches/moves.

It also shows a few other useful techniques.

One is how the page automatically deletes old circles after a period of inactivity. Whenever you are inserting stuff into the DOM like in this example, it's a good idea to think about how you're going to clean up after yourself. The DOM is not meant for tracking thousands of objects. (As an aside, a more efficient way of implementing this sample is using the HTML canvas, but that's another story). We use jQuery's `.each` method to iterate over every matching element in a page. `setInterval` is used to continuously run a function every two seconds.

Another useful trick is creating a relative coordinate sysem based on the size of the window/device rather than the absolute cursor x/y position. This is way we can normalise over difference in screen size and all users are on the 'same page' so to speak.

# Things to try
* At the moment only 'pointermove' events are sent and handled. Can you make a small change to respond to 'pointerup' as well?
* Can you implement "hit testing" so that if two cursors overlap something happens?
* The pointer removal code could be smarter. Eg, for touch, we could use pointerup/down or pointerenter/leave to help us to determine when pointers should be removed 