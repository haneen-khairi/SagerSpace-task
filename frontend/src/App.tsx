import { useEffect, useState, useRef } from "react";
import { io } from "socket.io-client";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Menu from "./components/UI/Menu";
import Sidebar from "./components/UI/Sidebar";
import Maps from "./components/Map/Map";

const socket = io("http://localhost:9013");
 
const MAX_DRONES = 200;       
const MAX_PATH_POINTS = 50;   

export type Drone = {
  serial: string;
  registration: string;
  name: string;
  altitude: number;
  yaw: number;
  pilot: string;
  organization: string;
  path: { lat: number; lng: number }[];
  color: "red" | "green";
  updatedAt: number;            
};

function App() {
  const [drones, setDrones] = useState<Record<string, Drone>>({});
  const mounted = useRef(false);

  useEffect(() => {
    mounted.current = true;

    socket.on("message", (data: any) => { 
      if (!data || data.type !== "FeatureCollection" || !Array.isArray(data.features)) return;

      setDrones(prev => {
        const updated = { ...prev };

        data.features.forEach((f: any) => {
          const props = f?.properties ?? {};
          const coords = f?.geometry?.coordinates;  
          if (!props?.serial || !Array.isArray(coords) || coords.length < 2) return;

          const regPart = (props.registration || "").split("-")[1] || "";
          const color: "red" | "green" = regPart[0] === "B" ? "green" : "red";
          const lat = coords[1];
          const lng = coords[0];

          if (updated[props.serial]) {
            const d = updated[props.serial];
            const newPath = d.path.length >= MAX_PATH_POINTS
              ? [...d.path.slice(1), { lat, lng }]
              : [...d.path, { lat, lng }];

            updated[props.serial] = {
              ...d,
              altitude: props.altitude ?? d.altitude,
              yaw: props.yaw ?? d.yaw,
              path: newPath,
              color,
              updatedAt: Date.now(),
            };
          } else {
            updated[props.serial] = {
              serial: props.serial,
              registration: props.registration || "",
              name: props.Name || "Unknown",
              altitude: props.altitude ?? 0,
              yaw: props.yaw ?? 0,
              pilot: props.pilot || "Unknown",
              organization: props.organization || "Unknown",
              path: [{ lat, lng }],
              color,
              updatedAt: Date.now(),
            };
          }
        }); 
        const keys = Object.keys(updated);
        if (keys.length > MAX_DRONES) {
          const sorted = keys
            .map(k => ({ k, t: updated[k].updatedAt }))
            .sort((a, b) => a.t - b.t);
          const toDelete = sorted.slice(0, keys.length - MAX_DRONES);
          toDelete.forEach(({ k }) => delete updated[k]);
        }

        return updated;
      });
    });

    return () => {
      mounted.current = false;
      socket.off("message");
    };
  }, []);

  return (
    <Router>
      <div className="dashboard-container">
        <Menu />
        <main className="dashboard-content">
          <Sidebar />
          <div className="dashboard-main">
            <Routes> 
              <Route path="/" element={<Maps drones={Object.values(drones)} />} />
            </Routes>
          </div>
        </main>
      </div>
    </Router>
  );
}

export default App;
