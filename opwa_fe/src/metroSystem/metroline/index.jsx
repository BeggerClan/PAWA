import React, { useState } from "react";
import MetroLineGrid from "./components/metrolineGridPage/MetroLineGrid";
import MetroLineStations from "./components/metrolineStationGridPage/MetroLineStations";
import MetroLineMapView from "./components/mapView/MetroLineMapView";
import MetroLineTripsOverview from "./components/tripPage/MetroLineTripsOverview";
import "./indexMapModal.css";

const Index = () => {
  const [selectedLineId, setSelectedLineId] = useState(null);
  const [showOverview, setShowOverview] = useState(false);
  const [mapModalOpen, setMapModalOpen] = useState(false);

  const handleShowStations = (lineId) => {
    setSelectedLineId(lineId);
  };

  const handleBack = () => {
    setSelectedLineId(null);
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "#f5f6fa"
      }}
    >
      <div style={{ width: "98vw", maxWidth: 1600, display: "flex", gap: 32 }}>
        {/* Main content */}
        <div style={{ flex: 2, minWidth: 0 }}>
          <div style={{ display: "flex", gap: 16, marginBottom: 16 }}>
            <button
              onClick={() => { setShowOverview(false); setSelectedLineId(null); }}
              style={{
                padding: "8px 20px",
                background: !showOverview ? "#2d98da" : "#f5f6fa",
                color: !showOverview ? "#fff" : "#2d98da",
                border: "1px solid #2d98da",
                borderRadius: 4,
                cursor: "pointer"
              }}
            >
              Metro Lines
            </button>
            <button
              onClick={() => { setShowOverview(true); setSelectedLineId(null); }}
              style={{
                padding: "8px 20px",
                background: showOverview ? "#2d98da" : "#f5f6fa",
                color: showOverview ? "#fff" : "#2d98da",
                border: "1px solid #2d98da",
                borderRadius: 4,
                cursor: "pointer"
              }}
            >
              Trips Overview
            </button>
          </div>
          {!showOverview ? (
            !selectedLineId ? (
              <MetroLineGrid onShowStations={handleShowStations} />
            ) : (
              <MetroLineStations lineId={selectedLineId} onBack={handleBack} />
            )
          ) : (
            <MetroLineTripsOverview />
          )}
        </div>
        {/* Mini Map on the right */}
        <div style={{ flex: 1, minWidth: 350, maxWidth: 500, position: "relative" }}>
          <div className="mini-map-container">
            <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: 4 }}>
              <button
                onClick={() => setMapModalOpen(true)}
                className="mini-map-enlarge-btn"
                title="Enlarge Map"
              >
                <span style={{ fontSize: 20, color: "#2d98da" }}>⤢</span>
              </button>
            </div>
            <MetroLineMapView selectedLineId={selectedLineId} />
          </div>
        </div>
        {/* Map Modal */}
        {mapModalOpen && (
          <div className="map-modal-overlay" onClick={() => setMapModalOpen(false)}>
            <div className="map-modal-close-row">
              <button
                onClick={() => setMapModalOpen(false)}
                className="map-modal-close-btn"
                title="Close"
              >
                <span style={{ fontSize: 20, color: "#2d98da" }}>×</span>
              </button>
            </div>
            <div className="map-modal-box" onClick={e => e.stopPropagation()}>
              <MetroLineMapView selectedLineId={selectedLineId} style={{ width: "80vw", height: "70vh" }} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Index;
