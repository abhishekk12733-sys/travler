import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import axios from "axios";
import { X } from "lucide-react";

export default function AddMemberForm({ onClose }) {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [travelLogs, setTravelLogs] = useState([]);
  const [selectedTrip, setSelectedTrip] = useState("");
  const [description, setDescription] = useState("");
  const [memberEmail, setMemberEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  useEffect(() => {
    if (user) {
      loadTravelLogs();
    }
  }, [user]);

  const loadTravelLogs = async () => {
    setLoading(true);
    setError(null);
    const token = localStorage.getItem("token");

    if (!token) {
      setError("No authentication token found. Please log in.");
      setLoading(false);
      return;
    }

    try {
      const config = {
        headers: {
          "x-auth-token": token,
        },
      };
      const res = await axios.get("/api/travelLogs", config);
      setTravelLogs(res.data);
    } catch (err) {
      console.error(
        "Error loading travel logs:",
        err.response?.data || err.message
      );
      setError(err.response?.data?.msg || "Error loading travel logs.");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    if (!selectedTrip || !memberEmail) {
      setError("Please select a trip and enter a member email.");
      setLoading(false);
      return;
    }

    const token = localStorage.getItem("token");
    if (!token) {
      setError("No authentication token found. Please log in.");
      setLoading(false);
      return;
    }

    try {
      const config = {
        headers: {
          "x-auth-token": token,
          "Content-Type": "application/json",
        },
      };
      const body = {
        travelLogId: selectedTrip,
        memberEmail,
        description,
      };
      await axios.post("/api/travelLogs/add-member", body, config);
      setSuccess("Member added successfully!");
      setSelectedTrip("");
      setDescription("");
      setMemberEmail("");
      if (onClose) onClose();
    } catch (err) {
      console.error("Error adding member:", err.response?.data || err.message);
      setError(err.response?.data?.msg || "Error adding member.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md relative">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 p-2 rounded-full hover:bg-gray-100 transition"
        >
          <X className="w-5 h-5 text-gray-600" />
        </button>
        <h2 className="text-2xl font-bold text-gray-800 mb-6">
          Add Member to Trip
        </h2>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4">
            {error}
          </div>
        )}
        {success && (
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative mb-4">
            {success}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label
              htmlFor="trip"
              className="block text-gray-700 text-sm font-bold mb-2"
            >
              Select Trip:
            </label>
            <select
              id="trip"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              value={selectedTrip}
              onChange={(e) => setSelectedTrip(e.target.value)}
              required
            >
              <option value="">-- Select a Travel Log --</option>
              {travelLogs.map((log) => (
                <option key={log._id} value={log._id}>
                  {log.title} ({log.destination})
                </option>
              ))}
            </select>
          </div>

          <div className="mb-4">
            <label
              htmlFor="description"
              className="block text-gray-700 text-sm font-bold mb-2"
            >
              Description (Optional):
            </label>
            <textarea
              id="description"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline h-24"
              placeholder="Add a message for the member..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            ></textarea>
          </div>

          <div className="mb-6">
            <label
              htmlFor="memberEmail"
              className="block text-gray-700 text-sm font-bold mb-2"
            >
              Member Email:
            </label>
            <input
              type="email"
              id="memberEmail"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              placeholder="Enter member's email"
              value={memberEmail}
              onChange={(e) => setMemberEmail(e.target.value)}
              required
            />
          </div>

          <div className="flex items-center justify-between">
            <button
              type="submit"
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              disabled={loading}
            >
              {loading ? "Adding..." : "Add Member"}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              disabled={loading}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
