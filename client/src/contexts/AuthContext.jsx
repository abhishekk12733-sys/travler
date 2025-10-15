import { createContext, useContext, useEffect, useState } from "react";
import api from "../utils/api";

export const AuthContext = createContext({});

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadUser = async () => {
      const token = localStorage.getItem("token");
      if (token) {
        try {
          const res = await api.get("/auth");
          setUser(res.data);
        } catch (error) {
          console.error("Failed to verify token with backend:", error);
          localStorage.removeItem("token");
          setUser(null);
        } finally {
          setLoading(false);
        }
      } else {
        setLoading(false); // If no token, stop loading immediately
      }
    };
    loadUser();
  }, []);

  const loadProfile = async (userId) => {
    // This would typically fetch user profile details from the backend
    // For now, we'll keep it simple or integrate later
    return null;
  };

  const signUp = async (username, email, password) => {
    try {
      const res = await api.post("/auth/signup", {
        username,
        email,
        password,
      });
      localStorage.setItem("token", res.data.token);
      // After successful signup, immediately verify the token with the backend
      const userRes = await api.get("/auth");
      setUser(userRes.data);
      return { data: res.data, error: null };
    } catch (error) {
      console.error("Signup error:", error.response?.data || error.message);
      return { data: null, error: error.response?.data || error.message };
    }
  };

  const signIn = async (email, password) => {
    try {
      const res = await api.post("/auth/login", { email, password });
      localStorage.setItem("token", res.data.token);
      // After successful login, immediately verify the token with the backend
      const userRes = await api.get("/auth");
      setUser(userRes.data);
      return { data: res.data, error: null };
    } catch (error) {
      console.error("Login error:", error.response?.data || error.message);
      return { data: null, error: error.response?.data || error.message };
    }
  };

  const signOut = async () => {
    localStorage.removeItem("token");
    setUser(null);
    setProfile(null);
    return { error: null };
  };

  const updateProfile = async (updates) => {
    // This functionality will be implemented later if needed
    if (!user) return { error: new Error("No user logged in") };
    setProfile((prev) => ({ ...prev, ...updates }));
    return { data: { ...profile, ...updates }, error: null };
  };

  const value = {
    user,
    profile,
    loading,
    signUp,
    signIn,
    signOut,
    updateProfile,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
