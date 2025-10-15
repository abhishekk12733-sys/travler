import React, { useState, useEffect } from "react";
import { getGroupTrips, createGroupTrip } from "../utils/groupTripApi";
import { useAuth } from "../contexts/AuthContext";
import { PlusCircle, Users, Calendar, MapPin } from "lucide-react";
import { Link } from "react-router-dom";

export default function GroupTripsPage() {
  const { user } = useAuth();
  const [groupTrips, setGroupTrips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newTripData, setNewTripData] = useState({
    name: "",
    description: "",
    startDate: "",
    endDate: "",
    members: "", // Comma-separated usernames/emails
  });

  useEffect(() => {
    if (user) {
      loadGroupTrips();
    } else {
      setLoading(false);
      setError("Please log in to view group trips.");
    }
  }, [user]);

  const loadGroupTrips = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getGroupTrips();
      setGroupTrips(data);
    } catch (err) {
      setError(err.msg || "Failed to load group trips.");
      console.error("Error loading group trips:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewTripData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleCreateTrip = async (e) => {
    e.preventDefault();
    setError(null);
    try {
      const membersArray = newTripData.members
        .split(",")
        .map((m) => m.trim())
        .filter(Boolean);
      await createGroupTrip({ ...newTripData, members: membersArray });
      setShowCreateForm(false);
      setNewTripData({
        name: "",
        description: "",
        startDate: "",
        endDate: "",
        members: "",
      });
      loadGroupTrips(); // Reload trips after creation
    } catch (err) {
      setError(err.msg || "Failed to create group trip.");
      console.error("Error creating group trip:", err);
    }
  };

  if (loading) {
    return (
      <div className="text-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm mb-6 max-w-4xl mx-auto mt-8">
        {error}
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-3xl font-bold text-gray-900">Group Trips</h2>
        <button
          onClick={() => setShowCreateForm(!showCreateForm)}
          className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg shadow-md hover:bg-blue-700 transition"
        >
          <PlusCircle className="w-5 h-5 mr-2" />
          New Group Trip
        </button>
      </div>

      {showCreateForm && (
        <div className="bg-white p-6 rounded-lg shadow-md mb-8">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">
            Create New Group Trip
          </h3>
          <form onSubmit={handleCreateTrip} className="space-y-4">
            <div>
              <label
                htmlFor="name"
                className="block text-sm font-medium text-gray-700"
              >
                Trip Name
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={newTripData.name}
                onChange={handleInputChange}
                required
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
            <div>
              <label
                htmlFor="description"
                className="block text-sm font-medium text-gray-700"
              >
                Description
              </label>
              <textarea
                id="description"
                name="description"
                value={newTripData.description}
                onChange={handleInputChange}
                rows="3"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              ></textarea>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label
                  htmlFor="startDate"
                  className="block text-sm font-medium text-gray-700"
                >
                  Start Date
                </label>
                <input
                  type="date"
                  id="startDate"
                  name="startDate"
                  value={newTripData.startDate}
                  onChange={handleInputChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
              <div>
                <label
                  htmlFor="endDate"
                  className="block text-sm font-medium text-gray-700"
                >
                  End Date
                </label>
                <input
                  type="date"
                  id="endDate"
                  name="endDate"
                  value={newTripData.endDate}
                  onChange={handleInputChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
            </div>
            <div>
              <label
                htmlFor="members"
                className="block text-sm font-medium text-gray-700"
              >
                Invite Members (comma-separated usernames or emails)
              </label>
              <input
                type="text"
                id="members"
                name="members"
                value={newTripData.members}
                onChange={handleInputChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                placeholder="e.g., user1, user2@example.com"
              />
            </div>
            <button
              type="submit"
              className="w-full px-4 py-2 bg-green-600 text-white rounded-lg shadow-md hover:bg-green-700 transition"
            >
              Create Trip
            </button>
          </form>
        </div>
      )}

      {groupTrips.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-lg shadow">
          <Users className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            No group trips yet
          </h3>
          <p className="text-gray-600">
            Start planning your next adventure with friends!
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {groupTrips.map((trip) => (
            <Link
              to={`/group-trips/${trip._id}`}
              key={trip._id}
              className="block bg-white rounded-xl shadow-md hover:shadow-lg transition overflow-hidden"
            >
              <div className="p-5">
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  {trip.name}
                </h3>
                <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                  {trip.description || "No description provided."}
                </p>
                <div className="flex items-center text-gray-500 text-sm mb-2">
                  <Calendar className="w-4 h-4 mr-2" />
                  <span>
                    {trip.startDate
                      ? new Date(trip.startDate).toLocaleDateString()
                      : "N/A"}{" "}
                    -{" "}
                    {trip.endDate
                      ? new Date(trip.endDate).toLocaleDateString()
                      : "N/A"}
                  </span>
                </div>
                <div className="flex items-center text-gray-500 text-sm">
                  <Users className="w-4 h-4 mr-2" />
                  <span>{trip.members.length} Members</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
