import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import { useState } from "react";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { Tabs, Tab, Box } from "@mui/material";

// Custom marker icon
const droneIcon = new L.Icon({
  iconUrl: "https://img.icons8.com/?size=40&id=36253&format=png",
  iconSize: [32, 32],
});

type Drone = {
  id: string;
  name: string;
  lat: number;
  lng: number;
  status: string;
  history: { date: string; location: string }[];
};

interface Props {
  drones: Drone[];
}

export default function DroneMap({ drones }: Props) {
  const [tabIndex, setTabIndex] = useState(0);

  return (
    <MapContainer
      center={[31.963158, 35.930359]}  
      zoom={8}
      style={{ height: "100vh", width: "100%" }}
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; OpenStreetMap contributors'
      />

      {drones.map((drone) => (
        <Marker
          key={drone.id}
          position={[drone.lat, drone.lng]}
          icon={droneIcon}
        >
          <Popup>
            {/* Tabs */}
            <Tabs
              value={tabIndex}
              onChange={(_, val) => setTabIndex(val)}
              aria-label="drone popup tabs"
            >
              <Tab label="Drone Details" />
              <Tab label="Flight History" />
            </Tabs>

            {/* Tab Panels */}
            <Box sx={{ p: 2 }}>
              {tabIndex === 0 && (
                <div>
                  <h4>{drone.name}</h4>
                  <p><b>Status:</b> {drone.status}</p>
                  <p><b>Location:</b> {drone.lat}, {drone.lng}</p>
                </div>
              )}
              {tabIndex === 1 && (
                <div>
                  <h4>Flight History</h4>
                  <ul>
                    {drone.history.map((h, i) => (
                      <li key={i}>
                        {h.date} - {h.location}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </Box>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}
