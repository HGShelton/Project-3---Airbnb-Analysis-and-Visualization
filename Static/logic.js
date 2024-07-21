//Define a map object
let myMap = L.map("map", {
    center: [42.3601, -71.0589],
    zoom: 10
});

// Add a tile layer
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(myMap);

// Call data
d3.json(info).then(function (data) {
    L.geoJson(data.addTo(myMap));
})