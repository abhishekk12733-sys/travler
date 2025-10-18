const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const GroupTrip = require("../models/GroupTrip");
const User = require("../models/User"); // To find users by username/email
const nodemailer = require("nodemailer");
const multer = require("multer"); // Import multer
const path = require("path"); // Import path module
require("dotenv").config();

// Create a transporter object using the default SMTP transport
const transporter = nodemailer.createTransport({
  service: "gmail", // Replace 'gmail' with your email service if different (e.g., 'Outlook365', 'Yahoo')
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// Set up multer for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/"); // Files will be stored in the 'uploads' directory in the server folder
  },
  filename: function (req, file, cb) {
    cb(
      null,
      file.fieldname + "-" + Date.now() + path.extname(file.originalname)
    );
  },
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB file size limit
});

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

// @route   POST api/groupTrips/:id/itinerary
// @desc    Add an itinerary item to a group trip
// @access  Private
router.post("/:id/itinerary", auth, async (req, res) => {
  const { name, date, location, description } = req.body;

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

    const newItineraryItem = {
      name,
      date,
      location,
      description,
      addedBy: req.user.id,
    };

    groupTrip.itinerary.push(newItineraryItem);
    await groupTrip.save();

    res.json(groupTrip.itinerary[groupTrip.itinerary.length - 1]);
  } catch (err) {
    console.error(err.message);
    if (err.kind === "ObjectId") {
      return res.status(404).json({ msg: "Group trip not found" });
    }
    res.status(500).send("Server Error");
  }
});

// @route   POST api/groupTrips/:id/expenses
// @desc    Add an expense to a group trip
// @access  Private
router.post("/:id/expenses", auth, async (req, res) => {
  const { description, amount, category } = req.body;

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

    const newExpense = {
      description,
      amount,
      category,
      addedBy: req.user.id,
    };

    groupTrip.expenses.push(newExpense);
    await groupTrip.save();

    // Populate the addedBy field for the newly added expense before sending response
    await groupTrip.populate("expenses.addedBy", ["username", "email"]);

    res.json(groupTrip.expenses[groupTrip.expenses.length - 1]);
  } catch (err) {
    console.error(err.message);
    if (err.kind === "ObjectId") {
      return res.status(404).json({ msg: "Group trip not found" });
    }
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
      .populate("expenses.addedBy", ["username", "email"]) // Populate uploader info for expenses
      .populate("sharedExpenses") // Populate related expenses
      .populate("sharedTravelLogs") // Populate related travel logs
      .populate("documents.uploadedBy", ["username", "email"]); // Populate uploader info for documents

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

        // Send invitation email
        const mailOptions = {
          from: process.env.EMAIL_USER,
          to: memberUser.email,
          subject: `You're invited to a group trip: ${groupTrip.name}`,
          html: `
            <p>Hello ${memberUser.username || memberUser.email},</p>
            <p>You have been invited to join the group trip "${
              groupTrip.name
            }" by ${req.user.username || req.user.email}.</p>
            <p>Trip Description: ${groupTrip.description}</p>
            <p>Start Date: ${
              groupTrip.startDate
                ? new Date(groupTrip.startDate).toLocaleDateString()
                : "N/A"
            }</p>
            <p>End Date: ${
              groupTrip.endDate
                ? new Date(groupTrip.endDate).toLocaleDateString()
                : "N/A"
            }</p>
            <p>Log in to Trevler to view the trip details and collaborate!</p>
            <p>Best regards,</p>
            <p>The Trevler Team</p>
          `,
        };

        try {
          await transporter.sendMail(mailOptions);
          console.log(`Invitation email sent to ${memberUser.email}`);
        } catch (emailError) {
          console.error(
            `Error sending email to ${memberUser.email}:`,
            emailError.message
          );
          // Continue even if email sending fails for one member
        }
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

// @route   POST api/groupTrips/:id/documents
// @desc    Add a document to a group trip
// @access  Private
router.post(
  "/:id/documents",
  auth,
  upload.single("document"),
  async (req, res) => {
    const { name } = req.body; // Document name from form field
    const file = req.file; // Uploaded file from multer

    if (!file) {
      return res.status(400).json({ msg: "No file uploaded" });
    }

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

      const newDocument = {
        name: name || file.originalname, // Use provided name or original filename
        url: `/uploads/${file.filename}`, // Store the path to the uploaded file
        fileType: file.mimetype,
        uploadedBy: req.user.id,
      };

      groupTrip.documents.push(newDocument);
      await groupTrip.save();

      // Populate the uploadedBy field for the newly added document before sending response
      await groupTrip.populate("documents.uploadedBy", ["username", "email"]);

      res.json(groupTrip.documents[groupTrip.documents.length - 1]); // Return the newly added document
    } catch (err) {
      console.error(err.message);
      if (err.kind === "ObjectId") {
        return res.status(404).json({ msg: "Group trip not found" });
      }
      res.status(500).send("Server Error");
    }
  }
);

// @route   DELETE api/groupTrips/:id/documents/:document_id
// @desc    Remove a document from a group trip
// @access  Private (only uploader or creator of the trip can delete)
router.delete("/:id/documents/:document_id", auth, async (req, res) => {
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

    const documentToRemove = groupTrip.documents.id(req.params.document_id);

    if (!documentToRemove) {
      return res.status(404).json({ msg: "Document not found" });
    }

    // Check if user is the uploader or the trip creator
    if (
      documentToRemove.uploadedBy.toString() !== req.user.id &&
      groupTrip.creator.toString() !== req.user.id
    ) {
      return res
        .status(401)
        .json({ msg: "User not authorized to delete this document" });
    }

    documentToRemove.remove();
    await groupTrip.save();

    res.json({ msg: "Document removed" });
  } catch (err) {
    console.error(err.message);
    if (err.kind === "ObjectId") {
      return res.status(404).json({ msg: "Group trip or document not found" });
    }
    res.status(500).send("Server Error");
  }
});

module.exports = router;
