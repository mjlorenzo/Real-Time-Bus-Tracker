// define our access token
const accessToken = "pk.eyJ1IjoibWpsb3JlbnpvIiwiYSI6ImNrcG9tNnJ6ZjFqajcydnJ4ZXhsNHR0dnMifQ.xqehybZcEUb4so2-S38VvA";

// set the access token
mapboxgl.accessToken = accessToken;

// create our map
var map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/mapbox/streets-v11',
    center: [-71.091542,42.358862],
    zoom: 12
});

// define an empty array for markers for right now
const markers = [];

// function to asynchronously request bus data from MBTA
async function getBusData(){
	const url = 'https://api-v3.mbta.com/vehicles?filter[route]=1&include=trip';
	const response = await fetch(url);
	const json     = await response.json();
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

// define an update() function to handle data retrieval and update markers
async function update(map, markers = []) {
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

    // [TODO]: handle busses leaving service
}

// run update() once to get initial data
update(map, markers);
// set update() to run every 15 seconds, save the timer ID
let intervalId = setInterval(() => update(map, markers), 15000);
// tell the window to cancel the timer when the window closes
window.onunload = () => clearInterval(intervalId);