import React, { createContext, useState, useEffect, useCallback } from "react";
import axios from "axios";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(() => localStorage.getItem("token"));
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Set auth token for all axios requests
  useEffect(() => {
    if (token) {
      axios.defaults.headers.common["x-auth-token"] = token;
      localStorage.setItem("token", token);
    } else {
      delete axios.defaults.headers.common["x-auth-token"];
      localStorage.removeItem("token");
    }
  }, [token]);

  // Validate token and load user
  const validateToken = useCallback(async () => {
    if (!token) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const res = await axios.get("/api/users/me");
      setUser(res.data);
      setIsAuthenticated(true);
    } catch (err) {
      // If token is invalid, clear everything
      localStorage.removeItem("token");
      setToken(null);
      setUser(null);
      setIsAuthenticated(false);
      setError("Session expired. Please login again.");
    } finally {
      setLoading(false);
    }
  }, [token]);

  // Initial load and token validation
  useEffect(() => {
    validateToken();
  }, [validateToken]);

  // Register user
  const register = async (formData) => {
    try {
      const res = await axios.post("/api/users/register", formData);
      setToken(res.data.token);
      setUser(res.data.user);
      setIsAuthenticated(true);
      return true;
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed");
      return false;
    }
  };

  // Login user
  const login = async (formData) => {
    try {
      const res = await axios.post("/api/users/login", formData);
      setToken(res.data.token);
      setUser(res.data.user);
      setIsAuthenticated(true);
      return true;
    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
      return false;
    }
  };

  // Logout user - completely clears authentication
  const logout = useCallback(() => {
    // Clear axios header
    delete axios.defaults.headers.common["x-auth-token"];

    // Clear local storage
    localStorage.removeItem("token");

    // Reset all state
    setToken(null);
    setUser(null);
    setIsAuthenticated(false);

    // Clear any errors
    setError(null);
  }, []);

  // Clear errors
  const clearError = () => setError(null);

  return (
    <AuthContext.Provider
      value={{
        token,
        isAuthenticated,
        loading,
        user,
        error,
        register,
        login,
        logout,
        clearError,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
