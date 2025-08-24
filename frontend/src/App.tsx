import { useEffect } from "react";
import { io } from "socket.io-client";

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
    <div>
      <h1>Drone Dashboard</h1>
      <p>Open the console to see live drone data</p>
    </div>
  );
}

export default App;
