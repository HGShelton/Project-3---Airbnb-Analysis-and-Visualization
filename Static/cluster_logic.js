// test-cluster.js
export function createMarkerClusterLayer(map) {
    return new Promise((resolve, reject) => {
        
        d3.json('listings.json').then(function (data) {
            console.log("Data loaded:", data);

            // Create a MarkerClusterGroup
            let markers = L.markerClusterGroup();

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

            data.forEach(function (listing) {
                // Create a new marker for each listing
                let marker = L.marker([listing.latitude, listing.longitude]);

                // Bind popup with listing details
                marker.bindPopup(`<h3>Property Type: ${listing.property_type}</h3><h3>Price: ${listing.price}</h3><br><b>Accommodates: ${listing.accommodates}</b><br><b>Bedrooms: ${listing.bedrooms}</b><br><b>Bathrooms: ${listing.bathrooms}</b>`);

                // Add marker to MarkerClusterGroup
                markers.addLayer(marker);

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

            // Active filters
            let activeAccommodationFilter = null;
            let activePriceFilter = null;

            // Function to apply filters and update markers
            function applyFilters() {
                // Clear current markers
                markers.clearLayers();

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

                // Apply filters if both are set
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

                // Add filtered markers to marker cluster layer
                filteredMarkers.forEach(marker => markers.addLayer(marker));
            }

<<<<<<< HEAD
            // // Listen to overlayadd and overlayremove events
            // map.on('overlayadd', function (eventLayer) {
            //     switch (eventLayer.name) {
            //         case 'Accommodates 1-3':
            //         case 'Accommodates 4-6':
            //         case 'Accommodates 7+':
            //             activeAccommodationFilter = eventLayer.layer;
            //             break;
            //         case '< $150':
            //         case '$150-$300':
            //         case '$301-$550':
            //         case '$551-$1000':
            //         case '> $1000':
            //             activePriceFilter = eventLayer.layer;
            //             break;
            //     }
            //     applyFilters();
            // });

            // map.on('overlayremove', function (eventLayer) {
            //     switch (eventLayer.name) {
            //         case 'Accommodates 1-3':
            //         case 'Accommodates 4-6':
            //         case 'Accommodates 7+':
            //             if (activeAccommodationFilter === eventLayer.layer) {
            //                 activeAccommodationFilter = null;
            //             }
            //             break;
            //         case '< $150':
            //         case '$150-$300':
            //         case '$301-$550':
            //         case '$551-$1000':
            //         case '> $1000':
            //             if (activePriceFilter === eventLayer.layer) {
            //                 activePriceFilter = null;
            //             }
            //             break;
            //     }
            //     applyFilters();
            // });

=======
>>>>>>> shelton
            // Resolve the promise with the created layers
            resolve({
                markers,
                accommodates1to3,
                accommodates4to6,
                accommodates7plus,
                price0to150,
                price151to300,
                price301to550,
                price551to1000,
                price1000plus
            });
        }).catch(error => reject('Error loading data:', error));
    });
<<<<<<< HEAD
}
=======
}

>>>>>>> shelton
