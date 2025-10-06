import { useState } from 'react';
import { Camera, CreditCard as Edit2, MapPin, Calendar } from 'lucide-react';
import { useAuth } from '../utils/authContext';
import { useTravel } from '../utils/travelContext';

const Profile = () => {
  const { user, updateProfile } = useAuth();
  const { travelLogs } = useTravel();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    username: user.username,
    bio: user.bio,
    travelTags: user.travelTags.join(', ')
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    updateProfile({
      ...formData,
      travelTags: formData.travelTags.split(',').map(tag => tag.trim())
    });
    setIsEditing(false);
  };

  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const visitedCountries = [...new Set(travelLogs.map(log => log.country))].length;

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
        <div className="h-48 bg-gradient-to-r from-blue-400 via-teal-400 to-green-400"></div>

        <div className="px-8 pb-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-end -mt-20 mb-6">
            <div className="relative">
              <img
                src={user.profilePicture}
                alt={user.username}
                className="w-32 h-32 rounded-full border-4 border-white shadow-xl object-cover"
              />
              <button className="absolute bottom-0 right-0 bg-blue-600 text-white p-2 rounded-full shadow-lg hover:bg-blue-700 transition-colors">
                <Camera size={16} />
              </button>
            </div>

            <div className="mt-4 sm:mt-0 sm:ml-6 flex-1">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h1 className="text-3xl font-bold text-gray-800">{user.username}</h1>
                  <p className="text-gray-600">{user.email}</p>
                </div>
                <button
                  onClick={() => setIsEditing(!isEditing)}
                  className="mt-3 sm:mt-0 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2 shadow-md"
                >
                  <Edit2 size={16} />
                  {isEditing ? 'Cancel' : 'Edit Profile'}
                </button>
              </div>
            </div>
          </div>

          {isEditing ? (
            <form onSubmit={handleSubmit} className="space-y-4 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Username</label>
                <input
                  type="text"
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Bio</label>
                <textarea
                  name="bio"
                  value={formData.bio}
                  onChange={handleChange}
                  rows="3"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none resize-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Travel Tags (comma-separated)</label>
                <input
                  type="text"
                  name="travelTags"
                  value={formData.travelTags}
                  onChange={handleChange}
                  placeholder="adventurer, backpacker, photographer"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                />
              </div>
              <button
                type="submit"
                className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors shadow-md"
              >
                Save Changes
              </button>
            </form>
          ) : (
            <div className="mb-6">
              <p className="text-gray-700 text-lg mb-4">{user.bio}</p>
              <div className="flex flex-wrap gap-2">
                {user.travelTags.map((tag, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-6 rounded-xl">
              <div className="flex items-center gap-3 mb-2">
                <MapPin className="text-blue-600" size={24} />
                <h3 className="text-gray-600 font-medium">Countries Visited</h3>
              </div>
              <p className="text-3xl font-bold text-blue-600">{visitedCountries}</p>
            </div>

            <div className="bg-gradient-to-br from-green-50 to-green-100 p-6 rounded-xl">
              <div className="flex items-center gap-3 mb-2">
                <Calendar className="text-green-600" size={24} />
                <h3 className="text-gray-600 font-medium">Travel Logs</h3>
              </div>
              <p className="text-3xl font-bold text-green-600">{travelLogs.length}</p>
            </div>

            <div className="bg-gradient-to-br from-orange-50 to-orange-100 p-6 rounded-xl">
              <div className="flex items-center gap-3 mb-2">
                <Camera className="text-orange-600" size={24} />
                <h3 className="text-gray-600 font-medium">Total Likes</h3>
              </div>
              <p className="text-3xl font-bold text-orange-600">
                {travelLogs.reduce((sum, log) => sum + log.likes, 0)}
              </p>
            </div>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-gray-800 mb-4">My Travel Logs</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {travelLogs.map(log => (
                <div key={log.id} className="group relative overflow-hidden rounded-xl shadow-md hover:shadow-xl transition-all transform hover:-translate-y-1">
                  <img
                    src={log.image}
                    alt={log.city}
                    className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent flex flex-col justify-end p-4">
                    <h3 className="text-white font-bold text-lg">{log.city}</h3>
                    <p className="text-white/90 text-sm">{log.country}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
