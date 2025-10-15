const express = require("express");
const router = express.Router();
const Expense = require("../models/Expense");
const auth = require("../middleware/auth");

// @route   POST api/expenses
// @desc    Add new expense
// @access  Private
router.post("/", auth, async (req, res) => {
  const { description, amount, category, date, travelLog, groupTrip } =
    req.body;

  try {
    const newExpense = new Expense({
      description,
      amount,
      category,
      date,
      user: req.user.id,
      travelLog,
      groupTrip: groupTrip || null, // Assign groupTrip if provided
    });

    const expense = await newExpense.save();
    res.json(expense);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

// @route   GET api/expenses
// @desc    Get all user expenses
// @access  Private
router.get("/", auth, async (req, res) => {
  try {
    const expenses = await Expense.find({ user: req.user.id })
      .populate("travelLog", "title") // Populate travelLog with only the title
      .sort({
        date: -1,
      });
    res.json(expenses);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

// @route   GET api/expenses/:id
// @desc    Get expense by ID
// @access  Private
router.get("/:id", auth, async (req, res) => {
  try {
    const expense = await Expense.findById(req.params.id);

    if (!expense) {
      return res.status(404).json({ msg: "Expense not found" });
    }

    // Make sure user owns expense
    if (expense.user.toString() !== req.user.id) {
      return res.status(401).json({ msg: "User not authorized" });
    }

    res.json(expense);
  } catch (err) {
    console.error(err.message);
    if (err.kind === "ObjectId") {
      return res.status(404).json({ msg: "Expense not found" });
    }
    res.status(500).send("Server Error");
  }
});

// @route   PUT api/expenses/:id
// @desc    Update expense
// @access  Private
router.put("/:id", auth, async (req, res) => {
  const { description, amount, category, date, travelLog, groupTrip } =
    req.body;

  // Build expense object
  const expenseFields = {};
  if (description) expenseFields.description = description;
  if (amount) expenseFields.amount = amount;
  if (category) expenseFields.category = category;
  if (date) expenseFields.date = date;
  // Handle travelLog explicitly: if it's an empty string, set to null
  expenseFields.travelLog = travelLog === "" ? null : travelLog;
  // Handle groupTrip explicitly: if it's an empty string, set to null
  expenseFields.groupTrip = groupTrip === "" ? null : groupTrip;

  try {
    let expense = await Expense.findById(req.params.id);

    if (!expense) return res.status(404).json({ msg: "Expense not found" });

    // Make sure user owns expense
    if (expense.user.toString() !== req.user.id) {
      return res.status(401).json({ msg: "User not authorized" });
    }

    expense = await Expense.findByIdAndUpdate(
      req.params.id,
      { $set: expenseFields },
      { new: true }
    );

    res.json(expense);
  } catch (err) {
    console.error(err.message);
    if (err.kind === "ObjectId") {
      return res.status(404).json({ msg: "Expense not found" });
    }
    res.status(500).send("Server Error");
  }
});

// @route   DELETE api/expenses/:id
// @desc    Delete expense
// @access  Private
router.delete("/:id", auth, async (req, res) => {
  try {
    const expense = await Expense.findById(req.params.id);

    if (!expense) return res.status(404).json({ msg: "Expense not found" });

    // Make sure user owns expense
    if (expense.user.toString() !== req.user.id) {
      return res.status(401).json({ msg: "User not authorized" });
    }

    await Expense.findByIdAndDelete(req.params.id);

    res.json({ msg: "Expense removed" });
  } catch (err) {
    console.error(err.message);
    if (err.kind === "ObjectId") {
      return res.status(404).json({ msg: "Expense not found" });
    }
    res.status(500).send("Server Error");
  }
});

module.exports = router;
