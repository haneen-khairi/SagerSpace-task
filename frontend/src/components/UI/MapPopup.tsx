import React, { useState } from "react";
import "../../../styles/MapPopUp.scss";

interface Drone {
  serial: string;
  registration: string;
  name: string;
  pilot: string;
  organization: string;
  color: "red" | "green";
}

interface MapPopupProps {
  drones: Drone[];
}

const MapPopup: React.FC<MapPopupProps> = ({ drones }) => {
  const [activeTab, setActiveTab] = useState<"details" | "history">("details");
  const [isOpen, setIsOpen] = useState(true);

  return (
    <>
      {!isOpen && (
        <button
          className="open-popup-btn"
          onClick={() => setIsOpen(true)}
          aria-label="Open Drone Panel"
        >
          +
        </button>
      )}

      {isOpen && (
        <div className="map-popup">
          <div className="tab-header">
            <div className="tab-title">Drone Flying</div>
            <button
              className="close-button"
              onClick={() => setIsOpen(false)}
              aria-label="Close Panel"
            >
              ✖
            </button>
          </div>

          <div className="popup-tabs">
            <button
              className={activeTab === "details" ? "active" : ""}
              onClick={() => setActiveTab("details")}
            >
              Drones
            </button>
            <button
              className={activeTab === "history" ? "active" : ""}
              onClick={() => setActiveTab("history")}
            >
              Flight History
            </button>
          </div>

          <div className="popup-content">
            {activeTab === "details" &&
              drones.map((drone) => (
                <div key={drone.serial} className="drones-details-box">
                  <h3>{drone.name}</h3>
                  <div className="drone-details">
                    <div>
                      <div className="mini-details">
                        <span>Serial # </span>
                        <p>{drone.serial}</p>
                      </div>
                      <div className="mini-details">
                        <span>Pilot </span>
                        <p>{drone.pilot}</p>
                      </div>
                    </div>
                    <div>
                      <div className="mini-details">
                        <span>Registration # </span>
                        <p>{drone.registration}</p>
                      </div>
                      <div className="mini-details">
                        <span>Organization </span>
                        <p>{drone.organization}</p>
                      </div>
                    </div>
                    <div className="drone-color">
                      {drone.registration.split("-")[1][0] === "B" ? (
                        <div className="green-circle"></div>
                      ) : (
                        <div className="red-circle"></div>
                      )}
                    </div>
                  </div>
                </div>
              ))}

            {activeTab === "history" && (
              <div className="drones-details-box">
                <p>Flight history can go here</p>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default MapPopup;
