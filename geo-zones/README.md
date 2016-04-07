# geo-zones demo

This demo builds on earlier examples, and considers a common scenario: detecting whether a user/device is within a certain zone. This can enable all sorts of location-based experiences. In the demo we use a very simple notion of a zone: a circular area which is defined by a lat/lon and radius.

TIP: Use geo-playground and click on the map to get the coordinates for your own zones

With a current location, we can then calculate whether the point intersects a zone, or how far it is from the middle. In the demo, we show how to define a set of zones, and maybe trigger other kinds of behaviour based on which zone is intersected. In its current state, we just show the 'raw' information, and light up a HTML element.

The actual spatial computation is handled by `geolib`, we just have to call `geolib.isPointInCircle()`. Simple!

Some interaction design challenges:
* Can you trigger interaction when a user enters or leaves a zone for the first time?
* Can you set up a behaviour if a user proceeds through zones in a particular order (sort of like a treasure map?)
* Can you try using a polygon-based zone? (see the geolib documentation for more)

## Fake Locations

To make testing easier, you can fake your location. Open up Chrome's console, and click the icon that looks a bit like '>=', to toggle the console drawer. Click "Emulation" and then "Sensors". From there, turn on "Emulate geolocation coordinates", and type in the lat/lon you want to fake, and then refresh the page.

[Read more on overriding location](https://developers.google.com/chrome-developer-tools/docs/mobile-emulation#device-geolocation-overrides)

## Read more
* [Overview on Geolocation](http://diveintohtml5.info/geolocation.html)
* [Generate a API key for CloudMade](http://account.cloudmade.com/register)
* [Geolocation technical docs](https://developer.mozilla.org/en/docs/WebAPI/Using_geolocation)
* Map library, [Leaflet Quickstart](http://leafletjs.com/examples/quick-start.html)
* Map library, [Leaflet API reference](http://leafletjs.com/reference.html)
* [Geolib](https://github.com/manuelbieh/Geolib) (included in Kattegat `libraries.js`)
* [Gelocation overrides](https://developers.google.com/chrome-developer-tools/docs/mobile-emulation#device-geolocation-overrides)