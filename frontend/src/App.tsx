import { useEffect } from "react";
import { io } from "socket.io-client";

const socket = io("http://localhost:3000"); // backend URL

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
    <div>
      <h1>Drone Dashboard</h1>
      <p>Check console for live drone data...</p>
    </div>
  );
}

export default App;