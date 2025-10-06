import { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadUser = async () => {
      const token = localStorage.getItem("token");
      if (token) {
        // In a real app, you would verify the token with the backend
        // and fetch user details. For now, we'll just set isAuthenticated
        // and a mock user.
        setIsAuthenticated(true);
        setUser({
          id: "mockUserId1",
          username: "MockUser",
          email: "mock@example.com",
        }); // Replace with actual user data from token
      }
      setLoading(false);
    };
    loadUser();
  }, []);

  const login = async (email, password) => {
    try {
      const res = await axios.post("/api/auth/login", { email, password });
      localStorage.setItem("token", res.data.token);
      setIsAuthenticated(true);
      setUser({ id: "mockUserId1", username: "MockUser", email: email }); // Mock user data
      return { success: true };
    } catch (err) {
      console.error(err.response.data.msg);
      return { success: false, message: err.response.data.msg };
    }
  };

  const signup = async (username, email, password) => {
    try {
      const res = await axios.post("/api/auth/signup", {
        username,
        email,
        password,
      });
      localStorage.setItem("token", res.data.token);
      setIsAuthenticated(true);
      setUser({ id: "mockUserId1", username: username, email: email }); // Mock user data
      return { success: true };
    } catch (err) {
      console.error(err.response.data.msg);
      return { success: false, message: err.response.data.msg };
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
    setIsAuthenticated(false);
  };

  const updateProfile = (updates) => {
    setUser((prev) => ({ ...prev, ...updates }));
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        loading,
        login,
        signup,
        logout,
        updateProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
