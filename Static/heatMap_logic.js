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
                maxZoom: 18,
            });

            function createHeatMapLegend() {
                let legend = L.control({ position: 'bottomright' });

                legend.onAdd = function () {
                    let div = L.DomUtil.create('div', 'info legend');
                    div.style.backgroundColor = 'white';
                    div.style.padding = '10px';
                    div.style.borderRadius = '5px';

                    div.innerHTML = `
                        <div style="text-align: center;">
                            <b>Property Density</b><br><br>
                            <i style="background: rgba(255,0,0,0.8); width: 20px; height: 20px; display: inline-block;"></i> High Density<br>
                            <i style="background: rgba(255,255,0,0.8); width: 20px; height: 20px; display: inline-block;"></i> Medium Density<br>
                            <i style="background: rgba(0,0,255,0.8); width: 20px; height: 20px; display: inline-block;"></i> Low Density<br>
                        </div>
                    `;

                    return div;
                };

                return legend;
            }

            let heatMapLegend = createHeatMapLegend();

            resolve({ heatLayer, heatMapLegend });
        }).catch(error => reject(error));
    });
}