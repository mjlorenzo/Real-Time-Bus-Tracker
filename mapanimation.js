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

// define array of coordinates for bus stops
const busStopCoordinates = [
    [-71.093729, 42.359244],
    [-71.094915, 42.360175],
    [-71.095800, 42.360698],
    [-71.099558, 42.362953],
    [-71.103476, 42.365248],
    [-71.106067, 42.366806],
    [-71.108717, 42.368355],
    [-71.110799, 42.369192],
    [-71.113095, 42.370218],
    [-71.115476, 42.372085],
    [-71.117585, 42.373016],
    [-71.118625, 42.374863]
];

// create the marker at the first stop
var marker = new mapboxgl.Marker()
    .setLngLat(busStopCoordinates[0])
    .addTo(map);

// set our counter to 1, since we're already at position 0
var counter = 1;

// define the move() function to reposition the marker to the next stop
// every second
function move() {
    setTimeout(() => {
        if (counter >= busStopCoordinates.length) return;
        marker.setLngLat(busStopCoordinates[counter]);
        counter++;
        move();
    }, 1000);
}