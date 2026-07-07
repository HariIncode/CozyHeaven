import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

import userService from "../../services/userService";
import hotelService from "../../services/hotelService";
import bookingService from "../../services/bookingService";
import refundService from "../../services/refundService";
import { useLoadingBar } from "../../context/LoadingBarContext";

function AdminDashboard() {
  const navigate = useNavigate();
  const loadingBar = useLoadingBar();

  const [stats, setStats] = useState({
    totalUsers: 0,
    totalHotels: 0,
    totalBookings: 0,
    pendingRefunds: 0,
  });

  useEffect(() => {
    loadingBar.current.continuousStart();
    Promise.all([
      userService.getAll(),
      hotelService.getAllHotels(),
      bookingService.getAll(),
      refundService.getAll(),
    ])
      .then(([userRes, hotelRes, bookingRes, refundsRes]) => {
  console.log(userRes.data.length);

        setStats({
          totalUsers: userRes.data.length,
          totalHotels: hotelRes.data.length,
          totalBookings: bookingRes.data.length,
          pendingRefunds: refundsRes.data.filter((r) => {
            r.refundStatus === "REQUESTED" || r.refundStatus === "APPROVED";
          }).length,
        });
      })
      .catch(() => {
        toast.error("Failed to load dashboard data");
      })
      .finally(() => {
        loadingBar.current.complete();
      });
  }, []);

  console.log(stats);
  
  

  const cards = [
    {
      label: "Total Users",
      value: stats.totalUsers,
      icon: "👤",
      bg: "#eff6ff",
      color: "#1d4ed8",
      route: "/admin/users",
    },
    {
      label: "Total Hotels",
      value: stats.totalHotels,
      icon: "🏨",
      bg: "#f0fdf4",
      color: "#15803d",
      route: "/admin/hotels",
    },
    {
      label: "Total Bookings",
      value: stats.totalBookings,
      icon: "📋",
      bg: "#fdf4ff",
      color: "#7e22ce",
      route: "/admin/bookings",
    },
    {
      label: "Pending Refunds",
      value: stats.pendingRefunds,
      icon: "💰",
      bg: "#fff7ed",
      color: "#c2410c",
      route: "/admin/refunds",
    },
  ];

  const quickLinks = [
    { label: "Manage Users", route: "/admin/users", icon: "👤" },
    { label: "Manage Hotels", route: "/admin/hotels", icon: "🏨" },
    { label: "Manage Bookings", route: "/admin/bookings", icon: "📋" },
    { label: "Manage Refunds", route: "/admin/refunds", icon: "💰" },
  ];

  return (
    <div className="cozy-page">
      <div className="container">
        <div className="mb-5">
          <h2 className="cozy-title mb-0">Admin Dashboard</h2>
          <p className="cozy-subtitle">Overview of CozyHeaven platform</p>
        </div>

        {/* Stat Cards */}
        <div className="row g-4 mb-5">
          {cards.map(({ label, value, icon, bg, color, route }) => (
            <div className="col-md-3" key={label}>
              <div
                className="cozy-card p-4 text-center"
                style={{ cursor: "pointer" }}
                onClick={() => navigate(route)}
              >
                <div style={{ fontSize: "2.5rem", marginBottom: "8px" }}>
                  {icon}
                </div>
                <h2
                  className="fw-bold mb-1"
                  style={{ color, fontSize: "2rem" }}
                >
                  {value}
                </h2>
                <p className="cozy-subtitle mb-0">{label}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Quick Links */}
        <h4 className="fw-bold mb-3">Quick Actions</h4>
        <div className="row g-3">
          {quickLinks.map(({ label, route, icon }) => (
            <div className="col-md-3" key={label}>
              <button
                className="btn cozy-btn-outline w-100 p-3"
                onClick={() => navigate(route)}
              >
                <span
                  style={{
                    fontSize: "1.5rem",
                    display: "block",
                    marginBottom: "4px",
                  }}
                >
                  {icon}
                </span>
                {label}
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;
