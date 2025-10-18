import { useState } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useNavigate,
} from "react-router-dom";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import LoginForm from "./components/Auth/LoginForm";
import SignupForm from "./components/Auth/SignupForm";
import Navbar from "./components/Layout/Navbar";
import TravelLogsList from "./components/TravelLogs/TravelLogsList";
import AIAssistant from "./components/AIAssistant/AIAssistant";
import ProfileView from "./components/Profile/ProfileView";
import HomePage from "./pages/HomePage"; // Assuming you have a HomePage component
import ExpensesPage from "./pages/ExpensesPage";
import GroupTripsPage from "./pages/GroupTripsPage";
import GroupTripDetailPage from "./pages/GroupTripDetailPage";
import AddMemberForm from "./components/AddMemberForm"; // Re-import the AddMemberForm component

function PrivateRoute({ children }) {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600 font-medium">Loading...</p>
        </div>
      </div>
    );
  }

  return user ? children : <Navigate to="/login" />;
}

function AuthenticatedApp() {
  const navigate = useNavigate(); // Get the navigate function

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navbar />
      <main className="flex-1">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/my-logs" element={<TravelLogsList />} />
          <Route path="/ai-assistant" element={<AIAssistant />} />
          <Route path="/profile" element={<ProfileView />} />
          <Route path="/expenses" element={<ExpensesPage />} />
          <Route path="/add-member" element={<AddMemberForm />} />{" "}
          {/* Route for Add Member as a full page */}
          <Route path="/group-trips" element={<GroupTripsPage />} />
          <Route path="/group-trips/:id" element={<GroupTripDetailPage />} />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </main>
    </div>
  );
}

function AuthRoutes() {
  const [mode, setMode] = useState("login"); // Default to login

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-cyan-50 to-teal-50 flex items-center justify-center px-4">
      <Routes>
        <Route
          path="/login"
          element={<LoginForm onToggleMode={() => setMode("signup")} />}
        />
        <Route
          path="/signup"
          element={<SignupForm onToggleMode={() => setMode("login")} />}
        />
        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
    </div>
  );
}

function AppContent() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600 font-medium">Loading...</p>
        </div>
      </div>
    );
  }

  return user ? <AuthenticatedApp /> : <AuthRoutes />;
}

function App() {
  return (
    <Router>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </Router>
  );
}

export default App;
