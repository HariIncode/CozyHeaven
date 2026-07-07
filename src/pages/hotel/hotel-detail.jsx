import React, { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";

import { useLoadingBar } from "../../context/LoadingBarContext";
import AuthContext from "../../context/AuthContext";
import HotelDataService from "../../services/hotelService";
import RoomDataService from "../../services/roomService";
import ReviewDataService from "../../services/reviewService";
import StarRating from "../../components/StarRating";
import RoomCard from '../../components/RoomCard';

function HotelDetails() {
  const { hotelId } = useParams();
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const loadingBar = useLoadingBar();

  const [hotel, setHotel] = useState(null);
  const [rooms, setRooms] = useState([]);
  const [reviews, setReviews] = useState([]);

 useEffect(() => {
  loadingBar.current.continuousStart();

  const toastId = toast.loading("Fetching Details...");

  Promise.all([
    HotelDataService.getHotelById(hotelId),
    RoomDataService.getByHotelId(hotelId),
    ReviewDataService.getByHotelId(hotelId),
  ])
    .then(([hotelRes, roomRes, revRes]) => {
      setHotel(hotelRes.data);
      setRooms(roomRes.data);
      setReviews(revRes.data);

      toast.success("Details fetched successfully.", {
        id: toastId,
      });
    })
    .catch(() => {
      toast.error("Failed to load hotel details", {
        id: toastId,
      });
    })
    .finally(() => {
      console.log(loadingBar.current);
      
      loadingBar.current.complete();
    });
}, [hotelId]);

  if (!hotel) return null;

  const amenities = [
    { key: "dining", label: "Dining" },
    { key: "parking", label: "Parking" },
    { key: "wifi", label: "WiFi" },
    { key: "roomService", label: "Room Service" },
    { key: "pool", label: "Pool" },
    { key: "gym", label: "Gym" },
  ];

  return (
    <div className="cozy-page">
      <div className="container">
        {/* Back */}
        <button
          className="btn cozy-btn-outline mb-4"
          onClick={() => navigate(-1)}
        >
          ← Back
        </button>

        {/* Hero image + name */}
        <div className="cozy-card overflow-hidden mb-4">
          {hotel.imageUrl && (
            <img
              src={hotel.imageUrl}
              alt={hotel.name}
              style={{ width: "100%", height: "320px", objectFit: "cover" }}
            />
          )}
          <div className="p-4">
            <div className="d-flex justify-content-between align-items-start">
              <div>
                <h2 className="cozy-title mb-1">{hotel.name}</h2>
                <p className="cozy-subtitle mb-2">{hotel.location}</p>
                <StarRating rating={hotel.averageRating} />
                <span className="cozy-subtitle ms-2">
                  ({hotel.totalReviews} review
                  {hotel.totalReviews !== 1 ? "s" : ""})
                </span>
              </div>
              {(user?.role === "HOTEL_OWNER" || user?.role === "ADMIN") && (
                <button
                  className="btn cozy-btn-outline"
                  onClick={() => navigate(`/hotel/edit/${hotelId}`)}
                >
                  Edit Hotel
                </button>
              )}
            </div>
            <p className="mt-3 mb-0">{hotel.description}</p>
          </div>
        </div>

        {/* Amenities */}
        <div className="cozy-card p-4 mb-4">
          <h5 className="fw-bold mb-3">Amenities</h5>
          <div className="d-flex flex-wrap gap-2">
            {amenities.map(({ key, label }) =>
              hotel[key] ? (
                <span key={key} className="cozy-badge bg-primary text-white">
                  {label}
                </span>
              ) : null,
            )}
          </div>
        </div>

        {/* Rooms */}
        <div className="mb-4">
          <div className="d-flex justify-content-between align-items-center mb-3">
            <h4 className="fw-bold mb-0">Rooms ({rooms.length})</h4>
            {(user?.role === "HOTEL_OWNER" || user?.role === "ADMIN") && (
              <button
                className="btn cozy-btn-primary"
                onClick={() => navigate(`/hotel/${hotelId}/room/add`)}
              >
                + Add Room
              </button>
            )}
          </div>

          {rooms.length === 0 ? (
            <div className="cozy-card p-4 text-center">
              <p className="cozy-subtitle mb-0">No rooms added yet.</p>
            </div>
          ) : (
            <div className="row g-3">
              {rooms.map((room) => (
                <div className="col-md-4" key={room.roomId}>
                  <RoomCard room={room} hotelId={hotelId} />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Reviews */}
        <div>
          <h4 className="fw-bold mb-3">Reviews ({reviews.length})</h4>
          {reviews.length === 0 ? (
            <div className="cozy-card p-4 text-center">
              <p className="cozy-subtitle mb-0">
                No reviews yet. Be the first!
              </p>
            </div>
          ) : (
            <div className="d-flex flex-column gap-3">
              {reviews.map((review) => (
                <div className="cozy-card p-3" key={review.reviewId}>
                  <div className="d-flex justify-content-between">
                    <span className="fw-semibold">{review.userName}</span>
                    <StarRating rating={review.rating} />
                  </div>
                  <p className="mb-0 mt-2 cozy-subtitle">{review.comments}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default HotelDetails;
