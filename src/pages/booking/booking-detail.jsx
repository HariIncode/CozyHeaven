import React, { useContext, useEffect, useState } from "react";
import { useLoaderData, useNavigate, useParams } from "react-router-dom";

import AuthContext from "../../context/AuthContext";
import { useLoadingBar } from "../../context/LoadingBarContext";
import bookingService from "../../services/bookingService";
import toast from "react-hot-toast";

function BookingDetail() {
  const { bookingId } = useParams();
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const loadingBar = useLoadingBar();

  const [booking, setBooking] = useState(null);

  useEffect(() => {
    loadingBar.current.continuousStart();
    bookingService
      .get(bookingId)
      .then((res) => {
        setBooking(res.data);
      })
      .catch(() => {
        toast.error("Failed to load booking details");
      })
      .finally(() => {
        loadingBar.current.complete();
      });
  }, [bookingId]);

  const handleCancel = () => {
     Swal.fire({
      title: "Cancel this booking?",
      text: "A refund will be calculated based on our cancellation policy.",
      icon: "warning",
      input: "textarea",
      inputPlaceholder: "Enter reason for cancellation (min 10 characters)...",
      showCancelButton: true,
      confirmButtonText: "Yes, cancel",
      confirmButtonColor: "#dc2626",
    })
    .then((res) => {
      if(res.isConfirmed){
        if(!res.value || res.value.trim().length < 10){
          toast.error("Please enter a valid reason (at least 10 characters)");
          return;
        }

        const toastId = toast.loading("Cancelling booking...");
        loadingBar.current.staticStart();
        bookingService
          .cancelBooking(bookingId, { reason: res.value })
          .then((res) => {
            toast.success("Booking Cancelled", {
              id: toastId
            });
            setBooking(res.data);
          })
          .catch((err) => {
            toast.error(
              err.response.data || "Cancellation failed",
              {
                id: toastId
              }
            )
          })
          .finally(() => {
            loadingBar.current.complete();
          })
      }
    })
  };

  const statusStyles = {
    CONFIRMED: { bg: "#eff6ff", color: "#1d4ed8" },
    PENDING: { bg: "#fff7ed", color: "#c2410c" },
    CANCELLED: { bg: "#fef2f2", color: "#b91c1c" },
    COMPLETED: { bg: "#f0fdf4", color: "#15803d" },
    NO_SHOW: { bg: "#f5f5f5", color: "#6b7280" },
  };

  const paymentStyles = {
    PENDING: { bg: "#fff7ed", color: "#c2410c" },
    SUCCESS: { bg: "#f0fdf4", color: "#15803d" },
    FAILED: { bg: "#fef2f2", color: "#b91c1c" },
    REFUNDED: { bg: "#eff6ff", color: "#1d4ed8" },
    PARTIAL_REFUND: { bg: "#fdf4ff", color: "#7e22ce" },
  };

  if (!booking) return null;

  const statusStyle = statusStyles[booking.status] || statusStyles.PENDING;
  const paymentStyle =
    paymentStyles[booking.paymentStatus] || paymentStyles.PENDING;

  return (
    <div className="cozy-page">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-md-8">
            <button
              className="btn cozy-btn-outline mb-4"
              onClick={() => navigate(-1)}
            >
              ← Back
            </button>

            {/* Header */}
            <div className="d-flex justify-content-between align-items-center mb-4">
              <div>
                <h2 className="cozy-title mb-1">
                  Booking #{booking.bookingId}
                </h2>
                <p className="cozy-subtitle mb-0">
                  Booked on {new Date(booking.bookedAt).toLocaleDateString()}
                </p>
              </div>
              <span
                className="cozy-badge"
                style={{
                  ...statusStyle,
                  fontSize: "0.9rem",
                  padding: "6px 12px",
                }}
              >
                {booking.status}
              </span>
            </div>

            {/* Hotel + Room */}
            <div className="cozy-card p-4 mb-4">
              <h5 className="fw-bold mb-3">Stay Details</h5>
              <div className="row">
                <div className="col-md-6">
                  <p className="fw-semibold mb-1">{booking.hotelName}</p>
                  <p className="cozy-subtitle mb-3">{booking.hotelLocation}</p>
                  <p className="mb-1">
                    <span className="cozy-subtitle">Room: </span>
                    <span className="fw-semibold">
                      #{booking.roomNumber} — {booking.roomType}
                    </span>
                  </p>
                </div>
                <div className="col-md-6">
                  <div className="d-flex flex-column gap-2 cozy-subtitle">
                    <span>
                      📅 Check In:{" "}
                      <b className="text-dark">{booking.checkIn}</b>
                    </span>
                    <span>
                      📅 Check Out:{" "}
                      <b className="text-dark">{booking.checkOut}</b>
                    </span>
                    <span>
                      🌙 {booking.totalNights} night
                      {booking.totalNights !== 1 ? "s" : ""}
                    </span>
                    <span>
                      👥 {booking.adults} adult{booking.adults !== 1 ? "s" : ""}
                      , {booking.childrens} child
                      {booking.childrens !== 1 ? "ren" : ""}
                    </span>
                  </div>
                </div>
              </div>
              <div className="cozy-divider" />
              <div className="d-flex justify-content-between align-items-center">
                <span className="cozy-subtitle">Total Amount</span>
                <span className="fw-bold" style={{ fontSize: "1.3rem" }}>
                  ₹{booking.totalAmount}
                </span>
              </div>
            </div>

            {/* Payment */}
            <div className="cozy-card p-4 mb-4">
              <h5 className="fw-bold mb-3">Payment</h5>
              <div className="d-flex justify-content-between align-items-center">
                <div className="d-flex flex-column gap-1 cozy-subtitle">
                  <span>
                    Transaction ID:{" "}
                    <b className="text-dark">{booking.transactionId || "—"}</b>
                  </span>
                  <span>
                    Method:{" "}
                    <b className="text-dark">{booking.paymentMethod || "—"}</b>
                  </span>
                </div>
                <span
                  className="cozy-badge"
                  style={{
                    ...paymentStyle,
                    fontSize: "0.85rem",
                    padding: "5px 10px",
                  }}
                >
                  {booking.paymentStatus}
                </span>
              </div>
            </div>

            {/* Guests */}
            {booking.guests && booking.guests.length > 0 && (
              <div className="cozy-card p-4 mb-4">
                <h5 className="fw-bold mb-3">Guests</h5>
                <div className="row g-2">
                  {booking.guests.map((guest) => (
                    <div className="col-md-6" key={guest.guestId}>
                      <div
                        className="d-flex justify-content-between align-items-center p-2"
                        style={{
                          border: "1.5px solid #e5e7eb",
                          borderRadius: "8px",
                        }}
                      >
                        <div>
                          <p className="fw-semibold mb-0">{guest.name}</p>
                          <p className="cozy-subtitle small mb-0">
                            Age: {guest.age}
                          </p>
                        </div>
                        <span
                          className="cozy-badge"
                          style={{
                            background:
                              guest.guestType === "ADULT"
                                ? "#eff6ff"
                                : "#f0fdf4",
                            color:
                              guest.guestType === "ADULT"
                                ? "#1d4ed8"
                                : "#15803d",
                          }}
                        >
                          {guest.guestType}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Cancellation info */}
            {booking.status === "CANCELLED" && booking.cancellationReason && (
              <div
                className="cozy-card p-4 mb-4"
                style={{ borderColor: "#dc2626", background: "#fef2f2" }}
              >
                <h5 className="fw-bold mb-2" style={{ color: "#b91c1c" }}>
                  Cancellation Details
                </h5>
                <p className="mb-1 cozy-subtitle">
                  Cancelled on:{" "}
                  {new Date(booking.cancelledAt).toLocaleDateString()}
                </p>
                <p className="mb-0">Reason: {booking.cancellationReason}</p>
              </div>
            )}

            {/* Actions */}
            <div className="d-flex gap-3">
              {booking.status === "CONFIRMED" && (
                <button className="btn cozy-btn-danger" onClick={handleCancel}>
                  Cancel Booking
                </button>
              )}
              {booking.status === "COMPLETED" && (
                <button
                  className="btn cozy-btn-primary"
                  onClick={() => navigate(`/review/new/${booking.bookingId}`)}
                >
                  Write a Review
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default BookingDetail;
