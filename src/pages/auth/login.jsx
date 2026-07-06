import { useContext } from "react";
import { Link } from "react-router-dom";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as yup from "yup";
// import Swal from "sweetalert2";
import toast from "react-hot-toast";
import { useLoadingBar } from "../../context/LoadingBarContext";

import AuthContext from "../../context/AuthContext";
import LoginDataService from "../../services/loginService";

function Login() {
  const loadingBar = useLoadingBar();
  const { login } = useContext(AuthContext);

  const initialValues = { email: "", password: "" };

  const validationSchema = yup.object().shape({
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
  });

  const handleSubmit = (values, { resetForm }) => {
    const toastId = toast.loading("Signing in...");

    loadingBar.current.continuousStart();

    LoginDataService.login(values)
      .then((response) => {
        const { token, userId, name, email, role } = response.data;
        login(token, { userId, name, email, role });

        toast.success(`Welcome back, ${name}!`, { id: toastId });
        resetForm();
      })
      .catch((error) => {
        toast.error(
          error.response?.data?.message || "Invalid email or password",
          { id: toastId },
        );
      })
      .finally(() => {
        loadingBar.current.complete();
      });
  };

  return (
    <div className="d-flex justify-content-center align-items-center min-vh-100">
      <div
        className="cozy-card p-4 p-md-5"
        style={{ width: "100%", maxWidth: "440px" }}
      >
        {/* Header */}
        <div className="text-center mb-4">
          <h2 className="cozy-title">CozyHeaven</h2>
          <p className="cozy-subtitle">Sign in to your account</p>
        </div>

        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          <Form>
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

            <div className="mb-4">
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

            <button type="submit" className="btn cozy-btn-primary w-100">
              Sign In
            </button>
          </Form>
        </Formik>

        <div className="cozy-divider" />
        <p className="text-center mb-0 cozy-subtitle">
          No account?{" "}
          <Link to="/register" className="fw-semibold text-dark">
            Register here
          </Link>
        </p>
      </div>
    </div>
  );
}

export default Login;
