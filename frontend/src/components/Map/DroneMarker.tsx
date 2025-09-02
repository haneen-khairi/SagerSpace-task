import { useEffect } from "react";
import mapboxgl from "mapbox-gl";

interface Drone {
  registration: string;
  path: { lat: number; lng: number }[];
  color: "red" | "green";
}

interface Props {
  map: mapboxgl.Map | null;
  drones: Drone[];
  markersRef: React.MutableRefObject<Record<string, mapboxgl.Marker>>;
}

export default function DroneMarker({ map, drones, markersRef }: Props) {
  useEffect(() => {
    if (!map) return;

    drones.forEach((drone) => {
      const last = drone.path[drone.path.length - 1];
      if (!last) return;
      const reg = drone.registration;

      // --- Marker ---
      if (markersRef.current[reg]) {
        markersRef.current[reg].setLngLat([last.lng, last.lat]);
      } else {
        const el = document.createElement("div");
        el.style.width = "20px";
        el.style.height = "20px";
        el.style.backgroundColor = drone.color;
        el.style.borderRadius = "50%";

        markersRef.current[reg] = new mapboxgl.Marker(el)
          .setLngLat([last.lng, last.lat])
          .setPopup(
            new mapboxgl.Popup({ offset: 25 }).setHTML(
              `<strong>${drone.registration}</strong>`
            )
          )
          .addTo(map);
      }

      // --- Polyline ---
      const lineId = `line-${reg}`;
      const geojson = {
        type: "Feature",
        geometry: {
          type: "LineString",
          coordinates: drone.path.map((p) => [p.lng, p.lat]),
        },
      };

      if (map.getSource(lineId)) {
        (map.getSource(lineId) as mapboxgl.GeoJSONSource).setData(geojson);
      } else {
        map.addSource(lineId, { type: "geojson", data: geojson });
        map.addLayer({
          id: lineId,
          type: "line",
          source: lineId,
          paint: { "line-color": "#3498db", "line-width": 3 },
        });
      }
    });
  }, [map, drones]);
}