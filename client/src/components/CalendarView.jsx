import { useState } from 'react';
import { ChevronLeft, ChevronRight, Plus, Plane, Calendar as CalendarIcon, Bell } from 'lucide-react';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isSameDay, addMonths, subMonths } from 'date-fns';
import { useTravel } from '../utils/travelContext';

const CalendarView = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [showEventForm, setShowEventForm] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  const { calendarEvents, addCalendarEvent, deleteCalendarEvent } = useTravel();

  const [eventForm, setEventForm] = useState({
    type: 'trip',
    title: '',
    date: '',
    endDate: '',
    time: ''
  });

  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  const daysInMonth = eachDayOfInterval({ start: monthStart, end: monthEnd });

  const previousMonth = () => setCurrentDate(subMonths(currentDate, 1));
  const nextMonth = () => setCurrentDate(addMonths(currentDate, 1));

  const getEventsForDay = (day) => {
    return calendarEvents.filter(event => {
      const eventDate = new Date(event.date);
      if (event.endDate) {
        const endDate = new Date(event.endDate);
        return day >= eventDate && day <= endDate;
      }
      return isSameDay(day, eventDate);
    });
  };

  const handleAddEvent = (e) => {
    e.preventDefault();
    const colorMap = {
      trip: 'bg-blue-500',
      flight: 'bg-green-500',
      reminder: 'bg-red-500'
    };
    addCalendarEvent({
      ...eventForm,
      color: colorMap[eventForm.type]
    });
    setShowEventForm(false);
    setEventForm({
      type: 'trip',
      title: '',
      date: '',
      endDate: '',
      time: ''
    });
  };

  const openEventForm = (day) => {
    setSelectedDate(day);
    setEventForm(prev => ({
      ...prev,
      date: format(day, 'yyyy-MM-dd')
    }));
    setShowEventForm(true);
  };

  const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const firstDayOfMonth = monthStart.getDay();

  return (
    <div className="max-w-7xl mx-auto">
      <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
        <div className="bg-gradient-to-r from-blue-500 to-teal-500 p-6 text-white">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-3xl font-bold">Travel Calendar</h1>
            <button
              onClick={() => setShowEventForm(true)}
              className="px-4 py-2 bg-white text-blue-600 rounded-lg font-semibold hover:bg-blue-50 transition-colors flex items-center gap-2 shadow-lg"
            >
              <Plus size={20} />
              Add Event
            </button>
          </div>

          <div className="flex items-center justify-between">
            <button
              onClick={previousMonth}
              className="p-2 hover:bg-white/20 rounded-lg transition-colors"
            >
              <ChevronLeft size={24} />
            </button>
            <h2 className="text-2xl font-semibold">
              {format(currentDate, 'MMMM yyyy')}
            </h2>
            <button
              onClick={nextMonth}
              className="p-2 hover:bg-white/20 rounded-lg transition-colors"
            >
              <ChevronRight size={24} />
            </button>
          </div>
        </div>

        <div className="p-6">
          <div className="grid grid-cols-7 gap-2 mb-2">
            {weekDays.map(day => (
              <div key={day} className="text-center font-semibold text-gray-600 py-2">
                {day}
              </div>
            ))}
          </div>

          <div className="grid grid-cols-7 gap-2">
            {Array.from({ length: firstDayOfMonth }).map((_, index) => (
              <div key={`empty-${index}`} className="h-24 bg-gray-50 rounded-lg"></div>
            ))}

            {daysInMonth.map(day => {
              const dayEvents = getEventsForDay(day);
              const isToday = isSameDay(day, new Date());

              return (
                <div
                  key={day.toString()}
                  onClick={() => openEventForm(day)}
                  className={`h-24 p-2 border rounded-lg cursor-pointer transition-all hover:shadow-md ${
                    isToday ? 'bg-blue-50 border-blue-500 border-2' : 'bg-white border-gray-200'
                  }`}
                >
                  <div className={`text-sm font-semibold mb-1 ${
                    isToday ? 'text-blue-600' : 'text-gray-700'
                  }`}>
                    {format(day, 'd')}
                  </div>
                  <div className="space-y-1">
                    {dayEvents.slice(0, 2).map(event => (
                      <div
                        key={event.id}
                        className={`text-xs ${event.color} text-white px-1 py-0.5 rounded truncate`}
                        title={event.title}
                      >
                        {event.title}
                      </div>
                    ))}
                    {dayEvents.length > 2 && (
                      <div className="text-xs text-gray-500 font-medium">
                        +{dayEvents.length - 2} more
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="p-6 bg-gray-50 border-t border-gray-200">
          <h3 className="font-bold text-lg text-gray-800 mb-4">Upcoming Events</h3>
          <div className="space-y-3">
            {calendarEvents
              .filter(event => new Date(event.date) >= new Date())
              .sort((a, b) => new Date(a.date) - new Date(b.date))
              .slice(0, 5)
              .map(event => {
                const Icon = event.type === 'flight' ? Plane : event.type === 'reminder' ? Bell : CalendarIcon;
                return (
                  <div key={event.id} className="bg-white p-4 rounded-lg shadow flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`${event.color} p-2 rounded-lg text-white`}>
                        <Icon size={20} />
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-800">{event.title}</h4>
                        <p className="text-sm text-gray-600">
                          {format(new Date(event.date), 'MMM dd, yyyy')}
                          {event.time && ` at ${event.time}`}
                          {event.endDate && ` - ${format(new Date(event.endDate), 'MMM dd, yyyy')}`}
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() => deleteCalendarEvent(event.id)}
                      className="text-gray-400 hover:text-red-500 transition-colors"
                    >
                      ×
                    </button>
                  </div>
                );
              })}
          </div>
        </div>
      </div>

      {showEventForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md">
            <div className="p-6">
              <h3 className="text-2xl font-bold text-gray-800 mb-6">Add Event</h3>

              <form onSubmit={handleAddEvent} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Event Type
                  </label>
                  <select
                    value={eventForm.type}
                    onChange={(e) => setEventForm({ ...eventForm, type: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                  >
                    <option value="trip">Trip</option>
                    <option value="flight">Flight</option>
                    <option value="reminder">Reminder</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Title
                  </label>
                  <input
                    type="text"
                    value={eventForm.title}
                    onChange={(e) => setEventForm({ ...eventForm, title: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                    placeholder="Event title"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Start Date
                  </label>
                  <input
                    type="date"
                    value={eventForm.date}
                    onChange={(e) => setEventForm({ ...eventForm, date: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                    required
                  />
                </div>

                {eventForm.type === 'trip' && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      End Date (Optional)
                    </label>
                    <input
                      type="date"
                      value={eventForm.endDate}
                      onChange={(e) => setEventForm({ ...eventForm, endDate: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                    />
                  </div>
                )}

                {eventForm.type === 'flight' && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Time
                    </label>
                    <input
                      type="time"
                      value={eventForm.time}
                      onChange={(e) => setEventForm({ ...eventForm, time: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                    />
                  </div>
                )}

                <div className="flex gap-4 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowEventForm(false)}
                    className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 px-6 py-3 bg-gradient-to-r from-blue-500 to-teal-500 text-white rounded-lg font-semibold hover:from-blue-600 hover:to-teal-600 transition-all shadow-lg"
                  >
                    Add Event
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CalendarView;
