import { useEffect, useRef, useState } from "react";
import mapboxgl from "mapbox-gl";
import io from "socket.io-client";
import MapPopup from "../UI/MapPopup";
import "../../../styles/Map.scss";
import "mapbox-gl/dist/mapbox-gl.css";

mapboxgl.accessToken =
  "pk.eyJ1IjoiaGFuZWVueW91c2VmIiwiYSI6ImNtZXI4b20xbTAzczQybnF0cXdzMmlqc3oifQ.dB9XSIFL1eH-4IcXxzkBDA";

interface Drone {
  serial: string;
  registration: string;
  name: string;
  pilot: string;
  organization: string;
  color: "red" | "green";
  path: { lat: number; lng: number }[];
}
interface MapProps {
  drones: Drone[];
}
const Map: React.FC<MapProps> = ({ drones }) => {
  const mapContainer = useRef<HTMLDivElement | null>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const markersRef = useRef<{ [key: string]: mapboxgl.Marker }>({});
  const [dronesData, setDronesData] = useState<Record<string, Drone>>({}); // renamed state

  useEffect(() => {
    if (map.current) return;
    if (!mapContainer.current) return;

    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: "mapbox://styles/haneenyousef/cmesij4bq00cc01qw2cn19fi1",
      center: [-122.429, 37.787],
      zoom: 13.3,
    });

    const socket = io("http://localhost:9013");

    socket.on("connect", () => {
      console.log("Connected to backend socket:", socket.id);
    });
socket.on("message", (drone: any) => {
  console.log("Received drone:", drone); // Check what the backend sends

  // Determine color dynamically
  const color = drone.registration?.split("-")[1]?.[0] === "B" ? "green" : "red";

  setDronesData((prev) => {
    const updated = { ...prev };

    if (updated[drone.serial]) {
      // append new path points if sent
      if (drone.path) {
        updated[drone.serial].path.push(...drone.path);
      }
    } else {
      updated[drone.serial] = {
        serial: drone.serial,
        registration: drone.registration,
        name: drone.name || "Unknown",
        pilot: drone.pilot || "Unknown",
        organization: drone.organization || "Unknown",
        color,
        path: drone.path || [],
      };
    }

    // Update marker on map
    const lastPoint = updated[drone.serial].path.slice(-1)[0];
    if (lastPoint) {
      if (markersRef.current[drone.serial]) {
        markersRef.current[drone.serial].setLngLat([lastPoint.lng, lastPoint.lat]);
      } else {
        const marker = new mapboxgl.Marker({ color })
          .setLngLat([lastPoint.lng, lastPoint.lat])
          .addTo(map.current!);
        markersRef.current[drone.serial] = marker;
      }
    }

    return updated;
  });
});


    return () => {
      socket.disconnect();
    };
  }, [drones]);
console.log("Current drones state:", Object.values(dronesData));

  return (
    <div className="map-page">
      <div ref={mapContainer} style={{ width: "100%", height: "100vh" }} />
      <MapPopup drones={Object.values(dronesData)} />
      <div className="drone-number">
        <div className="number">{Object.keys(dronesData).length}</div>
        <p>Drone Flying</p>
      </div>
    </div>
  );
};

export default Map;
