const mongoose = require("mongoose");

const GroupTripSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  description: {
    type: String,
    trim: true,
  },
  members: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  ],
  creator: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  startDate: {
    type: Date,
  },
  endDate: {
    type: Date,
  },
  itinerary: [
    {
      name: { type: String, required: true },
      date: { type: Date, required: true },
      location: { type: String },
      description: { type: String },
      // Potentially add more fields like time, participants, etc.
    },
  ],
  expenses: [
    {
      description: { type: String, required: true },
      amount: { type: Number, required: true },
      category: { type: String },
      addedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
      date: { type: Date, default: Date.now },
    },
  ],
  sharedExpenses: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Expense",
    },
  ],
  sharedTravelLogs: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "TravelLog",
    },
  ],
  documents: [
    {
      name: { type: String, required: true },
      url: { type: String, required: true },
      fileType: { type: String }, // e.g., 'image', 'pdf'
      uploadedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
      uploadDate: { type: Date, default: Date.now },
    },
  ],
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("GroupTrip", GroupTripSchema);
