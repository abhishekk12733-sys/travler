const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const TravelLog = require("../models/TravelLog");

// @route   GET /api/travelLogs/public
// @desc    Get all public travel logs
// @access  Public
router.get("/public", async (req, res) => {
  try {
    const logs = await TravelLog.find({ isPublic: true })
      .populate("userId", "username") // Populate username from User model
      .sort({ date: -1 });
    res.json(logs);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

router.get("/:id", auth, async (req, res) => {
  try {
    const log = await TravelLog.findById(req.params.id)
      .populate("userId", "username")
      .populate({
        path: "expenses",
        model: "Expense",
      });

    if (!log) {
      return res.status(404).json({ msg: "Travel log not found" });
    }

    // If log is private, ensure user owns it
    if (!log.isPublic && log.userId.toString() !== req.user.id) {
      return res.status(401).json({ msg: "User not authorized" });
    }

    res.json(log);
  } catch (err) {
    console.error(err.message);
    if (err.kind === "ObjectId") {
      return res.status(404).json({ msg: "Travel log not found" });
    }
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
  const {
    title,
    destination,
    description,
    status,
    latitude,
    longitude,
    isPublic,
    groupTrip, // Add groupTrip here
  } = req.body;

  try {
    const newLog = new TravelLog({
      title,
      destination,
      description,
      status,
      latitude,
      longitude,
      isPublic,
      userId: req.user.id,
      groupTrip: groupTrip || null, // Assign groupTrip if provided
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
  const {
    title,
    destination,
    description,
    status,
    latitude,
    longitude,
    isPublic,
  } = req.body;

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
        $set: {
          title,
          destination,
          description,
          status,
          latitude,
          longitude,
          isPublic,
        },
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

    // Check if the log has already been liked by this user
    if (log.likes.some((like) => like.user.toString() === req.user.id)) {
      return res.status(400).json({ msg: "Travel log already liked" });
    }

    log.likes.unshift({ user: req.user.id });
    await log.save();
    res.json(log.likes);
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

    // Check if the log has not yet been liked by this user
    if (!log.likes.some((like) => like.user.toString() === req.user.id)) {
      return res.status(400).json({ msg: "Travel log has not yet been liked" });
    }

    // Remove the user from the likes array
    log.likes = log.likes.filter(
      (like) => like.user.toString() !== req.user.id
    );
    await log.save();
    res.json(log.likes);
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

    // Check if the log has already been bookmarked by this user
    if (
      log.bookmarks.some((bookmark) => bookmark.user.toString() === req.user.id)
    ) {
      return res.status(400).json({ msg: "Travel log already bookmarked" });
    }

    log.bookmarks.unshift({ user: req.user.id });
    await log.save();
    res.json(log.bookmarks);
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

    // Check if the log has not yet been bookmarked by this user
    if (
      !log.bookmarks.some(
        (bookmark) => bookmark.user.toString() === req.user.id
      )
    ) {
      return res
        .status(400)
        .json({ msg: "Travel log has not yet been bookmarked" });
    }

    // Remove the user from the bookmarks array
    log.bookmarks = log.bookmarks.filter(
      (bookmark) => bookmark.user.toString() !== req.user.id
    );
    await log.save();
    res.json(log.bookmarks);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

module.exports = router;
