import "./assets/bootstrap.min.css";
import "../src/App.css";

import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster } from "react-hot-toast";

import AuthProvider from "./context/AuthProvider.jsx";
import App from "./App.jsx";
import Login from "./pages/auth/login.jsx";
import Register from "./pages/auth/register.jsx";
import HotelForm from "./pages/hotel/hotel-form.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 2000,
            style: {
              fontFamily: "'Poppins', sans-serif",
              fontWeight: "500",
              fontSize: "0.875rem",
              border: "2px solid #000",
              borderRadius: "8px",
              boxShadow: "4px 4px 0px #000",
              padding: "12px 16px",
            },
            success: {
              style: {
                background: "#f0fdf4",
                color: "#15803d",
                border: "2px solid #000",
              },
              iconTheme: {
                primary: "#16a34a",
                secondary: "#fff",
              },
            },
            error: {
              style: {
                background: "#fef2f2",
                color: "#b91c1c",
                border: "2px solid #000",
              },
              iconTheme: {
                primary: "#dc2626",
                secondary: "#fff",
              },
            },
          }}
        />
        <App />
        {/* <Routes>
         <Route path="/login" index element={ <Login />}/>
         <Route path="/register" element={ <Register />}/>
         <Route path="/add/hotel" element={ <HotelForm />}/>

        </Routes> */}
      </AuthProvider>
    </BrowserRouter>
  </StrictMode>,
);
