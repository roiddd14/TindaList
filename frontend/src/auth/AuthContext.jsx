// src/auth/AuthContext.jsx
import React, { createContext, useContext, useState, useEffect } from "react";

const API = import.meta.env.VITE_API_URL || "http://localhost:5000";
const AuthContext = createContext();

const getToken = () => localStorage.getItem("token");

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // ✅ FETCH CURRENT USER
  const fetchMe = async () => {
    try {
      const token = getToken();

      if (!token) {
        setUser(null);
        setLoading(false);
        return;
      }

      const res = await fetch(`${API}/api/auth/me`, {
        method: "GET",
        credentials: "include", // ✅ IMPORTANT
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.ok) {
        const data = await res.json();
        setUser(data.user);
      } else {
        setUser(null);
        localStorage.removeItem("token");
      }
    } catch {
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMe();
  }, []);

  // ✅ LOGIN
  const login = async (email, password) => {
    const res = await fetch(`${API}/api/auth/login`, {
      method: "POST",
      credentials: "include", // ✅ CRITICAL FIX
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ identifier: email, password }),
    });

    const data = await res.json();

    if (!res.ok) throw new Error(data.message || "Login failed");

    if (!data.token) throw new Error("Token not received");

    localStorage.setItem("token", data.token);
    setUser(data.user);

    return data;
  };

  // ✅ REGISTER
  const register = async (name, email, password) => {
    const res = await fetch(`${API}/api/auth/register`, {
      method: "POST",
      credentials: "include", // ✅ CRITICAL FIX
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, password }),
    });

    const data = await res.json();

    if (!res.ok) throw new Error(data.message || "Register failed");

    if (!data.token) throw new Error("Token not received");

    localStorage.setItem("token", data.token);
    setUser(data.user);

    return data;
  };

  // ✅ LOGOUT
  const logout = async () => {
    await fetch(`${API}/api/auth/logout`, {
      method: "POST",
      credentials: "include",
    });

    localStorage.removeItem("token");
    setUser(null);
  };

  // ✅ UPDATE PROFILE
  const updateProfile = async ({ name, email }) => {
    const token = getToken();

    const res = await fetch(`${API}/api/auth/update`, {
      method: "PUT",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ name, email }),
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data.message || "Update failed");

    setUser(data.user);
    return data;
  };

  // ✅ CHANGE PASSWORD
  const changePassword = async (currentPassword, newPassword) => {
    const token = getToken();

    const res = await fetch(`${API}/api/auth/change-password`, {
      method: "PUT",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ currentPassword, newPassword }),
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data.message || "Password change failed");

    return data;
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        register,
        logout,
        updateProfile,
        changePassword,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
