// main.js

// Import functions to create layers
import { createChoroplethLayer } from './choro-logic.js';
import { createHeatMap } from './heatmap.js';
import { createMarkerClusterLayer } from './markercluster.js';

// Define map object
let myMap = L.map("map", {
    center: [42.32413, -71.06991],
    zoom: 12
});

// Add tile layer
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(myMap);

// Use Promise.all to load layers asynchronously
Promise.all([
    createChoroplethLayer(myMap),
    createHeatMap(myMap),
]).then(([choroplethLayer, heatMapLayer]) => {
    console.log('Choropleth Layer:', choroplethLayer);
    console.log('Heat Map Layer:', heatMapLayer);

    // Load data using d3.json
    d3.json("listings.json").then(function (data) {
        console.log("Data loaded:", data);

        // Process the data and create Marker Cluster Layer
        createMarkerClusterLayer(myMap, data).then(markerClusterLayer => {
            console.log('Marker Cluster Layer:', markerClusterLayer);

            // Define base layers and overlay maps
            let baseLayers = {
                "Choropleth Layer": choroplethLayer,
                "Heat Map Layer": heatMapLayer,
                "Marker Cluster Layer": markerClusterLayer
            };

            // Add layer control to the map
            let layerControl = L.control.layers(null, baseLayers, { collapsed: false }).addTo(myMap);

            // Manage active layers
            let activeLayer = null;

            function switchLayer(layer) {
                if (activeLayer) {
                    myMap.removeLayer(activeLayer);
                }
                myMap.addLayer(layer);
                activeLayer = layer;
            }

            // Initially show the choropleth layer
            switchLayer(choroplethLayer);

            // Set up layer control to handle layer switching
            layerControl.on('overlayadd', function (eventLayer) {
                switchLayer(eventLayer.layer);
            });

        }).catch(error => console.error('Error creating Marker Cluster Layer:', error));
    }).catch(error => console.error('Error loading data:', error));
});

//     // Add layer control to the map
//     let layerControl = L.control.layers(baseLayers, overlayMaps, { collapsed: false, layers: {} }).addTo(myMap);

//     // Event listener for layer control
//     myMap.on('overlayadd', function (eventLayer) {

//         // Iterate through all overlay maps
//         Object.keys(overlayMaps).forEach(function (key) {
//             if (eventLayer.name === key) {
//                 let selectedLayer = overlayMaps[key];
//                 markers.eachLayer(function (marker) {
//                     let listingPrice = marker.getPopup().getContent().match(/Price: (\d+)/)[1];
//                     if (key.startsWith("Accommodates")) {
//                         // Show markers based on accommodates criteria
//                         let accommodatesRange = key.split(" ")[1];
//                         let accommodatesValue = parseInt(accommodatesRange.split("-")[0]);
//                         if (!(listing.accommodates >= accommodatesValue && listing.accommodates <= accommodatesValue + 2)) {
//                             markers.removeLayer(marker);
//                         }
//                     } else if (key.startsWith("<")) {
//                         // Show markers based on price range criteria
//                         let maxPrice = parseInt(key.split("$")[1]);
//                         if (listingPrice > maxPrice) {
//                             markers.removeLayer(marker);
//                         }
//                     }
//                 });
//             }
//         });
//     });
    
// }).catch(error => console.error('Error loading data:', error));
