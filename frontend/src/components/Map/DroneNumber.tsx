import type { Drone } from "../../App";

interface DroneNumberProps {
  drones: Drone[];
}

const DroneNumber: React.FC<DroneNumberProps> = ({ drones }) => { 
  const redRegistrations = new Set(
    drones
      .filter((drone) => drone.color === "red")
      .map((drone) => drone.registration || "Unknown")
  );

  return (
    <div className="drone-number">
      <div className="number">{redRegistrations.size}</div>
      <p>Drone Flying</p>
    </div>
  );
};

export default DroneNumber;
