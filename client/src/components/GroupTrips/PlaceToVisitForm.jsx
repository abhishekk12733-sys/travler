import React, { useState } from "react";
import { PlusCircle } from "lucide-react";
import { addItineraryItem } from "../../utils/groupTripApi"; // Import the API function

export default function PlaceToVisitForm({ selectedTripId }) {
  const [name, setName] = useState("");
  const [date, setDate] = useState("");
  const [location, setLocation] = useState("");
  const [description, setDescription] = useState("");
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (!selectedTripId) {
      setError("Please select a trip first.");
      return;
    }

    if (!name || !date) {
      setError("Place name and date are required.");
      return;
    }

    try {
      await addItineraryItem(selectedTripId, {
        name,
        date,
        location,
        description,
      });
      setSuccess("Place added successfully!");
      setName("");
      setDate("");
      setLocation("");
      setDescription("");
    } catch (err) {
      setError(err.msg || "Failed to add place.");
      console.error("Error adding place:", err);
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h3 className="text-xl font-semibold text-gray-800 mb-4">
        Add a Place to Visit
      </h3>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label
            htmlFor="placeName"
            className="block text-sm font-medium text-gray-700"
          >
            Place Name
          </label>
          <input
            type="text"
            id="placeName"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g., Eiffel Tower"
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500"
            required
          />
        </div>
        <div>
          <label
            htmlFor="visitDate"
            className="block text-sm font-medium text-gray-700"
          >
            Date of Visit
          </label>
          <input
            type="date"
            id="visitDate"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500"
            required
          />
        </div>
        <div>
          <label
            htmlFor="location"
            className="block text-sm font-medium text-gray-700"
          >
            Location (Optional)
          </label>
          <input
            type="text"
            id="location"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            placeholder="e.g., Paris, France"
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        <div>
          <label
            htmlFor="description"
            className="block text-sm font-medium text-gray-700"
          >
            Description (Optional)
          </label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows="3"
            placeholder="Notes about this place..."
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500"
          ></textarea>
        </div>
        {error && <p className="text-red-500 text-sm">{error}</p>}
        {success && <p className="text-green-500 text-sm">{success}</p>}
        <button
          type="submit"
          className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          <PlusCircle className="w-5 h-5 mr-2" />
          Add Place
        </button>
      </form>
    </div>
  );
}
