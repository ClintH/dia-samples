# pointer-drag

Demo that shows how to hook onto the `pointermove` event to display coordinates, move and on-screen element, and to detect intersections with other elements.

Kattegat provides some useful functions for checking whether things overlap. They work by comparing the coordinates and sizes of elements within the page. If you are curious as to how they are implemented, go to directory you installed Kattegat, and then bower_components/kattegat-client/jq-helpers.js

## findIntersecting

Returns all the elements (which match a selector) which intersect with an element described by another selector. In the following case, we find any element with a class of "targetBox" which intersects with an element with id "dragBox":

    ````
    var intersecting = $(".targetBox").findIntersecting("#dragBox");
    ````

`intersecting` might then be zero or more elements. The nice thing about jQuery is you can work with them as a collection, eg changing *all* of background colour at the same time:

    ````
    intersecting.css({"background-color": "red"});
    ````

If you want to work with each intersecting element, you can use a for loop to iterate over each element in the collection.

    ````
    for (var i=0; i<intersecting.length; i++) {
        var element = intersecting[i];
        $(element).text("Hit #" + (i+1));
    }
    ````

# intersects

If you just want to check whether something intersects or not, there is a simple form:

    ````
    var isIntersecting = $('.targetBox').intersects('#dragBox');
    ````

In this case, `intersects` will return `true` if any element with class "targetBox" intersects with an element having id "dragBox". It will return `false` if none of these elements intersect.