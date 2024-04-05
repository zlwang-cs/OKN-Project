import { useEffect } from "react";
import * as turf from '@turf/turf';
import L from "leaflet";
import "leaflet.heat";
import "leaflet/dist/leaflet.css";
import heatmapPoints from "../data/heatmap_points.json";
import censusTrackAreas from "../data/census_track.json";

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

    // plot areas of census track
    let census_track_map = {}
    Object.keys(censusTrackAreas).forEach(key => {
      const points = censusTrackAreas[key]; // Access the value associated with the current key
      const polygon = L.polygon(points);
      census_track_map[key] = polygon;
      polygon.setStyle({
        color: 'blue', // New stroke color
        fillColor: 'white',
        fillOpacity: 0.3, // New fill opacity
        dashArray: '3', // New dash style
        weight: 0.7 // Stroke width
      }).addTo(map);
    });

    // popup
    let popUp = L.popup().setLatLng().setContent("I am a standalone popup.");
    map.on("click", function (e: any) {
      Object.keys(census_track_map).forEach(key => {
        const polygon = census_track_map[key];

        const turf_polygon = turf.polygon([censusTrackAreas[key]]);
        const point = turf.point([e.latlng.lat, e.latlng.lng]);
        const isInside = turf.booleanPointInPolygon(point, turf_polygon);

        if (isInside) {
          polygon.setStyle({
            color: 'blue', // New stroke color
            fillColor: 'blue',
            fillOpacity: 0.8, // New fill opacity
            weight: 0.7 // Stroke width
          }).addTo(map);
          popUp
            .setLatLng(e.latlng)
            .setContent("You clicked the map at " + e.latlng.toString() + " in " + key)
            .openOn(map);
        } else {
          polygon.setStyle({
            color: 'blue', // New stroke color
            fillColor: 'white',
            fillOpacity: 0.3, // New fill opacity
            dashArray: '3', // New dash style
            weight: 0.7 // Stroke width
          });
        }
      });
    });
  }, []);

  return (
    <div className="w-[60vw] bg-gray-50">
      <div id="map" style={{ height: "60vh" }}></div>
    </div>
  );
};

export default Map;
