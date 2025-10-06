import { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { User, CreditCard as Edit2, Save, X, Mail, MapPin, Tag } from 'lucide-react';

export default function ProfileView() {
  const { user, profile, updateProfile } = useAuth();
  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    username: profile?.username || '',
    bio: profile?.bio || '',
    travel_tags: profile?.travel_tags || [],
  });
  const [newTag, setNewTag] = useState('');

  const handleSave = async () => {
    setLoading(true);
    const { error } = await updateProfile(formData);
    if (!error) {
      setEditing(false);
    } else {
      alert('Error updating profile');
    }
    setLoading(false);
  };

  const handleCancel = () => {
    setFormData({
      username: profile?.username || '',
      bio: profile?.bio || '',
      travel_tags: profile?.travel_tags || [],
    });
    setEditing(false);
  };

  const addTag = () => {
    if (newTag && !formData.travel_tags.includes(newTag)) {
      setFormData({
        ...formData,
        travel_tags: [...formData.travel_tags, newTag],
      });
      setNewTag('');
    }
  };

  const removeTag = (tag) => {
    setFormData({
      ...formData,
      travel_tags: formData.travel_tags.filter((t) => t !== tag),
    });
  };

  const tagSuggestions = ['adventurer', 'backpacker', 'luxury traveler', 'foodie', 'photographer', 'solo traveler', 'nature lover', 'culture enthusiast'];

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
        <div className="h-32 bg-gradient-to-r from-blue-500 via-cyan-500 to-teal-500"></div>

        <div className="relative px-8 pb-8">
          <div className="flex justify-between items-start -mt-16 mb-6">
            <div className="flex items-end space-x-4">
              {profile?.profile_picture_url ? (
                <img
                  src={profile.profile_picture_url}
                  alt={profile.username}
                  className="w-32 h-32 rounded-full border-4 border-white shadow-lg object-cover"
                />
              ) : (
                <div className="w-32 h-32 rounded-full border-4 border-white shadow-lg bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                  <User className="w-16 h-16 text-white" />
                </div>
              )}
            </div>

            {!editing ? (
              <button
                onClick={() => setEditing(true)}
                className="mt-16 flex items-center space-x-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition shadow-md"
              >
                <Edit2 className="w-4 h-4" />
                <span>Edit Profile</span>
              </button>
            ) : (
              <div className="mt-16 flex space-x-2">
                <button
                  onClick={handleSave}
                  disabled={loading}
                  className="flex items-center space-x-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition shadow-md disabled:opacity-50"
                >
                  <Save className="w-4 h-4" />
                  <span>Save</span>
                </button>
                <button
                  onClick={handleCancel}
                  className="flex items-center space-x-2 px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition shadow-md"
                >
                  <X className="w-4 h-4" />
                  <span>Cancel</span>
                </button>
              </div>
            )}
          </div>

          {!editing ? (
            <div className="space-y-6">
              <div>
                <h2 className="text-3xl font-bold text-gray-900 mb-2">{profile?.username}</h2>
                <div className="flex items-center space-x-2 text-gray-600">
                  <Mail className="w-4 h-4" />
                  <span>{user?.email}</span>
                </div>
              </div>

              {profile?.bio && (
                <div>
                  <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-2">
                    About
                  </h3>
                  <p className="text-gray-700 leading-relaxed">{profile.bio}</p>
                </div>
              )}

              {profile?.travel_tags && profile.travel_tags.length > 0 && (
                <div>
                  <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">
                    Travel Style
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {profile.travel_tags.map((tag) => (
                      <span
                        key={tag}
                        className="px-3 py-1 bg-gradient-to-r from-blue-100 to-cyan-100 text-blue-700 rounded-full text-sm font-medium"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              <div className="pt-6 border-t border-gray-200">
                <p className="text-sm text-gray-500">
                  Member since {new Date(profile?.created_at).toLocaleDateString('en-US', {
                    month: 'long',
                    year: 'numeric'
                  })}
                </p>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Username
                </label>
                <input
                  type="text"
                  value={formData.username}
                  onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                  placeholder="Your username"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Bio
                </label>
                <textarea
                  value={formData.bio}
                  onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                  rows="4"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition resize-none"
                  placeholder="Tell us about your travel experiences..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Travel Tags
                </label>
                <div className="flex flex-wrap gap-2 mb-3">
                  {formData.travel_tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-3 py-1 bg-blue-500 text-white rounded-full text-sm font-medium flex items-center space-x-2"
                    >
                      <span>{tag}</span>
                      <button
                        onClick={() => removeTag(tag)}
                        className="hover:bg-blue-600 rounded-full p-1 transition"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                </div>
                <div className="flex space-x-2 mb-3">
                  <input
                    type="text"
                    value={newTag}
                    onChange={(e) => setNewTag(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                    placeholder="Add a tag..."
                  />
                  <button
                    onClick={addTag}
                    className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
                  >
                    Add
                  </button>
                </div>
                <div className="flex flex-wrap gap-2">
                  <span className="text-sm text-gray-600">Suggestions:</span>
                  {tagSuggestions
                    .filter((tag) => !formData.travel_tags.includes(tag))
                    .map((tag) => (
                      <button
                        key={tag}
                        onClick={() => {
                          setFormData({
                            ...formData,
                            travel_tags: [...formData.travel_tags, tag],
                          });
                        }}
                        className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm hover:bg-gray-200 transition"
                      >
                        + {tag}
                      </button>
                    ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
