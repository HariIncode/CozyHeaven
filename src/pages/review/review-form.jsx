import { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import * as yup from "yup";
import { Formik, Form, Field, ErrorMessage } from "formik";

import reviewService from "../../services/reviewService";
import bookingService from "../../services/bookingService";
import roomService from "../../services/roomService";
import AuthContext from "../../context/AuthContext";
import { useLoadingBar } from "../../context/LoadingBarContext";
import toast from "react-hot-toast";

function ReviewForm() {
  const { bookingId } = useParams();
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const loadingBar = useLoadingBar();

  const [booking, setBooking] = useState(null);
  // const [hotelDetails, setHotelDetails] = useState(null);
  const [hoveredStar, setHoveredStar] = useState(0);

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

  const initialValues = {
    rating: 0,
    comments: "",
  };

  const validationSchema = yup.object().shape({
    rating: yup
      .number()
      .min(1, "Please select a rating")
      .max(5)
      .required("Rating is required"),
    comments: yup.string().max(1000, "Max 1000 characters"),
  });

  const handleSubmit = () => {
    const toastId = toast.loading("Submitting review");
    loadingBar.current.staticStart();

    const paylod = {
      userId: user.userId,
      hotelId: booking.hotelId,
      bookingId: Number(bookingId),
      rating: values.rating,
      comments: values.comments,
    };

    reviewService
      .add(paylod)
      .then(() => {
        toast.success("Review Submitted", {
          id: toastId,
        });
        navigate(`/hotels/${booking.hotelId}`);
      })
      .catch((err) => {
        toast.error(err.response.data || "Failed to submit review", {
          id: toastId,
        });
      })
      .finally(() => {
        loadingBar.current.complete();
      });
  };

  return (
    <div className="cozy-page">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-md-6">
            <button
              className="btn cozy-btn-outline mb-4"
              onClick={() => navigate(-1)}
            >
              ← Back
            </button>

            <div className="cozy-card p-4 p-md-5">
              {/* Header */}
              <div className="mb-4">
                <h2 className="cozy-title mb-1">Write a Review</h2>
                <p className="cozy-subtitle">
                  {booking?.hotelName} · {booking?.hotelLocation}
                </p>
              </div>

              <Formik
                initialValues={initialValues}
                validationSchema={validationSchema}
                onSubmit={handleSubmit}
              >
                {({ setFieldValue, values }) => (
                  <Form>
                    {/* Star Rating — interactive */}
                    <div className="mb-4">
                      <label className="form-label fw-semibold">
                        Your Rating
                      </label>
                      <div className="d-flex gap-1">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <span
                            key={star}
                            onClick={() => setFieldValue("rating", star)}
                            onMouseEnter={() => setHoveredStar(star)}
                            onMouseLeave={() => setHoveredStar(0)}
                            style={{
                              fontSize: "2.2rem",
                              cursor: "pointer",
                              color:
                                star <= (hoveredStar || values.rating)
                                  ? "#f59e0b"
                                  : "#d1d5db",
                              transition: "color 0.1s",
                            }}
                          >
                            ★
                          </span>
                        ))}
                      </div>
                      <p className="text-danger small mb-0 mt-1">
                        <ErrorMessage name="rating" />
                      </p>
                    </div>

                    {/* Comments */}
                    <div className="mb-4">
                      <label className="form-label fw-semibold">
                        Comments{" "}
                        <span className="cozy-subtitle">(optional)</span>
                      </label>
                      <Field
                        as="textarea"
                        name="comments"
                        placeholder="Share your experience..."
                        className="form-control cozy-input"
                        rows={5}
                      />
                      <p className="text-danger small mb-0 mt-1">
                        <ErrorMessage name="comments" />
                      </p>
                    </div>

                    <button
                      type="submit"
                      className="btn cozy-btn-primary w-100"
                    >
                      Submit Review
                    </button>
                  </Form>
                )}
              </Formik>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ReviewForm;
