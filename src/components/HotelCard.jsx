import { useNavigate } from "react-router-dom";
import StarRating from "./StarRating";

function HotelCard({ hotel, showActions = false, onEdit, onDelete }) {
  const navigate = useNavigate();

  const amenityIcons = {
    dining:      "🍽",
    parking:     "🚗",
    wifi:        "📶",
    roomService: "🛎",
    pool:        "🏊",
    gym:         "💪",
  };

  return (
    <div className="cozy-card h-100 d-flex flex-column">

      {/* Image */}
      <div style={{ overflow: "hidden", borderRadius: "8px 8px 0 0" }}>
        <img
          src={hotel.imageUrl || "https://placehold.co/400x200?text=Hotel"}
          alt={hotel.name}
          style={{
            width: "100%",
            height: "200px",
            objectFit: "cover",
            display: "block",
          }}
        />
      </div>

      {/* Body */}
      <div className="p-3 d-flex flex-column flex-grow-1">

        <h5 className="fw-bold mb-1">{hotel.name}</h5>
        <p className="cozy-subtitle mb-2">{hotel.location}</p>

        <div className="d-flex align-items-center gap-2 mb-2">
          <StarRating rating={hotel.averageRating} />
          <span className="cozy-subtitle small">
            ({hotel.totalReviews} review{hotel.totalReviews !== 1 ? "s" : ""})
          </span>
        </div>

        {/* Amenity icons */}
        <div className="d-flex flex-wrap gap-1 mb-3">
          {Object.entries(amenityIcons).map(([key, icon]) =>
            hotel[key] ? (
              <span
                key={key}
                title={key}
                className="cozy-badge bg-light text-dark"
                style={{ fontSize: "0.8rem" }}
              >
                {icon}
              </span>
            ) : null
          )}
        </div>

        {/* Spacer */}
        <div className="mt-auto d-flex gap-2">
          <button
            className="btn cozy-btn-primary flex-grow-1"
            onClick={() => navigate(`/hotels/${hotel.hotelId}`)}
          >
            View Details
          </button>
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

export default HotelCard;
