import Sidebar from "./Sidebar";
import Menu from "./Menu";
import "../../../styles/Header.scss";

export default function header() {
  return (
    <div className="dashboard-container">
        <Menu />
      <main className="dashboard-content">
      <Sidebar />
        <div className="dashboard-main">
          <h1>Drone Dashboard</h1>
        </div>
      </main>
    </div>
  );
}
