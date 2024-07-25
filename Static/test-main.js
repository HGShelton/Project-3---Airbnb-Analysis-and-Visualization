import { createChoroplethLayer } from './test-choro-logic.js';
import { createHeatMap } from './test-heatMap.js';
import { createMarkerClusterLayer } from './test-cluster.js';

let myMap = L.map("map", {
    center: [42.32413, -71.06991],
    zoom: 12
});

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(myMap);

Promise.all([
    createChoroplethLayer(myMap),
    createHeatMap(myMap),
    createMarkerClusterLayer(myMap)
]).then(([choroplethResult, heatMapLayer, markerClusterResult]) => {
    let { geoJsonLayer: choroplethLayer, legend: choroplethLegend } = choroplethResult;
    let {
        markers: markerClusterLayer,
        accommodates1to3,
        accommodates4to6,
        accommodates7plus,
        price0to150,
        price151to300,
        price301to550,
        price551to1000,
        price1000plus
    } = markerClusterResult;

    // Base layers
    let baseLayers = {
        "Street Map": myMap,
        "Heat Map": heatMapLayer,
        "Choropleth Layer": choroplethLayer
    };

    // Overlay layers
    let overlayLayers = {
        "All Listings": markerClusterLayer,
        "Accommodates 1-3": accommodates1to3,
        "Accommodates 4-6": accommodates4to6,
        "Accommodates 7+": accommodates7plus,
        "< $150": price0to150,
        "$150-$300": price151to300,
        "$301-$550": price301to550,
        "$551-$1000": price551to1000,
        "> $1000": price1000plus
    };

    // Add layer control to the map
    let layerControl = L.control.layers(baseLayers, overlayLayers, { collapsed: false }).addTo(myMap);

    // Track active filters
    let activeAccommodationFilter = null;
    let activePriceFilter = null;

    function applyFilters() {
        // Clear current markers
        markerClusterLayer.clearLayers();

        // Get all markers
        const allMarkers = [
            ...accommodates1to3.getLayers(),
            ...accommodates4to6.getLayers(),
            ...accommodates7plus.getLayers(),
            ...price0to150.getLayers(),
            ...price151to300.getLayers(),
            ...price301to550.getLayers(),
            ...price551to1000.getLayers(),
            ...price1000plus.getLayers()
        ];

        // Apply accommodation filter if set
        let filteredMarkers = allMarkers;
        if (activeAccommodationFilter) {
            filteredMarkers = filteredMarkers.filter(marker =>
                activeAccommodationFilter.hasLayer(marker)
            );
        }

        // Apply price filter if set
        if (activePriceFilter) {
            filteredMarkers = filteredMarkers.filter(marker =>
                activePriceFilter.hasLayer(marker)
            );
        }

        // Add filtered markers to marker cluster layer
        filteredMarkers.forEach(marker => markerClusterLayer.addLayer(marker));
    }

    // Listen to overlayadd and overlayremove events
    myMap.on('overlayadd', function (eventLayer) {
        switch (eventLayer.name) {
            case 'Accommodates 1-3':
            case 'Accommodates 4-6':
            case 'Accommodates 7+':
                activeAccommodationFilter = eventLayer.layer;
                break;
            case '< $150':
            case '$150-$300':
            case '$301-$550':
            case '$551-$1000':
            case '> $1000':
                activePriceFilter = eventLayer.layer;
                break;
        }
        applyFilters();
    });

    myMap.on('overlayremove', function (eventLayer) {
        switch (eventLayer.name) {
            case 'Accommodates 1-3':
            case 'Accommodates 4-6':
            case 'Accommodates 7+':
                activeAccommodationFilter = null;
                break;
            case '< $150':
            case '$150-$300':
            case '$301-$550':
            case '$551-$1000':
            case '> $1000':
                activePriceFilter = null;
                break;
        }
        applyFilters();
    });

    // Function to manage legend visibility for the choropleth layer
    myMap.on('overlayadd', function (eventLayer) {
        if (eventLayer.name === 'Choropleth Layer') {
            choroplethLegend.addTo(myMap);
        }
    });

    myMap.on('overlayremove', function (eventLayer) {
        if (eventLayer.name === 'Choropleth Layer') {
            myMap.removeControl(choroplethLegend);
        }
    });

}).catch(error => console.error('Error loading layers:', error));