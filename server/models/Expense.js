const mongoose = require("mongoose");

const expenseSchema = new mongoose.Schema(
  {
    description: {
      type: String,
      required: true,
      trim: true,
    },
    amount: {
      type: Number,
      required: true,
      min: 0,
    },
    category: {
      type: String,
      required: true,
      trim: true,
    },
    date: {
      type: Date,
      default: Date.now,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    groupTrip: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "GroupTrip",
      default: null, // Optional: an expense can exist outside a group trip
    },
    travelLog: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "TravelLog",
      required: false, // Expenses can be associated with a travel log or be general
    },
  },
  {
    timestamps: true,
  }
);

const Expense = mongoose.model("Expense", expenseSchema);

module.exports = Expense;
