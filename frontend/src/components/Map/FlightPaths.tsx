import { useEffect, useRef } from "react"; 
import type { Drone } from "../../App";

interface FlightPathsProps {
  map: mapboxgl.Map | null;
  drones: Drone[];
}

const FlightPaths: React.FC<FlightPathsProps> = ({ map, drones }) => {
  const sourcesAdded = useRef<Set<string>>(new Set());

  useEffect(() => {
    if (!map) return;

    if (!map.isStyleLoaded()) {
      map.on("styledata", () => {
        if (map.isStyleLoaded()) {
          updateFlightPaths(map);
        }
      });
    } else {
      updateFlightPaths(map);
    }

    function updateFlightPaths(activeMap: mapboxgl.Map) {
      const dronesByRegistration = drones.reduce((acc, drone) => {
        const registration = drone.registration || "Unknown";
        if (!acc[registration]) {
          acc[registration] = [];
        }
        acc[registration].push(drone);
        return acc;
      }, {} as Record<string, Drone[]>);

      Object.entries(dronesByRegistration).forEach(([registration, registrationDrones]) => {
        if (registrationDrones.length < 2) return;

        const sourceId = `registration-connections-${registration}`;
        const layerId = `registration-connections-layer-${registration}`;

        const currentPositions = registrationDrones
          .filter((drone) => drone.path.length > 0)
          .map((drone) => {
            const lastPosition = drone.path[drone.path.length - 1];
            return {
              serial: drone.serial,
              position: [lastPosition.lng, lastPosition.lat] as [number, number],
              color: drone.color,
            };
          });

        const connectionFeatures: any[] = [];

        for (let i = 0; i < currentPositions.length; i++) {
          for (let j = i + 1; j < currentPositions.length; j++) {
            const drone1 = currentPositions[i];
            const drone2 = currentPositions[j];

            let lineColor = "#e74c3c";
            if (drone1.color === "green" && drone2.color === "green") {
              lineColor = "#2ecc71";
            } else if (drone1.color === "green" || drone2.color === "green") {
              lineColor = "#f39c12";
            }

            connectionFeatures.push({
              type: "Feature" as const,
              properties: {
                registration,
                connectionId: `${registration}-${i}-${j}`,
                drone1Serial: drone1.serial,
                drone2Serial: drone2.serial,
                drone1Color: drone1.color,
                drone2Color: drone2.color,
                lineColor,
              },
              geometry: {
                type: "LineString" as const,
                coordinates: [drone1.position, drone2.position],
              },
            });
          }
        }

        const geojson = {
          type: "FeatureCollection" as const,
          features: connectionFeatures,
        };

        if (activeMap.getSource(sourceId)) {
    
          (activeMap.getSource(sourceId) as mapboxgl.GeoJSONSource).setData(geojson);
        } else {
     
          activeMap.addSource(sourceId, {
            type: "geojson",
            data: geojson,
          });

          activeMap.addLayer({
            id: layerId,
            type: "line",
            source: sourceId,
            layout: {
              "line-join": "round",
              "line-cap": "round",
            },
            paint: {
              "line-color": ["get", "lineColor"],
              "line-width": 3,
              "line-opacity": 1,
            },
          });

          sourcesAdded.current.add(sourceId);
        }
      });
 
      const currentRegistrations = new Set(drones.map((d) => d.registration || "Unknown"));
      sourcesAdded.current.forEach((sourceId) => {
        const registration = sourceId.replace("registration-connections-", "");
        if (!currentRegistrations.has(registration)) {
          const layerId = `registration-connections-layer-${registration}`;
          if (activeMap.getLayer(layerId)) {
            activeMap.removeLayer(layerId);
          }
          if (activeMap.getSource(sourceId)) {
            activeMap.removeSource(sourceId);
          }
          sourcesAdded.current.delete(sourceId);
        }
      });
    }
  }, [map, drones]);

  return null;
};

export default FlightPaths;
