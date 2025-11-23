import React from "react";
import { Routes, Route, useLocation } from "react-router-dom";

import Navbar from "./components/Navbar";

// Auth system
import { AuthProvider } from "./auth/AuthContext";
import ProtectedRoute from "./auth/ProtectedRoute";

// Pages
import HomePage from "./pages/HomePage";
import Login from "./pages/Login";
import Register from "./pages/Register";
import CreatePage from "./pages/CreatePage";
import CalculatePricePage from "./pages/CalculatePricePage";
import ProfilePage from "./pages/ProfilePage";



export default function App() {
  const location = useLocation();

  // Hide sidebar/navbar on Login & Register
  const hideNavbar = location.pathname === "/login" || location.pathname === "/register";

  return (
    <AuthProvider>
      {!hideNavbar && <Navbar />}  {/* Sidebar shown only when logged in */}

      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        <Route
          path="/"
          element={
            <ProtectedRoute>
              <HomePage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/create"
          element={
            <ProtectedRoute>
              <CreatePage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/calculate"
          element={
            <ProtectedRoute>
              <CalculatePricePage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <ProfilePage />
            </ProtectedRoute>
          }
        />
      </Routes>
    </AuthProvider>
  );
}
