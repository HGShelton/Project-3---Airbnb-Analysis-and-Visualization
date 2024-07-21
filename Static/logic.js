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
d3.json("listings.json").then(function (data) {
    console.log("Data loaded:", data);

    data.forEach(function (listing) {
        console.log("Latitude:", listing.latitiude, "Longitude:", listing.longitude);
        L.marker([listing.latitude, listing.longitude]).addTo(myMap);
    });
});