import { useEffect } from "react";
import L from "leaflet";
import "leaflet.heat";
import "leaflet/dist/leaflet.css";
import heatmapPoints from "../data/heatmap_points.json";

// Leaflet website for API documentation: https://leafletjs.com/examples/quick-start/
const Map = (): JSX.Element => {
  useEffect(() => {

    // draw map
    const map = L.map("map").setView(
      [39.99269824882205, -75.15686301406642],
      12,
    );
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    }).addTo(map);
    
    // plot points on heatmap
    const points = heatmapPoints
      ? heatmapPoints.map((p) => {
          return [p[0], p[1]];
        })
      : [];
    L.heatLayer(points).addTo(map);


    // add polygon on the map (demo)
    var polygon = L.polygon([
      [39.99269824882205, -75.15686301406642],
      [39.99269824882205, -75.14686301406642],
      [39.98269824882205, -75.15686301406642]
    ]);
    polygon.addTo(map);

    // popup
    let popUp = L.popup().setLatLng().setContent("I am a standalone popup.");
    map.on("click", function (e: any) {
      popUp
        .setLatLng(e.latlng)
        .setContent("You clicked the map at " + e.latlng.toString())
        .openOn(map);
    });
  }, []);

  return (
    <div className="w-[60vw] bg-gray-50">
      <div id="map" style={{ height: "60vh" }}></div>
    </div>
  );
};

export default Map;
