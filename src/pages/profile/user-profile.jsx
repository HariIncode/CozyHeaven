import { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

import userService from "../../services/userService";
import AuthContext from "../../context/AuthContext";
import { useLoadingBar } from "../../context/LoadingBarContext";

function UserProfile() {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const loadingBar = useLoadingBar();

  const [profile, setProfile] = useState(null);

  useEffect(() => {
    loadingBar.current.continuousStart();
    userService
      .get(user.userId)
      .then((res) => {
        setProfile(res.data);
      })
      .catch(() => {
        toast.error("Failed to load profile");
      })
      .finally(() => {
        loadingBar.current.complete();
      });
  }, []);

  if (!profile) return null;

  const roleColors = {
    ADMIN: { bg: "#fef2f2", color: "#b91c1c" },
    HOTEL_OWNER: { bg: "#fff7ed", color: "#c2410c" },
    GUEST: { bg: "#eff6ff", color: "#1d4ed8" },
  };
  const roleStyle = roleColors[profile.role] || roleColors.GUEST;

  return (
    <div className="cozy-page">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-md-7">
            {/* Profile Card */}
            <div className="cozy-card p-4 p-md-5 mb-4">
              {/* Avatar + Name */}
              <div className="d-flex align-items-center gap-4 mb-4">
                <div
                  style={{
                    width: "72px",
                    height: "72px",
                    borderRadius: "50%",
                    border: "2px solid #000",
                    background: "#eff6ff",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "2rem",
                    fontWeight: "700",
                    color: "#2563eb",
                  }}
                >
                  {profile.name?.charAt(0).toUpperCase()}
                </div>
                <div>
                  <h3
                    className="cozy-title mb-0"
                    style={{ fontSize: "1.5rem" }}
                  >
                    {profile.name}
                  </h3>
                  <p className="cozy-subtitle mb-1">{profile.email}</p>
                  <span
                    className="cozy-badge"
                    style={{ background: roleStyle.bg, color: roleStyle.color }}
                  >
                    {profile.role}
                  </span>
                </div>
              </div>

              <div className="cozy-divider" />

              {/* Details */}
              <div className="row g-3 mt-1">
                <div className="col-md-6">
                  <p className="cozy-subtitle small mb-1">Contact Number</p>
                  <p className="fw-semibold mb-0">
                    {profile.contactNumber || "—"}
                  </p>
                </div>
                <div className="col-md-6">
                  <p className="cozy-subtitle small mb-1">Gender</p>
                  <p className="fw-semibold mb-0">{profile.gender || "—"}</p>
                </div>
                <div className="col-12">
                  <p className="cozy-subtitle small mb-1">Address</p>
                  <p className="fw-semibold mb-0">{profile.address || "—"}</p>
                </div>
                <div className="col-md-6">
                  <p className="cozy-subtitle small mb-1">Total Bookings</p>
                  <p className="fw-semibold mb-0">
                    {profile.totalBookings ?? 0}
                  </p>
                </div>
                <div className="col-md-6">
                  <p className="cozy-subtitle small mb-1">Member Since</p>
                  <p className="fw-semibold mb-0">
                    {new Date(profile.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </div>

              <div className="cozy-divider" />

              {/* Actions */}
              <div className="d-flex gap-3">
                <button
                  className="btn cozy-btn-primary"
                  onClick={() => navigate("/profile/edit")}
                >
                  Edit Profile
                </button>
                <button
                  className="btn cozy-btn-outline"
                  onClick={() => navigate("/bookings")}
                >
                  My Bookings
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default UserProfile;
