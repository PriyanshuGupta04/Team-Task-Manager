import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, AuthContext } from "./src/context/AuthContext.jsx";
import { useContext } from "react";

// Pages
import Login from "./src/pages/Login.jsx";
import Signup from "./src/pages/Signup.jsx";
import Dashboard from "./src/pages/Dashboard.jsx";
import Projects from "./src/pages/Projects.jsx";
import Tasks from "./src/pages/Tasks.jsx";

// Components
import Navigation from "./src/components/Navigation.jsx";
import ProtectedRoute from "./src/components/ProtectedRoute.jsx";

// Styles
import "./src/styles/global.css";

function AppContent() {
  const { token, loading } = useContext(AuthContext);

  if (loading) {
    return <div className="loading-page">Loading...</div>;
  }

  return (
    <>
      {token && <Navigation />}
      <Routes>
        {/* Public Routes */}
        <Route
          path="/login"
          element={token ? <Navigate to="/dashboard" /> : <Login />}
        />
        <Route
          path="/signup"
          element={token ? <Navigate to="/dashboard" /> : <Signup />}
        />

        {/* Protected Routes */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/projects"
          element={
            <ProtectedRoute>
              <Projects />
            </ProtectedRoute>
          }
        />
        <Route
          path="/tasks"
          element={
            <ProtectedRoute>
              <Tasks />
            </ProtectedRoute>
          }
        />

        {/* Default Route */}
        <Route path="/" element={<Navigate to="/dashboard" />} />
      </Routes>
    </>
  );
}

export default function App() {
  return (
    <Router>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </Router>
  );
}
