import { createContext, useEffect, useState } from "react";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  //Set auth token for all axios request
  useEffect(() => {
    if (token) {
      axios.defaults.headers.common["x-auth-token"] = token;
    } else {
      delete axios.defaults.headers.common["x-auth-token"];
    }
  }, [token]);

  //Load user if token exists
  useEffect(() => {
    const loadUser = async () => {
      if (token) {
        try {
          const res = await axios.get("/api/users/me");
          setUser(res.data);
          setIsAuthenticated(true);
        } catch (error) {
          localStorage.removeItem("token");
          setToken(null);
          setError("Session expired. Please login again.");
        }
      }
      setLoading(false);
    };
    loadUser();
  }, [token]);

  //Register user
  const register = async (formData) => {
    try {
      const res = await axios.post("/api/users/register", formData);
      localStorage.setItem("token", res.data.token);
      setToken(res.data.token);
      setIsAuthenticated(true);
    } catch (error) {
      setError(error.response.data.message);
      return false;
    }
  };
  // Login user
  const login = async (formData) => {
    try {
      const res = await axios.post("/api/users/login", formData);
      localStorage.setItem("token", res.data.token);
      setToken(res.data.token);
      setUser(res.data.user);
      setIsAuthenticated(true);
      return true;
    } catch (err) {
      setError(err.response.data.message);
      return false;
    }
  };
  // Logout user
  const logout = () => {
    localStorage.removeItem("token");
    setToken(null);
    setUser(null);
    setIsAuthenticated(false);
  };
  // Clear errors
  const clearError = () => setError(null);

  return (
    <AuthContext.Provider value={
      {
        token,
        isAuthenticated,
        loading,
        user,
        error,
        register,
        login,
        logout,
        clearError,

      }
    }>{ children }</AuthContext.Provider>
  )
};
