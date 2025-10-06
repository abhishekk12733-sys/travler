import { useState, useEffect } from "react";
import { useAuth } from "../../contexts/AuthContext";
import axios from "axios";
import {
  Calendar as CalendarIcon,
  Plus,
  Edit2,
  Trash2,
  Plane,
  FileText,
  MapPin,
  Clock,
} from "lucide-react";
import EventForm from "./EventForm";

export default function CalendarView() {
  const { user } = useAuth();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [editingEvent, setEditingEvent] = useState(null);
  const [selectedDate, setSelectedDate] = useState(new Date()); // Not currently used, but kept for potential future calendar UI

  useEffect(() => {
    if (user) {
      loadEvents();
    } else {
      setEvents([]);
      setLoading(false);
    }
  }, [user]);

  const loadEvents = async () => {
    setLoading(true);
    setError(null);
    const token = localStorage.getItem("token");

    if (!token) {
      setError("No authentication token found. Please log in.");
      setLoading(false);
      return;
    }

    try {
      const config = {
        headers: {
          "x-auth-token": token,
        },
      };
      const res = await axios.get("/api/calendarEvents", config);
      setEvents(res.data.sort((a, b) => new Date(a.start) - new Date(b.start)));
    } catch (err) {
      console.error("Error loading events:", err.response?.data || err.message);
      if (err.response && err.response.status === 401) {
        setError("Session expired. Please log in again.");
        user.signOut(); // Assuming signOut is available via useAuth
      } else {
        setError(err.response?.data?.msg || "Error loading calendar events.");
      }
      setEvents([]);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this event?")) return;

    setLoading(true);
    setError(null);
    const token = localStorage.getItem("token");

    if (!token) {
      setError("No authentication token found. Please log in.");
      setLoading(false);
      return;
    }

    try {
      const config = {
        headers: {
          "x-auth-token": token,
        },
      };
      await axios.delete(`/api/calendarEvents/${id}`, config);
      loadEvents(); // Reload events after deletion
    } catch (err) {
      console.error("Error deleting event:", err.response?.data || err.message);
      if (err.response && err.response.status === 401) {
        setError("Session expired. Please log in again.");
        user.signOut(); // Assuming signOut is available via useAuth
      } else {
        setError(err.response?.data?.msg || "Error deleting event.");
      }
    } finally {
      setLoading(false);
    }
  };

  const getEventIcon = (type) => {
    // The backend model doesn't have an 'event_type', so we'll use a generic icon for now
    // or infer from description/title if possible in a more advanced implementation.
    // For simplicity, we'll just return CalendarIcon.
    return CalendarIcon;
  };

  const groupEventsByDate = () => {
    const grouped = {};
    events.forEach((event) => {
      const date = new Date(event.start).toLocaleDateString(); // Use event.start
      if (!grouped[date]) {
        grouped[date] = [];
      }
      grouped[date].push(event);
    });
    return grouped;
  };

  const groupedEvents = groupEventsByDate();

  if (showForm) {
    return (
      <EventForm
        event={editingEvent}
        onClose={() => {
          setShowForm(false);
          setEditingEvent(null);
          loadEvents(); // Reload events after form close
        }}
      />
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-3xl font-bold text-gray-900">Travel Calendar</h2>
          <p className="text-gray-600 mt-1">
            Manage your trips, flights, and reminders
          </p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="flex items-center space-x-2 bg-gradient-to-r from-blue-500 to-cyan-500 text-white px-6 py-3 rounded-lg font-semibold hover:from-blue-600 hover:to-cyan-600 transition shadow-lg"
        >
          <Plus className="w-5 h-5" />
          <span>Add Event</span>
        </button>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm mb-6">
          {error}
        </div>
      )}

      {loading ? (
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
        </div>
      ) : events.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-lg shadow">
          <CalendarIcon className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            No events scheduled
          </h3>
          <p className="text-gray-600 mb-6">
            Start planning your trips and add important dates
          </p>
          <button
            onClick={() => setShowForm(true)}
            className="inline-flex items-center space-x-2 bg-gradient-to-r from-blue-500 to-cyan-500 text-white px-6 py-3 rounded-lg font-semibold hover:from-blue-600 hover:to-cyan-600 transition"
          >
            <Plus className="w-5 h-5" />
            <span>Add Your First Event</span>
          </button>
        </div>
      ) : (
        <div className="space-y-8">
          {Object.entries(groupedEvents).map(([date, dateEvents]) => (
            <div key={date} className="bg-white rounded-xl shadow-md p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center space-x-2">
                <CalendarIcon className="w-5 h-5 text-blue-600" />
                <span>{date}</span>
              </h3>
              <div className="space-y-3">
                {dateEvents.map((event) => {
                  const Icon = getEventIcon(event.event_type); // event_type is not in model
                  const eventStart = new Date(event.start);
                  const eventEnd = new Date(event.end);
                  const isPast = eventEnd < new Date();

                  return (
                    <div
                      key={event._id}
                      className={`flex items-center justify-between p-4 rounded-lg border-2 transition ${
                        isPast
                          ? "bg-gray-50 border-gray-200 opacity-60"
                          : "bg-blue-50 border-blue-200 hover:border-blue-300"
                      }`}
                    >
                      <div className="flex items-center space-x-4 flex-1">
                        <div
                          className={`p-3 rounded-full ${
                            // No event_type in model, so using a generic color
                            "bg-blue-500"
                          }`}
                        >
                          <Icon className="w-5 h-5 text-white" />
                        </div>
                        <div className="flex-1">
                          <h4 className="font-semibold text-gray-900">
                            {event.title}
                          </h4>
                          {event.description && (
                            <p className="text-sm text-gray-600 mt-1">
                              {event.description}
                            </p>
                          )}
                          <div className="flex items-center space-x-4 mt-2 text-xs text-gray-500">
                            <span className="flex items-center space-x-1">
                              <Clock className="w-3 h-3" />
                              <span>
                                {eventStart.toLocaleTimeString([], {
                                  hour: "2-digit",
                                  minute: "2-digit",
                                })}{" "}
                                -{" "}
                                {eventEnd.toLocaleTimeString([], {
                                  hour: "2-digit",
                                  minute: "2-digit",
                                })}
                              </span>
                            </span>
                            {event.location && (
                              <span className="flex items-center space-x-1">
                                <MapPin className="w-3 h-3" />
                                <span>{event.location}</span>
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => {
                            setEditingEvent(event);
                            setShowForm(true);
                          }}
                          className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(event._id)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
