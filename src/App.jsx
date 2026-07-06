import { useRef } from "react";
import { Route, Routes } from "react-router-dom";

import LoadingBarContext from "./context/LoadingBarContext";
import PrivateRouter from "./common/PrivateRouter";

import NavBar from "./components/Navbar";

import Login from "./pages/auth/login";
import Register from "./pages/auth/register";

import HotelSearch from "./pages/hotel/hotel-search";
import HotelList from "./pages/hotel/hotel-list";
import HotelDetails from "./pages/hotel/hotel-detail";
import HotelForm from "./pages/hotel/hotel-form";

import RoomList from "./pages/room/room-list";
import RoomFrom from "./pages/room/room-form";

import BookingForm from "./pages/booking/booking-form";
import BookingList from "./pages/booking/booking-list";
import BookingDetail from "./pages/booking/booking-detail";

import ReviewForm from "./pages/review/review-form";
import ReviewsList from "./pages/review/reviews-list";

import UserProfile from "./pages/profile/user-profile";
import UpdateProfile from "./pages/profile/update-profile";

import AdminDashboard from "./pages/admin/admin-dashboard";
import ManageUsers from "./pages/admin/manage-users";
import ManageHotels from "./pages/admin/manage-hotels";
import ManageBookings from "./pages/admin/manage-bookings";
import ManageRefunds from "./pages/admin/manage-refunds";
import LoadingBar from "react-top-loading-bar";

function App() {
  const loadingBarRef = useRef(null);

  return (
    <>
      <LoadingBarContext.Provider value={loadingBarRef}>

        <LoadingBar
          color="#2563eb"
          // color="#2a92d3"
          // color="#d32a2a"
          ref={loadingBarRef}
          height={4}
          shadow={true}
        />



        <NavBar />

        <Routes>
          {/* PUBLIC */}

          <Route path="/" element={<HotelSearch />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/hotels" element={<HotelList />} />
          <Route path="/hotels/:hotelId" element={<HotelDetails />} />

          {/* ANY LoggedIn USER */}

          <Route
            path="/bookings/new/:roomId"
            element={
              <PrivateRouter>
                <BookingForm />
              </PrivateRouter>
            }
          />

          <Route
            path="/bookings"
            element={
              <PrivateRouter>
                <BookingList />
              </PrivateRouter>
            }
          />

          <Route
            path="/bookings/:bookingId"
            element={
              <PrivateRouter>
                <BookingDetail />
              </PrivateRouter>
            }
          />

          <Route
            path="/profile"
            element={
              <PrivateRouter>
                <UserProfile />
              </PrivateRouter>
            }
          />

          <Route
            path="/profile/edit"
            element={
              <PrivateRouter>
                <UpdateProfile />
              </PrivateRouter>
            }
          />

          <Route
            path="/review/new/:bookingId"
            element={
              <PrivateRouter>
                <ReviewForm />
              </PrivateRouter>
            }
          />

          {/* HOTEL OWNER / ADMIN */}

          <Route
            path="/hotel/add"
            element={
              <PrivateRouter allowedRoles={["HOTEL_OWNER", "ADMIN"]}>
                <HotelForm />
              </PrivateRouter>
            }
          />

          <Route
            path="/hotel/edit/:hotelId"
            element={
              <PrivateRouter allowedRoles={["HOTEL_OWNER", "ADMIN"]}>
                <HotelForm />
              </PrivateRouter>
            }
          />

          <Route
            path="/hotel/:hotelId/rooms"
            element={
              <PrivateRouter allowedRoles={["HOTEL_OWNER", "ADMIN"]}>
                <RoomList />
              </PrivateRouter>
            }
          />

          <Route
            path="/hotel/:hotelId/room/add"
            element={
              <PrivateRouter allowedRoles={["HOTEL_OWNER", "ADMIN"]}>
                <RoomFrom />
              </PrivateRouter>
            }
          />

          <Route
            path="/hotel/:hotelId/room/edit/:roomId"
            element={
              <PrivateRouter allowedRoles={["HOTEL_OWNER", "ADMIN"]}>
                <RoomFrom />
              </PrivateRouter>
            }
          />

          {/* ADMIN ONLY */}

          <Route
            path="/admin/dashboard"
            element={
              <PrivateRouter allowedRoles={["ADMIN"]}>
                <AdminDashboard />
              </PrivateRouter>
            }
          />

          <Route
            path="/admin/users"
            element={
              <PrivateRouter allowedRoles={["ADMIN"]}>
                <ManageUsers />
              </PrivateRouter>
            }
          />

          <Route
            path="/admin/hotels"
            element={
              <PrivateRouter allowedRoles={["ADMIN"]}>
                <ManageHotels />
              </PrivateRouter>
            }
          />

          <Route
            path="/admin/bookings"
            element={
              <PrivateRouter allowedRoles={["ADMIN"]}>
                <ManageBookings />
              </PrivateRouter>
            }
          />

          <Route
            path="/admin/refunds"
            element={
              <PrivateRouter allowedRoles={["ADMIN"]}>
                <ManageRefunds />
              </PrivateRouter>
            }
          />
        </Routes>
      </LoadingBarContext.Provider>
    </>
  );
}

export default App;
