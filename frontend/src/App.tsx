import { useEffect, useState } from "react";
import { io } from "socket.io-client";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Menu from "./components/UI/Menu";
import Sidebar from "./components/UI/Sidebar";
import Maps from "./components/Map/Map";

const socket = io("http://localhost:9013");

function App() {
  const [drones, setDrones] = useState([]);

  useEffect(() => {
    socket.on("droneData", (data) => {
      setDrones(data); 
    });

    return () => {
      socket.off("droneData");
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
              <Route path="/map" element={<Maps drones={drones} />} />
            </Routes>
          </div>
        </main>
      </div>  
    </Router>
  );
}

export default App;
