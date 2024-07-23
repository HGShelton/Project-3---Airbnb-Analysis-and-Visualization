//Define a map object
let myMap = L.map("map", {
    center: [42.3601, -71.0589],
    zoom: 13
});

// Add a tile layer
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(myMap);

// Create layer groups
let accommodates = L.layerGroup();
let price = L.layerGroup();

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
        marker.on('mouseover',function(){
            marker.bindPopup(`<h3>Property Type: ${listing.property_type}</h3><h3>Price: ${listing.price}</h3><br><b>Accommodates: ${listing.accommodates}</b><br><b>Bedrooms: ${listing.bedrooms}</b><b>Bathrooms:${listing.bathrooms}</b>`).openPopup();
        });
        marker.on('mouseout', function() {
            marker.closePopup();
        });

        // Determine accommodates value and add marker to accommodates group
        let value = listing.accommodates;
        if (value >= 1 && value <= 3) {
            marker.addTo(accommodates);
        } else if (value >= 4 && value <= 6) {
            marker.addTo(accommodates);
        } else {
            marker.addTo(accommodates);
        }

        // Determine the price value and add marker to price group
        let prices = listing.price;
        if (prices >= 0 && prices <= 150) {
            marker.addTo(price);
        } else if (prices >= 151 && prices <= 300) {
            marker.addTo(price);
        } else if (prices >= 301 && prices <= 550) {
            marker.addTo(price);
        } else if (prices >= 551 && prices <= 1000) {
            marker.addTo(price);
        } else {
            marker.addTo(price);
        }
    });

        // Add MarkerClusterGroup to the map
        myMap.addLayer(markers);

        // Prepare heat map data
        let heatData = data.map(function (listing) {
            return [listing.latitude, listing.longitude];
        });
    
        // Create heat map layer
        L.heatLayer(heatData, {
            radius: 25,
            blur: 15,
            maxZoom: 17,
        }).addTo(myMap);
    
        // Add layer groups to the map
        accommodates.addTo(myMap);
        price.addTo(myMap);
    
        // Create layer control
        let overlayMaps = {
            "1-3": accommodates,
            "4-6": accommodates,
            "7+": accommodates,
            "<$150": price,
            "$150-$300": price,
            "$300-$550": price,
            "$550-$1000": price,
            ">$1000": price
        };
    
        // Add layer control to the map
        L.control.layers(null, overlayMaps).addTo(myMap);
    
    }).catch(error => console.error('Error loading data:', error));
    
//         let value = listing.accommodates;
//         let prices = listing.price;

//         if (value >= 1 && value <= 3) {
//             marker.addTo(accommodates);
//         } else if (value >= 4 && value <= 6) {
//             marker.addTo(accommodates);
//         } else {
//             marker.addTo(accommodates);
//         }

//         if (prices >= 0 && prices <= 150) {
//             marker.addTo(price);
//         } else if (prices >= 151 && prices <= 300) {
//             marker.addTo(price);
//         } else if (prices >= 301 && prices <= 550) {
//             marker.addTo(price);
//         } else if (prices >= 551 && prices <= 1000) {
//             marker.addTo(price);
//         } else {
//             marker.addTo(price);
//         }
//     });

//     myMap.addLayer(markers);

//     // Prepare heat map data
//     let heatData = data.map(function (listing) {
//         return [listing.latitude, listing.longitude];
//     });

//     // Create heat map layer
//     L.heatLayer(heatData, {
//         radius: 25,
//         blur: 15,
//         maxZoom: 17,
//     }).addTo(myMap);

//     // Add the layer groups to the map
//     accommodates.addTo(myMap);
//     price.addTo(myMap);

//     // Create layer control
//     let overlayMaps = {
//         "1-3": accommodates,
//         "4-6": accommodates,
//         "7+": accommodates,
//         "<$150": price,
//         "$150-$300": price,
//         "$300-$550": price,
//         "$550-$1000": price,
//         ">$1000": price
//     };

//     L.control.layers(null, overlayMaps).addTo(myMap);
// }).catch(error => console.error('Error loading data:', error));



// // Create subgroups for accommodates
// let group1to3 = L.layerGroup().addTo(accommodates);
// let group4to6 = L.layerGroup().addTo(accommodates);
// let group7plus = L.layerGroup().addTo(accommodates);

