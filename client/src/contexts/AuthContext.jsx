import { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";

const AuthContext = createContext({});

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
          // In a real app, you'd verify the token with the backend
          // For now, we'll just assume it's valid and decode it
          const decoded = JSON.parse(atob(token.split(".")[1])); // Basic decode for client-side
          setUser({
            id: decoded.user.id,
            username: decoded.user.username,
            email: decoded.user.email,
          });
        } catch (error) {
          console.error("Failed to decode token:", error);
          localStorage.removeItem("token");
        }
      }
      setLoading(false);
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
      const res = await axios.post("/api/auth/signup", {
        username,
        email,
        password,
      });
      localStorage.setItem("token", res.data.token);
      const decoded = JSON.parse(atob(res.data.token.split(".")[1]));
      setUser({ id: decoded.user.id, username, email });
      return { data: res.data, error: null };
    } catch (error) {
      console.error("Signup error:", error.response?.data || error.message);
      return { data: null, error: error.response?.data || error.message };
    }
  };

  const signIn = async (email, password) => {
    try {
      const res = await axios.post("/api/auth/login", { email, password });
      localStorage.setItem("token", res.data.token);
      const decoded = JSON.parse(atob(res.data.token.split(".")[1]));
      setUser({ id: decoded.user.id, email }); // Username might not be in login token
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
