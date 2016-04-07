# geo-trip demo

This demo shows you how to store a coordinate and compare it with live coordinates, for example to show how far away the person is from the start point.

When the user clicks "Start", we start periodically fetching the location using `setTimeout`. The basic `geolocation.getCurrentPosition` function is used to request the device position, and the UI is updated on the basis of the calculations (`geolib.getDistance()` and `geolib.getSpeed()`)

If the user hits 'Stop', we cancel the timer.

Things to try:
* Using previous audio demos, can you make a luggage minder which sets off an alarm when it strays too far?
* The demo could be improved to record the actual route taken. Every time a new location is available, it can add it to an array, so that the total distance travelled can be calculated.

## Fake Locations

To make testing easier, you can fake your location. Open up Chrome's console, and click the icon that looks a bit like '>=', to toggle the console drawer. Click "Emulation" and then "Sensors". From there, turn on "Emulate geolocation coordinates", and type in the lat/lon you want to fake, and then refresh the page.


## Read more
* [Overview on Geolocation](http://diveintohtml5.info/geolocation.html)
* [Generate a API key for CloudMade](http://account.cloudmade.com/register)
* [Geolocation technical docs](https://developer.mozilla.org/en/docs/WebAPI/Using_geolocation)
* Map library, [Leaflet Quickstart](http://leafletjs.com/examples/quick-start.html)
* Map library, [Leaflet API reference](http://leafletjs.com/reference.html)
* [Geolib](https://github.com/manuelbieh/Geolib) (included in Kattegat `libraries.js`)
* [Gelocation overrides](https://developers.google.com/chrome-developer-tools/docs/mobile-emulation#device-geolocation-overrides)