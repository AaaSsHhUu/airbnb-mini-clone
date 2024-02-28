mapboxgl.accessToken = mapToken;
const map = new mapboxgl.Map({
    container: 'map', // container ID
    center: coordinates, // starting position [lng, lat]
    zoom: 9 // starting zoom
});
console.log(coordinates);
const marker = new mapboxgl.Marker({color : 'red'})
.setLngLat(coordinates) // Listing geometry location
.setPopup(new mapboxgl.Popup({offset: 25})
.setHTML("<p>Exact location will be provided after booking</p>"))
.addTo(map)