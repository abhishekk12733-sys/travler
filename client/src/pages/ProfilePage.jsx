import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { 
  User, 
  Mail, 
  MapPin, 
  Calendar, 
  Camera, 
  Edit,
  Save,
  X,
  Settings,
  Globe,
  Award,
  Star
} from 'lucide-react';

const ProfilePage = () => {
  const { user } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [profile, setProfile] = useState({
    username: user.username || 'demo_user',
    email: user.email || 'demo@example.com',
    bio: 'Passionate traveler exploring the world one destination at a time. Love discovering hidden gems and sharing travel stories with fellow adventurers.',
    location: 'San Francisco, CA',
    joinedDate: '2024-01-15',
    website: 'https://mytravel.blog',
    travelTags: ['adventurer', 'backpacker', 'photographer', 'foodie']
  });

  const [editForm, setEditForm] = useState(profile);

  const stats = [
    { label: 'Countries Visited', value: 12, icon: Globe },
    { label: 'Cities Explored', value: 45, icon: MapPin },
    { label: 'Travel Logs', value: 28, icon: Calendar },
    { label: 'Photos Shared', value: 156, icon: Camera },
  ];

  const travelTags = [
    'adventurer', 'backpacker', 'luxury', 'budget', 'solo', 'family',
    'photographer', 'foodie', 'culture', 'nature', 'city', 'beach',
    'mountain', 'desert', 'history', 'art', 'music', 'nightlife'
  ];

  const badges = [
    { name: 'Early Bird', description: 'Joined in the first month', icon: '🐦', earned: true },
    { name: 'Globetrotter', description: 'Visited 10+ countries', icon: '🌍', earned: true },
    { name: 'Storyteller', description: 'Created 25+ travel logs', icon: '📚', earned: true },
    { name: 'Photographer', description: 'Shared 100+ photos', icon: '📸', earned: true },
    { name: 'Community Star', description: 'Received 500+ likes', icon: '⭐', earned: false },
    { name: 'Explorer', description: 'Visited 25+ countries', icon: '🗺️', earned: false }
  ];

  const handleSave = () => {
    setProfile(editForm);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditForm(profile);
    setIsEditing(false);
  };

  const toggleTag = (tag) => {
    setEditForm(prev => ({
      ...prev,
      travelTags: prev.travelTags.includes(tag)
        ? prev.travelTags.filter(t => t !== tag)
        : [...prev.travelTags, tag]
    }));
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="bg-white rounded-xl shadow-lg overflow-hidden mb-8">
        <div className="h-32 bg-gradient-to-r from-sky-400 via-blue-500 to-indigo-600"></div>
        <div className="relative px-6 pb-6">
          <div className="flex flex-col sm:flex-row sm:items-end sm:space-x-6">
            {/* Profile Picture */}
            <div className="relative -mt-16 mb-4 sm:mb-0">
              <div className="w-32 h-32 bg-gradient-to-br from-sky-400 to-blue-600 rounded-full border-4 border-white flex items-center justify-center shadow-lg">
                <User className="h-16 w-16 text-white" />
              </div>
              <button className="absolute bottom-2 right-2 bg-white rounded-full p-2 shadow-lg border border-gray-200 hover:bg-gray-50 transition-colors">
                <Camera className="h-4 w-4 text-gray-600" />
              </button>
            </div>

            {/* Profile Info */}
            <div className="flex-1">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">{profile.username}</h1>
                  <p className="text-gray-600 flex items-center space-x-1">
                    <MapPin className="h-4 w-4" />
                    <span>{profile.location}</span>
                  </p>
                </div>
                
                <div className="mt-4 sm:mt-0">
                  {!isEditing ? (
                    <button
                      onClick={() => setIsEditing(true)}
                      className="inline-flex items-center space-x-2 bg-sky-600 hover:bg-sky-700 text-white px-4 py-2 rounded-lg transition-colors"
                    >
                      <Edit className="h-4 w-4" />
                      <span>Edit Profile</span>
                    </button>
                  ) : (
                    <div className="flex space-x-2">
                      <button
                        onClick={handleSave}
                        className="inline-flex items-center space-x-2 bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg transition-colors"
                      >
                        <Save className="h-4 w-4" />
                        <span>Save</span>
                      </button>
                      <button
                        onClick={handleCancel}
                        className="inline-flex items-center space-x-2 bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg transition-colors"
                      >
                        <X className="h-4 w-4" />
                        <span>Cancel</span>
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div key={index} className="bg-white rounded-xl shadow-lg p-6 text-center">
              <div className="bg-sky-50 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3">
                <Icon className="h-6 w-6 text-sky-600" />
              </div>
              <div className="text-2xl font-bold text-gray-900">{stat.value}</div>
              <div className="text-sm text-gray-600">{stat.label}</div>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Profile Details */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Profile Information</h2>
            
            {isEditing ? (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Username</label>
                  <input
                    type="text"
                    value={editForm.username}
                    onChange={(e) => setEditForm(prev => ({ ...prev, username: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                  <input
                    type="email"
                    value={editForm.email}
                    onChange={(e) => setEditForm(prev => ({ ...prev, email: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                  <input
                    type="text"
                    value={editForm.location}
                    onChange={(e) => setEditForm(prev => ({ ...prev, location: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Website</label>
                  <input
                    type="url"
                    value={editForm.website}
                    onChange={(e) => setEditForm(prev => ({ ...prev, website: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Bio</label>
                  <textarea
                    rows={4}
                    value={editForm.bio}
                    onChange={(e) => setEditForm(prev => ({ ...prev, bio: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 resize-none"
                  />
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <User className="h-5 w-5 text-gray-400" />
                  <span className="text-gray-900">{profile.username}</span>
                </div>
                
                <div className="flex items-center space-x-3">
                  <Mail className="h-5 w-5 text-gray-400" />
                  <span className="text-gray-900">{profile.email}</span>
                </div>
                
                <div className="flex items-center space-x-3">
                  <MapPin className="h-5 w-5 text-gray-400" />
                  <span className="text-gray-900">{profile.location}</span>
                </div>
                
                <div className="flex items-center space-x-3">
                  <Globe className="h-5 w-5 text-gray-400" />
                  <a href={profile.website} className="text-sky-600 hover:text-sky-700 transition-colors">
                    {profile.website}
                  </a>
                </div>
                
                <div className="flex items-center space-x-3">
                  <Calendar className="h-5 w-5 text-gray-400" />
                  <span className="text-gray-900">Joined {new Date(profile.joinedDate).toLocaleDateString()}</span>
                </div>

                <div className="pt-4">
                  <h3 className="text-sm font-medium text-gray-700 mb-2">About</h3>
                  <p className="text-gray-900 leading-relaxed">{profile.bio}</p>
                </div>
              </div>
            )}
          </div>

          {/* Travel Tags */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Travel Style</h2>
            
            {isEditing ? (
              <div>
                <p className="text-sm text-gray-600 mb-4">Select tags that describe your travel style:</p>
                <div className="flex flex-wrap gap-2">
                  {travelTags.map((tag) => (
                    <button
                      key={tag}
                      onClick={() => toggleTag(tag)}
                      className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                        editForm.travelTags.includes(tag)
                          ? 'bg-sky-600 text-white'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      {tag}
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              <div className="flex flex-wrap gap-2">
                {profile.travelTags.map((tag) => (
                  <span
                    key={tag}
                    className="px-3 py-1 bg-sky-50 text-sky-700 rounded-full text-sm font-medium"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Achievements */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Achievements</h3>
            <div className="space-y-3">
              {badges.map((badge, index) => (
                <div
                  key={index}
                  className={`flex items-center space-x-3 p-3 rounded-lg ${
                    badge.earned ? 'bg-emerald-50 border border-emerald-200' : 'bg-gray-50 border border-gray-200'
                  }`}
                >
                  <div className="text-2xl">{badge.icon}</div>
                  <div className="flex-1">
                    <h4 className={`font-medium ${badge.earned ? 'text-emerald-900' : 'text-gray-500'}`}>
                      {badge.name}
                    </h4>
                    <p className={`text-sm ${badge.earned ? 'text-emerald-600' : 'text-gray-400'}`}>
                      {badge.description}
                    </p>
                  </div>
                  {badge.earned && (
                    <Award className="h-5 w-5 text-emerald-600" />
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Quick Settings */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Settings</h3>
            <div className="space-y-3">
              <button className="w-full flex items-center space-x-3 p-3 text-left hover:bg-gray-50 rounded-lg transition-colors">
                <Settings className="h-5 w-5 text-gray-400" />
                <span className="text-gray-700">Account Settings</span>
              </button>
              <button className="w-full flex items-center space-x-3 p-3 text-left hover:bg-gray-50 rounded-lg transition-colors">
                <Globe className="h-5 w-5 text-gray-400" />
                <span className="text-gray-700">Privacy Settings</span>
              </button>
              <button className="w-full flex items-center space-x-3 p-3 text-left hover:bg-gray-50 rounded-lg transition-colors">
                <Star className="h-5 w-5 text-gray-400" />
                <span className="text-gray-700">Preferences</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;