import React, { useState } from "react";
import { PlusCircle } from "lucide-react";
import { addGroupTripExpense } from "../../utils/groupTripApi"; // Import the API function

export default function ExpenseForm({ selectedTripId }) {
  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("");
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

    if (!description || !amount || !category) {
      setError("Description, amount, and category are required.");
      return;
    }
    if (isNaN(amount) || parseFloat(amount) <= 0) {
      setError("Amount must be a positive number.");
      return;
    }

    try {
      await addGroupTripExpense(selectedTripId, {
        description,
        amount: parseFloat(amount),
        category,
      });
      setSuccess("Expense added successfully!");
      setDescription("");
      setAmount("");
      setCategory("");
    } catch (err) {
      setError(err.msg || "Failed to add expense.");
      console.error("Error adding expense:", err);
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h3 className="text-xl font-semibold text-gray-800 mb-4">
        Add a New Expense
      </h3>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label
            htmlFor="expenseDescription"
            className="block text-sm font-medium text-gray-700"
          >
            Description
          </label>
          <input
            type="text"
            id="expenseDescription"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="e.g., Hotel stay, Flight ticket, Dinner"
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500"
            required
          />
        </div>
        <div>
          <label
            htmlFor="expenseAmount"
            className="block text-sm font-medium text-gray-700"
          >
            Amount ($)
          </label>
          <input
            type="number"
            id="expenseAmount"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="e.g., 150.75"
            step="0.01"
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500"
            required
          />
        </div>
        <div>
          <label
            htmlFor="expenseCategory"
            className="block text-sm font-medium text-gray-700"
          >
            Category
          </label>
          <select
            id="expenseCategory"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500"
            required
          >
            <option value="">Select a category</option>
            <option value="Accommodation">Accommodation</option>
            <option value="Transportation">Transportation</option>
            <option value="Food">Food</option>
            <option value="Activities">Activities</option>
            <option value="Shopping">Shopping</option>
            <option value="Other">Other</option>
          </select>
        </div>
        {error && <p className="text-red-500 text-sm">{error}</p>}
        {success && <p className="text-green-500 text-sm">{success}</p>}
        <button
          type="submit"
          className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          <PlusCircle className="w-5 h-5 mr-2" />
          Add Expense
        </button>
      </form>
    </div>
  );
}
