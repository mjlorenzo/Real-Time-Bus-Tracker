## Real Time Bus Tracker!

This is a simple proof-of-concept application using the Mapbox API combined with
the MBTA's public API to track busses in real time traveling through Cambridge and
Boston on Bus Route 1. Further, it has been modified to query the MBTA API for the
location of every stop along the route, convert it to GeoJSON, and supply the data
to the mapboxgl rendering library to provide a visual representation of the route
itself.

This project shouldn't require any setup to get working on a browser, just clone
it and go!

In the future, I would add an interface to change the route queried by the software
and update the UI accordingly. Also, I would allow the user to interact with a marker
and get more detailed information about the bus, where it's headed, and when.

### Obligatory MIT License Legal Mumbo Jumbo
Copyright <2021> <Michael Lorenzo>

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.