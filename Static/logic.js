//Define a map object
let myMap = L.map("map", {
    center: [42.3601, -71.0589],
    zoom: 13,
    layers: null
});

// Add a tile layer
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(myMap);

// Create layer groups
let accommodates = L.layerGroup();
let price = L.layerGroup();

// Call data
d3.json("listings.json").then(function (data) {
    console.log("Data loaded:", data);

    // Prepare heat map data
    let heatData = data.map(function (listing) {
        return [listing.latitude, listing.longitude];
    });

    // Create heat map layer
    let heatLayer = L.heatLayer(heatData, {
        radius: 25,  // Adjust the radius as needed
        blur: 15,    // Adjust the blur intensity as needed
        maxZoom: 17, // Adjust the max zoom level as needed
    }).addTo(myMap);

    // Create a MarkerClusterGroup
    let markers = L.markerClusterGroup();

    data.forEach(function (listing) {
        // Create a new marker for each listing
        let marker = L.marker([listing.latitude, listing.longitude]);

        // Add marker to MarkerClusterGroup
        markers.addLayer(marker);

        // Bind popup with listing
        marker.bindPopup(`<h3>Property Type: ${listing.property_type}</h3><h3>Price: ${listing.price}</h3><br><b>Accommodates: ${listing.accommodates}</b><br><b>Bedrooms: ${listing.bedrooms}</b><br><b>Bathrooms: ${listing.bathrooms}</b>`);

        // Determine accommodates value and add marker to accommodates group
        let value = listing.accommodates;
        if (value >= 1 && value <= 3) {
            marker.addTo(accommodates);
        } else if (value >= 4 && value <= 6) {
            marker.addTo(accommodates);
        } else {
            marker.addTo(accommodates);
        }

        // Determine the price value and add marker to price group
        let prices = listing.price;
        if (prices >= 0 && prices <= 150) {
            marker.addTo(price);
        } else if (prices >= 151 && prices <= 300) {
            marker.addTo(price);
        } else if (prices >= 301 && prices <= 550) {
            marker.addTo(price);
        } else if (prices >= 551 && prices <= 1000) {
            marker.addTo(price);
        } else {
            marker.addTo(price);
        }
    });

    // Add MarkerClusterGroup to the map
    myMap.addLayer(markers);

    // Add layer groups to the map
    accommodates.addTo(myMap);
    price.addTo(myMap);
    heatLayer.addTo(myMap);

        // Create layer control
        let overlayMaps = {
            "1-3": accommodates,
            "4-6": accommodates,
            "7+": accommodates,
            "<$150": price,
            "$150-$300": price,
            "$300-$550": price,
            "$550-$1000": price,
            ">$1000": price,
            "HeatMap": heatLayer
        };

    // Hide all layers
    Object.values(overlayMaps).forEach(layer => {
        myMap.removeLayer(layer);
    });
    
    // Add layer control to the map
    L.control.layers(null, overlayMaps, { collapsed: false, layers: {} }).addTo(myMap);
    
}).catch(error => console.error('Error loading data:', error));
     