// // Create subgroups for price
// let price0to150 = L.layerGroup().addTo(price);
// let price151to300 = L.layerGroup().addTo(price);
// let price301to550 = L.layerGroup().addTo(price);
// let price551to1000 = L.layerGroup().addTo(price);
// let price1000plus = L.layerGroup().addTo(price);

// // data.forEach(function (listing) {
// //     let value = listing.accommodates; 

// //     if (value >= 1 && value <= 3) {
// //         L.marker([listing.latitude, listing.longitude]).addTo(group1to3);
// //     } else if (value >= 4 && value <= 6) {
// //         L.marker([listing.latitude, listing.longitude]).addTo(group4to6);
// //     } else {
// //         L.marker([listing.latitude, listing.longitude]).addTo(group7plus);
// //     }

// //     let prices = listing.price;

// //     if (prices >= 0 && prices <= 150) {
// //         L.marker([listing.latitude, listing.longitude]).addTo(price0to150);
// //     } else if (prices >= 151 && prices <= 300) {
// //         L.marker([listing.latitude, listing.longitude]).addTo(price151to300);
// //     } else if (prices >= 301 && prices <= 550) {
// //         L.marker([listing.latitude, listing.longitude]).addTo(price301to550);
// //     } else if (prices >= 551 && prices <= 1000) {
// //         L.marker([listing.latitude, listing.longitude]).addTo(price551to1000);
// //     } else {
// //         L.marker([listing.latitude, listing.longitude]).addTo(price1000plus);    
// //     }
// // });

// // Add the layer groups to the map
// accommodates.addTo(myMap);
// price.addTo(myMap);

// // Create layer control
// var overlayMaps = {
//     "1-3": group1to3,
//     "4-6": group4to6,
//     "7+": group7plus,
//     "<$150": price0to150,
//     "$150-$300": price151to300,
//     "$300-$550": price301to550,
//     "$550-$1000": price551to1000,
//     ">$1000": price1000plus
// };

// L.control.layers(null, overlayMaps).addTo(myMap);


//     });

//     myMap.addLayer(markers);

//     // Prepare heat map data
//     let heatData = data.map(function (listing) {
//         return [listing.latitude, listing.longitude];
//     });

//     // Create heat map layer
//     L.heatLayer(heatData, {
//         radius: 25,
//         blur: 15,
//         maxZoom: 17,
//     }).addTo(myMap);

//     let value = listing.accommodates; 

//     if (value >= 1 && value <= 3) {
//         L.marker([listing.latitude, listing.longitude]).addTo(group1to3);
//     } else if (value >= 4 && value <= 6) {
//         L.marker([listing.latitude, listing.longitude]).addTo(group4to6);
//     } else {
//         L.marker([listing.latitude, listing.longitude]).addTo(group7plus);
//     }

//     let prices = listing.price;

//     if (prices >= 0 && prices <= 150) {
//         L.marker([listing.latitude, listing.longitude]).addTo(price0to150);
//     } else if (prices >= 151 && prices <= 300) {
//         L.marker([listing.latitude, listing.longitude]).addTo(price151to300);
//     } else if (prices >= 301 && prices <= 550) {
//         L.marker([listing.latitude, listing.longitude]).addTo(price301to550);
//     } else if (prices >= 551 && prices <= 1000) {
//         L.marker([listing.latitude, listing.longitude]).addTo(price551to1000);
//     } else {
//         L.marker([listing.latitude, listing.longitude]).addTo(price1000plus);    
//     }
//     // Add the layer groups to the map
//     accommodates.addTo(myMap);
//     price.addTo(myMap);

// }).catch(error => console.error('Error loading data:', error));


// L.control.layers(null, overlayMaps).addTo(myMap);




// //Define a map object
// let myMap = L.map("map", {
//     center: [42.3601, -71.0589],
//     zoom: 13
// });

// // Create base layers
// let street = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
//     attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
// })
// // }).addTo(myMap);

// // let heat = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
// //     attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
// // });

// // Create layer groups
// // let propertyType = L.layerGroup();
// let accommodates = L.layerGroup();
// let price = L.layerGroup();

