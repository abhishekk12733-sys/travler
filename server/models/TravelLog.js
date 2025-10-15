const mongoose = require("mongoose");

const TravelLogSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
  },
  destination: {
    type: String,
    required: true,
    trim: true,
  },
  description: {
    type: String,
    trim: true,
  },
  status: {
    type: String,
    enum: ["visited", "wishlist", "ongoing"],
    default: "visited",
  },
  isPublic: {
    type: Boolean,
    default: false,
  },
  likes: [
    {
      user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    },
  ],
  bookmarks: [
    {
      user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    },
  ],
  latitude: {
    type: Number,
  },
  longitude: {
    type: Number,
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  groupTrip: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "GroupTrip",
    default: null, // Optional: a travel log can exist outside a group trip
  },
  date: {
    type: Date,
    default: Date.now,
  },
  expenses: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Expense",
    },
  ],
});

module.exports = mongoose.model("TravelLog", TravelLogSchema);
