import React, { useEffect, useRef } from "react";
import * as L from "leaflet";
import * as turf from "@turf/turf";
import "leaflet.heat";
import "leaflet/dist/leaflet.css";
import { useStore } from '@nanostores/react';
import { selectedCensusBlocks } from '../stores/censusStore';
import heatmapPoints from "../data/heatmap_points.json";
import censusTrackAreas from "../data/census_track.json";
import type { CensusTrackAreas } from "../../types/turf";
import ShowChartsButton from "./charts/ShowChartsButton";

const Map = (): JSX.Element => {
  const censusBlocks = useStore(selectedCensusBlocks);
  const mapRef = useRef<any>(null);
  const censusTrackMapRef = useRef<any>({});

  useEffect(() => {
    if (!mapRef.current) {
      const map = L.map("map").setView([39.99269824882205, -75.15686301406642], 12);
      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      }).addTo(map);
      mapRef.current = map;

      const points = heatmapPoints ? heatmapPoints.map((p) => [p[0], p[1]]) : [];
      L.heatLayer(points).addTo(map);

      const censusTrackAreasTyped: CensusTrackAreas = censusTrackAreas;
      Object.keys(censusTrackAreas).forEach((key) => {
        const points = censusTrackAreasTyped[key];
        const polygon = L.polygon(points);
        censusTrackMapRef.current[key] = polygon;
        polygon
          .setStyle({
            color: "blue",
            fillColor: "white",
            fillOpacity: 0.3,
            dashArray: "3",
            weight: 0.7,
          })
          .addTo(map);
      });

      const popUp = L.popup().setLatLng().setContent("I am a standalone popup.");
      map.on("click", (e: any) => {
        let isInsideAny = false;
        const currentCensusBlocks = selectedCensusBlocks.get();

        Object.keys(censusTrackMapRef.current).forEach((key) => {
          const turfPolygon = turf.polygon([censusTrackAreasTyped[key]]);
          const point = turf.point([e.latlng.lat, e.latlng.lng]);
          const isInside = turf.booleanPointInPolygon(point, turfPolygon);

          if (isInside) {
            censusTrackMapRef.current[key]
              .setStyle({
                color: "blue",
                fillColor: "blue",
                fillOpacity: 0.8,
                weight: 0.7,
              })
              .addTo(map);

            isInsideAny = true;
            if (!currentCensusBlocks.includes(parseInt(key))) {
              popUp
              .setLatLng(e.latlng)
              .setContent("You clicked the map at " + e.latlng.toString() + " in " + key)
              .openOn(map);

              // add the block to the selected blocks
              selectedCensusBlocks.set([...currentCensusBlocks, parseInt(key)]);
            } else {
              // remove the block from the selected blocks
              selectedCensusBlocks.set(currentCensusBlocks.filter((b) => b !== parseInt(key)));
            }
          } else {
            censusTrackMapRef.current[key].setStyle({
              color: "blue",
              fillColor: "white",
              fillOpacity: 0.3,
              dashArray: "3",
              weight: 0.7,
            });
          }
        });

        if (!isInsideAny) {
          selectedCensusBlocks.set([]);
        }
      });
    }
  }, []);

  useEffect(() => {
    // Update styles for selected blocks without reinitializing the map
    Object.keys(censusTrackMapRef.current).forEach((key) => {
      if (censusBlocks.includes(parseInt(key))) {
        censusTrackMapRef.current[key].setStyle({
          color: "blue",
          fillColor: "blue",
          fillOpacity: 0.8,
          weight: 0.7,
        });
      } else {
        censusTrackMapRef.current[key].setStyle({
          color: "blue",
          fillColor: "white",
          fillOpacity: 0.3,
          dashArray: "3",
          weight: 0.7,
        });
      }
    });
  }, [censusBlocks]);

  return (
    <>
      <button 
        className="bg-blue-500 hover:bg-blue-700 text-white text-sm py-1 px-2 rounded mb-2"
        onClick={() => selectedCensusBlocks.set([])}
      >
        Clear Selection
      </button>
      <div className="w-[60vw] bg-gray-50">
        <div id="map" style={{ height: "60vh" }}></div>
      </div>
      <ShowChartsButton censusBlock={censusBlocks} />
    </>
  );
};

export default Map;
