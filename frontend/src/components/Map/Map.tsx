type Drone = {
  id: number;
  name: string;
  lat: number;
  lng: number;
};

interface MapProps {
  drones: Drone[];
}

const Map: React.FC<MapProps> = ({ drones }) => {
  return (
    <div>
      <h2>Map</h2>
      {drones.map((drone) => (
        <div key={drone.id}>
          {drone.name} ({drone.lat}, {drone.lng})
        </div>
      ))}
    </div>
  );
};

export default Map;