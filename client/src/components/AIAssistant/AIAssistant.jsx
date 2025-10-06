import { useState } from "react";
import { Sparkles, MapPin, Calendar, Backpack, DollarSign } from "lucide-react";
import axios from "axios";
import ReactMarkdown from "react-markdown";

export default function AIAssistant() {
  const [activeTab, setActiveTab] = useState("itinerary");
  const [loading, setLoading] = useState(false);

  const tabs = [
    { id: "itinerary", label: "Itinerary Planner", icon: MapPin },
    { id: "packing", label: "Packing List", icon: Backpack },
    { id: "budget", label: "Budget Estimator", icon: DollarSign },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full mb-4">
          <Sparkles className="w-8 h-8 text-white" />
        </div>
        <h2 className="text-3xl font-bold text-gray-900">
          AI Travel Assistant
        </h2>
        <p className="text-gray-600 mt-2">
          Let AI help plan your perfect journey
        </p>
      </div>

      <div className="flex space-x-2 mb-6 overflow-x-auto pb-2">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center space-x-2 px-6 py-3 rounded-lg font-medium whitespace-nowrap transition ${
                activeTab === tab.id
                  ? "bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg"
                  : "bg-white text-gray-600 hover:bg-gray-50 shadow"
              }`}
            >
              <Icon className="w-5 h-5" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      <div className="bg-white rounded-2xl shadow-xl p-8">
        {activeTab === "itinerary" && <ItineraryPlanner />}
        {activeTab === "packing" && <PackingListGenerator />}
        {activeTab === "budget" && <BudgetEstimator />}
      </div>
    </div>
  );
}

function ItineraryPlanner() {
  const [formData, setFormData] = useState({
    destination: "",
    days: "",
    budget: "moderate",
    interests: "",
  });
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setResult("");

    if (!formData.destination || !formData.days || !formData.interests) {
      setResult(
        "Please fill in all required fields: Destination, Number of Days, and Interests & Activities."
      );
      setLoading(false);
      return;
    }

    try {
      const token = localStorage.getItem("token");
      const response = await axios.post(
        "http://localhost:5000/api/ai-assistant",
        { type: "itinerary", ...formData },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setResult(response.data.response);
    } catch (error) {
      console.error("Error generating itinerary:", error);
      if (
        error.response &&
        error.response.data &&
        error.response.data.message
      ) {
        setResult(
          `Failed to generate itinerary: ${error.response.data.message}`
        );
      } else {
        setResult("Failed to generate itinerary. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h3 className="text-2xl font-bold text-gray-900 mb-6">
        Generate Trip Itinerary
      </h3>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Destination
            </label>
            <input
              type="text"
              value={formData.destination}
              onChange={(e) =>
                setFormData({ ...formData, destination: e.target.value })
              }
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition"
              placeholder="e.g., Bali, Indonesia"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Number of Days
            </label>
            <input
              type="number"
              value={formData.days}
              onChange={(e) =>
                setFormData({ ...formData, days: e.target.value })
              }
              required
              min="1"
              max="30"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition"
              placeholder="e.g., 5"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Travel Style
          </label>
          <select
            value={formData.budget}
            onChange={(e) =>
              setFormData({ ...formData, budget: e.target.value })
            }
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition"
          >
            <option value="budget">Budget Traveler</option>
            <option value="moderate">Moderate</option>
            <option value="luxury">Luxury</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Interests & Activities
          </label>
          <textarea
            value={formData.interests}
            onChange={(e) =>
              setFormData({ ...formData, interests: e.target.value })
            }
            rows="3"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition resize-none"
            placeholder="e.g., adventure activities, cultural experiences, beaches, food tours"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white py-3 rounded-lg font-semibold hover:from-purple-600 hover:to-pink-600 transition disabled:opacity-50 shadow-lg"
        >
          {loading ? "Generating Itinerary..." : "Generate Itinerary"}
        </button>
      </form>

      {result && (
        <div className="mt-8 p-6 bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl">
          <h4 className="text-lg font-semibold text-gray-900 mb-3 flex items-center space-x-2">
            <Sparkles className="w-5 h-5 text-purple-600" />
            <span>AI-Generated Itinerary</span>
          </h4>
          <div className="prose max-w-none">
            <ReactMarkdown>{result}</ReactMarkdown>
          </div>
        </div>
      )}
    </div>
  );
}

function PackingListGenerator() {
  const [formData, setFormData] = useState({
    destination: "",
    days: "",
    season: "summer",
    activities: "",
  });
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setResult("");

    try {
      const token = localStorage.getItem("token");
      const response = await axios.post(
        "http://localhost:5000/api/ai-assistant",
        { type: "packing-list", ...formData },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setResult(response.data.response);
    } catch (error) {
      console.error("Error generating packing list:", error);
      setResult("Failed to generate packing list. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h3 className="text-2xl font-bold text-gray-900 mb-6">
        Generate Packing List
      </h3>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Destination
            </label>
            <input
              type="text"
              value={formData.destination}
              onChange={(e) =>
                setFormData({ ...formData, destination: e.target.value })
              }
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition"
              placeholder="e.g., Iceland"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Trip Duration
            </label>
            <input
              type="number"
              value={formData.days}
              onChange={(e) =>
                setFormData({ ...formData, days: e.target.value })
              }
              required
              min="1"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition"
              placeholder="e.g., 7 days"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Season
          </label>
          <select
            value={formData.season}
            onChange={(e) =>
              setFormData({ ...formData, season: e.target.value })
            }
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition"
          >
            <option value="spring">Spring</option>
            <option value="summer">Summer</option>
            <option value="fall">Fall</option>
            <option value="winter">Winter</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Planned Activities
          </label>
          <textarea
            value={formData.activities}
            onChange={(e) =>
              setFormData({ ...formData, activities: e.target.value })
            }
            rows="3"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition resize-none"
            placeholder="e.g., hiking, swimming, formal dinners"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white py-3 rounded-lg font-semibold hover:from-purple-600 hover:to-pink-600 transition disabled:opacity-50 shadow-lg"
        >
          {loading ? "Generating List..." : "Generate Packing List"}
        </button>
      </form>

      {result && (
        <div className="mt-8 p-6 bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl">
          <h4 className="text-lg font-semibold text-gray-900 mb-3 flex items-center space-x-2">
            <Backpack className="w-5 h-5 text-purple-600" />
            <span>AI-Generated Packing List</span>
          </h4>
          <div className="prose max-w-none">
            <ReactMarkdown>{result}</ReactMarkdown>
          </div>
        </div>
      )}
    </div>
  );
}

function BudgetEstimator() {
  const [formData, setFormData] = useState({
    destination: "",
    days: "",
    style: "moderate",
    travelers: "1",
  });
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setResult("");

    try {
      const token = localStorage.getItem("token");
      const response = await axios.post(
        "http://localhost:5000/api/ai-assistant",
        { type: "budget-estimate", ...formData },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setResult(response.data.response);
    } catch (error) {
      console.error("Error estimating budget:", error);
      setResult("Failed to estimate budget. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h3 className="text-2xl font-bold text-gray-900 mb-6">
        Estimate Travel Budget
      </h3>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Destination
            </label>
            <input
              type="text"
              value={formData.destination}
              onChange={(e) =>
                setFormData({ ...formData, destination: e.target.value })
              }
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition"
              placeholder="e.g., Tokyo, Japan"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Number of Days
            </label>
            <input
              type="number"
              value={formData.days}
              onChange={(e) =>
                setFormData({ ...formData, days: e.target.value })
              }
              required
              min="1"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition"
              placeholder="e.g., 7"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Travel Style
            </label>
            <select
              value={formData.style}
              onChange={(e) =>
                setFormData({ ...formData, style: e.target.value })
              }
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition"
            >
              <option value="backpacking">Backpacking</option>
              <option value="budget">Budget</option>
              <option value="moderate">Moderate</option>
              <option value="luxury">Luxury</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Number of Travelers
            </label>
            <input
              type="number"
              value={formData.travelers}
              onChange={(e) =>
                setFormData({ ...formData, travelers: e.target.value })
              }
              required
              min="1"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition"
              placeholder="e.g., 2"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white py-3 rounded-lg font-semibold hover:from-purple-600 hover:to-pink-600 transition disabled:opacity-50 shadow-lg"
        >
          {loading ? "Calculating Budget..." : "Estimate Budget"}
        </button>
      </form>

      {result && (
        <div className="mt-8 p-6 bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl">
          <h4 className="text-lg font-semibold text-gray-900 mb-3 flex items-center space-x-2">
            <DollarSign className="w-5 h-5 text-purple-600" />
            <span>AI-Generated Budget Estimate</span>
          </h4>
          <div className="prose max-w-none">
            <ReactMarkdown>{result}</ReactMarkdown>
          </div>
        </div>
      )}
    </div>
  );
}
