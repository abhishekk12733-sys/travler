import React, { useState, useEffect } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom"; // Import useParams, useLocation, and useNavigate
import { X, MapPin, Calendar, UserPlus, XCircle } from "lucide-react"; // Import UserPlus and XCircle
import api from "../../utils/api";
import { useAuth } from "../../contexts/AuthContext";
import AddMemberForm from "../AddMemberForm"; // Import AddMemberForm

export default function TravelLogDetail({ log: initialLog, onClose }) {
  const { user, loading: authLoading } = useAuth();
  const { id } = useParams(); // Get id from URL params
  const location = useLocation(); // Get location object for query params
  const navigate = useNavigate(); // Initialize useNavigate
  const [log, setLog] = useState(initialLog);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchLogDetails = async () => {
      if (!user) {
        setError("You must be logged in to view travel log details.");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const logId = initialLog?._id || id; // Use id from params if initialLog is not available
        const res = await api.get(`/travelLogs/${logId}`);
        setLog(res.data);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching travel log details:", err);
        setError(
          "Failed to load travel log details. " +
            (err.response?.data?.msg || err.message)
        );
        setLoading(false);
      }
    };

    if ((initialLog && initialLog._id) || (id && !authLoading)) {
      // Check for initialLog or id from params
      fetchLogDetails();
    } else if (!authLoading && !user) {
      setError("You must be logged in to view travel log details.");
      setLoading(false);
    }
  }, [initialLog, user, authLoading, id, location.search]);

  const loadLogDetails = async () => {
    if (!user) {
      setError("You must be logged in to view travel log details.");
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const logId = initialLog?._id || id;
      const res = await api.get(`/travelLogs/${logId}`);
      setLog(res.data);
      setLoading(false);
    } catch (err) {
      console.error("Error fetching travel log details:", err);
      setError(
        "Failed to load travel log details. " +
          (err.response?.data?.msg || err.message)
      );
      setLoading(false);
    }
  };

  const handleRemoveMember = async (memberId) => {
    if (window.confirm("Are you sure you want to remove this member?")) {
      setError(null);
      try {
        const logId = initialLog?._id || id;
        await api.delete(`/travelLogs/${logId}/members/${memberId}`);
        loadLogDetails(); // Reload log to reflect changes
      } catch (err) {
        setError(err.response?.data?.msg || "Failed to remove member.");
        console.error("Error removing member:", err);
      }
    }
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600 font-medium">Loading travel log...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 text-red-600">
        {error}
      </div>
    );
  }

  if (!log) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 text-gray-600">
        Travel log not found.
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
        <div className="relative h-96 bg-gradient-to-br from-blue-400 to-cyan-400">
          <div className="w-full h-full flex items-center justify-center">
            <MapPin className="w-24 h-24 text-white opacity-50" />
          </div>
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 bg-white rounded-full shadow-lg hover:bg-gray-100 transition"
          >
            <X className="w-6 h-6 text-gray-700" />
          </button>
          <div className="absolute bottom-4 left-4">
            <span
              className={`px-4 py-2 rounded-full text-sm font-semibold ${
                log.status === "visited"
                  ? "bg-green-500 text-white"
                  : log.status === "wishlist"
                  ? "bg-yellow-500 text-white"
                  : log.status === "ongoing"
                  ? "bg-purple-500 text-white"
                  : "bg-gray-500 text-white" // Added default for public/private
              }`}
            >
              {log.status === "visited"
                ? "Visited"
                : log.status === "wishlist"
                ? "Wishlist"
                : log.status === "ongoing"
                ? "ongoing"
                : log.status === "public"
                ? "Public"
                : "Private"}
            </span>
          </div>
        </div>

        <div className="p-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">{log.title}</h1>

          <div className="flex items-center space-x-6 text-gray-600 mb-6">
            <div className="flex items-center space-x-2">
              <MapPin className="w-5 h-5" />
              <span className="font-medium">{log.destination}</span>
            </div>
            <div className="flex items-center space-x-2">
              <Calendar className="w-5 h-5" />
              <span>
                {new Date(log.date).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </span>
            </div>
            {log.latitude && log.longitude && (
              <div className="flex items-center space-x-2">
                <MapPin className="w-5 h-5" />
                <span className="font-medium">
                  Lat: {log.latitude}, Lng: {log.longitude}
                </span>
              </div>
            )}
          </div>

          {log.description && (
            <div className="mb-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-3">
                Description
              </h2>
              <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                {log.description}
              </p>
            </div>
          )}

          {log.expenses && log.expenses.length > 0 && (
            <div className="mb-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-3">
                Expenses
              </h2>
              <ul className="space-y-2">
                {log.expenses.map((expense) => (
                  <li
                    key={expense._id}
                    className="flex justify-between items-center bg-gray-50 p-3 rounded-lg"
                  >
                    <span className="text-gray-700">
                      {expense.description} ({expense.category})
                    </span>
                    <span className="font-semibold text-gray-900">
                      ${expense.amount.toFixed(2)}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          <div className="mt-8 border-t border-gray-200 pt-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-gray-900">Members</h2>
              {user &&
                log.userId._id === user.id && ( // Only owner can add members
                  <button
                    onClick={() => navigate("/add-member")} // Navigate to add-member page
                    className="flex items-center px-3 py-1 bg-blue-500 text-white rounded-md text-sm hover:bg-blue-600 transition"
                  >
                    <UserPlus className="w-4 h-4 mr-1" /> Add Member
                  </button>
                )}
            </div>

            <ul className="space-y-2">
              {log.members && log.members.length > 0 ? (
                log.members.map((member) => (
                  <li
                    key={member._id}
                    className="flex items-center justify-between bg-gray-50 p-3 rounded-lg"
                  >
                    <div className="flex items-center space-x-3">
                      <UserPlus className="w-5 h-5 text-gray-500" />
                      <span className="font-medium text-gray-800">
                        {member.username}{" "}
                        {member._id === log.userId._id && "(Owner)"}
                      </span>
                    </div>
                    {user &&
                      log.userId._id === user.id &&
                      member._id !== log.userId._id && (
                        <button
                          onClick={() => handleRemoveMember(member._id)}
                          className="px-3 py-1 bg-red-500 text-white rounded-md text-sm hover:bg-red-600 transition"
                        >
                          Remove
                        </button>
                      )}
                  </li>
                ))
              ) : (
                <p className="text-gray-600">No members added yet.</p>
              )}
            </ul>
          </div>

          <div className="flex space-x-4 pt-4 border-t border-gray-200 mt-8">
            <button
              onClick={onClose}
              className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
