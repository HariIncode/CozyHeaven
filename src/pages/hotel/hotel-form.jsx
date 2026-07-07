import { useState, useEffect, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as yup from "yup";
import Swal from "sweetalert2";
import toast from "react-hot-toast";

import { useLoadingBar } from "../../context/LoadingBarContext";
import HotelDataService from "../../services/hotelService";
import AuthContext from "../../context/AuthContext";

function HotelForm() {
  const { hotelId } = useParams(); // present = edit mode, absent = add mode
  const isEditMode = !!hotelId;
  const navigate = useNavigate();
  const loadingBar = useLoadingBar();
  const { user } = useContext(AuthContext);

  const [initialValues, setInitialValues] = useState({
    name: "",
    location: "",
    description: "",
    imageUrl: "",
    dining: false,
    parking: false,
    wifi: false,
    roomService: false,
    pool: false,
    gym: false,
  });

  // In edit mode — prefill the form with existing hotel data
  useEffect(() => {
    if (isEditMode) {
      loadingBar.current.continuousStart();

      HotelDataService.getHotelById(hotelId)
        .then((response) => {
          const h = response.data;
          setInitialValues({
            name: h.name || "",
            location: h.location || "",
            description: h.description || "",
            imageUrl: h.imageUrl || "",
            dining: h.dining || false,
            parking: h.parking || false,
            wifi: h.wifi || false,
            roomService: h.roomService || false,
            pool: h.pool || false,
            gym: h.gym || false,
          });
        })
        .catch(() => {
          toast.error("Failed to load hotel data.");
        })
        .finally(() => {
          loadingBar.current.complete();
        });
    }
  }, [hotelId]);

  const validationSchema = yup.object().shape({
    name: yup
      .string()
      .required("Hotel name is required")
      .min(3, "At least 3 characters"),
    location: yup.string().required("Location is required"),
    description: yup
      .string()
      .required("Description is required")
      .max(500, "Max 500 characters"),
    imageUrl: yup
      .string()
      .required("Image URL is required")
      .url("Enter a valid URL"),
  });

  const handleSubmit = (values, { resetForm }) => {
    const payload = { ...values, ownerId: user.userId };

    const toastId = toast.loading(
      isEditMode ? "Updating hotel..." : "Adding hotel...",
    );

    console.log("Values", values);
    console.log("payload", payload);

    loadingBar.current.staticStart();

    const request = isEditMode
      ? HotelDataService.updateHotel(hotelId, payload)
      : HotelDataService.addHotel(payload);

    request
      .then(() => {
        toast.success(
          isEditMode
            ? "Hotel updated successfully!"
            : "Hotel added successfully",
          { id: toastId },
        );

        if (!isEditMode) resetForm();

        navigate("/hotels");
      })
      .catch((error) => {
        Swal.fire({
          icon: "error",
          title: isEditMode ? "Update Failed" : "Add Failed",
          text: error.response?.data?.message || "Something went wrong.",
        });
        toast.error(
          error.response.data?.message ||
            (isEditMode ? "Update Failed" : "Add Failed"),
          {
            id: toastId,
          },
        );
      })
      .finally(() => {
        loadingBar.current.complete();
      });
  };

  const amenities = [
    { name: "dining", label: "Dining" },
    { name: "parking", label: "Parking" },
    { name: "wifi", label: "WiFi" },
    { name: "roomService", label: "Room Service" },
    { name: "pool", label: "Pool" },
    { name: "gym", label: "Gym" },
  ];

  return (
    <div className="cozy-page">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-md-8">
            <div className="cozy-card p-4 p-md-5">
              {/* Header */}
              <div className="mb-4">
                <h2 className="cozy-title mb-1">
                  {isEditMode ? "Edit Hotel" : "Add New Hotel"}
                </h2>
                <p className="cozy-subtitle">
                  {isEditMode
                    ? "Update your hotel details"
                    : "Fill in the details to list your property"}
                </p>
              </div>

              <Formik
                initialValues={initialValues}
                validationSchema={validationSchema}
                onSubmit={handleSubmit}
                enableReinitialize // allows prefill to work in edit mode
              >
                <Form>
                  {/* Name */}
                  <div className="mb-3">
                    <label htmlFor="name" className="form-label fw-semibold">Hotel Name</label>
                    <Field
                      id = "name"
                      type="text"
                      name="name"
                      placeholder="e.g. The Grand Horizon"
                      className="form-control cozy-input"
                    />
                    <p className="text-danger small mb-0 mt-1">
                      <ErrorMessage name="name" />
                    </p>
                  </div>

                  {/* Location */}
                  <div className="mb-3">
                    <label htmlFor="location" className="form-label fw-semibold">Location</label>
                    <Field
                      id = "location"
                      type="text"
                      name="location"
                      placeholder="e.g. Chennai, Tamil Nadu"
                      className="form-control cozy-input"
                    />
                    <p className="text-danger small mb-0 mt-1">
                      <ErrorMessage name="location" />
                    </p>
                  </div>

                  {/* Description */}
                  <div className="mb-3">
                    <label htmlFor="description" className="form-label fw-semibold">
                      Description
                    </label>
                    <Field
                      id="description"
                      as="textarea"
                      name="description"
                      placeholder="Describe your hotel..."
                      className="form-control cozy-input"
                      rows={4}
                    />
                    <p className="text-danger small mb-0 mt-1">
                      <ErrorMessage name="description" />
                    </p>
                  </div>

                  {/* Image URL */}
                  <div className="mb-4">
                    <label htmlFor="imageUrl" className="form-label fw-semibold">Image URL</label>
                    <Field
                      id="imageUrl"
                      type="url"
                      name="imageUrl"
                      placeholder="https://example.com/hotel.jpg"
                      className="form-control cozy-input"
                    />
                    <p className="text-danger small mb-0 mt-1">
                      <ErrorMessage name="imageUrl" />
                    </p>
                  </div>

                  {/* Amenities */}
                  <div className="mb-4">
                    <label htmlFor="amenities" className="form-label fw-semibold">Amenities</label>
                    <div className="row g-2">
                      {amenities.map(({ name, label }) => (
                        <div className="col-4" key={name}>
                          <div className="cozy-card p-2 d-flex align-items-center gap-2">
                            <Field
                              type="checkbox"
                              name={name}
                              id={name}
                              className="form-check-input mt-0"
                              style={{
                                width: "18px",
                                height: "18px",
                                cursor: "pointer",
                              }}
                            />
                            <label
                              htmlFor={name}
                              className="mb-0 fw-semibold"
                              style={{ cursor: "pointer" }}
                            >
                              {label}
                            </label>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Buttons */}
                  <div className="d-flex gap-3">
                    <button
                      type="submit"
                      className="btn cozy-btn-primary flex-grow-1"
                    >
                      {isEditMode ? "Update Hotel" : "Add Hotel"}
                    </button>
                    <button
                      type="button"
                      className="btn cozy-btn-outline"
                      onClick={() => navigate(-1)}
                    >
                      Cancel
                    </button>
                  </div>
                </Form>
              </Formik>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default HotelForm;
