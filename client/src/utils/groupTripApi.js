import api from "./api";

// Create a new group trip
export const createGroupTrip = async (tripData) => {
  try {
    const res = await api.post("/groupTrips", tripData);
    return res.data;
  } catch (err) {
    throw err.response.data;
  }
};

// Get all group trips for the authenticated user
export const getGroupTrips = async () => {
  try {
    const res = await api.get("/groupTrips");
    return res.data;
  } catch (err) {
    throw err.response.data;
  }
};

// Get a single group trip by ID
export const getGroupTripById = async (id) => {
  try {
    const res = await api.get(`/groupTrips/${id}`);
    return res.data;
  } catch (err) {
    throw err.response.data;
  }
};

// Update a group trip
export const updateGroupTrip = async (id, tripData) => {
  try {
    const res = await api.put(`/groupTrips/${id}`, tripData);
    return res.data;
  } catch (err) {
    throw err.response.data;
  }
};

// Delete a group trip
export const deleteGroupTrip = async (id) => {
  try {
    const res = await api.delete(`/groupTrips/${id}`);
    return res.data;
  } catch (err) {
    throw err.response.data;
  }
};

// Add members to a group trip
export const addGroupTripMembers = async (id, newMembers) => {
  try {
    const res = await api.put(`/groupTrips/${id}/members`, { newMembers });
    return res.data;
  } catch (err) {
    throw err.response.data;
  }
};

// Remove a member from a group trip
export const removeGroupTripMember = async (tripId, memberId) => {
  try {
    const res = await api.delete(`/groupTrips/${tripId}/members/${memberId}`);
    return res.data;
  } catch (err) {
    throw err.response.data;
  }
};
