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

// Serve static files from the 'uploads' directory
app.use("/uploads", express.static("uploads"));

// Import routes
const authRoutes = require("./routes/auth");
const aiAssistantRoutes = require("./routes/aiAssistant");
const travelLogsRoutes = require("./routes/travelLogs");
const expensesRoutes = require("./routes/expenses");
const groupTripsRoutes = require("./routes/groupTrips");

// Use routes
app.use("/api/auth", authRoutes);
app.use("/api/ai-assistant", aiAssistantRoutes);
app.use("/api/travelLogs", travelLogsRoutes);
app.use("/api/expenses", expensesRoutes);
app.use("/api/groupTrips", groupTripsRoutes);

app.get("/", (req, res) => {
  res.send("Server is running!");
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
