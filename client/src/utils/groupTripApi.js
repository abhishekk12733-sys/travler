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

// Add an itinerary item to a group trip
export const addItineraryItem = async (tripId, itemData) => {
  try {
    const res = await api.post(`/groupTrips/${tripId}/itinerary`, itemData);
    return res.data;
  } catch (err) {
    throw err.response.data;
  }
};

// Add an expense to a group trip
export const addGroupTripExpense = async (tripId, expenseData) => {
  try {
    const res = await api.post(`/groupTrips/${tripId}/expenses`, expenseData);
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

// Upload a document to a group trip
export const uploadGroupTripDocument = async (tripId, formData) => {
  try {
    const res = await api.post(`/groupTrips/${tripId}/documents`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
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
