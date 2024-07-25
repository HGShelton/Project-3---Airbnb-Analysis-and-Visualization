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
}