// // Create subgroups
// // let property = L.layerGroup().addTo(propertyType);
// // let room = L.layerGroup().addTo(propertyType);
// let group1to3 = L.layerGroup().addTo(accomodates);
// let group4to6 = L.layerGroup().addTo(accomodates);
// let group7plus = L.layerGroup().addTo(accomodates);
// let price0to150 = L.layerGroup().addTo(price);
// let price151to300 = L.layerGroup().addTo(price);
// let price301to550 = L.layerGroup().addTo(price);
// let price551to1000 = L.layerGroup().addTo(price);
// let price1000plus = L.layerGroup().addTo(price);

// data.forEach(function(item) {
//     let value = item.accommodates; 

//     if (value >= 1 && value <= 3) {
//         // Add marker to group1to3
//         let marker = L.marker([item.latitude, item.longitude]).addTo(group1to3);
//     } else if (value >= 4 && value <= 6) {
//         // Add marker to group4to6
//         var marker = L.marker([item.latitude, item.longitude]).addTo(group4to6);
//     } else {
//         // Add marker to group7plus
//         var marker = L.marker([item.latitude, item.longitude]).addTo(group7plus);
//     };

//     let prices = item.price;

//     if (prices >= 0 && prices <= 150) {
//         let marker = L.marker([item.latitude, item.longitude]).addTo(price0to150);
//     } else if (prices >= 151 && prices <= 300) {
//         let marker = L.marker([item.latitude, item.longitude]).addTo(price151to300);
//     } else if (prices >= 301 && prices <= 550) {
//         let marker = L.marker([item.latitude, item.longitude]).addTo(price301to550);
//     } else if (prices >= 551 && prices <= 1000) {
//         let marker = L.marker([item.latitude, item.longitude]).addTo(price551to1000);
//     } else {
//         let marker = L.marker([item.latitude, item.longitude]).addTo(group1000plus);    
//     }

// });

// // Add the layer groups to the map
// group1to3.addTo(myMap);
// group4to6.addTo(myMap);
// group7plus.addTo(myMap);
// price0to150.addTo(myMap);
// price151to300.addTo(myMap);
// price301to550.addTo(myMap);
// price551to1000.addTo(myMap);
// price1000plus.addTo(myMap);

// // Create layer control
// var overlayMaps = {
//     "1-3": group1to3,
//     "4-6": group4to6,
//     "7+": group7plus,
//     "<$150": price0to150,
//     "$150-$300": price151to300,
//     "$300-$550": price301to550,
//     "$550-$1000": price551to1000,
//     ">$1000": price1000plus
// };

// L.control.layers(null, overlayMaps).addTo(map);

// // Call data
// d3.json("listings.json").then(function (data) {
//     console.log("Data loaded:", data);

//     // Create a MarkerClusterGroup
//     let markers = L.markerClusterGroup();

//     data.forEach(function (listing) {
//         console.log("Latitude:", listing.latitude, "Longitude:", listing.longitude);
//         let marker = L.marker([listing.latitude, listing.longitude]);
//         markers.addLayer(marker);
//         marker.on('mouseover',function(){
//             marker.bindPopup(`<h3>Property Type: ${listing.property_type}</h3><h3>Price: ${listing.price}</h3><br><b>Accommodates: ${listing.accommodates}</b><br><b>Bedrooms: ${listing.bedrooms}</b><b>Bathrooms:${listing.bathrooms}</b>`).openPopup();
//         });
//         marker.on('mouseout', function() {
//             marker.bindPopup(`<h3>Property Type: ${listing.property_type}</h3><h3>Price: ${listing.price}</h3><br><b>Accommodates: ${listing.accommodates}</b><br><b>Bedrooms: ${listing.bedrooms}</b><b>Bathrooms:${listing.bathrooms}</b>`).closePopup();
//         });
//     });

//     myMap.addLayer(markers);

//     // Prepare heat map data
//     let heatData = data.map(function (listing) {
//         return [listing.latitude, listing.longitude];
//     });

//     // Create heat map layer
//     L.heatLayer(heatData, {
//         radius: 25,  // Adjust the radius as needed
//         blur: 15,    // Adjust the blur intensity as needed
//         maxZoom: 17, // Adjust the max zoom level as needed
//     }).addTo(myMap);

//     myMap.addLayer(heat);

// }).catch(error => console.error('Error loading data:', error));