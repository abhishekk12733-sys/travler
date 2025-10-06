import { useState } from 'react';
import { Plus, MapPin, Calendar, TrendingUp } from 'lucide-react';
import { useTravel } from '../utils/travelContext';
import { useAuth } from '../utils/authContext';
import TravelLogCard from '../components/TravelLogCard';
import TravelLogForm from '../components/TravelLogForm';

const Home = () => {
  const { travelLogs } = useTravel();
  const { user } = useAuth();
  const [showLogForm, setShowLogForm] = useState(false);
  const [editingLog, setEditingLog] = useState(null);

  const handleEdit = (log) => {
    setEditingLog(log);
    setShowLogForm(true);
  };

  const handleCloseForm = () => {
    setShowLogForm(false);
    setEditingLog(null);
  };

  const visitedCountries = [...new Set(travelLogs.map(log => log.country))].length;
  const totalLogs = travelLogs.length;

  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-8 bg-gradient-to-r from-blue-500 via-teal-500 to-green-500 rounded-2xl shadow-2xl overflow-hidden">
        <div className="p-8 text-white">
          <h1 className="text-4xl font-bold mb-2">Welcome back, {user.username}!</h1>
          <p className="text-white/90 text-lg mb-6">Continue documenting your amazing journeys</p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-white/20 backdrop-blur-sm rounded-xl p-4">
              <div className="flex items-center gap-3 mb-2">
                <MapPin className="text-white" size={24} />
                <h3 className="text-white/90 font-medium">Countries Visited</h3>
              </div>
              <p className="text-3xl font-bold">{visitedCountries}</p>
            </div>

            <div className="bg-white/20 backdrop-blur-sm rounded-xl p-4">
              <div className="flex items-center gap-3 mb-2">
                <Calendar className="text-white" size={24} />
                <h3 className="text-white/90 font-medium">Travel Logs</h3>
              </div>
              <p className="text-3xl font-bold">{totalLogs}</p>
            </div>

            <div className="bg-white/20 backdrop-blur-sm rounded-xl p-4">
              <div className="flex items-center gap-3 mb-2">
                <TrendingUp className="text-white" size={24} />
                <h3 className="text-white/90 font-medium">Total Likes</h3>
              </div>
              <p className="text-3xl font-bold">
                {travelLogs.reduce((sum, log) => sum + log.likes, 0)}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-3xl font-bold text-gray-800">Your Travel Logs</h2>
          <p className="text-gray-600 mt-1">All your amazing adventures in one place</p>
        </div>
        <button
          onClick={() => setShowLogForm(true)}
          className="px-6 py-3 bg-gradient-to-r from-blue-500 to-teal-500 text-white rounded-lg font-semibold hover:from-blue-600 hover:to-teal-600 transition-all shadow-lg hover:shadow-xl flex items-center gap-2"
        >
          <Plus size={20} />
          Add New Log
        </button>
      </div>

      {travelLogs.length === 0 ? (
        <div className="bg-white rounded-2xl shadow-lg p-16 text-center">
          <div className="w-24 h-24 bg-gradient-to-br from-blue-100 to-teal-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <MapPin size={48} className="text-blue-600" />
          </div>
          <h3 className="text-2xl font-bold text-gray-800 mb-3">No travel logs yet</h3>
          <p className="text-gray-600 mb-6 max-w-md mx-auto">
            Start documenting your travels! Add your first log to begin building your travel diary.
          </p>
          <button
            onClick={() => setShowLogForm(true)}
            className="px-8 py-4 bg-gradient-to-r from-blue-500 to-teal-500 text-white rounded-lg font-semibold hover:from-blue-600 hover:to-teal-600 transition-all shadow-lg hover:shadow-xl inline-flex items-center gap-2"
          >
            <Plus size={20} />
            Create Your First Log
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {travelLogs.map(log => (
            <TravelLogCard key={log.id} log={log} isOwner={true} onEdit={handleEdit} />
          ))}
        </div>
      )}

      <TravelLogForm
        isOpen={showLogForm}
        onClose={handleCloseForm}
        logToEdit={editingLog}
      />
    </div>
  );
};

export default Home;
