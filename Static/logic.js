import { createChoroplethLayer } from './choro_logic.js';
import { createHeatMap } from './heatMap_logic.js';
import { createMarkerClusterLayer } from './cluster_logic.js';
import './sidePanel.js';

// Initialize the map
let myMap = L.map("map", {
    center: [42.32413, -71.06991],
    zoom: 12
});

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
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

// Create custom controls for dropdowns
let NeighbourhoodControl = L.Control.extend({
    options: { position: 'topleft' },
    onAdd: function () {
        let container = L.DomUtil.create('div', 'leaflet-bar leaflet-control leaflet-control-custom');
        container.style.backgroundColor = 'white';
        container.style.padding = '5px';
        let select = L.DomUtil.create('select', '', container);
        select.id = 'neighbourhoodDropdown';
        select.style.width = '185px';
        let defaultOption = document.createElement('option');
        defaultOption.text = 'Select Neighbourhood';
        defaultOption.value = '';
        select.add(defaultOption);
        return container;
    }
});
myMap.addControl(new NeighbourhoodControl());

let PropertyTypeControl = L.Control.extend({
    options: { position: 'topleft' },
    onAdd: function () {
        let container = L.DomUtil.create('div', 'leaflet-bar leaflet-control leaflet-control-custom');
        container.style.backgroundColor = 'white';
        container.style.padding = '5px';
        let select = L.DomUtil.create('select', '', container);
        select.id = 'propertyTypeDropdown';
        select.style.width = '185px';
        let defaultOption = document.createElement('option');
        defaultOption.text = 'Select A Property Type';
        defaultOption.value = 'all';
        select.add(defaultOption);
        return container;
    }
});
myMap.addControl(new PropertyTypeControl());

// Populate property type dropdown
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

// Filter listings
function filterListings(listing, selectedPropertyType) {
    return selectedPropertyType === "all" || listing.property_type.toLowerCase() === selectedPropertyType;
}

// Load neighbourhood boundaries
d3.json('/Resources/neighbourhoods.geojson').then(function (neighbourhoodsData) {
    console.log('Neighbourhood data loaded successfully:', neighbourhoodsData);

    let neighbourhoodLayer = L.geoJson(neighbourhoodsData, {
        style: function (feature) {
            return {
                color: '#808080',
                weight: 2,
                fillOpacity: 0
            };
        }
    }).addTo(myMap);

    let neighbourhoodSelect = document.getElementById('neighbourhoodDropdown');
    neighbourhoodsData.features.forEach(feature => {
        let option = document.createElement('option');
        option.text = feature.properties.neighbourhood;
        option.value = feature.properties.neighbourhood;
        neighbourhoodSelect.add(option);
    });

    neighbourhoodSelect.addEventListener('change', function () {
        let selectedNeighbourhood = this.value;
        if (selectedNeighbourhood) {
            let selectedFeature = neighbourhoodsData.features.find(feature => feature.properties.neighbourhood === selectedNeighbourhood);
            if (selectedFeature) {
                let bounds = L.geoJson(selectedFeature).getBounds();
                myMap.fitBounds(bounds);
            }
        }
    });

    d3.json("listings.json").then(function (listingsData) {
        console.log("Listings data loaded:", listingsData);

        populateDropdown(listingsData);

        let markers = L.markerClusterGroup();

        function updateMarkers() {
            if (document.getElementById("propertyTypeDropdown").value === 'all') {
                // Do not clear markers if 'all' is selected
                return;
            }

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

        document.getElementById("propertyTypeDropdown").addEventListener("change", updateMarkers);
        updateMarkers();

        Promise.all([
            createChoroplethLayer(myMap),
            createHeatMap(myMap),
            createMarkerClusterLayer(myMap)
        ]).then(([choroplethResult, heatMapResult, markerClusterResult]) => {
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

            let { heatLayer, heatMapLegend } = heatMapResult;

            let baseLayers = {
                "Street Map": L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                }),
                "Heat Map": heatLayer,
                "Choropleth Layer": choroplethLayer
            };

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

            let layerControl = L.control.groupedLayers(baseLayers, groupedOverlayLayers, { collapsed: false }).addTo(myMap);

            let activeAccommodationFilter = null;
            let activePriceFilter = null;
            let heatMapLegendAdded = false;
            let choroplethLegendAdded = false;

            function applyFilters() {
                markers.clearLayers();

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
                if (myMap.hasLayer(heatLayer)) {
                    if (!heatMapLegendAdded) {
                        heatMapLegend.addTo(myMap);
                        heatMapLegendAdded = true;
                    }
                } else {
                    if (heatMapLegendAdded) {
                        myMap.removeControl(heatMapLegend);
                        heatMapLegendAdded = false;
                    }
                }
            }

            function updateChoroplethLegendVisibility() {
                if (myMap.hasLayer(choroplethLayer)) {
                    if (!choroplethLegendAdded) {
                        choroplethLegend.addTo(myMap);
                        choroplethLegendAdded = true;
                    }
                } else {
                    if (choroplethLegendAdded) {
                        myMap.removeControl(choroplethLegend);
                        choroplethLegendAdded = false;
                    }
                }
            }

            myMap.on('baselayerchange', function (eventLayer) {
                if (eventLayer.name === 'Heat Map') {
                    updateLegendVisibility();
                } else if (eventLayer.name === 'Choropleth Layer') {
                    updateChoroplethLegendVisibility();
                } else {
                    if (heatMapLegendAdded) {
                        myMap.removeControl(heatMapLegend);
                        heatMapLegendAdded = false;
                    }
                    if (choroplethLegendAdded) {
                        myMap.removeControl(choroplethLegend);
                        choroplethLegendAdded = false;
                    }
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
            updateChoroplethLegendVisibility();
        }).catch(error => console.error('Error loading layers:', error));
    }).catch(error => console.error('Error loading listings data:', error));
}).catch(error => console.error('Error loading neighbourhoods data:', error));