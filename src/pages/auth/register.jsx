import { useContext } from "react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as yup from "yup";
import toast from "react-hot-toast";

import { useLoadingBar } from "../../context/LoadingBarContext";
import AuthContext from "../../context/AuthContext";
import UserDataService from "../../services/userService";

function Register() {
  const loadingBar = useLoadingBar();
  const { login } = useContext(AuthContext);

  const navigate = useNavigate();

  const initialValues = {
    name: "",
    email: "",
    password: "",
    gender: "",
    contactNumber: "",
    address: "",
    role: "GUEST",
  };

  const validationSchema = yup.object().shape({
    name: yup
      .string()
      .required("Name is required")
      .min(2, "At least 2 characters"),
    email: yup
      .string()
      .required("Email is required")
      .email("Enter a valid email"),
    password: yup
      .string()
      .required("Password is required")
      .matches(
        "^(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*]).+$",
        "Must have uppercase, digit and special character",
      ),
    gender: yup.string().required("Gender is required"),
    contactNumber: yup
      .string()
      .required("Contact number is required")
      .matches("^[0-9]{10}$", "Must be exactly 10 digits"),
    address: yup
      .string()
      .required("Address is required")
      .min(10, "At least 10 characters"),
    role: yup.string().required("Role is required"),
  });

  const handleSubmit = (values, { resetForm }) => {
    const toastId = toast.loading("Signing up...");

    loadingBar.current.continuousStart();

    UserDataService.register(values)
      .then(() => {
        toast.success("Registered Successfully!", { id: toastId });
        navigate("/login");
        resetForm();
      })
      .catch((error) => {
        toast.error(error.response?.data?.message || "Registration Failed", {
          id: toastId,
        });
      })
      .finally(() => {
        loadingBar.current.complete();
      });
  };

  return (
    <div className="d-flex justify-content-center align-items-center min-vh-100 py-5">
      <div
        className="cozy-card p-4 p-md-5"
        style={{ width: "100%", maxWidth: "520px" }}
      >
        {/* Header */}
        <div className="text-center mb-4">
          <h2 className="cozy-title">Create Account</h2>
          <p className="cozy-subtitle">Join CozyHeaven today</p>
        </div>

        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          <Form>
            {/* Name */}
            <div className="mb-3">
              <label className="form-label fw-semibold">Full Name</label>
              <Field
                type="text"
                name="name"
                placeholder="Enter full name"
                className="form-control cozy-input"
              />
              <p className="text-danger small mb-0 mt-1">
                <ErrorMessage name="name" />
              </p>
            </div>

            {/* Email */}
            <div className="mb-3">
              <label className="form-label fw-semibold">Email</label>
              <Field
                type="email"
                name="email"
                placeholder="you@example.com"
                className="form-control cozy-input"
              />
              <p className="text-danger small mb-0 mt-1">
                <ErrorMessage name="email" />
              </p>
            </div>

            {/* Password */}
            <div className="mb-3">
              <label className="form-label fw-semibold">Password</label>
              <Field
                type="password"
                name="password"
                placeholder="Enter password"
                className="form-control cozy-input"
              />
              <p className="text-danger small mb-0 mt-1">
                <ErrorMessage name="password" />
              </p>
            </div>

            {/* Gender + Role side by side */}
            <div className="row mb-3">
              <div className="col-6">
                <label className="form-label fw-semibold">Gender</label>
                <Field
                  as="select"
                  name="gender"
                  className="form-select cozy-input"
                >
                  <option value="">Select</option>
                  <option value="MALE">Male</option>
                  <option value="FEMALE">Female</option>
                </Field>
                <p className="text-danger small mb-0 mt-1">
                  <ErrorMessage name="gender" />
                </p>
              </div>
              <div className="col-6">
                <label className="form-label fw-semibold">Register as</label>
                <Field
                  as="select"
                  name="role"
                  className="form-select cozy-input"
                >
                  <option value="GUEST">Guest</option>
                  <option value="HOTEL_OWNER">Hotel Owner</option>
                </Field>
                <p className="text-danger small mb-0 mt-1">
                  <ErrorMessage name="role" />
                </p>
              </div>
            </div>

            {/* Contact */}
            <div className="mb-3">
              <label className="form-label fw-semibold">Contact Number</label>
              <Field
                type="text"
                name="contactNumber"
                placeholder="10-digit number"
                className="form-control cozy-input"
              />
              <p className="text-danger small mb-0 mt-1">
                <ErrorMessage name="contactNumber" />
              </p>
            </div>

            {/* Address */}
            <div className="mb-4">
              <label className="form-label fw-semibold">Address</label>
              <Field
                as="textarea"
                name="address"
                placeholder="Enter your address"
                className="form-control cozy-input"
                rows={3}
              />
              <p className="text-danger small mb-0 mt-1">
                <ErrorMessage name="address" />
              </p>
            </div>

            <button type="submit" className="btn cozy-btn-success w-100">
              Create Account
            </button>
          </Form>
        </Formik>

        <div className="cozy-divider" />
        <p className="text-center mb-0 cozy-subtitle">
          Already have an account?{" "}
          <Link to="/login" className="fw-semibold text-dark">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}

export default Register;
