import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import {
  getGroupTripById,
  addGroupTripMembers,
  removeGroupTripMember,
  deleteGroupTrip,
  addItineraryItem,
  addGroupTripExpense,
} from "../utils/groupTripApi";
import { useAuth } from "../contexts/AuthContext";
import {
  Users,
  Calendar,
  MapPin,
  Trash2,
  UserPlus,
  XCircle,
  Edit,
  PlusCircle,
  FileText,
  Image,
} from "lucide-react";
import DocumentUpload from "../components/GroupTrips/DocumentUpload";
import PlaceToVisitForm from "../components/GroupTrips/PlaceToVisitForm";
import ExpenseForm from "../components/GroupTrips/ExpenseForm"; // Import the new ExpenseForm

export default function GroupTripDetailPage() {
  const { id } = useParams();
  const { user } = useAuth();
  const [groupTrip, setGroupTrip] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showAddMemberForm, setShowAddMemberForm] = useState(false);
  const [newMemberIdentifier, setNewMemberIdentifier] = useState("");
  const [showAddPlaceForm, setShowAddPlaceForm] = useState(false);
  const [showAddExpenseForm, setShowAddExpenseForm] = useState(false); // New state for expense form
  const [itineraryItems, setItineraryItems] = useState([]);
  const [documents, setDocuments] = useState([]);
  const [expenses, setExpenses] = useState([]); // New state for expenses

  useEffect(() => {
    if (user) {
      loadGroupTrip();
    } else {
      setLoading(false);
      setError("Please log in to view group trip details.");
    }
  }, [user, id]);

  const loadGroupTrip = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getGroupTripById(id);
      setGroupTrip(data);
      setItineraryItems(data.itinerary || []);
      setDocuments(data.documents || []);
      setExpenses(data.expenses || []); // Initialize expenses
    } catch (err) {
      setError(err.msg || "Failed to load group trip details.");
      console.error("Error loading group trip:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddPlace = async (newPlace) => {
    try {
      await addItineraryItem(id, newPlace);
      setShowAddPlaceForm(false);
      loadGroupTrip(); // Reload to get updated itinerary from server
    } catch (err) {
      setError(err.msg || "Failed to add place to itinerary.");
      console.error("Error adding place:", err);
    }
  };

  const handleAddExpense = async (newExpense) => {
    try {
      await addGroupTripExpense(id, newExpense);
      setShowAddExpenseForm(false);
      loadGroupTrip(); // Reload to get updated expenses from server
    } catch (err) {
      setError(err.msg || "Failed to add expense.");
      console.error("Error adding expense:", err);
    }
  };

  const handleDocumentAdded = () => {
    loadGroupTrip(); // Reload documents after upload/delete
  };

  const getFileIcon = (fileType) => {
    if (fileType.startsWith("image")) {
      return <Image className="w-5 h-5 text-blue-500" />;
    }
    if (fileType.includes("pdf")) {
      return <FileText className="w-5 h-5 text-red-500" />;
    }
    return <FileText className="w-5 h-5 text-gray-500" />;
  };

  const handleAddMember = async (e) => {
    e.preventDefault();
    setError(null);
    if (!newMemberIdentifier.trim()) {
      setError("Please enter a username or email.");
      return;
    }
    try {
      await addGroupTripMembers(id, [newMemberIdentifier.trim()]);
      setNewMemberIdentifier("");
      setShowAddMemberForm(false);
      loadGroupTrip(); // Reload trip to show new member
    } catch (err) {
      setError(err.msg || "Failed to add member.");
      console.error("Error adding member:", err);
    }
  };

  const handleRemoveMember = async (memberId) => {
    if (window.confirm("Are you sure you want to remove this member?")) {
      setError(null);
      try {
        await removeGroupTripMember(id, memberId);
        loadGroupTrip(); // Reload trip to reflect changes
      } catch (err) {
        setError(err.msg || "Failed to remove member.");
        console.error("Error removing member:", err);
      }
    }
  };

  const handleDeleteTrip = async () => {
    if (
      window.confirm(
        "Are you sure you want to delete this group trip? This action cannot be undone."
      )
    ) {
      setError(null);
      try {
        await deleteGroupTrip(id);
        // Redirect to group trips list after deletion
        window.location.href = "/group-trips"; // Or use navigate from react-router-dom
      } catch (err) {
        setError(err.msg || "Failed to delete group trip.");
        console.error("Error deleting group trip:", err);
      }
    }
  };

  if (loading) {
    return (
      <div className="text-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm mb-6 max-w-4xl mx-auto mt-8">
        {error}
      </div>
    );
  }

  if (!groupTrip) {
    return (
      <div className="text-center py-12 bg-white rounded-lg shadow max-w-4xl mx-auto mt-8">
        <XCircle className="w-16 h-16 text-gray-400 mx-auto mb-4" />
        <h3 className="text-xl font-semibold text-gray-900 mb-2">
          Group trip not found or you don't have access.
        </h3>
        <Link to="/group-trips" className="text-blue-600 hover:underline">
          Back to Group Trips
        </Link>
      </div>
    );
  }

  const isCreator = user && groupTrip.creator._id === user.id;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="bg-white p-6 rounded-lg shadow-md mb-8">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-3xl font-bold text-gray-900">{groupTrip.name}</h2>
          {isCreator && (
            <div className="flex space-x-2">
              {/* <Link to={`/group-trips/edit/${groupTrip._id}`} className="p-2 rounded-full text-gray-600 hover:bg-gray-100 transition">
                <Edit className="w-5 h-5" />
              </Link> */}
              <button
                onClick={handleDeleteTrip}
                className="p-2 rounded-full text-red-600 hover:bg-red-100 transition"
              >
                <Trash2 className="w-5 h-5" />
              </button>
            </div>
          )}
        </div>

        <p className="text-gray-700 mb-4">{groupTrip.description}</p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-gray-600 text-sm mb-6">
          <div className="flex items-center">
            <Calendar className="w-4 h-4 mr-2" />
            <span>
              Start Date:{" "}
              {groupTrip.startDate
                ? new Date(groupTrip.startDate).toLocaleDateString()
                : "N/A"}
            </span>
          </div>
          <div className="flex items-center">
            <Calendar className="w-4 h-4 mr-2" />
            <span>
              End Date:{" "}
              {groupTrip.endDate
                ? new Date(groupTrip.endDate).toLocaleDateString()
                : "N/A"}
            </span>
          </div>
          <div className="flex items-center">
            <Users className="w-4 h-4 mr-2" />
            <span>Creator: {groupTrip.creator.username}</span>
          </div>
        </div>

        <div className="border-t border-gray-200 pt-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-semibold text-gray-800">Members</h3>
            {isCreator && (
              <button
                onClick={() => setShowAddMemberForm(!showAddMemberForm)}
                className="flex items-center px-3 py-1 bg-blue-500 text-white rounded-md text-sm hover:bg-blue-600 transition"
              >
                <UserPlus className="w-4 h-4 mr-1" /> Add Member
              </button>
            )}
          </div>

          {showAddMemberForm && (
            <form onSubmit={handleAddMember} className="flex space-x-2 mb-4">
              <input
                type="text"
                value={newMemberIdentifier}
                onChange={(e) => setNewMemberIdentifier(e.target.value)}
                placeholder="Username or Email"
                className="flex-1 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
              <button
                type="submit"
                className="px-4 py-2 bg-green-600 text-white rounded-md shadow-sm hover:bg-green-700 transition"
              >
                Add
              </button>
            </form>
          )}

          <ul className="space-y-2">
            {groupTrip.members.map((member) => (
              <li
                key={member._id}
                className="flex items-center justify-between bg-gray-50 p-3 rounded-md"
              >
                <div className="flex items-center space-x-3">
                  <Users className="w-5 h-5 text-gray-500" />
                  <span className="font-medium text-gray-800">
                    {member.username}{" "}
                    {member._id === groupTrip.creator._id && "(Creator)"}
                  </span>
                </div>
                {(isCreator || member._id === user.id) &&
                  member._id !== groupTrip.creator._id && (
                    <button
                      onClick={() => handleRemoveMember(member._id)}
                      className="text-red-500 hover:text-red-700 transition"
                    >
                      <XCircle className="w-5 h-5" />
                    </button>
                  )}
              </li>
            ))}
          </ul>
        </div>

        {/* Future sections for Itinerary, Shared Travel Logs, Shared Expenses */}
        <div className="mt-8 border-t border-gray-200 pt-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-semibold text-gray-800">Itinerary</h3>
            {isCreator && (
              <button
                onClick={() => setShowAddPlaceForm(!showAddPlaceForm)}
                className="flex items-center px-3 py-1 bg-blue-500 text-white rounded-md text-sm hover:bg-blue-600 transition"
              >
                <PlusCircle className="w-4 h-4 mr-1" /> Add Place
              </button>
            )}
          </div>

          {showAddPlaceForm && (
            <div className="mb-6">
              <PlaceToVisitForm onAddPlace={handleAddPlace} />
            </div>
          )}

          {itineraryItems && itineraryItems.length > 0 ? (
            <ul className="space-y-3">
              {itineraryItems.map((item, index) => (
                <li
                  key={item._id || index}
                  className="bg-gray-50 p-4 rounded-md"
                >
                  <p className="font-semibold text-gray-900">{item.name}</p>
                  <p className="text-sm text-gray-600">
                    <Calendar className="inline-block w-4 h-4 mr-1" />
                    {new Date(item.date).toLocaleDateString()}
                    {item.location && (
                      <>
                        {" "}
                        | <MapPin className="inline-block w-4 h-4 mr-1" />
                        {item.location}
                      </>
                    )}
                  </p>
                  {item.description && (
                    <p className="text-sm text-gray-700 mt-1">
                      {item.description}
                    </p>
                  )}
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-600">No itinerary items planned yet.</p>
          )}
        </div>

        <div className="mt-8 border-t border-gray-200 pt-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-semibold text-gray-800">Expenses</h3>
            {isCreator && (
              <button
                onClick={() => setShowAddExpenseForm(!showAddExpenseForm)}
                className="flex items-center px-3 py-1 bg-blue-500 text-white rounded-md text-sm hover:bg-blue-600 transition"
              >
                <PlusCircle className="w-4 h-4 mr-1" /> Add Expense
              </button>
            )}
          </div>

          {showAddExpenseForm && (
            <div className="mb-6">
              <ExpenseForm onAddExpense={handleAddExpense} />
            </div>
          )}

          {expenses && expenses.length > 0 ? (
            <ul className="space-y-3">
              {expenses.map((expense, index) => (
                <li
                  key={expense._id || index}
                  className="bg-gray-50 p-4 rounded-md"
                >
                  <p className="font-semibold text-gray-900">
                    {expense.description}
                  </p>
                  <p className="text-sm text-gray-600">
                    Amount: ${expense.amount.toFixed(2)} | Category:{" "}
                    {expense.category}
                  </p>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-600">No expenses added yet.</p>
          )}
        </div>

        <div className="mt-8 border-t border-gray-200 pt-6">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">
            Shared Travel Logs
          </h3>
          {groupTrip.sharedTravelLogs &&
          groupTrip.sharedTravelLogs.length > 0 ? (
            <ul className="space-y-3">
              {groupTrip.sharedTravelLogs.map((log) => (
                <li key={log._id} className="bg-gray-50 p-4 rounded-md">
                  <Link
                    to={`/travel-logs/${log._id}`}
                    className="text-blue-600 hover:underline font-semibold"
                  >
                    {log.title}
                  </Link>
                  <p className="text-sm text-gray-600">{log.description}</p>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-600">No shared travel logs yet.</p>
          )}
        </div>

        <div className="mt-8 border-t border-gray-200 pt-6">
          <DocumentUpload
            selectedTripId={groupTrip._id}
            onDocumentAdded={handleDocumentAdded}
            documents={documents}
          />
        </div>
      </div>
    </div>
  );
}
