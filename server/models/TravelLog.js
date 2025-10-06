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
    enum: ["public", "private", "visited", "wishlist", "dream"],
    default: "private",
  },
  likes: {
    type: Number,
    default: 0,
  },
  bookmarks: {
    type: Number,
    default: 0,
  },
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
  date: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("TravelLog", TravelLogSchema);
