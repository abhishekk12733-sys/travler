import React, { useState, useContext, useEffect } from "react";
import { AuthContext } from "../../contexts/AuthContext";
import { createExpense, updateExpense, getTravelLogs } from "../../utils/api";
import { useNavigate } from "react-router-dom";

const ExpenseForm = ({ currentExpense, onSave }) => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    description: "",
    amount: "",
    category: "",
    date: "",
    travelLog: "",
  });
  const [travelLogs, setTravelLogs] = useState([]);
  const [loadingTravelLogs, setLoadingTravelLogs] = useState(true);
  const [errorTravelLogs, setErrorTravelLogs] = useState(null);

  useEffect(() => {
    const fetchTravelLogs = async () => {
      try {
        const logs = await getTravelLogs();
        setTravelLogs(logs);
      } catch (err) {
        console.error("Error fetching travel logs:", err);
        setErrorTravelLogs("Failed to load travel logs.");
      } finally {
        setLoadingTravelLogs(false);
      }
    };
    fetchTravelLogs();
  }, []);

  useEffect(() => {
    if (currentExpense) {
      setFormData({
        description: currentExpense.description,
        amount: currentExpense.amount,
        category: currentExpense.category,
        date: currentExpense.date.substring(0, 10), // Format date for input
        travelLog: currentExpense.travelLog || "",
      });
    } else {
      setFormData({
        description: "",
        amount: "",
        category: "",
        date: "",
        travelLog: "",
      });
    }
  }, [currentExpense]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) {
      navigate("/login");
      return;
    }

    try {
      if (currentExpense) {
        await updateExpense(currentExpense._id, formData);
      } else {
        await createExpense(formData);
      }
      onSave();
      setFormData({
        description: "",
        amount: "",
        category: "",
        date: "",
        travelLog: "",
      });
    } catch (err) {
      console.error("Error saving expense:", err);
      // Handle error (e.g., show error message to user)
    }
  };

  return (
    <div className="max-w-lg mx-auto p-4 bg-white shadow-md rounded-lg">
      <h2 className="text-2xl font-bold mb-4">
        {currentExpense ? "Edit Expense" : "Add New Expense"}
      </h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="description" className="block text-gray-700">
            Description
          </label>
          <input
            type="text"
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>
        <div>
          <label htmlFor="amount" className="block text-gray-700">
            Amount
          </label>
          <input
            type="number"
            id="amount"
            name="amount"
            value={formData.amount}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
            min="0"
            step="0.01"
          />
        </div>
        <div>
          <label htmlFor="category" className="block text-gray-700">
            Category
          </label>
          <input
            type="text"
            id="category"
            name="category"
            value={formData.category}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>
        <div>
          <label htmlFor="date" className="block text-gray-700">
            Date
          </label>
          <input
            type="date"
            id="date"
            name="date"
            value={formData.date}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>
        <div>
          <label htmlFor="travelLog" className="block text-gray-700">
            Travel Log
          </label>
          {loadingTravelLogs ? (
            <p>Loading travel logs...</p>
          ) : errorTravelLogs ? (
            <p className="text-red-500">{errorTravelLogs}</p>
          ) : (
            <select
              id="travelLog"
              name="travelLog"
              value={formData.travelLog}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required={!currentExpense} // Required for new expenses, optional for existing
            >
              <option value="">Select a Travel Log</option>
              {travelLogs.map((log) => (
                <option key={log._id} value={log._id}>
                  {log.title}
                </option>
              ))}
            </select>
          )}
        </div>
        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          {currentExpense ? "Update Expense" : "Add Expense"}
        </button>
      </form>
    </div>
  );
};

export default ExpenseForm;
