import { createChoroplethLayer } from './choro_logic.js';
import { createHeatMap } from './heatMap_logic.js';
import { createMarkerClusterLayer } from './cluster_logic.js';

let myMap = L.map("map", {
    center: [42.32413, -71.06991],
    zoom: 12
});

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(myMap);


// Create a custom control for the dropdown
let NeighbourhoodControl = L.Control.extend({
    options: {
        position: 'topleft'
    },
    onAdd: function (myMap) {
        let container = L.DomUtil.create('div', 'leaflet-bar leaflet-control leaflet-control-custom');
        container.style.backgroundColor = 'white';
        container.style.padding = '5px';

        let select = L.DomUtil.create('select', '', container);
        select.id = 'neighbourhoodDropdown'; // Make sure this ID matches your selector in the rest of your code
        select.style.width = '185px';

        // Add default option
        let defaultOption = document.createElement('option');
        defaultOption.text = 'Select Neighbourhood';
        defaultOption.value = '';
        select.add(defaultOption);

        return container;
    }
});

myMap.addControl(new NeighbourhoodControl());

// Load the neighbourhood boundaries GeoJSON data
d3.json('/Resources/neighbourhoods.geojson').then(function (neighbourhoodsData) {
    console.log('Neighbourhood data loaded successfully:', neighbourhoodsData);

    // Create a GeoJSON layer for neighbourhoods with medium gray outlines
    let neighbourhoodLayer = L.geoJson(neighbourhoodsData, {
        style: function (feature) {
            return {
                color: '#808080',  // Medium gray outline color
                weight: 2,         // Outline weight
                fillOpacity: 0     // Make the fill transparent
            };
        }
    }).addTo(myMap);  // Add the layer to the map

    // Populate the dropdown with neighbourhood names
    let select = document.getElementById('neighbourhoodDropdown');
    neighbourhoodsData.features.forEach(feature => {
        let option = document.createElement('option');
        option.text = feature.properties.neighbourhood;  // Adjust this property name to match your GeoJSON
        option.value = feature.properties.neighbourhood; // Adjust this property name to match your GeoJSON
        select.add(option);
    });

    select.addEventListener('change', function () {
        let selectedNeighbourhood = this.value;
        if (selectedNeighbourhood) {
            let selectedFeature = neighbourhoodsData.features.find(feature => feature.properties.neighbourhood === selectedNeighbourhood);
            if (selectedFeature) {
                let bounds = L.geoJson(selectedFeature).getBounds();
                myMap.fitBounds(bounds);
            }
        }
    });

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

        // Function to manage legend visibility for the choropleth layer
        function updateLegendVisibility() {
            if (myMap.hasLayer(choroplethLayer)) {
                choroplethLegend.addTo(myMap);
            } else {
                myMap.removeControl(choroplethLegend);
            }
        }

        // Listen to base layer changes
        myMap.on('baselayerchange', function (eventLayer) {
            if (eventLayer.name === 'Choropleth Layer') {
                updateLegendVisibility();
            } else {
                // If switching to a non-choropleth base layer, hide the legend
                myMap.removeControl(choroplethLegend);
            }
        });

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
                    if (activeAccommodationFilter === eventLayer.layer) {
                        activeAccommodationFilter = null;
                    }
                    break;
                case '< $150':
                case '$150-$300':
                case '$301-$550':
                case '$551-$1000':
                case '> $1000':
                    if (activePriceFilter === eventLayer.layer) {
                        activePriceFilter = null;
                    }
                    break;
            }
            applyFilters();
        });

        // Initially add the layers to the map
        choroplethLayer.addTo(myMap);
        markerClusterLayer.addTo(myMap);
        updateLegendVisibility(); // Ensure legend is correctly displayed

    }).catch(error => console.error('Error loading layers:', error));
}).catch(error => console.error('Error loading neighbourhoods data:', error));