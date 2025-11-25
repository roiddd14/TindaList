// src/auth/AuthContext.jsx
import React, { createContext, useContext, useState, useEffect } from "react";

const API = import.meta.env.VITE_API_URL || "http://localhost:5000";
const AuthContext = createContext();

const getToken = () => localStorage.getItem("token");

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // ✅ Fetch logged in user using TOKEN HEADER
  const fetchMe = async () => {
    try {
      const token = getToken();

      if (!token) {
        setUser(null);
        setLoading(false);
        return;
      }

      const res = await fetch(`${API}/api/auth/me`, {
        headers: {
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
    } catch (err) {
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
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ identifier: email, password }),
    });

    const data = await res.json();

    if (!res.ok) throw new Error(data.message || "Login failed");

    setUser(data.user);
    localStorage.setItem("token", data.token); // ✅ SAVE TOKEN
    return data;
  };

  // ✅ REGISTER
  const register = async (name, email, password) => {
    const res = await fetch(`${API}/api/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, password }),
    });

    const data = await res.json();

    if (!res.ok) throw new Error(data.message || "Register failed");

    setUser(data.user);
    localStorage.setItem("token", data.token); // ✅ SAVE TOKEN
    return data;
  };

  // ✅ LOGOUT
  const logout = async () => {
    localStorage.removeItem("token");
    setUser(null);
  };

  // ✅ UPDATE PROFILE
  const updateProfile = async ({ name, email }) => {
    const token = getToken();

    const res = await fetch(`${API}/api/auth/update`, {
      method: "PUT",
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
