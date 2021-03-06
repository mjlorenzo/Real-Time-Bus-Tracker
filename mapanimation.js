// This module defines a Mapbox map that will display the path of the Boston MBTA's Route 1 bus
// as well as track the busses currently serving that route

// Credit must be given to the example given on the Mapbox webpage on drawing lines with GeoJSON:
// https://docs.mapbox.com/mapbox-gl-js/example/geojson-line/

// define our access token
const accessToken = "pk.eyJ1IjoibWpsb3JlbnpvIiwiYSI6ImNrcG9tNnJ6ZjFqajcydnJ4ZXhsNHR0dnMifQ.xqehybZcEUb4so2-S38VvA";

// set the access token
mapboxgl.accessToken = accessToken;

// create global containers to allow access to current parsed information
let busses = [];
let stops = [];
let markers = [];
// a constant identifier for our route layer
const routeLayerId = "routeLayer";
// constant identifier for our source
const sourceId = "sourceId";

// create our map
var map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/mapbox/streets-v11',
    center: [-71.091542,42.358862],
    zoom: 12
});

// define the current route as Route 1
let currentRoute = 1;

// function to asynchronously request bus data from MBTA
async function getBusData() {
	const url = 'https://api-v3.mbta.com/vehicles?filter[route]=1&include=trip';
	const response = await fetch(url);
	const json     = await response.json();
	return json.data;
}

// function to asynchronously request route data from MBTA
async function getRouteData(route) {
    const url = "https://api-v3.mbta.com/stops?filter[route]=" + (typeof route === "Number" ? route.toString() : route);
    const response = await fetch(url);
    const json = await response.json();
    return json.data;
}

// define an object to describe a particular bus
function Bus(id, coordinates) {
    this.id = id;
    this.coordinates = coordinates;
    return this;
}
// utility function to shortcut extracting from JSON
Bus.fromJSON = function (json) {
    return new Bus(json.id, getBusCoordinates(json))
}
// retrieve coordinate data from the parsed JSON
function getBusCoordinates(bus) {
    return [bus.attributes.longitude, bus.attributes.latitude];
}

// define an object to describe a particular bus stop
function BusStop(name, coordinates) {
    this.name = name;
    this.coordinates = coordinates;
    return this;
}
// utility function to shortcut extracting from JSON
BusStop.fromJSON = function (json) {
    return new BusStop(json.attributes.name, [json.attributes.longitude, json.attributes.latitude]);
}

// define an update() function to handle bus data retrieval and update markers
async function update() {
    let busData = await getBusData();
    let busses = busData.map((bus) => Bus.fromJSON(bus));

    // loop through the busses
    for (bus of busses) {
        // if a marker doesn't exist for this bus, add one
        let currentMarker = markers.find((item) => item.id == bus.id);
        if (!currentMarker) {
            markers.push({
                id: bus.id,
                marker: new mapboxgl.Marker()
                .setLngLat(bus.coordinates)
                .addTo(map)
            });
        }
        // if one does, update it
        else {
            currentMarker.marker.setLngLat(bus.coordinates);
        }
    }

    // essentially this asks the markers array to give us only markers that do not have a corresponding
    // bus in the busses array, and are thus out of service
    const invalidMarkers = markers.filter((marker) => !busses.some((bus) => bus.id == marker.id));
    // tell each marker to remove itself
    // note: this removes these markers from the map, NOT from the markers array
    // they are thus still polluting the markers array (unresolved issue, out of time!)
    invalidMarkers.forEach((marker) => marker.remove());
}

// 
async function updateRoute(map, stops, routeLayerId, sourceId) {
    // retrieve the current route data
    let routeData = await getRouteData(currentRoute);
    stops = routeData.map((stop) => BusStop.fromJSON(stop));
    paintRoute(map, stops, routeLayerId, sourceId);
}

async function paintRoute(map, stops, layerId, sourceId) {
    // check if the layer exists
    if (map.getLayer(layerId)) {
        // if so, get rid of it
        map.removeLayer(layerId);
    }

    // check if the source exists and also delete if found
    if (map.getSource(sourceId)) {
        map.removeSource(sourceId);
    }

    // add the new source
    map.addSource(sourceId, {
        "type": "geojson",
        "data": {
            "type": "Feature",
            "geometry": {
                "type": "LineString",
                "coordinates": stops.map((stop) => stop.coordinates)
            }
        }
    })

    // add the layer for the current route
    map.addLayer({
        id: layerId,
        source: sourceId,
        type: "line",
        layout: {
            'line-join': 'round',
            'line-cap': 'round'
        },
        paint: {
            'line-color': '#4287f5',
            'line-width': 6,
            'line-opacity': .35
        }
    });
}

// get route info
updateRoute(map, stops, routeLayerId, sourceId);

// run update() once to get initial data
update(map, markers);
// set update() to run every 15 seconds, save the timer ID
let intervalId = setInterval(() => update(map, markers), 15000);
// tell the window to cancel the timer when the window closes
window.onunload = () => clearInterval(intervalId);