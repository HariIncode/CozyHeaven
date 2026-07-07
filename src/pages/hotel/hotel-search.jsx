import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import * as yup from 'yup';
import { Formik, Form, ErrorMessage, Field} from 'formik';
import toast from "react-hot-toast";

import { useLoadingBar } from "../../context/LoadingBarContext";
import HotelDataService from "../../services/hotelService";
import HotelCard from '../../components/HotelCard';

function HotelSearch() {
  const [results, setResults] = useState([]);
  const [searched, setSearched] = useState(false);
  const navigate = useNavigate();

  const loadingBar = useLoadingBar();

  const initialValues = {
    location: "",
    checkIn: "",
    checkOut: "",
    guests: 1,
  };

  const validationSchema = yup.object().shape({
    location: yup.string().required("Location is required"),
    checkIn: yup.date().required("Check-in date is required"),
    checkOut: yup
      .date()
      .required("Check-out date is required")
      .min(yup.ref("checkIn"), "Check-out must be after check-in"),
    guests: yup.number().min(1, "At least 1 guest").required("Required"),
  });

  const handleSubmit = (values) => {

    loadingBar.current.continuousStart();

    const toastId = toast.loading("Searching Hotels.")

    HotelDataService
      .getByLocation(values)
      .then((response) => {

        console.log(response);
        

      setResults(response.data);
      setSearched(true);
      if (response.data.length === 0 ) {
        toast("No hotels available at the moment.", {
          id : toastId
        });
      }
      })
      .catch((error) => {
        toast.error( error.status === 404 ? "No Hotel Found" : "Search Failed" , {
          id : toastId
        });
      })
      .finally(() => {
        loadingBar.current.complete();
      })
  };

  return (
    <div className="cozy-page">
      <div className="container">
        {/* Hero */}
        <div className="text-center mb-5">
          <h1 className="cozy-title" style={{ fontSize: "2.5rem" }}>
            Find Your Perfect Stay
          </h1>
          <p className="cozy-subtitle fs-5">
            Search hotels by location, dates and guests
          </p>
        </div>

        {/* Search Form */}
        <div className="cozy-card p-4 mb-5">
          <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
          >
            <Form>
              <div className="row g-3 align-items-end">
                <div className="col-md-3">
                  <label className="form-label fw-semibold">Location</label>
                  <Field
                    type="text"
                    name="location"
                    placeholder="City or area"
                    className="form-control cozy-input"
                  />
                  <p className="text-danger small mb-0 mt-1">
                    <ErrorMessage name="location" />
                  </p>
                </div>

                <div className="col-md-3">
                  <label className="form-label fw-semibold">Check In</label>
                  <Field
                    type="date"
                    name="checkIn"
                    className="form-control cozy-input"
                  />
                  <p className="text-danger small mb-0 mt-1">
                    <ErrorMessage name="checkIn" />
                  </p>
                </div>

                <div className="col-md-3">
                  <label className="form-label fw-semibold">Check Out</label>
                  <Field
                    type="date"
                    name="checkOut"
                    className="form-control cozy-input"
                  />
                  <p className="text-danger small mb-0 mt-1">
                    <ErrorMessage name="checkOut" />
                  </p>
                </div>

                <div className="col-md-1">
                  <label className="form-label fw-semibold">Guests</label>
                  <Field
                    type="number"
                    name="guests"
                    min="1"
                    className="form-control cozy-input"
                  />
                  <p className="text-danger small mb-0 mt-1">
                    <ErrorMessage name="guests" />
                  </p>
                </div>

                <div className="col-md-2">
                  <button type="submit" className="btn cozy-btn-primary w-100">
                    Search
                  </button>
                </div>
              </div>
            </Form>
          </Formik>
        </div>

        {/* Results */}
        {searched && results.length > 0 && (
          <>
            <h4 className="fw-bold mb-4">
              {results.length} hotel{results.length > 1 ? "s" : ""} found
            </h4>
            <div className="row g-4">
              {results.map((hotel) => (
                <div className="col-md-4" key={hotel.hotelId}>
                  <HotelCard hotel={hotel} />
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default HotelSearch;
