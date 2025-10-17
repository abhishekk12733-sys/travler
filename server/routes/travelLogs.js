const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const TravelLog = require("../models/TravelLog");
const nodemailer = require("nodemailer");

// @route   GET /api/travelLogs/public
// @desc    Get all public travel logs
// @access  Public
router.get("/public", async (req, res) => {
  try {
    const logs = await TravelLog.find({ isPublic: true })
      .populate("userId", "username") // Populate username from User model
      .populate("members", "_id username") // Populate members' _id and username
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
      .populate("members", "_id username") // Populate members' _id and username
      .populate({
        path: "expenses",
        model: "Expense",
      });

    if (!log) {
      return res.status(404).json({ msg: "Travel log not found" });
    }

    // If log is private, ensure user owns it or is a member
    if (
      !log.isPublic &&
      log.userId._id.toString() !== req.user.id &&
      !log.members.some((member) => member._id.toString() === req.user.id)
    ) {
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

// @route   POST /api/travelLogs/:id/members
// @desc    Add members to a travel log
// @access  Private
router.post("/:id/members", auth, async (req, res) => {
  const { members } = req.body; // Expect an array of user IDs or usernames/emails
  const { id } = req.params;

  try {
    let travelLog = await TravelLog.findById(id);

    if (!travelLog) {
      return res.status(404).json({ msg: "Travel log not found" });
    }

    // Ensure the current user is the owner of the travel log
    if (travelLog.userId.toString() !== req.user.id) {
      return res.status(401).json({ msg: "User not authorized" });
    }

    // Find users by their identifiers (assuming 'members' contains usernames or emails)
    const User = require("../models/User"); // Import User model here to avoid circular dependency issues if it's not already imported
    const newMembers = [];
    for (const memberIdentifier of members) {
      const userToAdd = await User.findOne({
        $or: [{ username: memberIdentifier }, { email: memberIdentifier }],
      });
      if (userToAdd && !travelLog.members.includes(userToAdd._id)) {
        newMembers.push(userToAdd._id);
      }
    }

    travelLog.members.push(...newMembers);
    await travelLog.save();

    // Populate members to return updated list
    travelLog = await TravelLog.findById(id)
      .populate("userId", "username")
      .populate("members", "_id username");

    res.json(travelLog.members);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

// @route   DELETE /api/travelLogs/:id/members/:memberId
// @desc    Remove a member from a travel log
// @access  Private
router.delete("/:id/members/:memberId", auth, async (req, res) => {
  const { id, memberId } = req.params;

  try {
    let travelLog = await TravelLog.findById(id);

    if (!travelLog) {
      return res.status(404).json({ msg: "Travel log not found" });
    }

    // Ensure the current user is the owner of the travel log
    if (travelLog.userId.toString() !== req.user.id) {
      return res.status(401).json({ msg: "User not authorized" });
    }

    // Ensure the member exists in the travel log
    if (!travelLog.members.includes(memberId)) {
      return res.status(404).json({ msg: "Member not found in travel log" });
    }

    // Remove the member
    travelLog.members = travelLog.members.filter(
      (member) => member.toString() !== memberId
    );
    await travelLog.save();

    // Populate members to return updated list
    travelLog = await TravelLog.findById(id)
      .populate("userId", "username")
      .populate("members", "_id username");

    res.json(travelLog.members);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

// @route   POST /api/travelLogs/add-member
// @desc    Add a member to a travel log by email
// @access  Private
router.post("/add-member", auth, async (req, res) => {
  const { travelLogId, memberEmail, description } = req.body;

  // Create a transporter using Nodemailer
  const transporter = nodemailer.createTransport({
    service: "gmail", // You can use other services or SMTP settings
    auth: {
      user: process.env.EMAIL_USER, // Your email address
      pass: process.env.EMAIL_PASS, // Your email password or app-specific password
    },
  });

  try {
    let travelLog = await TravelLog.findById(travelLogId);

    if (!travelLog) {
      return res.status(404).json({ msg: "Travel log not found" });
    }

    // Ensure the current user is the owner of the travel log
    if (travelLog.userId.toString() !== req.user.id) {
      return res
        .status(401)
        .json({ msg: "User not authorized to add members to this log" });
    }

    const User = require("../models/User"); // Import User model
    const memberToAdd = await User.findOne({ email: memberEmail });

    if (!memberToAdd) {
      return res.status(404).json({ msg: "User with this email not found" });
    }

    // Check if the member is already in the travel log
    if (travelLog.members.includes(memberToAdd._id)) {
      return res
        .status(400)
        .json({ msg: "Member already added to this travel log" });
    }

    travelLog.members.push(memberToAdd._id);
    await travelLog.save();

    // Send email notification
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: memberEmail,
      subject: `You've been added to a travel log: ${travelLog.title}`,
      html: `
        <p>Hello ${memberToAdd.username},</p>
        <p>You have been added as a member to the travel log: <strong>${
          travelLog.title
        }</strong>.</p>
        ${description ? `<p>Message from owner: ${description}</p>` : ""}
        <p>You can view the travel log details in the Trevler app.</p>
        <p>Best regards,</p>
        <p>The Trevler Team</p>
      `,
    };

    await transporter.sendMail(mailOptions);

    res.json({
      msg: "Member added successfully and notification email sent",
      travelLogId: travelLog._id,
      memberId: memberToAdd._id,
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

module.exports = router;
