import React, { useEffect, useRef, useState } from "react";
import mapboxgl from "mapbox-gl";
import { io } from "socket.io-client";
import DroneMarker from "./DroneMarker";
import MapPopup from "./MapPopup";

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

export default function Map() {
  const mapContainer = useRef<HTMLDivElement | null>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const [drones, setDrones] = useState<Drone[]>([]);
  const markersRef = useRef<Record<string, mapboxgl.Marker>>({});

  useEffect(() => {
    map.current = new mapboxgl.Map({
      container: mapContainer.current!,
      style: "mapbox://styles/mapbox/streets-v11",
      center: [35.91, 31.95],
      zoom: 6,
    });

    const socket = io("http://localhost:9013");

    socket.on("message", (data: Drone[]) => {
      // For each drone, update path
      const updatedDrones = data.map((d) => {
        const existing = drones.find((dr) => dr.registration === d.registration);
        if (existing) {
          return { ...d, path: [...existing.path, { lat: d.path[d.path.length-1].lat, lng: d.path[d.path.length-1].lng }] };
        } else {
          return { ...d, path: [{ lat: d.path[d.path.length-1].lat, lng: d.path[d.path.length-1].lng }] };
        }
      });
      setDrones(updatedDrones);
    });

    return () => socket.disconnect();
  }, [drones]);

  return (
    <>
      <div ref={mapContainer} className="w-full h-screen" />
      <DroneMarker map={map.current} drones={drones} markersRef={markersRef} />
      <MapPopup drones={drones} map={map.current} markersRef={markersRef} />
    </>
  );
}