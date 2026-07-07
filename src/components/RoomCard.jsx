import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import AuthContext from "../context/AuthContext";

function RoomCard({ room, hotelId, showActions = false, onEdit, onDelete }) {
  const { isLoggedIn } = useContext(AuthContext);
  const navigate = useNavigate();

  const roomTypeColors = {
    STANDARD:   { bg: "#eff6ff", color: "#1d4ed8" },
    DELUXE:     { bg: "#f0fdf4", color: "#15803d" },
    SUITE:      { bg: "#fdf4ff", color: "#7e22ce" },
    PENTHOUSE:  { bg: "#fff7ed", color: "#c2410c" },
  };

  const typeStyle = roomTypeColors[room.roomType] || roomTypeColors.STANDARD;

  return (
    <div className="cozy-card h-100 d-flex flex-column p-3">

      {/* Top row — room number + type badge */}
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h5 className="fw-bold mb-0">Room {room.roomNumber}</h5>
        <span
          className="cozy-badge"
          style={{ background: typeStyle.bg, color: typeStyle.color }}
        >
          {room.roomType}
        </span>
      </div>

      {/* Details */}
      <div className="d-flex flex-column gap-1 mb-3 cozy-subtitle">
        <span>🛏 {room.bedSize} Bed</span>
        <span>👥 Capacity: {room.capacity}</span>
        <span>📐 {room.sizeSQM} sq.m</span>
        <span>{room.ac ? "❄️ Air Conditioned" : "🌀 Non-AC"}</span>
      </div>

      {/* Availability badge */}
      <div className="mb-3">
        <span
          className="cozy-badge"
          style={{
            background: room.available ? "#f0fdf4" : "#fef2f2",
            color:      room.available ? "#15803d" : "#b91c1c",
          }}
        >
          {room.available ? "Available" : "Unavailable"}
        </span>
      </div>

      {/* Fare */}
      <div className="mt-auto">
        <p className="fw-bold mb-3" style={{ fontSize: "1.2rem" }}>
          ₹{room.fare}
          <span className="cozy-subtitle fw-normal" style={{ fontSize: "0.85rem" }}>
            {" "}/ night
          </span>
        </p>

        {/* Buttons */}
        <div className="d-flex gap-2">
          {isLoggedIn && room.isAvailable && (
            <button
              className="btn cozy-btn-primary flex-grow-1"
              onClick={() => navigate(`/booking/new/${room.roomId}`)}
            >
              Book Now
            </button>
          )}
          {showActions && (
            <>
              <button className="btn cozy-btn-outline" onClick={onEdit}>
                Edit
              </button>
              <button className="btn cozy-btn-danger" onClick={onDelete}>
                Delete
              </button>
            </>
          )}
        </div>
      </div>

    </div>
  );
}

export default RoomCard;