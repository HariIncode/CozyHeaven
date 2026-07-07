import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import * as yup from "yup";
import { Formik, Form, Field, ErrorMessage } from "formik";

import { useLoadingBar } from "../../context/LoadingBarContext";
import RoomDataService from "../../services/roomService";
import toast from "react-hot-toast";

function RoomForm() {
  const { hotelId, roomId } = useParams();

  // return true if roomId found,
  // if roomId is found then form is in Edit mode
  const isEditMode = !!roomId;

  const navigate = useNavigate();
  const loadingBar = useLoadingBar();

  const [initalValues, setInitalValues] = useState({
    roomNumber: "",
    roomType: "STANDARD",
    bedSize: "SINGLE",
    capacity: 1,
    fare: 0,
    sizeSQM: 0,
    ac: false,
  });

  //If the form is on Edit mode then pre fill the Data's
  useEffect(() => {
    if (isEditMode) {
      loadingBar.current.continuousStart();

      RoomDataService.getRoomById(roomId)
        .then((response) => {
          const r = response.data;
          setInitalValues({
            roomNumber: r.roomNumber || "",
            roomType: r.roomType || "STANDARD",
            bedSize: r.bedSize || "SINGLE",
            capacity: r.capacity || 1,
            fare: r.fare || 0,
            sizeSQM: r.sizeSQM || 0,
            ac: r.ac || false,
          });
        })
        .catch(() => {
          toast.error("Failed to load room data.");
        })
        .finally(() => {
          loadingBar.current.complete();
        });
    }
  }, [roomId]);

  const validationSchema = yup.object().shape({
    roomNumber: yup
      .number()
      .required("Room number is required")
      .min(1, "Must be at least 1"),
    roomType: yup.string().required("Room type is required"),
    bedSize: yup.string().required("Bed size is required"),
    capacity: yup
      .number()
      .required("Capacity is required")
      .min(1, "At least 1 guest")
      .max(10, "Maximum 10 guests"),
    fare: yup
      .number()
      .required("Fare is required")
      .min(1, "Fare must be greater than 0"),
    sizeSQM: yup
      .number()
      .required("Room size is required")
      .min(1, "Must be greater than 0"),
  });

  const handleSubmit = (values, { resetForm }) => {
    const toastId = toast.loading(
      isEditMode ? "Updating room..." : "Adding room...",
    );

    console.log("Adding OR Updating Room",values);
    

    loadingBar.current.staticStart();

    const request = isEditMode
      ? RoomDataService.updateRoom(roomId, values)
      : RoomDataService.addRoom(hotelId, values);

    request
      .then(() => {
        toast.success(
          isEditMode ? "Room updated successfully!" : "Room added successfully",
          { id: toastId },
        );
        if (!isEditMode) {
          resetForm();
        }
        navigate(`/hotel/${hotelId}/rooms`);
      })
      .catch((error) => {
        toast.error(error.response.data || "Something went wrong.", {
          id: toastId,
        });
      })
      .finally(() => {
        loadingBar.current.complete();
      });
  };

  return (
    <>
      <div className="cozy-page">
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-md-7">
              <div className="cozy-card p-4 p-md-5">
                {/* Header */}
                <div className="mb-4">
                  <h2 className="cozy-title mb-1">
                    {isEditMode ? "Edit Room" : "Add New Room"}
                  </h2>
                  <p className="cozy-subtitle">
                    {isEditMode
                      ? "Update the room details below"
                      : "Fill in the details to add a room to this hotel"}
                  </p>
                </div>

                <Formik
                  initialValues={initalValues}
                  validationSchema={validationSchema}
                  onSubmit={handleSubmit}
                  enableReinitialize
                >
                  <Form>
                    {/* Room Number + Room Type */}
                    <div className="row mb-3">
                      <div className="col-6">
                        <label className="form-label fw-semibold">
                          Room Number
                        </label>
                        <Field
                          type="number"
                          name="roomNumber"
                          placeholder="e.g. 101"
                          className="form-control cozy-input"
                        />
                        <p className="text-danger small mb-0 mt-1">
                          <ErrorMessage name="roomNumber" />
                        </p>
                      </div>
                      <div className="col-6">
                        <label className="form-label fw-semibold">
                          Room Type
                        </label>
                        <Field
                          as="select"
                          name="roomType"
                          className="form-select cozy-input"
                        >
                          <option value="STANDARD">Standard</option>
                          <option value="DELUXE">Deluxe</option>
                          <option value="SUITE">Suite</option>
                          <option value="PENTHOUSE">Penthouse</option>
                        </Field>
                        <p className="text-danger small mb-0 mt-1">
                          <ErrorMessage name="roomType" />
                        </p>
                      </div>
                    </div>

                    {/* Bed Size + Capacity */}
                    <div className="row mb-3">
                      <div className="col-6">
                        <label className="form-label fw-semibold">
                          Bed Size
                        </label>
                        <Field
                          as="select"
                          name="bedSize"
                          className="form-select cozy-input"
                        >
                          <option value="SINGLE">Single</option>
                          <option value="DOUBLE">Double</option>
                          <option value="KING">King</option>
                        </Field>
                        <p className="text-danger small mb-0 mt-1">
                          <ErrorMessage name="bedSize" />
                        </p>
                      </div>
                      <div className="col-6">
                        <label className="form-label fw-semibold">
                          Capacity (guests)
                        </label>
                        <Field
                          type="number"
                          name="capacity"
                          min="1"
                          max="10"
                          className="form-control cozy-input"
                        />
                        <p className="text-danger small mb-0 mt-1">
                          <ErrorMessage name="capacity" />
                        </p>
                      </div>
                    </div>

                    {/* Fare + Size */}
                    <div className="row mb-3">
                      <div className="col-6">
                        <label className="form-label fw-semibold">
                          Fare (₹ per night)
                        </label>
                        <Field
                          type="number"
                          name="fare"
                          min="1"
                          placeholder="e.g. 2500"
                          className="form-control cozy-input"
                        />
                        <p className="text-danger small mb-0 mt-1">
                          <ErrorMessage name="fare" />
                        </p>
                      </div>
                      <div className="col-6">
                        <label className="form-label fw-semibold">
                          Size (sq. meters)
                        </label>
                        <Field
                          type="number"
                          name="sizeSQM"
                          min="1"
                          placeholder="e.g. 30"
                          className="form-control cozy-input"
                        />
                        <p className="text-danger small mb-0 mt-1">
                          <ErrorMessage name="sizeSQM" />
                        </p>
                      </div>
                    </div>

                    {/* AC Checkbox */}
                    <div className="mb-4">
                      <div className="cozy-card p-3 d-flex align-items-center gap-3">
                        <Field
                          type="checkbox"
                          name="ac"
                          id="ac"
                          className="form-check-input mt-0"
                          style={{
                            width: "20px",
                            height: "20px",
                            cursor: "pointer",
                          }}
                        />
                        <label
                          htmlFor="ac"
                          className="mb-0 fw-semibold"
                          style={{ cursor: "pointer" }}
                        >
                          Air Conditioned
                        </label>
                      </div>
                    </div>

                    {/* Buttons */}
                    <div className="d-flex gap-3">
                      <button
                        type="submit"
                        className="btn cozy-btn-primary flex-grow-1"
                      >
                        {isEditMode ? "Update Room" : "Add Room"}
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
    </>
  );
}

export default RoomForm;
