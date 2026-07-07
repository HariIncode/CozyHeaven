import { useState, useEffect, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Formik, Form, Field, ErrorMessage, FieldArray } from "formik";
import * as yup from "yup";
import toast from "react-hot-toast";

import bookingService from "../../services/bookingService";
import roomService from "../../services/roomService";
import AuthContext from "../../context/AuthContext";
import { useLoadingBar } from "../../context/LoadingBarContext";

function BookingForm() {
  const { roomId } = useParams();
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const loadingBar = useLoadingBar();

  const [room, setRoom] = useState(null);

  useEffect(() => {
    loadingBar.current.continuousStart();
    roomService
      .getRoomById(roomId)
      .then((res) => setRoom(res.data))
      .catch(() => toast.error("Failed to load room details"))
      .finally(() => loadingBar.current.complete());
  }, [roomId]);

  const today = new Date().toISOString().split("T")[0];
  const tomorrow = new Date(Date.now() + 86400000).toISOString().split("T")[0];

  const initialValues = {
    checkIn: today,
    checkOut: tomorrow,
    adults: 1,
    childrens: 0,
    guestDetails: [],
  };

  const guestSchema = yup.object().shape({
    name: yup.string().required("Name is required"),
    age: yup
      .number()
      .min(0, "Invalid age")
      .max(120, "Invalid age")
      .required("Age is required"),
    guestType: yup.string().required("Guest type is required"),
  });

  const validationSchema = yup.object().shape({
    checkIn: yup.date().required("Check-in date is required"),
    checkOut: yup
      .date()
      .required("Check-out date is required")
      .min(yup.ref("checkIn"), "Check-out must be after check-in"),
    adults: yup
      .number()
      .min(1, "At least 1 adult required")
      .required("Required"),
    childrens: yup.number().min(0, "Cannot be negative"),
    guestDetails: yup.array().of(guestSchema),
  });

  const handleSubmit = (values) => {
    const checkIn = new Date(values.checkIn);
    const checkOut = new Date(values.checkOut);
    const totalGuests = Number(values.adults) + Number(values.childrens);

    if (room && totalGuests > room.capacity) {
      toast.error(
        `Room capacity is ${room.capacity}. You entered ${totalGuests} guests.`,
      );
      return;
    }

    // Validate guest count matches adults + children
    if (
      values.guestDetails.length > 0 &&
      values.guestDetails.length > room.capacity
    ) {
      toast.error(
        `Cannot add more guests than room capacity (${room.capacity})`,
      );
      return;
    }

    const toastId = toast.loading("Creating booking...");
    loadingBar.current.staticStart();

    const payload = {
      userId: user.userId,
      roomId: Number(roomId),
      checkIn: values.checkIn,
      checkOut: values.checkOut,
      adults: Number(values.adults),
      childrens: Number(values.childrens),
      guestDetails: values.guestDetails,
    };

    bookingService
      .createBooking(payload)
      .then((res) => {
        toast.success("Booking created successfully!", { id: toastId });
        navigate(`/bookings/${res.data.bookingId}`);
      })
      .catch((error) => {
        toast.error(
          error.response?.data?.message ||
            "Booking failed. Room may not be available.",
          { id: toastId },
        );
      })
      .finally(() => loadingBar.current.complete());
  };

  if (!room) {
    return (
      <div className="d-flex justify-content-center align-items-center min-vh-100">
        <div className="spinner-border text-primary" />
      </div>
    );
  }

  return (
    <div className="cozy-page">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-md-10">
            <button
              className="btn cozy-btn-outline mb-4"
              onClick={() => navigate(-1)}
            >
              ← Back
            </button>

            <div className="row g-4">
              {/* Room Summary */}
              <div className="col-md-4">
                <div className="cozy-card p-4 h-100">
                  <h5 className="fw-bold mb-3">Room Summary</h5>
                  <p className="mb-1 fw-semibold">{room.hotelName}</p>
                  <p className="cozy-subtitle mb-2">{room.hotelLocation}</p>
                  <div className="cozy-divider" />
                  <div className="d-flex flex-column gap-2 cozy-subtitle">
                    <span>
                      🏷 Room {room.roomNumber} — {room.roomType}
                    </span>
                    <span>🛏 {room.bedSize} Bed</span>
                    <span>👥 Capacity: {room.capacity} guests</span>
                    <span>{room.ac ? "❄️ AC" : "🌀 Non-AC"}</span>
                  </div>
                  <div className="cozy-divider" />
                  <p className="fw-bold mb-0" style={{ fontSize: "1.3rem" }}>
                    ₹{room.fare}
                    <span
                      className="cozy-subtitle fw-normal"
                      style={{ fontSize: "0.85rem" }}
                    >
                      {" "}
                      / night
                    </span>
                  </p>
                </div>
              </div>

              {/* Booking Form */}
              <div className="col-md-8">
                <Formik
                  initialValues={initialValues}
                  validationSchema={validationSchema}
                  onSubmit={handleSubmit}
                >
                  {({ values, setFieldValue }) => {
                    const checkIn = new Date(values.checkIn);
                    const checkOut = new Date(values.checkOut);
                    const nights =
                      checkOut > checkIn
                        ? Math.ceil(
                            (checkOut - checkIn) / (1000 * 60 * 60 * 24),
                          )
                        : 0;
                    const total = nights * room.fare;

                    return (
                      <Form>
                        {/* ── Stay Details ── */}
                        <div className="cozy-card p-4 mb-4">
                          <h5 className="fw-bold mb-4">Stay Details</h5>

                          <div className="row mb-3">
                            <div className="col-6">
                              <label className="form-label fw-semibold">
                                Check In
                              </label>
                              <Field
                                type="date"
                                name="checkIn"
                                min={today}
                                className="form-control cozy-input"
                              />
                              <p className="text-danger small mb-0 mt-1">
                                <ErrorMessage name="checkIn" />
                              </p>
                            </div>
                            <div className="col-6">
                              <label className="form-label fw-semibold">
                                Check Out
                              </label>
                              <Field
                                type="date"
                                name="checkOut"
                                min={tomorrow}
                                className="form-control cozy-input"
                              />
                              <p className="text-danger small mb-0 mt-1">
                                <ErrorMessage name="checkOut" />
                              </p>
                            </div>
                          </div>

                          <div className="row mb-3">
                            <div className="col-6">
                              <label className="form-label fw-semibold">
                                Adults
                              </label>
                              <Field
                                type="number"
                                name="adults"
                                min="1"
                                className="form-control cozy-input"
                              />
                              <p className="text-danger small mb-0 mt-1">
                                <ErrorMessage name="adults" />
                              </p>
                            </div>
                            <div className="col-6">
                              <label className="form-label fw-semibold">
                                Children
                              </label>
                              <Field
                                type="number"
                                name="childrens"
                                min="0"
                                className="form-control cozy-input"
                              />
                              <p className="text-danger small mb-0 mt-1">
                                <ErrorMessage name="childrens" />
                              </p>
                            </div>
                          </div>

                          {/* Live total */}
                          {nights > 0 && (
                            <div
                              className="cozy-card p-3"
                              style={{ background: "#eff6ff" }}
                            >
                              <div className="d-flex justify-content-between align-items-center">
                                <span className="cozy-subtitle">
                                  ₹{room.fare} × {nights} night
                                  {nights > 1 ? "s" : ""}
                                </span>
                                <span
                                  className="fw-bold"
                                  style={{ fontSize: "1.1rem" }}
                                >
                                  ₹{total}
                                </span>
                              </div>
                            </div>
                          )}
                        </div>

                        {/* ── Guest Details ── */}
                        <div className="cozy-card p-4 mb-4">
                          <div className="d-flex justify-content-between align-items-center mb-4">
                            <div>
                              <h5 className="fw-bold mb-0">Guest Details</h5>
                              <p className="cozy-subtitle small mb-0">
                                Optional — add guest info (max {room.capacity})
                              </p>
                            </div>
                          </div>

                          <FieldArray name="guestDetails">
                            {({ push, remove }) => (
                              <>
                                {/* Guest rows */}
                                {values.guestDetails.map((_, index) => (
                                  <div
                                    key={index}
                                    className="cozy-card p-3 mb-3"
                                    style={{ background: "#f8f9fa" }}
                                  >
                                    <div className="d-flex justify-content-between align-items-center mb-2">
                                      <span className="fw-semibold cozy-subtitle">
                                        Guest {index + 1}
                                      </span>
                                      <button
                                        type="button"
                                        className="btn cozy-btn-danger btn-sm"
                                        style={{
                                          fontSize: "0.75rem",
                                          padding: "2px 10px",
                                        }}
                                        onClick={() => remove(index)}
                                      >
                                        Remove
                                      </button>
                                    </div>

                                    <div className="row g-2">
                                      {/* Name */}
                                      <div className="col-md-5">
                                        <Field
                                          type="text"
                                          name={`guestDetails.${index}.name`}
                                          placeholder="Full Name"
                                          className="form-control cozy-input"
                                        />
                                        <p className="text-danger small mb-0 mt-1">
                                          <ErrorMessage
                                            name={`guestDetails.${index}.name`}
                                          />
                                        </p>
                                      </div>

                                      {/* Age */}
                                      <div className="col-md-3">
                                        <Field
                                          type="number"
                                          name={`guestDetails.${index}.age`}
                                          placeholder="Age"
                                          min="0"
                                          max="120"
                                          className="form-control cozy-input"
                                        />
                                        <p className="text-danger small mb-0 mt-1">
                                          <ErrorMessage
                                            name={`guestDetails.${index}.age`}
                                          />
                                        </p>
                                      </div>

                                      {/* Guest Type */}
                                      <div className="col-md-4">
                                        <Field
                                          as="select"
                                          name={`guestDetails.${index}.guestType`}
                                          className="form-select cozy-input"
                                        >
                                          <option value="">Type</option>
                                          <option value="ADULT">Adult</option>
                                          <option value="CHILD">Child</option>
                                        </Field>
                                        <p className="text-danger small mb-0 mt-1">
                                          <ErrorMessage
                                            name={`guestDetails.${index}.guestType`}
                                          />
                                        </p>
                                      </div>
                                    </div>
                                  </div>
                                ))}

                                {/* Add Guest button */}
                                {values.guestDetails.length < room.capacity && (
                                  <button
                                    type="button"
                                    className="btn cozy-btn-outline w-100"
                                    onClick={() =>
                                      push({ name: "", age: "", guestType: "" })
                                    }
                                  >
                                    + Add Guest
                                  </button>
                                )}

                                {values.guestDetails.length >=
                                  room.capacity && (
                                  <p className="cozy-subtitle small text-center mb-0">
                                    Room capacity reached ({room.capacity}{" "}
                                    guests max)
                                  </p>
                                )}
                              </>
                            )}
                          </FieldArray>
                        </div>

                        {/* Submit */}
                        <button
                          type="submit"
                          className="btn cozy-btn-primary w-100"
                          style={{ padding: "12px" }}
                        >
                          Confirm Booking
                        </button>
                      </Form>
                    );
                  }}
                </Formik>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default BookingForm;
