import { useState, useEffect } from "react";
import * as L from "leaflet";
import * as turf from "@turf/turf";
import "leaflet.heat";
import "leaflet/dist/leaflet.css";
import heatmapPoints from "../data/heatmap_points.json";
import censusTrackAreas from "../data/census_track.json"
import type { CensusTrackAreas } from "../../types/turf";
import ShowChartsButton from "./charts/ShowChartsButton";

// Leaflet website for API documentation: https://leafletjs.com/examples/quick-start/
const Map = (): JSX.Element => {
  const [points, setPoints] = useState<number[][]>();
  const [censusBlock, setCensusBlock] = useState<number>();

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
    const censusTrackAreasTyped: CensusTrackAreas = censusTrackAreas;
    let census_track_map: any = {};
    Object.keys(censusTrackAreas).forEach((key) => {
      const points = censusTrackAreasTyped[key]; // Access the value associated with the current key
      const polygon = L.polygon(points);
      census_track_map[key] = polygon;
      polygon
        .setStyle({
          color: "blue", // New stroke color
          fillColor: "white",
          fillOpacity: 0.3, // New fill opacity
          dashArray: "3", // New dash style
          weight: 0.7, // Stroke width
        })
        .addTo(map);
    });

    // popup
    let popUp = L.popup().setLatLng().setContent("I am a standalone popup.");
    map.on("click", function (e: any) {
      // if point is not in any census track, set censusBlock to undefined and return
      let isInsideAny = false;
      Object.keys(census_track_map).forEach((key) => {
        const turf_polygon = turf.polygon([censusTrackAreasTyped[key]]);
        const point = turf.point([e.latlng.lat, e.latlng.lng]);
        const isInside = turf.booleanPointInPolygon(point, turf_polygon);

        if (isInside) {
          census_track_map[key]
            .setStyle({
              color: "blue", // New stroke color
              fillColor: "blue",
              fillOpacity: 0.8, // New fill opacity
              weight: 0.7, // Stroke width
            })
            .addTo(map);
          popUp
            .setLatLng(e.latlng)
            .setContent(
              "You clicked the map at " + e.latlng.toString() + " in " + key,
            )
            .openOn(map);
          
          // set state
          isInsideAny = true;
          setPoints([e.latlng.lat, e.latlng.lng]);
          setCensusBlock(parseInt(key));
        } else {
          census_track_map[key].setStyle({
            color: "blue", // New stroke color
            fillColor: "white",
            fillOpacity: 0.3, // New fill opacity
            dashArray: "3", // New dash style
            weight: 0.7, // Stroke width
          });
        }
      });

      // if point is not in any census track, set censusBlock to undefined and return
      if (!isInsideAny) {
        setCensusBlock(undefined);
      }
    });
  }, []);

  return (
    <>
      <div className="w-[60vw] bg-gray-50">
        <div id="map" style={{ height: "60vh" }}></div>
      </div>
      <ShowChartsButton censusBlock={censusBlock} />
    </>
  );
};

export default Map;
