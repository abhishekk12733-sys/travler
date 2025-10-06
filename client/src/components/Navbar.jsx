import { useState } from 'react';
import { Compass, Home, Map, Users, Calendar, Sparkles, User, LogOut, Menu, X } from 'lucide-react';
import { useAuth } from '../utils/authContext';

const Navbar = ({ currentPage, onNavigate }) => {
  const { user, logout } = useAuth();
  const [showMobileMenu, setShowMobileMenu] = useState(false);

  const navItems = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'logs', label: 'My Logs', icon: Compass },
    { id: 'map', label: 'Map', icon: Map },
    { id: 'community', label: 'Community', icon: Users },
    { id: 'ai', label: 'AI Assistant', icon: Sparkles },
    { id: 'calendar', label: 'Calendar', icon: Calendar }
  ];

  return (
    <nav className="bg-white shadow-lg sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center gap-3">
            <div className="bg-gradient-to-r from-blue-500 to-teal-500 p-2 rounded-lg">
              <Compass className="text-white" size={28} />
            </div>
            <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-teal-600 bg-clip-text text-transparent">
              TravelDiary
            </span>
          </div>

          <div className="hidden md:flex items-center gap-1">
            {navItems.map(item => {
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => onNavigate(item.id)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all ${
                    currentPage === item.id
                      ? 'bg-blue-500 text-white shadow-lg'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <Icon size={18} />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </div>

          <div className="hidden md:flex items-center gap-4">
            <button
              onClick={() => onNavigate('profile')}
              className="flex items-center gap-2 px-4 py-2 rounded-lg font-medium text-gray-700 hover:bg-gray-100 transition-colors"
            >
              <img
                src={user.profilePicture}
                alt={user.username}
                className="w-8 h-8 rounded-full object-cover"
              />
              <span>{user.username}</span>
            </button>
            <button
              onClick={logout}
              className="p-2 text-gray-700 hover:bg-red-50 hover:text-red-600 rounded-lg transition-colors"
              title="Logout"
            >
              <LogOut size={20} />
            </button>
          </div>

          <button
            onClick={() => setShowMobileMenu(!showMobileMenu)}
            className="md:hidden p-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
          >
            {showMobileMenu ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {showMobileMenu && (
        <div className="md:hidden border-t border-gray-200 bg-white">
          <div className="px-4 py-4 space-y-2">
            {navItems.map(item => {
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    onNavigate(item.id);
                    setShowMobileMenu(false);
                  }}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-all ${
                    currentPage === item.id
                      ? 'bg-blue-500 text-white'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <Icon size={20} />
                  <span>{item.label}</span>
                </button>
              );
            })}
            <div className="pt-4 border-t border-gray-200 space-y-2">
              <button
                onClick={() => {
                  onNavigate('profile');
                  setShowMobileMenu(false);
                }}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-lg font-medium text-gray-700 hover:bg-gray-100 transition-colors"
              >
                <User size={20} />
                <span>Profile</span>
              </button>
              <button
                onClick={logout}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-lg font-medium text-red-600 hover:bg-red-50 transition-colors"
              >
                <LogOut size={20} />
                <span>Logout</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
