import { useAuth } from "../../contexts/AuthContext";
import {
  Globe,
  Users,
  Sparkles,
  LogOut,
  User,
  Menu,
  X,
  Home,
  DollarSign,
} from "lucide-react";
import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";

export default function Navbar() {
  const { user, profile, signOut } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const handleSignOut = async () => {
    await signOut();
    navigate("/login");
  };

  const navItems = [
    { id: "home", label: "Home", icon: Home, path: "/" },
    { id: "my-logs", label: "My Travels", icon: Globe, path: "/my-logs" },
    {
      id: "ai-assistant",
      label: "AI Assistant",
      icon: Sparkles,
      path: "/ai-assistant",
    },
    { id: "expenses", label: "Expenses", icon: DollarSign, path: "/expenses" },
    {
      id: "group-trips",
      label: "Trip Planning",
      icon: Users, // Using Users icon for now, can be changed if a more suitable icon is found
      path: "/group-trips",
    },
    {
      id: "add-member",
      label: "Add Member",
      icon: Users, // Keeping Users icon for now, can be changed if a more suitable icon is found
      path: "/add-member", // New path for the Add Member functionality
    },
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="bg-white shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center">
              <Globe className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">TravelDiary</h1>
              <p className="text-xs text-gray-500">Your Journey, Documented</p>
            </div>
          </Link>

          <div className="hidden md:flex items-center space-x-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.id}
                  to={item.path}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition ${
                    isActive(item.path)
                      ? "bg-blue-50 text-blue-600"
                      : "text-gray-600 hover:bg-gray-50"
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </div>

          <div className="hidden md:flex items-center space-x-3">
            <Link
              to="/profile"
              className="flex items-center space-x-2 px-4 py-2 rounded-lg hover:bg-gray-50 transition"
            >
              {profile?.profile_picture_url ? (
                <img
                  src={profile.profile_picture_url}
                  alt={profile.username}
                  className="w-8 h-8 rounded-full object-cover"
                />
              ) : (
                <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                  <User className="w-5 h-5 text-white" />
                </div>
              )}
              <span className="font-medium text-gray-700">
                {user?.username || "Profile"}
              </span>
            </Link>
            <button
              onClick={handleSignOut}
              className="p-2 text-gray-600 hover:bg-red-50 hover:text-red-600 rounded-lg transition"
            >
              <LogOut className="w-5 h-5" />
            </button>
          </div>

          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 text-gray-600 hover:bg-gray-50 rounded-lg"
          >
            {mobileMenuOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>
        </div>

        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-200">
            <div className="space-y-1">
              {navItems.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.id}
                    to={item.path}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg font-medium transition ${
                      isActive(item.path)
                        ? "bg-blue-50 text-blue-600"
                        : "text-gray-600 hover:bg-gray-50"
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    <span>{item.label}</span>
                  </Link>
                );
              })}
              <Link
                to="/profile"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full flex items-center space-x-3 px-4 py-3 rounded-lg font-medium text-gray-600 hover:bg-gray-50 transition"
              >
                <User className="w-5 h-5" />
                <span>Profile</span>
              </Link>
              {navItems.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.id}
                    to={item.path}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg font-medium transition ${
                      isActive(item.path)
                        ? "bg-blue-50 text-blue-600"
                        : "text-gray-600 hover:bg-gray-50"
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    <span>{item.label}</span>
                  </Link>
                );
              })}
              <Link
                to="/profile"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full flex items-center space-x-3 px-4 py-3 rounded-lg font-medium text-gray-600 hover:bg-gray-50 transition"
              >
                <User className="w-5 h-5" />
                <span>Profile</span>
              </Link>
              <button
                onClick={handleSignOut}
                className="w-full flex items-center space-x-3 px-4 py-3 rounded-lg font-medium text-red-600 hover:bg-red-50 transition"
              >
                <LogOut className="w-5 h-5" />
                <span>Sign Out</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
