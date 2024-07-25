// test-heatMap.js
export function createHeatMap(map) {
    return new Promise((resolve, reject) => {
        d3.json("listings.json").then(function (data) {
            let heatData = data.map(function (listing) {
                return [listing.latitude, listing.longitude];
            });

            let heatLayer = L.heatLayer(heatData, {
                radius: 25,
                blur: 15,
                maxZoom: 17,
            });

            resolve(heatLayer);
        }).catch(error => reject(error));
    });
}