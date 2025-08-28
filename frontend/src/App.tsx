import { useEffect, useState } from "react";
import { io } from "socket.io-client";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Menu from "./components/UI/Menu";
import Sidebar from "./components/UI/Sidebar";
import Maps from "./components/Map/Map";

const socket = io("http://localhost:9013");

type Drone = {
  serial: string;
  registration: string;
  name: string;
  altitude: number;
  yaw: number;
  pilot: string;
  organization: string;
  path: { lat: number; lng: number }[];
  color: "red" | "green";
};

function App() {
  const [drones, setDrones] = useState<Record<string, Drone>>({});

  useEffect(() => {
    socket.on("message", (data) => {
      if (!data || !data.features) return;

      setDrones((prev) => {
        const updated = { ...prev };

        data.features.forEach((f: any) => {
          const props = f.properties;
          const coords = f.geometry.coordinates;

          // check the first letter after SD-
          const regPart = props.registration.split("-")[1];
          const color = regPart && regPart[0] === "B" ? "green" : "red";

          if (updated[props.serial]) {
            updated[props.serial] = {
              ...updated[props.serial],
              altitude: props.altitude,
              yaw: props.yaw,
              path: [...updated[props.serial].path, { lat: coords[1], lng: coords[0] }],
            };
          } else {
            updated[props.serial] = {
              serial: props.serial,
              registration: props.registration,
              name: props.Name,
              altitude: props.altitude,
              yaw: props.yaw,
              pilot: props.pilot,
              organization: props.organization,
              path: [{ lat: coords[1], lng: coords[0] }],
              color,
            };
          }
        });

        return updated;
      });
    });

    return () => {
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
             <Route path="/map" element={<Maps drones={Object.values(drones)} />} />
            </Routes>
          </div>
        </main>
      </div>
    </Router>
  );
}

export default App;
