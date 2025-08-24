import { useEffect } from "react";
import { io } from "socket.io-client";
import Dashboard from "../components/Dashboard/Dashboard";
const socket = io("http://localhost:9013"); // match your backend port

function App() {
  useEffect(() => {
    socket.on("droneData", (data) => {
      console.log("Drone data:", data);
    });

    return () => {
      socket.off("droneData");
    };
  }, []);

  return (
     <Dashboard />
  );
}

export default App;
