// main.js
import { createChoroplethLayer } from './test-choro-logic.js';
import { createHeatMap } from './test-heatMap.js';

let myMap = L.map("map", {
    center: [42.32413, -71.06991],
    zoom: 12
});

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(myMap);

Promise.all([
    createChoroplethLayer(myMap),
    createHeatMap(myMap)
]).then(([choroplethLayer, heatMapLayer]) => {
    // Base layers
    let baseLayers = {
        "Choropleth Layer": choroplethLayer,
        "Heat Map Layer": heatMapLayer
    };

    // Add layer control to the map
    L.control.layers(null, baseLayers, { collapsed: false }).addTo(myMap);

    // Optionally, manage only one layer visibility at a time
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
    L.control.layers(null, {
        "Choropleth Layer": choroplethLayer,
        "Heat Map Layer": heatMapLayer
    }, { collapsed: false }).on('overlayadd', function (eventLayer) {
        switchLayer(eventLayer.layer);
    }).addTo(myMap);

}).catch(error => console.error('Error loading layers:', error));