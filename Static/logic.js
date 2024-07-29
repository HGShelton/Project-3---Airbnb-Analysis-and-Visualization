import { createChoroplethLayer } from './choro_logic.js';
import { createHeatMap } from './heatMap_logic.js';
import { createMarkerClusterLayer } from './cluster_logic.js';
import './sidePanel.js';

// Initialize the map
let myMap = L.map("map", {
    center: [42.32413, -71.06991],
    zoom: 12
});

let streetMap = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(myMap);

// Create and add the side panel control to the map
let sidePanel = L.control.sidepanel('sidePanel', {
    panelPosition: 'left',
    hasTabs: true,
    tabsPosition: 'bottom',
    darkMode: false,
    pushControls: false,
    startTab: 1
}).addTo(myMap);

// Create a custom control for the neighbourhood dropdown
let NeighbourhoodControl = L.Control.extend({
    options: {
        position: 'topleft'
    },
    onAdd: function () {
        let container = L.DomUtil.create('div', 'leaflet-bar leaflet-control leaflet-control-custom');
        container.style.backgroundColor = 'white';
        container.style.padding = '5px';

        let select = L.DomUtil.create('select', '', container);
        select.id = 'neighbourhoodDropdown';
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

// Create a custom control for the property type dropdown
let PropertyTypeControl = L.Control.extend({
    options: {
        position: 'topleft'
    },
    onAdd: function () {
        let container = L.DomUtil.create('div', 'leaflet-bar leaflet-control leaflet-control-custom');
        container.style.backgroundColor = 'white';
        container.style.padding = '5px';

        let select = L.DomUtil.create('select', '', container);
        select.id = 'propertyTypeDropdown';
        select.style.width = '185px';

        // Add default option
        let defaultOption = document.createElement('option');
        defaultOption.text = 'Select A Property Type';
        defaultOption.value = 'all';
        select.add(defaultOption);

        return container;
    }
});

myMap.addControl(new PropertyTypeControl());

// Function to populate the dropdown with unique property types
function populateDropdown(data) {
    let propertyTypes = new Set(data.map(listing => listing.property_type));
    let dropdown = document.getElementById("propertyTypeDropdown");

    propertyTypes.forEach(type => {
        let option = document.createElement("option");
        option.value = type.toLowerCase();
        option.text = type;
        dropdown.add(option);
    });
}

// Function to filter listings based on selected property type
function filterListings(listing, selectedPropertyType) {
    return selectedPropertyType === "all" || listing.property_type.toLowerCase() === selectedPropertyType;
}

// Load the neighbourhood boundaries GeoJSON data
d3.json('/Resources/neighbourhoods.geojson').then(function (neighbourhoodsData) {
    console.log('Neighbourhood data loaded successfully:', neighbourhoodsData);

    // Create a GeoJSON layer for neighbourhoods with medium gray outlines
    let neighbourhoodLayer = L.geoJson(neighbourhoodsData, {
        style: function (feature) {
            return {
                color: '#808080',
                weight: 2,
                fillOpacity: 0
            };
        }
    }).addTo(myMap);

    // Populate the dropdown with neighbourhood names
    let neighbourhoodSelect = document.getElementById('neighbourhoodDropdown');
    neighbourhoodsData.features.forEach(feature => {
        let option = document.createElement('option');
        option.text = feature.properties.neighbourhood;
        option.value = feature.properties.neighbourhood;
        neighbourhoodSelect.add(option);
    });

<<<<<<< HEAD
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

    // Overlay layers
    let groupedOverlayLayers = {
        "Accommodates": {
            "All Listings": markerClusterLayer,
            "Accommodates 1-3": accommodates1to3,
            "Accommodates 4-6": accommodates4to6,
            "Accommodates 7+": accommodates7plus
        },
        "Price per night": {
            "< $150": price0to150,
            "$150-$300": price151to300,
            "$301-$550": price301to550,
            "$551-$1000": price551to1000,
            "> $1000": price1000plus
        }
    };

    // Add layer control to the map
    let layerControl = L.control.groupedLayers(baseLayers, groupedOverlayLayers, { collapsed: false }).addTo(myMap);

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
=======
    neighbourhoodSelect.addEventListener('change', function () {
        let selectedNeighbourhood = this.value;
        if (selectedNeighbourhood) {
            let selectedFeature = neighbourhoodsData.features.find(feature => feature.properties.neighbourhood === selectedNeighbourhood);
            if (selectedFeature) {
                let bounds = L.geoJson(selectedFeature).getBounds();
                myMap.fitBounds(bounds);
>>>>>>> shelton
            }
        }
    });

    // Load and display data
    d3.json("listings.json").then(function (listingsData) {
        console.log("Listings data loaded:", listingsData);

        // Populate the dropdown with property types
        populateDropdown(listingsData);

        // Initialize the marker cluster group
        let markers = L.markerClusterGroup();

        function updateMarkers() {
            markers.clearLayers();

            const selectedPropertyType = document.getElementById("propertyTypeDropdown").value.toLowerCase();
            const filteredData = listingsData.filter(listing => filterListings(listing, selectedPropertyType));

            filteredData.forEach(function (listing) {
                console.log("Latitude:", listing.latitude, "Longitude:", listing.longitude);
                let marker = L.marker([listing.latitude, listing.longitude]);
                markers.addLayer(marker);
                marker.on('mouseover', function () {
                    marker.bindPopup(`<h3>Property Type: ${listing.property_type}</h3><h3>Price: ${listing.price}</h3><br><b>Accommodates: ${listing.accommodates}</b><br><b>Bedrooms: ${listing.bedrooms}</b><b> Bathrooms:${listing.bathrooms}</b>`).openPopup();
                });
                marker.on('mouseout', function () {
                    marker.closePopup();
                });
            });

            myMap.addLayer(markers);
        }

        // Add event listener for dropdown change
        document.getElementById("propertyTypeDropdown").addEventListener("change", updateMarkers);

        // Initial marker update
        updateMarkers();

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

            let baseLayers = {
                "Street Map": streetMap,
                "Heat Map": heatMapLayer,
                "Choropleth Layer": choroplethLayer
            };

            // Overlay layers
            let groupedOverlayLayers = {
                "Accommodates": {
                    "All Listings": markerClusterLayer,
                    "Accommodates 1-3": accommodates1to3,
                    "Accommodates 4-6": accommodates4to6,
                    "Accommodates 7+": accommodates7plus
                },
                "Price per night": {
                    "< $150": price0to150,
                    "$150-$300": price151to300,
                    "$301-$550": price301to550,
                    "$551-$1000": price551to1000,
                    "> $1000": price1000plus
                }
            };

            // Add layer control to the map
            let layerControl = L.control.groupedLayers(baseLayers, groupedOverlayLayers, { collapsed: false }).addTo(myMap);

            let activeAccommodationFilter = null;
            let activePriceFilter = null;

            function applyFilters() {
                markerClusterLayer.clearLayers();

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

                let filteredMarkers = allMarkers;
                if (activeAccommodationFilter) {
                    filteredMarkers = filteredMarkers.filter(marker =>
                        activeAccommodationFilter.hasLayer(marker)
                    );
                }

                if (activePriceFilter) {
                    filteredMarkers = filteredMarkers.filter(marker =>
                        activePriceFilter.hasLayer(marker)
                    );
                }

                filteredMarkers.forEach(marker => markerClusterLayer.addLayer(marker));
            }

            function updateLegendVisibility() {
                if (myMap.hasLayer(choroplethLayer)) {
                    choroplethLegend.addTo(myMap);
                } else {
                    myMap.removeControl(choroplethLegend);
                }
            }

            myMap.on('baselayerchange', function (eventLayer) {
                if (eventLayer.name === 'Choropleth Layer') {
                    updateLegendVisibility();
                } else {
                    myMap.removeControl(choroplethLegend);
                }
            });

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

            choroplethLayer.addTo(myMap);
            markerClusterLayer.addTo(myMap);
            updateLegendVisibility();
        }).catch(error => console.error('Error loading layers:', error));
    }).catch(error => console.error('Error loading listings data:', error));
}).catch(error => console.error('Error loading neighbourhoods data:', error));
