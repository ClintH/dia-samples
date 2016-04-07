# square demo

The scenario of this sample is a drawing program which allows a user to paint with squares. The catch is it is done using a command interface, where the user tells the system what kind of a square he or she wants, rather than making the square directly on the screen.

A command interface is slow-paced input-response-input-response sort of cycle, the kind seen when running command-line programs, or using voice-activated systems such as Apple's Siri. There is a lack of direct manipulation, the user _commands_ rather than _controls_. Commands are typically declarative: "this is what I want", rather than the user working directly _through_ the system.

The user writes a line of text, which needs to be interpreted by the program and a square made a result. The design of this command-based interaction is left as an exercise. All it can do now is recognise the word "square" (and draw the same square over and over again), or "random", in which it adds an image at a random location. Obviously neither commands are particularly satisfying for a user.

Some interaction design challenges:
* What does the system need to know from the user about what to draw?
* How might you design more expressive interaction using the command paradigm? Eg, giving the user more fine-grained control over square properties
* Could sensible defaults be used to speed interaction?
* Can you change the interaction so it's more of a dialog (eg command-question-command-question-command-question-result) rather than just command-result?
* How can we communicate to the user what options, syntax etc are available? (i.e. supporting discoverability)
* How can the design of interaction support learnability?
* How can the user repair mistakes, or be notified of errors?
* How can learned language skills be leveraged? Should the commands be English-like, for example, or be more esoteric yet powerful? What might be gained or lost? What other technological languages do we learn as humans in the modern world, and when and why do we bother? 
* Should the system take a stance as to the aesthetic of the resulting 'picture'? If so, could the interaction be tailored for this? Eg to draw 8-bit style pictures, or more impressionistic pictures

* How could it be changed to support a direct interaction paradigm? Eg, rather than telling the system where to put the square, how about being able to place it there? Eg, using keys to push and pull into place, or using mouse events
* How expressive can you make the key interaction in this case?
* Can the physicality of pressing and holding keys in a keyboard be exploited, or their spatial arrangement? Try seeing the keyboard not as a keyboard.

## Introduced to
This sample introduces you to:
* Event handling [more](http://learn.jquery.com/events/)
* DOM insertion [more](http://api.jquery.com/appendTo/)
* CSS manipulation [more](http://api.jquery.com/css/) (and also transitions via [Transit](http://ricostacruz.com/jquery.transit/))
* String processing [more](http://www.codecademy.com/glossary/javascript#strings)
* Random number generation [more](http://www.codecademy.com/glossary/javascript#math)
* Associating data with DOM elements [more](http://api.jquery.com/jquery.data/)
* Iterating through arrays [more](http://www.codecademy.com/glossary/javascript#arrays_accessing-array-elements)

# See also
* The 'square-decouple' takes this basic sample and allows you to operate it between different devices
