export function createMarkerClusterLayer(map) {
    return new Promise((resolve, reject) => {
        // Call data
        d3.json("listings.json").then(function (data) {
            console.log("Data loaded:", data);

            // Create a MarkerClusterGroup
            let markers = L.markerClusterGroup();

            data.forEach(function (listing) {
                // Create a new marker for each listing
                let marker = L.marker([listing.latitude, listing.longitude]);

                // Add marker to MarkerClusterGroup
                markers.addLayer(marker);

                // Bind popup with listing
                marker.bindPopup(`<h3>Property Type: ${listing.property_type}</h3><h3>Price: ${listing.price}</h3><br><b>Accommodates: ${listing.accommodates}</b><br><b>Bedrooms: ${listing.bedrooms}</b><br><b>Bathrooms: ${listing.bathrooms}</b>`);
                
                // data.forEach(listing => {
                //     let prices = parseFloat(listing.price.replace('$', ''));
                //     let value = listing.accommodates;
        
                //     let marker = L.marker([listing.latitude, listing.longitude]);
        
                //     // Add marker to the map
                //     marker.addTo(myMap);
                    
                //     // Price range
                //     if (prices >= 0 && prices <= 150) {
                //         marker.addTo(price0to150);
                //     } else if (prices >= 151 && prices <= 300) {
                //         marker.addTo(price151to300);
                //     } else if (prices >= 301 && prices <= 550) {
                //         marker.addTo(price301to550);
                //     } else if (prices >= 551 && prices <= 1000) {
                //         marker.addTo(price551to1000);
                //     } else {
                //         marker.addTo(price1000plus);
                //     };
                    
                //     // Accomdates range
                //     if (value >= 1 && value <= 3) {
                //         marker.addTo(accommodates1to3);
                //     } else if (value >= 4 && value <= 6) {
                //         marker.addTo(accommodates4to6);
                //     } else {
                //         marker.addTo(accommodates7plus);
                //     }
                // });
        
            // Resolve the Promise with the marker cluster group once all markers are added
            resolve(markers);

            }).catch(error => {
            reject(error)
            }); // Reject the Promise if there is an error loading data
        });
    });
}

  

