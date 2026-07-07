import { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as yup from "yup";
import toast from "react-hot-toast";

import userService from "../../services/userService";
import AuthContext from "../../context/AuthContext";
import { useLoadingBar } from "../../context/LoadingBarContext";

function UpdateProfile() {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const loadingBar = useLoadingBar();

  const [initialValues, setInitialValues] = useState({
    name: "",
    email: "",
    password: "",
    gender: "",
    contactNumber: "",
    address: "",
    role: "",
  });

  useEffect(() => {
    loadingBar.current.continuousStart();
    userService
      .get(user.userId)
      .then((res) => {
        const p = res.data;
        setInitialValues({
          name: p.name || "",
          email: p.email || "",
          password: "",
          gender: p.gender || "",
          contactNumber: p.contactNumber || "",
          address: p.address || "",
          role: p.role || "GUEST",
        });
      })
      .catch(() => toast.error("Failed to load profile data"))
      .finally(() => loadingBar.current.complete());
  }, []);

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
      .required("Required")
      .matches("^[0-9]{10}$", "Must be 10 digits"),
    address: yup
      .string()
      .required("Address is required")
      .min(10, "At least 10 characters"),
  });

  const handleSubmit = (values) => {
    const toastId = toast.loading("Updating profile...");
    loadingBar.current.staticStart();

    userService
      .get(user.userId, values)
      .then(() => {
        toast.success("Profile updated successfully!", { id: toastId });
        navigate("/profile");
      })
      .catch((error) => {
        toast.error(error.response?.data?.message || "Update failed", {
          id: toastId,
        });
      })
      .finally(() => loadingBar.current.complete());
  };

  return (
    <div className="cozy-page">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-md-7">
            <div className="cozy-card p-4 p-md-5">
              <div className="mb-4">
                <h2 className="cozy-title mb-1">Edit Profile</h2>
                <p className="cozy-subtitle">Update your account details</p>
              </div>

              <Formik
                initialValues={initialValues}
                validationSchema={validationSchema}
                onSubmit={handleSubmit}
                enableReinitialize
              >
                <Form>
                  <div className="mb-3">
                    <label className="form-label fw-semibold">Full Name</label>
                    <Field
                      type="text"
                      name="name"
                      className="form-control cozy-input"
                    />
                    <p className="text-danger small mb-0 mt-1">
                      <ErrorMessage name="name" />
                    </p>
                  </div>

                  <div className="mb-3">
                    <label className="form-label fw-semibold">Email</label>
                    <Field
                      type="email"
                      name="email"
                      className="form-control cozy-input"
                    />
                    <p className="text-danger small mb-0 mt-1">
                      <ErrorMessage name="email" />
                    </p>
                  </div>

                  <div className="mb-3">
                    <label className="form-label fw-semibold">
                      New Password
                    </label>
                    <Field
                      type="password"
                      name="password"
                      placeholder="Enter new password"
                      className="form-control cozy-input"
                    />
                    <p className="text-danger small mb-0 mt-1">
                      <ErrorMessage name="password" />
                    </p>
                  </div>

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
                        <option value="OTHER">Other</option>
                      </Field>
                      <p className="text-danger small mb-0 mt-1">
                        <ErrorMessage name="gender" />
                      </p>
                    </div>
                    <div className="col-6">
                      <label className="form-label fw-semibold">
                        Contact Number
                      </label>
                      <Field
                        type="text"
                        name="contactNumber"
                        className="form-control cozy-input"
                      />
                      <p className="text-danger small mb-0 mt-1">
                        <ErrorMessage name="contactNumber" />
                      </p>
                    </div>
                  </div>

                  <div className="mb-4">
                    <label className="form-label fw-semibold">Address</label>
                    <Field
                      as="textarea"
                      name="address"
                      rows={3}
                      className="form-control cozy-input"
                    />
                    <p className="text-danger small mb-0 mt-1">
                      <ErrorMessage name="address" />
                    </p>
                  </div>

                  <div className="d-flex gap-3">
                    <button
                      type="submit"
                      className="btn cozy-btn-primary flex-grow-1"
                    >
                      Save Changes
                    </button>
                    <button
                      type="button"
                      className="btn cozy-btn-outline"
                      onClick={() => navigate("/profile")}
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

export default UpdateProfile;
