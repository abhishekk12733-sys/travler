import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import TravelLogForm from '../components/travel/TravelLogForm';
import TravelLogCard from '../components/travel/TravelLogCard';
import StatsOverview from '../components/dashboard/StatsOverview';
import { Plus, MapPin, Calendar, Camera, TrendingUp } from 'lucide-react';

const DashboardPage = () => {
  const { user } = useAuth();
  const [showLogForm, setShowLogForm] = useState(false);
  const [travelLogs, setTravelLogs] = useState([
    {
      id: 1,
      country: 'Japan',
      city: 'Tokyo',
      date: '2024-03-15',
      images: ['https://images.pexels.com/photos/2506923/pexels-photo-2506923.jpeg?auto=compress&cs=tinysrgb&w=800'],
      notes: 'Amazing experience in Tokyo! Visited the Senso-ji Temple and tried authentic ramen in Shibuya. The cherry blossoms were just starting to bloom.',
      rating: 5
    },
    {
      id: 2,
      country: 'France',
      city: 'Paris',
      date: '2024-02-20',
      images: ['https://images.pexels.com/photos/338515/pexels-photo-338515.jpeg?auto=compress&cs=tinysrgb&w=800'],
      notes: 'Romantic getaway in Paris. Climbed the Eiffel Tower and strolled along the Seine. The Louvre was absolutely magnificent.',
      rating: 5
    },
    {
      id: 3,
      country: 'Thailand',
      city: 'Bangkok',
      date: '2024-01-10',
      images: ['https://images.pexels.com/photos/1031659/pexels-photo-1031659.jpeg?auto=compress&cs=tinysrgb&w=800'],
      notes: 'Incredible street food and vibrant markets in Bangkok. Visited the Grand Palace and took a boat tour through the floating markets.',
      rating: 4
    }
  ]);

  const handleAddLog = (newLog) => {
    const log = {
      ...newLog,
      id: Date.now(),
      images: newLog.images || []
    };
    setTravelLogs([log, ...travelLogs]);
    setShowLogForm(false);
  };

  const handleDeleteLog = (id) => {
    setTravelLogs(travelLogs.filter(log => log.id !== id));
  };

  const recentActivities = [
    { type: 'log', message: 'Added a new travel log for Tokyo, Japan', time: '2 hours ago', icon: MapPin },
    { type: 'ai', message: 'Generated AI itinerary for upcoming Bali trip', time: '1 day ago', icon: TrendingUp },
    { type: 'photo', message: 'Uploaded 12 photos to Paris travel log', time: '3 days ago', icon: Camera },
    { type: 'plan', message: 'Scheduled trip to Iceland for next month', time: '1 week ago', icon: Calendar },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Welcome back, {user.username}!
        </h1>
        <p className="text-gray-600">
          Here's what's happening with your travel adventures.
        </p>
      </div>

      {/* Stats Overview */}
      <StatsOverview travelLogs={travelLogs} />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
        {/* Main Content */}
        <div className="lg:col-span-2">
          {/* Quick Actions */}
          <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Quick Actions</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <button
                onClick={() => setShowLogForm(true)}
                className="flex items-center justify-center space-x-2 bg-sky-600 hover:bg-sky-700 text-white px-4 py-3 rounded-lg transition-colors"
              >
                <Plus className="h-5 w-5" />
                <span>Add Travel Log</span>
              </button>
              <button className="flex items-center justify-center space-x-2 bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-3 rounded-lg transition-colors">
                <TrendingUp className="h-5 w-5" />
                <span>Generate AI Itinerary</span>
              </button>
            </div>
          </div>

          {/* Travel Logs */}
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-semibold text-gray-900">Recent Travel Logs</h2>
              <span className="text-sm text-gray-500">{travelLogs.length} total logs</span>
            </div>
            
            {travelLogs.length === 0 ? (
              <div className="bg-white rounded-xl shadow-lg p-8 text-center">
                <MapPin className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No travel logs yet</h3>
                <p className="text-gray-600 mb-4">Start documenting your adventures by adding your first travel log!</p>
                <button
                  onClick={() => setShowLogForm(true)}
                  className="inline-flex items-center space-x-2 bg-sky-600 hover:bg-sky-700 text-white px-4 py-2 rounded-lg transition-colors"
                >
                  <Plus className="h-4 w-4" />
                  <span>Add Your First Log</span>
                </button>
              </div>
            ) : (
              <div className="grid gap-6">
                {travelLogs.map((log) => (
                  <TravelLogCard
                    key={log.id}
                    log={log}
                    onDelete={() => handleDeleteLog(log.id)}
                  />
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Recent Activity */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
            <div className="space-y-4">
              {recentActivities.map((activity, index) => {
                const Icon = activity.icon;
                return (
                  <div key={index} className="flex items-start space-x-3">
                    <div className="bg-sky-50 p-2 rounded-full">
                      <Icon className="h-4 w-4 text-sky-600" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm text-gray-900">{activity.message}</p>
                      <p className="text-xs text-gray-500">{activity.time}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Travel Goals */}
          <div className="bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl shadow-lg p-6 text-white">
            <h3 className="text-lg font-semibold mb-4">Travel Goals 2024</h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm">Countries Visited</span>
                <span className="text-sm font-semibold">3/10</span>
              </div>
              <div className="w-full bg-emerald-400 rounded-full h-2">
                <div className="bg-white rounded-full h-2" style={{ width: '30%' }}></div>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">Travel Logs</span>
                <span className="text-sm font-semibold">3/25</span>
              </div>
              <div className="w-full bg-emerald-400 rounded-full h-2">
                <div className="bg-white rounded-full h-2" style={{ width: '12%' }}></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Travel Log Form Modal */}
      {showLogForm && (
        <TravelLogForm
          onSubmit={handleAddLog}
          onClose={() => setShowLogForm(false)}
        />
      )}
    </div>
  );
};

export default DashboardPage;