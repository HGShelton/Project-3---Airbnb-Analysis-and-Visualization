// Initialize the map
let myMap = L.map("map", {
    center: [42.3601, -71.0589],
    zoom: 13
});

// Add a tile layer
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(myMap);

// Create a MarkerClusterGroup
let markers = L.markerClusterGroup();

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

// Load and display data
d3.json('http://localhost:3000/api/listings').then(function (data) {
    console.log("Data loaded:", data);

    // Populate the dropdown with property types
    populateDropdown(data);

    // Function to update markers based on selected property type
    function updateMarkers() {
        // Clear existing markers
        markers.clearLayers();

        // Get selected property type from dropdown
        const selectedPropertyType = document.getElementById("propertyTypeDropdown").value.toLowerCase();

        // Filter listings
        const filteredData = data.filter(listing => filterListings(listing, selectedPropertyType));

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
});