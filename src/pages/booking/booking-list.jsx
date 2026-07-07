import { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import toast from "react-hot-toast";

import bookingService from "../../services/bookingService";
import AuthContext from "../../context/AuthContext";
import { useLoadingBar } from "../../context/LoadingBarContext";

function BookingList() {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const loadingBar = useLoadingBar();

  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadingBar.current.continuousStart();
    bookingService
      .getByUserId(user.userId)
      .then((res) => {
        setBookings(res.data);
      })
      .catch(() => {
        toast.error("Failed to load bookings");
      })
      .finally(() => {
        setLoading(false);
        loadingBar.current.complete();
      });
  }, []);

  const handleCancel = (bookingId) => {
    Swal.fire({
      title: "Cancel this booking?",
      text: "A refund will be issued based on our cancellation policy.",
      icon: "warning",
      input: "textarea",
      inputPlaceholder: "Enter reason for cancellation...",
      inputAttributes: { minlength: 10 },
      showCancelButton: true,
      confirmButtonText: "Yes, cancel booking",
      confirmButtonColor: "#dc2626",
    }).then((result) => {
      if (result.isConfirmed) {
        if (!result.value || result.value.trim().length < 10) {
          toast.error("Please enter a reason (at least 10 characters)");
          return;
        }
        const toastId = toast.loading("Cancelling booking...");
        loadingBar.current.staticStart();
        bookingService
          .cancelBooking(bookingId, { reason: result.value })
          .then(() => {
            toast.success("Booking cancelled successfully", { id: toastId });
            setBookings((prev) =>
              prev.map((b) =>
                b.bookingId === bookingId ? { ...b, status: "CANCELLED" } : b,
              ),
            );
          })
          .catch((error) => {
            toast.error(
              error.response?.data?.message || "Cancellation failed",
              { id: toastId },
            );
          })
          .finally(() => {
            loadingBar.current.complete();
          });
      }
    });
  };

  const statusStyles = {
    CONFIRMED: { bg: "#eff6ff", color: "#1d4ed8" },
    PENDING: { bg: "#fff7ed", color: "#c2410c" },
    CANCELLED: { bg: "#fef2f2", color: "#b91c1c" },
    COMPLETED: { bg: "#f0fdf4", color: "#15803d" },
    NO_SHOW: { bg: "#f5f5f5", color: "#6b7280" },
  };

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center min-vh-100">
        <div className="spinner-border text-primary" />
      </div>
    );
  }

  return (
    <div className="cozy-page">
      <div className="container">
        <div className="mb-4">
          <h2 className="cozy-title mb-0">My Bookings</h2>
          <p className="cozy-subtitle">
            {bookings.length} booking{bookings.length !== 1 ? "s" : ""} found
          </p>
        </div>

        {bookings.length === 0 ? (
          <div className="cozy-card p-5 text-center">
            <h5 className="fw-semibold">No bookings yet.</h5>
            <p className="cozy-subtitle mb-4">
              Start exploring hotels and make your first booking!
            </p>
            <button
              className="btn cozy-btn-primary"
              onClick={() => navigate("/")}
            >
              Search Hotels
            </button>
          </div>
        ) : (
          <div className="d-flex flex-column gap-3">
            {bookings.map((booking) => {
              const style =
                statusStyles[booking.status] || statusStyles.PENDING;
              return (
                <div className="cozy-card p-4" key={booking.bookingId}>
                  <div className="row align-items-center">
                    {/* Left — details */}
                    <div className="col-md-8">
                      <div className="d-flex align-items-center gap-2 mb-2">
                        <h5 className="fw-bold mb-0">{booking.hotelName}</h5>
                        <span
                          className="cozy-badge"
                          style={{ background: style.bg, color: style.color }}
                        >
                          {booking.status}
                        </span>
                      </div>
                      <p className="cozy-subtitle mb-1">
                        {booking.hotelLocation}
                      </p>
                      <div className="d-flex gap-4 cozy-subtitle mt-2">
                        <span>
                          🗓 {booking.checkIn} → {booking.checkOut}
                        </span>
                        <span>
                          🌙 {booking.totalNights} night
                          {booking.totalNights !== 1 ? "s" : ""}
                        </span>
                        <span>
                          👥 {booking.adults + booking.childrens} guest
                          {booking.adults + booking.childrens !== 1 ? "s" : ""}
                        </span>
                      </div>
                      <p className="fw-bold mt-2 mb-0">
                        ₹{booking.totalAmount}
                      </p>
                    </div>

                    {/* Right — actions */}
                    <div className="col-md-4 d-flex flex-column gap-2 mt-3 mt-md-0">
                      <button
                        className="btn cozy-btn-outline w-100"
                        onClick={() =>
                          navigate(`/bookings/${booking.bookingId}`)
                        }
                      >
                        View Details
                      </button>

                      {booking.status === "CONFIRMED" && (
                        <button
                          className="btn cozy-btn-danger w-100"
                          onClick={() => handleCancel(booking.bookingId)}
                        >
                          Cancel
                        </button>
                      )}

                      {booking.status === "COMPLETED" && (
                        <button
                          className="btn cozy-btn-success w-100"
                          onClick={() =>
                            navigate(`/review/new/${booking.bookingId}`)
                          }
                        >
                          Write Review
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

export default BookingList;
