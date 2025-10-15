const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const GroupTrip = require("../models/GroupTrip");
const User = require("../models/User"); // To find users by username/email

// @route   POST api/groupTrips
// @desc    Create a new group trip
// @access  Private
router.post("/", auth, async (req, res) => {
  const { name, description, startDate, endDate, members } = req.body;

  try {
    // Ensure all members exist and convert usernames/emails to ObjectIds
    const memberIds = [];
    for (const memberIdentifier of members) {
      const memberUser = await User.findOne({
        $or: [{ username: memberIdentifier }, { email: memberIdentifier }],
      });
      if (!memberUser) {
        return res
          .status(404)
          .json({ msg: `User ${memberIdentifier} not found` });
      }
      memberIds.push(memberUser._id);
    }

    const newGroupTrip = new GroupTrip({
      name,
      description,
      startDate,
      endDate,
      creator: req.user.id,
      members: [req.user.id, ...memberIds], // Creator is also a member
    });

    const groupTrip = await newGroupTrip.save();
    res.json(groupTrip);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

// @route   GET api/groupTrips
// @desc    Get all group trips for the authenticated user
// @access  Private
router.get("/", auth, async (req, res) => {
  try {
    const groupTrips = await GroupTrip.find({
      members: req.user.id,
    })
      .populate("creator", ["username", "email"])
      .populate("members", ["username", "email"])
      .sort({ createdAt: -1 });
    res.json(groupTrips);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

// @route   GET api/groupTrips/:id
// @desc    Get a single group trip by ID
// @access  Private
router.get("/:id", auth, async (req, res) => {
  try {
    const groupTrip = await GroupTrip.findById(req.params.id)
      .populate("creator", ["username", "email"])
      .populate("members", ["username", "email"])
      .populate("sharedExpenses") // Populate related expenses
      .populate("sharedTravelLogs"); // Populate related travel logs

    if (!groupTrip) {
      return res.status(404).json({ msg: "Group trip not found" });
    }

    // Check if user is a member of the trip
    if (
      !groupTrip.members.some((member) => member._id.toString() === req.user.id)
    ) {
      return res.status(401).json({ msg: "User not authorized" });
    }

    res.json(groupTrip);
  } catch (err) {
    console.error(err.message);
    if (err.kind === "ObjectId") {
      return res.status(404).json({ msg: "Group trip not found" });
    }
    res.status(500).send("Server Error");
  }
});

// @route   PUT api/groupTrips/:id
// @desc    Update a group trip
// @access  Private (only creator or specific members can update)
router.put("/:id", auth, async (req, res) => {
  const { name, description, startDate, endDate } = req.body;

  // Build groupTrip object
  const groupTripFields = {};
  if (name) groupTripFields.name = name;
  if (description) groupTripFields.description = description;
  if (startDate) groupTripFields.startDate = startDate;
  if (endDate) groupTripFields.endDate = endDate;

  try {
    let groupTrip = await GroupTrip.findById(req.params.id);

    if (!groupTrip) {
      return res.status(404).json({ msg: "Group trip not found" });
    }

    // Check if user is the creator or an authorized member to update
    if (groupTrip.creator.toString() !== req.user.id) {
      return res.status(401).json({ msg: "User not authorized" });
    }

    groupTrip = await GroupTrip.findByIdAndUpdate(
      req.params.id,
      { $set: groupTripFields },
      { new: true }
    );

    res.json(groupTrip);
  } catch (err) {
    console.error(err.message);
    if (err.kind === "ObjectId") {
      return res.status(404).json({ msg: "Group trip not found" });
    }
    res.status(500).send("Server Error");
  }
});

// @route   DELETE api/groupTrips/:id
// @desc    Delete a group trip
// @access  Private (only creator can delete)
router.delete("/:id", auth, async (req, res) => {
  try {
    const groupTrip = await GroupTrip.findById(req.params.id);

    if (!groupTrip) {
      return res.status(404).json({ msg: "Group trip not found" });
    }

    // Check if user is the creator
    if (groupTrip.creator.toString() !== req.user.id) {
      return res.status(401).json({ msg: "User not authorized" });
    }

    await GroupTrip.findByIdAndDelete(req.params.id);

    res.json({ msg: "Group trip removed" });
  } catch (err) {
    console.error(err.message);
    if (err.kind === "ObjectId") {
      return res.status(404).json({ msg: "Group trip not found" });
    }
    res.status(500).send("Server Error");
  }
});

// @route   PUT api/groupTrips/:id/members
// @desc    Add members to a group trip
// @access  Private (only creator or authorized members can add)
router.put("/:id/members", auth, async (req, res) => {
  const { newMembers } = req.body; // Array of usernames/emails

  try {
    let groupTrip = await GroupTrip.findById(req.params.id);

    if (!groupTrip) {
      return res.status(404).json({ msg: "Group trip not found" });
    }

    // Check if user is a member of the trip
    if (
      !groupTrip.members.some((member) => member.toString() === req.user.id)
    ) {
      return res.status(401).json({ msg: "User not authorized" });
    }

    const memberIdsToAdd = [];
    for (const memberIdentifier of newMembers) {
      const memberUser = await User.findOne({
        $or: [{ username: memberIdentifier }, { email: memberIdentifier }],
      });
      if (!memberUser) {
        return res
          .status(404)
          .json({ msg: `User ${memberIdentifier} not found` });
      }
      // Only add if not already a member
      if (!groupTrip.members.includes(memberUser._id)) {
        memberIdsToAdd.push(memberUser._id);
      }
    }

    groupTrip.members.push(...memberIdsToAdd);
    await groupTrip.save();

    res.json(groupTrip);
  } catch (err) {
    console.error(err.message);
    if (err.kind === "ObjectId") {
      return res.status(404).json({ msg: "Group trip not found" });
    }
    res.status(500).send("Server Error");
  }
});

// @route   DELETE api/groupTrips/:id/members/:member_id
// @desc    Remove a member from a group trip
// @access  Private (only creator or the member themselves can leave)
router.delete("/:id/members/:member_id", auth, async (req, res) => {
  try {
    let groupTrip = await GroupTrip.findById(req.params.id);

    if (!groupTrip) {
      return res.status(404).json({ msg: "Group trip not found" });
    }

    // Check if user is the creator or the member being removed
    if (
      groupTrip.creator.toString() !== req.user.id &&
      req.params.member_id !== req.user.id
    ) {
      return res.status(401).json({ msg: "User not authorized" });
    }

    // Remove member
    groupTrip.members = groupTrip.members.filter(
      (member) => member.toString() !== req.params.member_id
    );

    await groupTrip.save();

    res.json(groupTrip);
  } catch (err) {
    console.error(err.message);
    if (err.kind === "ObjectId") {
      return res.status(404).json({ msg: "Group trip not found" });
    }
    res.status(500).send("Server Error");
  }
});

module.exports = router;
