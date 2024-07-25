// test-choro-logic.js
export function createChoroplethLayer(map) {
    return new Promise((resolve, reject) => {
        // Load the neighbourhood boundaries GeoJSON data
        d3.json('/Resources/neighbourhoods.geojson').then(function (neighbourhoodsData) {
            console.log('Neighbourhood data loaded successfully:', neighbourhoodsData);

            // Load the listings data
            d3.json('listings.json').then(function (listingsData) {
                console.log('Listings data loaded successfully:', listingsData);

                // Aggregate price data by neighbourhood
                let priceByNeighbourhood = {};
                listingsData.forEach(item => {
                    let neighbourhood = item.neighbourhood;
                    let price = item.price;

                    // Remove any non-numeric characters and convert to number
                    if (price) {
                        price = parseFloat(price.replace(/[^0-9.-]+/g, ''));
                    }

                    // Skip if price is missing or not a number
                    if (isNaN(price)) return;

                    if (!priceByNeighbourhood[neighbourhood]) {
                        priceByNeighbourhood[neighbourhood] = [];
                    }
                    priceByNeighbourhood[neighbourhood].push(price);
                });

                // Calculate average price by neighbourhood
                const avgPriceByNeighbourhood = {};
                for (const neighbourhood in priceByNeighbourhood) {
                    const prices = priceByNeighbourhood[neighbourhood];
                    if (prices.length > 0) {
                        const avgPrice = prices.reduce((a, b) => a + b, 0) / prices.length;
                        avgPriceByNeighbourhood[neighbourhood] = parseFloat(avgPrice.toFixed(2));
                    } else {
                        avgPriceByNeighbourhood[neighbourhood] = 0; // Default to 0 if no valid prices
                    }
                }

                console.log('Price by neighbourhood:', priceByNeighbourhood);
                console.log('Average price by neighbourhood:', avgPriceByNeighbourhood);

                let geoJsonLayer;

                // Function to get color based on price
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

                // Style for each feature
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

                // Reset highlight
                function resetHighlight() {
                    geoJsonLayer.eachLayer(layer => {
                        let neighbourhood = layer.feature.properties.neighbourhood;
                        let avgPrice = avgPriceByNeighbourhood[neighbourhood] || 0;
                        layer.setStyle({
                            fillColor: getColor(avgPrice),
                            weight: 2,
                            opacity: 1,
                            color: 'white',
                            dashArray: '3',
                            fillOpacity: 0.7
                        });
                    });
                }

                // Highlight feature
                function highlightFeature(e) {
                    let layer = e.target;
                    layer.setStyle({
                        weight: 5,
                        color: '#666',
                        dashArray: '',
                        fillOpacity: 0.7
                    });
                }

                // For each feature
                function onEachFeature(feature, layer) {
                    layer.on({
                        mouseover: highlightFeature,
                        mouseout: resetHighlight
                    });
                    let neighbourhood = feature.properties.neighbourhood;  
                    let avgPrice = avgPriceByNeighbourhood[neighbourhood] || 'No data';
                    layer.bindPopup(`<strong>Neighbourhood: ${neighbourhood}</strong><br>Average Price: $${avgPrice}`);
                }

                // Create geoJsonLayer
                geoJsonLayer = L.geoJson(neighbourhoodsData, {
                    style: style,
                    onEachFeature: onEachFeature
                });

                // Add the layer to the map
                geoJsonLayer.addTo(map);

                // Set up the legend
                let legend = L.control({ position: "bottomright" });
                legend.onAdd = function () {
                    let div = L.DomUtil.create("div", "info legend");
                    div.style.backgroundColor = "white";
                    div.style.padding = "10px";

                    // Add the title
                    div.innerHTML = "<h4 style='margin-top: 0; margin-bottom: 10px;'>Average Nightly Price ($)</h4>";

                    // Define the grades and their labels
                    let grades = [0, 100, 150, 200, 250, 300, 350, 450];

                    // Add the color ranges with sample colors
                    grades.forEach(function (grade, index) {
                        let color = getColor(grade + 1);
                        div.innerHTML +=
                            '<i style="background:' + color + '; width: 20px; height: 20px; display: inline-block; margin-right: 5px;"></i> ' +
                            grade + (grades[index + 1] ? '&ndash;' + grades[index + 1] + '<br>' : '+');
                    });
                    return div;
                };

                legend.addTo(map);

                // Resolve the promise with the geoJsonLayer
                resolve(geoJsonLayer);

            }).catch(error => reject('Error loading listings data:', error));
        }).catch(error => reject('Error loading neighbourhoods data:', error));
    });
}