import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import Swal from "sweetalert2";

import AuthContext from "../../context/AuthContext";
import { useLoadingBar } from "../../context/LoadingBarContext";
import HotelDataService from "../../services/hotelService";
import HotelCard from "../../components/HotelCard";

function HotelList() {
  const [hotels, setHotels] = useState([]);
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const loadingBar = useLoadingBar();

  useEffect(() => {
    fetchHotels();
  }, []);

  const fetchHotels = () => {
    const toastId = toast.loading("Fetching Hotel Details");

    HotelDataService.getAllHotels()
      .then((response) => {
        loadingBar.current.continuousStart();
        setHotels(response.data);
        toast.success("Hotels loaded successfully", {
          id: toastId,
        });
      })
      .catch((error) => {
        toast.error(error.response?.data?.message || "Failed to load hotels", {
          id: toastId,
        });
      })
      .finally(() => {
        loadingBar.current.complete();
      });
  };

  const handleDelete = (hotelId) => {
    loadingBar.current.staticStart();

    Swal.fire({
      title: "Delete this hotel?",
      text: "This action cannot be undone.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete",
      confirmButtonColor: "#dc2626",
    }).then((result) => {
      if (result.isConfirmed) {
        const toastId = toast.loading("Deleting Hotel...");
        HotelDataService.deleteHotel(hotelId)
          .then(() => {
            loadingBar.current.staticStart();
            toast.success("Hotel deleted successfully.", {
              id: toastId,
            });
            fetchHotels();
          })
          .catch((error) => {
            toast.error(error.response?.data?.message || "Deletion Failed", {
              id: toastId,
            });
          })
          .finally(() => {
            loadingBar.current.complete();
          });
      }
    });
  };
  return (
    <div className="cozy-page">
      <div className="container">
        {/* Header */}
        <div className="d-flex justify-content-between align-items-center mb-4">
          <div>
            <h2 className="cozy-title mb-0">All Hotels</h2>
            <p className="cozy-subtitle mb-0">
              {hotels.length} properties listed
            </p>
          </div>
          {(user?.role === "HOTEL_OWNER" || user?.role === "ADMIN") && (
            <button
              className="btn cozy-btn-primary"
              onClick={() => navigate("/hotel/add")}
            >
              + Add Hotel
            </button>
          )}
        </div>

        {/* Grid */}
        {hotels.length === 0 ? (
          <div className="cozy-card p-5 text-center">
            <h5 className="fw-semibold">No hotels available yet.</h5>
            <p className="cozy-subtitle">Check back soon!</p>
          </div>
        ) : (
          <div className="row g-4">
            {hotels.map((hotel) => (
              <div className="col-md-4" key={hotel.hotelId}>
                <HotelCard
                  hotel={hotel}
                  showActions={
                    user?.role === "HOTEL_OWNER" || user?.role === "ADMIN"
                  }
                  onDelete={() => handleDelete(hotel.hotelId)}
                  onEdit={() => navigate(`/hotel/edit/${hotel.hotelId}`)}
                />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default HotelList;
