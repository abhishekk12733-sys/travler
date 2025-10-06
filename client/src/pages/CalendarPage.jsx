import React, { useState } from 'react';
import { 
  ChevronLeft, 
  ChevronRight, 
  Plus, 
  Calendar as CalendarIcon, 
  MapPin,
  Clock,
  Bell,
  Edit,
  Trash2
} from 'lucide-react';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isSameDay, addMonths, subMonths } from 'date-fns';

const CalendarPage = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [showEventForm, setShowEventForm] = useState(false);
  const [events, setEvents] = useState([
    {
      id: 1,
      title: 'Flight to Tokyo',
      date: new Date(2024, 11, 15),
      type: 'flight',
      time: '14:30',
      description: 'JAL Flight JL123 - Check-in 2 hours early'
    },
    {
      id: 2,
      title: 'Hotel Check-in',
      date: new Date(2024, 11, 15),
      type: 'accommodation',
      time: '15:00',
      description: 'Tokyo Grand Hotel - Confirmation #ABC123'
    },
    {
      id: 3,
      title: 'Visa Renewal',
      date: new Date(2024, 11, 20),
      type: 'document',
      time: '10:00',
      description: 'Submit visa renewal application'
    },
    {
      id: 4,
      title: 'Bali Trip Planning',
      date: new Date(2024, 11, 25),
      type: 'planning',
      time: '16:00',
      description: 'Research activities and book tours'
    }
  ]);

  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  const monthDays = eachDayOfInterval({ start: monthStart, end: monthEnd });

  const getEventsForDate = (date) => {
    return events.filter(event => isSameDay(event.date, date));
  };

  const getEventTypeColor = (type) => {
    const colors = {
      flight: 'bg-sky-500 text-white',
      accommodation: 'bg-emerald-500 text-white',
      document: 'bg-orange-500 text-white',
      planning: 'bg-purple-500 text-white',
      activity: 'bg-pink-500 text-white'
    };
    return colors[type] || 'bg-gray-500 text-white';
  };

  const getEventTypeIcon = (type) => {
    const icons = {
      flight: '✈️',
      accommodation: '🏨',
      document: '📄',
      planning: '📝',
      activity: '🎯'
    };
    return icons[type] || '📅';
  };

  const handleAddEvent = (eventData) => {
    const newEvent = {
      id: Date.now(),
      ...eventData,
      date: selectedDate
    };
    setEvents([...events, newEvent]);
    setShowEventForm(false);
  };

  const handleDeleteEvent = (eventId) => {
    setEvents(events.filter(event => event.id !== eventId));
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Travel Calendar</h1>
        <p className="text-gray-600">
          Plan your trips and keep track of important travel dates and reminders.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Calendar */}
        <div className="lg:col-span-3">
          <div className="bg-white rounded-xl shadow-lg overflow-hidden">
            {/* Calendar Header */}
            <div className="flex items-center justify-between px-6 py-4 bg-sky-50 border-b border-gray-200">
              <button
                onClick={() => setCurrentDate(subMonths(currentDate, 1))}
                className="p-2 hover:bg-sky-100 rounded-full transition-colors"
              >
                <ChevronLeft className="h-5 w-5 text-sky-600" />
              </button>
              
              <h2 className="text-xl font-semibold text-gray-900">
                {format(currentDate, 'MMMM yyyy')}
              </h2>
              
              <button
                onClick={() => setCurrentDate(addMonths(currentDate, 1))}
                className="p-2 hover:bg-sky-100 rounded-full transition-colors"
              >
                <ChevronRight className="h-5 w-5 text-sky-600" />
              </button>
            </div>

            {/* Days of Week */}
            <div className="grid grid-cols-7 border-b border-gray-200">
              {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
                <div key={day} className="p-3 text-center text-sm font-medium text-gray-600 bg-gray-50">
                  {day}
                </div>
              ))}
            </div>

            {/* Calendar Grid */}
            <div className="grid grid-cols-7">
              {/* Empty cells for days before month start */}
              {Array.from({ length: monthStart.getDay() }, (_, index) => (
                <div key={`empty-${index}`} className="h-24 border-b border-r border-gray-200 bg-gray-50"></div>
              ))}
              
              {/* Month days */}
              {monthDays.map((day) => {
                const dayEvents = getEventsForDate(day);
                const isSelected = isSameDay(day, selectedDate);
                const isToday = isSameDay(day, new Date());
                
                return (
                  <div
                    key={day.toISOString()}
                    className={`h-24 border-b border-r border-gray-200 p-2 cursor-pointer hover:bg-gray-50 transition-colors ${
                      isSelected ? 'bg-sky-50' : ''
                    }`}
                    onClick={() => setSelectedDate(day)}
                  >
                    <div className={`text-sm font-medium mb-1 ${
                      isToday ? 'text-sky-600 font-bold' : 
                      isSameMonth(day, currentDate) ? 'text-gray-900' : 'text-gray-400'
                    }`}>
                      {format(day, 'd')}
                    </div>
                    
                    <div className="space-y-1">
                      {dayEvents.slice(0, 2).map((event) => (
                        <div
                          key={event.id}
                          className={`text-xs px-2 py-1 rounded truncate ${getEventTypeColor(event.type)}`}
                        >
                          {getEventTypeIcon(event.type)} {event.title}
                        </div>
                      ))}
                      {dayEvents.length > 2 && (
                        <div className="text-xs text-gray-500 px-1">
                          +{dayEvents.length - 2} more
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Add Event Button */}
          <button
            onClick={() => setShowEventForm(true)}
            className="w-full bg-sky-600 hover:bg-sky-700 text-white px-4 py-3 rounded-lg font-medium transition-colors flex items-center justify-center space-x-2"
          >
            <Plus className="h-5 w-5" />
            <span>Add Event</span>
          </button>

          {/* Selected Date Events */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              {format(selectedDate, 'MMMM d, yyyy')}
            </h3>
            
            <div className="space-y-3">
              {getEventsForDate(selectedDate).length === 0 ? (
                <p className="text-gray-500 text-sm">No events scheduled</p>
              ) : (
                getEventsForDate(selectedDate).map((event) => (
                  <div key={event.id} className="border border-gray-200 rounded-lg p-3">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-1">
                          <span className="text-lg">{getEventTypeIcon(event.type)}</span>
                          <h4 className="font-medium text-gray-900">{event.title}</h4>
                        </div>
                        <div className="flex items-center space-x-1 text-sm text-gray-600 mb-2">
                          <Clock className="h-4 w-4" />
                          <span>{event.time}</span>
                        </div>
                        {event.description && (
                          <p className="text-sm text-gray-600">{event.description}</p>
                        )}
                      </div>
                      <div className="flex items-center space-x-1">
                        <button className="p-1 text-gray-400 hover:text-sky-600 transition-colors">
                          <Edit className="h-4 w-4" />
                        </button>
                        <button 
                          onClick={() => handleDeleteEvent(event.id)}
                          className="p-1 text-gray-400 hover:text-red-600 transition-colors"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Upcoming Events */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Upcoming Events</h3>
            
            <div className="space-y-3">
              {events
                .filter(event => event.date >= new Date())
                .sort((a, b) => a.date - b.date)
                .slice(0, 5)
                .map((event) => (
                  <div key={event.id} className="flex items-start space-x-3">
                    <div className={`w-3 h-3 rounded-full mt-2 ${getEventTypeColor(event.type).replace('text-white', '')}`}></div>
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-900 text-sm">{event.title}</h4>
                      <p className="text-xs text-gray-600">
                        {format(event.date, 'MMM d')} at {event.time}
                      </p>
                    </div>
                  </div>
                ))}
            </div>
          </div>

          {/* Travel Stats */}
          <div className="bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl shadow-lg p-6 text-white">
            <h3 className="text-lg font-semibold mb-4">This Month</h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm">Upcoming Trips</span>
                <span className="font-semibold">2</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">Travel Days</span>
                <span className="font-semibold">12</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">Countries</span>
                <span className="font-semibold">3</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Event Form Modal */}
      {showEventForm && (
        <EventForm
          selectedDate={selectedDate}
          onSubmit={handleAddEvent}
          onClose={() => setShowEventForm(false)}
        />
      )}
    </div>
  );
};

// Event Form Component
const EventForm = ({ selectedDate, onSubmit, onClose }) => {
  const [formData, setFormData] = useState({
    title: '',
    type: 'planning',
    time: '12:00',
    description: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
    setFormData({ title: '', type: 'planning', time: '12:00', description: '' });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl shadow-xl max-w-md w-full">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">Add Travel Event</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Event Title
            </label>
            <input
              type="text"
              required
              value={formData.title}
              onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500"
              placeholder="e.g., Flight to Paris"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Date
            </label>
            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <CalendarIcon className="h-4 w-4" />
              <span>{format(selectedDate, 'MMMM d, yyyy')}</span>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Event Type
            </label>
            <select
              value={formData.type}
              onChange={(e) => setFormData(prev => ({ ...prev, type: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500"
            >
              <option value="flight">✈️ Flight</option>
              <option value="accommodation">🏨 Accommodation</option>
              <option value="document">📄 Document/Visa</option>
              <option value="planning">📝 Planning</option>
              <option value="activity">🎯 Activity</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Time
            </label>
            <input
              type="time"
              value={formData.time}
              onChange={(e) => setFormData(prev => ({ ...prev, time: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 resize-none"
              placeholder="Additional details..."
            />
          </div>

          <div className="flex space-x-4 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-2 bg-sky-600 hover:bg-sky-700 text-white rounded-lg transition-colors"
            >
              Add Event
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CalendarPage;