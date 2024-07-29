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
<<<<<<< HEAD
                maxZoom: 17,
=======
                maxZoom: 18,
>>>>>>> shelton
            });

            resolve(heatLayer);
        }).catch(error => reject(error));
    });
<<<<<<< HEAD
}
=======
}
>>>>>>> shelton
