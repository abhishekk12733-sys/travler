import React from "react";
import { format } from "date-fns";

const ExpenseList = ({ expenses, onDelete, onEdit }) => {
  if (!expenses || expenses.length === 0) {
    return (
      <p className="text-center text-gray-500">No expenses recorded yet.</p>
    );
  }

  return (
    <div className="space-y-4">
      {expenses.map((expense) => (
        <div
          key={expense._id}
          className="bg-white shadow-md rounded-lg p-4 flex justify-between items-center"
        >
          <div>
            <h3 className="text-lg font-semibold">{expense.description}</h3>
            <p className="text-gray-600">
              Category: {expense.category} | Date:{" "}
              {format(new Date(expense.date), "PPP")}
            </p>
            {expense.travelLog && (
              <p className="text-gray-500 text-sm">
                Travel Log: {expense.travelLog.title}
              </p>
            )}
          </div>
          <div className="flex items-center space-x-3">
            <span className="text-xl font-bold text-green-600">
              ${expense.amount.toFixed(2)}
            </span>
            <button
              onClick={() => onEdit(expense)}
              className="text-blue-600 hover:text-blue-800"
            >
              Edit
            </button>
            <button
              onClick={() => onDelete(expense._id)}
              className="text-red-600 hover:text-red-800"
            >
              Delete
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ExpenseList;
