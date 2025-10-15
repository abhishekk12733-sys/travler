import axios from "axios";

const api = axios.create({
  baseURL: "/api", // Adjust this if your backend API is not served from /api
  headers: {
    "Content-Type": "application/json",
  },
});

// Add a request interceptor to include the token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers["x-auth-token"] = token;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add a response interceptor to handle 401 errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // If 401 received, clear token and redirect to login
      localStorage.removeItem("token");
      // Optionally, you might want to dispatch a logout action or redirect
      // window.location.href = "/login"; // Or use react-router-dom's history.push
    }
    return Promise.reject(error);
  }
);

export const getExpenses = async () => {
  const res = await api.get("/expenses");
  return res.data;
};

export const getExpenseById = async (id) => {
  const res = await api.get(`/expenses/${id}`);
  return res.data;
};

export const createExpense = async (expenseData) => {
  const res = await api.post("/expenses", expenseData);
  return res.data;
};

export const updateExpense = async (id, expenseData) => {
  const res = await api.put(`/expenses/${id}`, expenseData);
  return res.data;
};

export const deleteExpense = async (id) => {
  const res = await api.delete(`/expenses/${id}`);
  return res.data;
};

export const getTravelLogs = async () => {
  const res = await api.get("/travelLogs");
  return res.data;
};

export default api;
