# Noodl demos

The sketch demonstrates sending and receiving values to a Noodl project.

The values typed in by the user are packaged up into an object which is sent via web socket connect as usual. We convert typed colour values to the hexadecimal format expected by Noodl.

On the Noodl side, load `noodl-project`. You'll see the id the Noodl's connection receives from Kattegat. The circle changes size and colour according to what is typed in to the Kattegat sketch. The text just shows up as a label.

Touching and dragging the surface of the Noodl project (or click and drag with a mouse) sends x,y coordinates to the Kattegat sketch, which are just shown as text.

Together, the Kattegat and Noodl sketches demonstrate the basic principles needed to communicate back and forth.

There is also `noodl-project-data-gen`, a separate Noodl project which works with the existing `data-gen` sample.

## Read more

* [Noodl Javascript node](http://www.getnoodl.com/docs/javascript/)