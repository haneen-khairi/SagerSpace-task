import { useEffect, useRef, useState } from "react";
import mapboxgl from "mapbox-gl";
import MapPopup from "../UI/MapPopup";
import "../../../styles/Map.scss";
import "mapbox-gl/dist/mapbox-gl.css";
import type { Drone } from "../../App";
import DroneNumber from "./DroneNumber";
import DroneMarker from "./DroneMarker";

mapboxgl.accessToken =
  "pk.eyJ1IjoiaGFuZWVueW91c2VmIiwiYSI6ImNtZXI4b20xbTAzczQybnF0cXdzMmlqc3oifQ.dB9XSIFL1eH-4IcXxzkBDA";

interface MapProps {
  drones: Drone[];
}

const Map: React.FC<MapProps> = ({ drones }) => {
  const mapContainer = useRef<HTMLDivElement | null>(null);
  const [map, setMap] = useState<mapboxgl.Map | null>(null);

  useEffect(() => {
    if (map || !mapContainer.current) return;

    const mapInstance = new mapboxgl.Map({
      container: mapContainer.current,
      style: "mapbox://styles/haneenyousef/cmesij4bq00cc01qw2cn19fi1",
      center: [35.9313, 31.9487],
      zoom: 12.5,
    });

    setMap(mapInstance);
  }, [map]);

  return (
    <div className="map-page">
      <div ref={mapContainer} style={{ width: "100%", height: "100vh" }} />
      {map && <DroneMarker map={map} drones={drones} />}
      <MapPopup drones={drones} />
      <DroneNumber drones={drones} />
    </div>
  );
};

export default Map;
