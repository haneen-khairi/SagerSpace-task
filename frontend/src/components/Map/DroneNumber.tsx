import type { Drone } from "../../App";
interface DroneNumberProps{
      drones: Drone[];
}
const DroneNumber: React.FC<DroneNumberProps> = ({ drones }) => {
    return (
        <>
            <div className="drone-number">
                <div className="number">
                    {drones.filter((drone: any) => drone.color !== "green").length}
                </div>
                <p>Drone Flying</p>
            </div>
        </>
    );
}
export default DroneNumber;