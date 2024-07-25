import { createChoroplethLayer } from './choro-logic.js';

// Define a map object
let myMap = L.map("map", {
    center: [42.3601, -71.0589],
    zoom: 13,
    layers: []
});

// Add a default tile layer
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(myMap);

// Load the GeoJSON choropleth layer
let choroplethLayer = createChoroplethLayer(myMap);

// Create layer groups for accommodation values
let accommodates1to3 = L.layerGroup();
let accommodates4to6 = L.layerGroup();
let accommodates7plus = L.layerGroup();

// Create layer groups for price range values
let price0to150 = L.layerGroup();
let price151to300 = L.layerGroup();
let price301to550 = L.layerGroup();
let price551to1000 = L.layerGroup();
let price1000plus = L.layerGroup();

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
    })

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
            marker.addTo(accommodates1to3);
        } else if (value >= 4 && value <= 6) {
            marker.addTo(accommodates4to6);
        } else {
            marker.addTo(accommodates7plus);
        }

        // Determine the price value and add marker to price group
        let prices = parseFloat(listing.price.replace('$', ''));
    
        if (prices >= 0 && prices <= 150) {
            marker.addTo(price0to150);
        } else if (prices >= 151 && prices <= 300) {
            marker.addTo(price151to300);
        } else if (prices >= 301 && prices <= 550) {
            marker.addTo(price301to550);
        } else if (prices >= 551 && prices <= 1000) {
            marker.addTo(price551to1000);
        } else {
            marker.addTo(price1000plus);
        }
    });

    // Add MarkerClusterGroup to the map
    myMap.addLayer(markers);

    // Hide all layers initially
    myMap.removeLayer(accommodates1to3);
    myMap.removeLayer(accommodates4to6);
    myMap.removeLayer(accommodates7plus);
    myMap.removeLayer(price0to150);
    myMap.removeLayer(price151to300);
    myMap.removeLayer(price301to550);
    myMap.removeLayer(price551to1000);
    myMap.removeLayer(price1000plus);
    myMap.removeLayer(heatLayer);

    // Create a base layer object
    let baseLayers = {
        "All listings": markers,
        "HeatMap": heatLayer,
    };

    // Create overlay maps object
    let overlayMaps = {
        "Accommodates 1-3": accommodates1to3,
        "Accommodates 4-6": accommodates4to6,
        "Accommodates 7+": accommodates7plus,
        "< $150": price0to150,
        "$150-$300": price151to300,
        "$301-$550": price301to550,
        "$551-$1000": price551to1000,
        "> $1000": price1000plus,
    };

    // Add layer control to the map
    let layerControl = L.control.layers(baseLayers, overlayMaps, { collapsed: false, layers: {} }).addTo(myMap);

    // Event listener for layer control
    myMap.on('overlayadd', function (eventLayer) {

        // Iterate through all overlay maps
        Object.keys(overlayMaps).forEach(function (key) {
            if (eventLayer.name === key) {
                let selectedLayer = overlayMaps[key];
                markers.eachLayer(function (marker) {
                    let listingPrice = marker.getPopup().getContent().match(/Price: (\d+)/)[1];
                    if (key.startsWith("Accommodates")) {
                        // Show markers based on accommodates criteria
                        let accommodatesRange = key.split(" ")[1];
                        let accommodatesValue = parseInt(accommodatesRange.split("-")[0]);
                        if (!(listing.accommodates >= accommodatesValue && listing.accommodates <= accommodatesValue + 2)) {
                            markers.removeLayer(marker);
                        }
                    } else if (key.startsWith("<")) {
                        // Show markers based on price range criteria
                        let maxPrice = parseInt(key.split("$")[1]);
                        if (listingPrice > maxPrice) {
                            markers.removeLayer(marker);
                        }
                    }
                });
            }
        });
    });
    
}).catch(error => console.error('Error loading data:', error));
