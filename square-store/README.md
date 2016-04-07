# square-store demo

The demo builds on square-decouple, and shows you how to store data in the browser's cache and on the server.

It uses HTML's [localStorage](http://coding.smashingmagazine.com/2010/10/11/local-storage-and-how-to-use-it/) and [the storage features of Kattegat](https://github.com/ClintH/kattegat/blob/master/DOCS.md#storage). 

In this set up, the canvas saves the accumulated set of squares on the server - and attempts to load them up from the server when it first starts. The canvas automatically saves squares to the server, but only when it has something new to save. The system assumes there is only a single canvas instance saving stuff -- because it uses a fixed key for which object to get/set from server. Try rebooting the server and refreshing the input and canvas pages - the canvas should reappear as it was.

The input script extends the grammar of the parser, allowing you to set a colour, which is remembered via localStorage.  Try setting a colour and then refreshing your browser to see that it sticks around.

Note: In this contrived example, it's technically possible for the input page to write to the database itself, but in a normal situation, let's presume that only the canvas page is able to write to the server and track the canvas.

## Dig deeper
* How can the controller (input.js) be extended to allow the user to place squares at particular locations?
* How could the system be extended so that multiple canvas's could save to the database without overwriting each other?
* How would it be to save each square individually, rather than within a single object?
* Can you implement filtering of squares based on an attribute? For example, to delete all green squares, or all squares with an area less than 100px.

## Introduced to
* For more, see the supplied demos.
* Adding to arrays, getting their length
* Using jQuery to access a web service, fetching and putting data [more](http://learn.jquery.com/ajax/jquery-ajax-methods/)
* localStorage [more](https://developer.apple.com/library/safari/documentation/iphone/conceptual/safarijsdatabaseguide/Name-ValueStorage/Name-ValueStorage.html)
* isUndefined method from lodash [more](http://lodash.com/)
* setTimout to run a function periodically [more](https://developer.mozilla.org/en/docs/Web/API/window.setTimeout)