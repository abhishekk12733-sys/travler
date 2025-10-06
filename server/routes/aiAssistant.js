const express = require("express");
const router = express.Router();
const { GoogleGenerativeAI } = require("@google/generative-ai");

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

router.post("/", async (req, res) => {
  const { type, ...formData } = req.body;

  try {
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
    let prompt = "";

    switch (type) {
      case "itinerary":
        prompt = `Generate a 2-day travel itinerary for ${formData.destination} focusing on ${formData.interests}. Include activities, places to visit, and estimated times. Keep the response concise, between 15 and 20 lines.`;
        break;
      case "packing-list":
        prompt = `Create a packing list for a trip to ${formData.destination} for ${formData.duration} days, considering the weather in ${formData.season}. Keep the response concise, between 15 and 20 lines.`;
        break;
      case "budget-estimate":
        prompt = `Provide a budget estimate for a trip to ${formData.destination} for ${formData.duration} days, including categories like accommodation, flights, food, and activities. Keep the response concise, between 15 and 20 lines.`;
        break;
      default:
        return res.status(400).json({ msg: "Invalid AI assistant type" });
    }

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    res.json({ response: text });
  } catch (error) {
    console.error("Gemini API error:", error);
    res
      .status(500)
      .json({ msg: "Error generating AI response", error: error.message });
  }
});

module.exports = router;
