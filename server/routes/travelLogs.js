const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const TravelLog = require("../models/TravelLog");

// @route   GET /api/travelLogs/public
// @desc    Get all public travel logs
// @access  Public
router.get("/public", async (req, res) => {
  try {
    const logs = await TravelLog.find({ status: "public" }).sort({ date: -1 });
    res.json(logs);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

// @route   GET /api/travelLogs
// @desc    Get all travel logs for a user
// @access  Private
router.get("/", auth, async (req, res) => {
  try {
    const logs = await TravelLog.find({ userId: req.user.id }).sort({
      date: -1,
    });
    res.json(logs);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

// @route   POST /api/travelLogs
// @desc    Create new travel log
// @access  Private
router.post("/", auth, async (req, res) => {
  const { title, destination, description, status, latitude, longitude } =
    req.body;

  try {
    const newLog = new TravelLog({
      title,
      destination,
      description,
      status,
      latitude,
      longitude,
      userId: req.user.id,
    });

    const log = await newLog.save();
    res.status(201).json(log);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

// @route   PUT /api/travelLogs/:id
// @desc    Update travel log
// @access  Private
router.put("/:id", auth, async (req, res) => {
  const { title, destination, description, status, latitude, longitude } =
    req.body;

  try {
    let log = await TravelLog.findById(req.params.id);

    if (!log) {
      return res.status(404).json({ msg: "Travel log not found" });
    }

    // Make sure user owns log
    if (log.userId.toString() !== req.user.id) {
      return res.status(401).json({ msg: "User not authorized" });
    }

    log = await TravelLog.findByIdAndUpdate(
      req.params.id,
      {
        $set: { title, destination, description, status, latitude, longitude },
      },
      { new: true }
    );

    res.json(log);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

// @route   DELETE /api/travelLogs/:id
// @desc    Delete travel log
// @access  Private
router.delete("/:id", auth, async (req, res) => {
  try {
    const log = await TravelLog.findById(req.params.id);

    if (!log) {
      return res.status(404).json({ msg: "Travel log not found" });
    }

    // Make sure user owns log
    if (log.userId.toString() !== req.user.id) {
      return res.status(401).json({ msg: "User not authorized" });
    }

    await TravelLog.findByIdAndDelete(req.params.id);

    res.json({ msg: "Travel log removed" });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

// @route   PUT /api/travelLogs/like/:id
// @desc    Like a travel log
// @access  Private
router.put("/like/:id", auth, async (req, res) => {
  try {
    const log = await TravelLog.findById(req.params.id);

    if (!log) {
      return res.status(404).json({ msg: "Travel log not found" });
    }
    log.likes++;
    await log.save();
    res.json(log);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

// @route   PUT /api/travelLogs/unlike/:id
// @desc    Unlike a travel log
// @access  Private
router.put("/unlike/:id", auth, async (req, res) => {
  try {
    const log = await TravelLog.findById(req.params.id);

    if (!log) {
      return res.status(404).json({ msg: "Travel log not found" });
    }
    if (log.likes > 0) {
      log.likes--;
    }
    await log.save();
    res.json(log);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

// @route   PUT /api/travelLogs/bookmark/:id
// @desc    Bookmark a travel log
// @access  Private
router.put("/bookmark/:id", auth, async (req, res) => {
  try {
    const log = await TravelLog.findById(req.params.id);

    if (!log) {
      return res.status(404).json({ msg: "Travel log not found" });
    }
    log.bookmarks++;
    await log.save();
    res.json(log);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

// @route   PUT /api/travelLogs/unbookmark/:id
// @desc    Unbookmark a travel log
// @access  Private
router.put("/unbookmark/:id", auth, async (req, res) => {
  try {
    const log = await TravelLog.findById(req.params.id);

    if (!log) {
      return res.status(404).json({ msg: "Travel log not found" });
    }
    if (log.bookmarks > 0) {
      log.bookmarks--;
    }
    await log.save();
    res.json(log);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

module.exports = router;
