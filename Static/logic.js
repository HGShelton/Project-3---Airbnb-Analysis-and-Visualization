//Define a map object
let myMap = L.map("map", {
    center: [42.3601, -71.0589],
    zoom: 13
});

// Add a tile layer
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(myMap);

// Create a MarkerClusterGroup
let markers = L.markerClusterGroup();

// Call data
d3.json("listings.json").then(function (data) {
    console.log("Data loaded:", data);

    data.forEach(function (listing) {
        console.log("Latitude:", listing.latitude, "Longitude:", listing.longitude);
        let marker = L.marker([listing.latitude, listing.longitude]);
        markers.addLayer(marker);
        marker.on('mouseover',function(){
            marker.bindPopup(`<h3>Property Type: ${listing.property_type}</h3><h3>Price: ${listing.price}</h3><br><b>Accommodates: ${listing.accommodates}</b><br><b>Bedrooms: ${listing.bedrooms}</b><b> Bathrooms:${listing.bathrooms}</b>`).openPopup();
        });
        marker.on('mouseout', function() {
            marker.bindPopup(`<h3>Property Type: ${listing.property_type}</h3><h3>Price: ${listing.price}</h3><br><b>Accommodates: ${listing.accommodates}</b><br><b>Bedrooms: ${listing.bedrooms}</b><b> Bathrooms:${listing.bathrooms}</b>`).closePopup();
        });
    });

    myMap.addLayer(markers);
});
