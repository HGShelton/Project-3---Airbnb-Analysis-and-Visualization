//Define a map object
let myMap = L.map("map", {
    center: [42.3601, -71.0589],
    zoom: 13
});

// Add a tile layer
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(myMap);

// Call data
d3.json("listings.json").then(function (data) {
    console.log("Data loaded:", data);

    // Create a MarkerClusterGroup
    let markers = L.markerClusterGroup();

    data.forEach(function (listing) {
        console.log("Latitude:", listing.latitude, "Longitude:", listing.longitude);
        let marker = L.marker([listing.latitude, listing.longitude]);
        markers.addLayer(marker);
        marker.on('mouseover',function(){
            marker.bindPopup(`<h3>Property Type: ${listing.property_type}</h3><h3>Price: ${listing.price}</h3><br><b>Accommodates: ${listing.accommodates}</b><br><b>Bedrooms: ${listing.bedrooms}</b><b>Bathrooms:${listing.bathrooms}</b>`).openPopup();
        });
        marker.on('mouseout', function() {
            marker.bindPopup(`<h3>Property Type: ${listing.property_type}</h3><h3>Price: ${listing.price}</h3><br><b>Accommodates: ${listing.accommodates}</b><br><b>Bedrooms: ${listing.bedrooms}</b><b>Bathrooms:${listing.bathrooms}</b>`).closePopup();
        });
    });

    myMap.addLayer(markers);

    // Prepare heat map data
    let heatData = data.map(function (listing) {
        return [listing.latitude, listing.longitude];
    });

    // Create heat map layer
    L.heatLayer(heatData, {
        radius: 25,  // Adjust the radius as needed
        blur: 15,    // Adjust the blur intensity as needed
        maxZoom: 17, // Adjust the max zoom level as needed
    }).addTo(myMap);

    myMap.addLayer(heat);

}).catch(error => console.error('Error loading data:', error));