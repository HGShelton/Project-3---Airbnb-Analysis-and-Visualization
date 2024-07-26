// test-cluster.js
export function createMarkerClusterLayer(map) {
    return new Promise((resolve, reject) => {
        // Fetch data from the server
        fetch('http://localhost:3000/api/listings')
            .then(response => response.json())
            .then(data => {
                console.log("Data loaded:", data);

                // Create a MarkerClusterGroup
                let markers = L.markerClusterGroup();

                data.forEach(function (listing) {
                    // Create a new marker for each listing
                    let marker = L.marker([listing.latitude, listing.longitude]);

                    // Bind popup with listing details
                    marker.bindPopup(`
                        <h3>Property Type: ${listing.property_type}</h3>
                        <h3>Price: ${listing.price}</h3>
                        <br><b>Accommodates: ${listing.accommodates}</b>
                        <br><b>Bedrooms: ${listing.bedrooms}</b>
                        <br><b>Bathrooms: ${listing.bathrooms}</b>
                    `);

                    // Add marker to MarkerClusterGroup
                    markers.addLayer(marker);
                });

                // Resolve the promise with the MarkerClusterGroup
                resolve(markers);
            })
            .catch(error => reject('Error loading data:', error));
    });
}

  

