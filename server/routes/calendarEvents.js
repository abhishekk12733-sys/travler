const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const CalendarEvent = require("../models/CalendarEvent");

// @route   GET /api/calendarEvents
// @desc    Get all calendar events for a user
// @access  Private
router.get("/", auth, async (req, res) => {
  try {
    const events = await CalendarEvent.find({ userId: req.user.id }).sort({
      start: 1,
    });
    res.json(events);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

// @route   POST /api/calendarEvents
// @desc    Add new calendar event
// @access  Private
router.post("/", auth, async (req, res) => {
  const { title, start, end, description, location } = req.body;

  try {
    const newEvent = new CalendarEvent({
      title,
      start,
      end,
      description,
      location,
      userId: req.user.id,
    });

    const event = await newEvent.save();
    res.status(201).json(event);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

// @route   PUT /api/calendarEvents/:id
// @desc    Update calendar event
// @access  Private
router.put("/:id", auth, async (req, res) => {
  const { title, start, end, description, location } = req.body;

  try {
    let event = await CalendarEvent.findById(req.params.id);

    if (!event) {
      return res.status(404).json({ msg: "Event not found" });
    }

    // Make sure user owns event
    if (event.userId.toString() !== req.user.id) {
      return res.status(401).json({ msg: "User not authorized" });
    }

    event = await CalendarEvent.findByIdAndUpdate(
      req.params.id,
      { $set: { title, start, end, description, location } },
      { new: true }
    );

    res.json(event);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

// @route   DELETE /api/calendarEvents/:id
// @desc    Delete calendar event
// @access  Private
router.delete("/:id", auth, async (req, res) => {
  try {
    const event = await CalendarEvent.findById(req.params.id);

    if (!event) {
      return res.status(404).json({ msg: "Event not found" });
    }

    // Make sure user owns event
    if (event.userId.toString() !== req.user.id) {
      return res.status(401).json({ msg: "User not authorized" });
    }

    await CalendarEvent.findByIdAndDelete(req.params.id);

    res.json({ msg: "Event removed" });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

module.exports = router;
