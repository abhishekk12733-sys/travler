import { useState } from 'react';
import { Plus, Search, Filter } from 'lucide-react';
import { useTravel } from '../utils/travelContext';
import TravelLogCard from '../components/TravelLogCard';
import TravelLogForm from '../components/TravelLogForm';

const MyLogs = () => {
  const { travelLogs } = useTravel();
  const [showLogForm, setShowLogForm] = useState(false);
  const [editingLog, setEditingLog] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('recent');

  const filteredLogs = travelLogs
    .filter(log =>
      log.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.country.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.notes.toLowerCase().includes(searchQuery.toLowerCase())
    )
    .sort((a, b) => {
      if (sortBy === 'recent') {
        return new Date(b.dateVisited) - new Date(a.dateVisited);
      } else if (sortBy === 'oldest') {
        return new Date(a.dateVisited) - new Date(b.dateVisited);
      } else if (sortBy === 'popular') {
        return b.likes - a.likes;
      }
      return 0;
    });

  const handleEdit = (log) => {
    setEditingLog(log);
    setShowLogForm(true);
  };

  const handleCloseForm = () => {
    setShowLogForm(false);
    setEditingLog(null);
  };

  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <div>
            <h1 className="text-4xl font-bold text-gray-800">My Travel Logs</h1>
            <p className="text-gray-600 mt-1">{travelLogs.length} {travelLogs.length === 1 ? 'log' : 'logs'} total</p>
          </div>
          <button
            onClick={() => setShowLogForm(true)}
            className="px-6 py-3 bg-gradient-to-r from-blue-500 to-teal-500 text-white rounded-lg font-semibold hover:from-blue-600 hover:to-teal-600 transition-all shadow-lg hover:shadow-xl flex items-center gap-2"
          >
            <Plus size={20} />
            Add New Log
          </button>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by destination or notes..."
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
              />
            </div>

            <div className="flex items-center gap-2">
              <Filter size={20} className="text-gray-500" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
              >
                <option value="recent">Most Recent</option>
                <option value="oldest">Oldest First</option>
                <option value="popular">Most Popular</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {filteredLogs.length === 0 ? (
        <div className="bg-white rounded-2xl shadow-lg p-16 text-center">
          <div className="text-gray-400 mb-4">
            <Search size={64} className="mx-auto" />
          </div>
          <h3 className="text-xl font-bold text-gray-800 mb-2">
            {searchQuery ? 'No matching logs found' : 'No travel logs yet'}
          </h3>
          <p className="text-gray-600 mb-6">
            {searchQuery
              ? 'Try adjusting your search query'
              : 'Start documenting your travels by creating your first log'}
          </p>
          {!searchQuery && (
            <button
              onClick={() => setShowLogForm(true)}
              className="px-8 py-4 bg-gradient-to-r from-blue-500 to-teal-500 text-white rounded-lg font-semibold hover:from-blue-600 hover:to-teal-600 transition-all shadow-lg hover:shadow-xl inline-flex items-center gap-2"
            >
              <Plus size={20} />
              Create Your First Log
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredLogs.map(log => (
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

export default MyLogs;
