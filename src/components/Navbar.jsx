import { useContext } from "react";
import AuthContext from "../context/AuthContext";
import { NavLink, Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

function Navbar() {
  const { user, isLoggedIn, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    toast.success("Logged out Successfully...");
  };

  return (
    <>
      <nav
        className="navbar navbar-expand-lg"
        style={{
          borderBottom: "2px solid #000",
          background: "#fff",
          boxShadow: "0 3px 0px #000",
          fontFamily: "'Poppins', sans-serif",
          padding: "10px 0",
        }}
      >
        <div className="container">
          {/* Brand */}
          <NavLink
            className="navbar-brand fw-bold"
            to="/"
            style={{ fontSize: "1.3rem", color: "#2563eb" }}
          >
            🏨 CozyHeaven
          </NavLink>

          {/* Toggle for mobile */}
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarNav"
            style={{ border: "2px solid #000" }}
          >
            <span className="navbar-toggler-icon" />
          </button>

          <div className="collapse navbar-collapse" id="navbarNav">
            <ul className="navbar-nav me-auto mb-2 mb-lg-0">
              {/* Always visible */}
              <li className="nav-item">
                <NavLink className="nav-link fw-semibold" to="/">
                  Search
                </NavLink>
              </li>
              <li className="nav-item">
                <NavLink className="nav-link fw-semibold" to="/hotels">
                  Hotels
                </NavLink>
              </li>

              {/* Logged-in user */}
              {isLoggedIn && (
                <li className="nav-item">
                  <NavLink className="nav-link fw-semibold" to="/bookings">
                    My Bookings
                  </NavLink>
                </li>
              )}

              {/* Hotel Owner */}
              {isLoggedIn && user?.role === "HOTEL_OWNER" && (
                <li className="nav-item">
                  <NavLink className="nav-link fw-semibold" to="/hotel/add">
                    Add Hotel
                  </NavLink>
                </li>
              )}

              {/* Admin */}
              {isLoggedIn && user?.role === "ADMIN" && (
                <li className="nav-item dropdown">
                  <a
                    className="nav-link fw-semibold dropdown-toggle"
                    href="#"
                    role="button"
                    data-bs-toggle="dropdown"
                  >
                    Admin
                  </a>
                  <ul
                    className="dropdown-menu"
                    style={{ border: "2px solid #000", borderRadius: "8px" }}
                  >
                    <li>
                      <NavLink className="dropdown-item" to="/admin/dashboard">
                        Dashboard
                      </NavLink>
                    </li>
                    <li>
                      <NavLink className="dropdown-item" to="/admin/users">
                        Users
                      </NavLink>
                    </li>
                    <li>
                      <NavLink className="dropdown-item" to="/admin/hotels">
                        Hotels
                      </NavLink>
                    </li>
                    <li>
                      <NavLink className="dropdown-item" to="/admin/bookings">
                        Bookings
                      </NavLink>
                    </li>
                    <li>
                      <NavLink className="dropdown-item" to="/admin/refunds">
                        Refunds
                      </NavLink>
                    </li>
                  </ul>
                </li>
              )}
            </ul>

            {/* Right side */}
            <div className="d-flex align-items-center gap-3">
              {isLoggedIn ? (
                <>
                  <NavLink
                    to="/profile"
                    className="fw-semibold text-dark text-decoration-none"
                    style={{ fontSize: "0.9rem" }}
                  >
                    👤 {user?.name}
                  </NavLink>
                  <button
                    className="btn cozy-btn-outline"
                    style={{ padding: "4px 16px", fontSize: "0.875rem" }}
                    onClick={handleLogout}
                  >
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <NavLink
                    to="/login"
                    className="btn cozy-btn-primary"
                    style={{ padding: "4px 16px", fontSize: "0.875rem" }}
                  >
                    Login
                  </NavLink>
                  <NavLink
                    to="/register"
                    className="btn cozy-btn-primary"
                    style={{ padding: "4px 16px", fontSize: "0.875rem" }}
                  >
                    Register
                  </NavLink>
                </>
              )}
            </div>
          </div>
        </div>
      </nav>
    </>
  );
}

export default Navbar;
