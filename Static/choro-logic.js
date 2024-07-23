// Creating the map object
let myMap = L.map("map", {
    center: [42.36413, -71.02991],
    zoom: 12
});

// Adding the tile layer
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(myMap);

// Load the neighbourhood boundaries GeoJSON data
d3.json('/Resources/neighbourhoods.geojson').then(function(neighbourhoodsData) {
    console.log('Neighbourhood data loaded successfully:', neighbourhoodsData);

    // Load the listings data
    d3.json('listings.json').then(function(listingsData) {
        console.log('Listings data loaded successfully:', listingsData);

        // Aggregate price data by neighbourhood
        let priceByNeighbourhood = {};
        listingsData.forEach(item => {
            let neighbourhood = item.neighbourhood;
            let price = item.price;

            // Remove any non-numeric characters (e.g., dollar sign, spaces) and convert to number
            if (price) {
                price = parseFloat(price.replace(/[^0-9.-]+/g, ''));
            };

            // Skip if price is missing or not a number
            if (isNaN(price)) return;

            if (!priceByNeighbourhood[neighbourhood]) {
                priceByNeighbourhood[neighbourhood] = [];
            };
            priceByNeighbourhood[neighbourhood].push(price);
        });

        const avgPriceByNeighbourhood = {};
        for (const neighbourhood in priceByNeighbourhood) {
            const prices = priceByNeighbourhood[neighbourhood];
            if (prices.length > 0) {
                const avgPrice = prices.reduce((a, b) => a + b, 0) / prices.length;
                avgPriceByNeighbourhood[neighbourhood] = avgPrice;
            } else {
                avgPriceByNeighbourhood[neighbourhood] = 0; // Default to 0 if no valid prices
            }
        }

        console.log('Price by neighbourhood:', priceByNeighbourhood);
        console.log('Average price by neighbourhood:', avgPriceByNeighbourhood);

        // Populate the dropdown with neighbourhoods
        const neighbourhoodSelect = document.getElementById('neighbourhoodSelect');
        for (const neighbourhood in avgPriceByNeighbourhood) {
            const option = document.createElement('option');
            option.value = neighbourhood;
            option.textContent = neighbourhood;
            neighbourhoodSelect.appendChild(option);
        }

        let geoJsonLayer;
        let previousHighlight = null;

        // Create the choropleth layer manually
        function getColor(d) {
            return d > 450 ? '#800026' :
                d > 350 ? '#BD0026' :
                d > 300 ? '#E31A1C' :
                d > 250 ? '#FC4E2A' :
                d > 200 ? '#FD8D3C' : 
                d > 150 ? '#FEB24C' : 
                d > 100 ? '#FED976' :
                        '#FFEDA0';
        }

        function style(feature) {
            let neighbourhood = feature.properties.neighbourhood;  
            let avgPrice = avgPriceByNeighbourhood[neighbourhood] || 0; // Default to 0 if no data
            
            return {
                fillColor: getColor(avgPrice),
                weight: 2,
                opacity: 1,
                color: 'white',
                dashArray: '3',
                fillOpacity: 0.7
            };
        }

        function resetHighlight() {
            geoJsonLayer.eachLayer(layer => {
                if (layer.feature.properties.neighbourhood === previousHighlight) {
                    let avgPrice = avgPriceByNeighbourhood[previousHighlight] || 0;
                    layer.setStyle({
                        fillColor: getColor(avgPrice),
                        weight: 2,
                        opacity: 1,
                        color: 'white',
                        dashArray: '3',
                        fillOpacity: 0.7
                    });
                } else {
                    layer.setStyle(style(layer.feature));
                }
            });
        }

        function highlightFeature(e) {
            let layer = e.target;
            layer.setStyle({
                weight: 5,
                color: '#666',
                dashArray: '',
                fillOpacity: 0.7
            });
        }

        function onEachFeature(feature, layer) {
            layer.on({
                mouseover: highlightFeature,
                mouseout: resetHighlight
            });
            let neighbourhood = feature.properties.neighbourhood;  
            let avgPrice = avgPriceByNeighbourhood[neighbourhood] || 'No data';
            layer.bindPopup(`<strong>Neighbourhood: ${neighbourhood}</strong><br>Average Price: $${avgPrice}`);
        }

        geoJsonLayer = L.geoJson(neighbourhoodsData, {
            style: style,
            onEachFeature: onEachFeature
        }).addTo(myMap);

        // Set up the legend
        let legend = L.control({ position: "bottomright" });
        legend.onAdd = function() {
            let div = L.DomUtil.create("div", "info legend");
            div.style.backgroundColor = "white"; 
            div.style.padding = "10px";    

            // Add the title
            div.innerHTML = "<h4>Average Nightly Price</h4>";

            // Define the grades and their labels
            let grades = [0, 100, 150, 200, 250, 300, 350, 450];

            // Add the color ranges with sample colors
            grades.forEach(function(grade, index) {
                // Generate a sample color for each range
                let color = getColor(grade + 1);
                div.innerHTML +=
                    '<i style="background:' + color + '; width: 20px; height: 20px; display: inline-block; margin-right: 5px;"></i> ' +
                    grade + (grades[index + 1] ? '&ndash;' + grades[index + 1] + '<br>' : '+');
            });

            return div;
        };

        legend.addTo(myMap);

        // Update map on dropdown change
        neighbourhoodSelect.addEventListener('change', function() {
            let selectedNeighbourhood = this.value;
            let selectedFeature = neighbourhoodsData.features.find(
                feature => feature.properties.neighbourhood === selectedNeighbourhood
            );

            if (selectedFeature) {
                let bounds = L.geoJSON(selectedFeature).getBounds();
                myMap.fitBounds(bounds);

                // Reset previously highlighted feature and highlight new one
                resetHighlight();
                previousHighlight = selectedNeighbourhood;
                geoJsonLayer.eachLayer(layer => {
                    if (layer.feature.properties.neighbourhood === selectedNeighbourhood) {
                        let avgPrice = avgPriceByNeighbourhood[selectedNeighbourhood] || 0;
                        layer.setStyle({
                            fillColor: getColor(avgPrice),
                            weight: 5,
                            color: '#666',
                            dashArray: '',
                            fillOpacity: 0.7
                        });
                    }
                });
            }
        });
    }).catch(error => console.error('Error loading listings data:', error));
}).catch(error => console.error('Error loading neighbourhoods data:', error));