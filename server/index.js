require("dotenv").config();
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");

const app = express();
const PORT = process.env.PORT || 5000;

// Connect to MongoDB
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected..."))
  .catch((err) => console.error(err));

app.use(cors());
app.use(express.json());

// Import routes
const authRoutes = require("./routes/auth");
const aiAssistantRoutes = require("./routes/aiAssistant");
const calendarEventsRoutes = require("./routes/calendarEvents");
const travelLogsRoutes = require("./routes/travelLogs");

// Use routes
app.use("/api/auth", authRoutes);
app.use("/api/ai-assistant", aiAssistantRoutes);
app.use("/api/calendarEvents", calendarEventsRoutes);
app.use("/api/travelLogs", travelLogsRoutes);

app.get("/", (req, res) => {
  res.send("Server is running!");
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
