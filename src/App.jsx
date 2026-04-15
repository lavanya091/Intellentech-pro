import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';

// Components
import LoginPage from './pages/Auth/LoginPage';
import ForgotPassword from './pages/Auth/ForgotPassword';
import ResetPassword from './pages/Auth/ResetPassword';
import AdminDashboard from './pages/Admin/Dashboard';
import UserManagement from './pages/Admin/UserManagement';
import AdminProjectsView from './pages/Admin/ProjectsView';
import ManagerDashboard from './pages/Manager/Dashboard';
import ProjectManagement from './pages/Manager/ProjectManagement';
import DeveloperDashboard from './pages/Developer/Dashboard';
import KanbanBoard from './pages/Developer/KanbanBoard';
import ActivityLogs from './pages/Logs/ActivityLogs';
import ProfilePage from './pages/Profile/ProfilePage';
import DashboardLayout from './components/Layout/DashboardLayout';

const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user, loading } = useAuth();

  if (loading) return <div className="flex items-center justify-center h-screen">Loading...</div>;
  if (!user) return <Navigate to="/login" />;
  if (allowedRoles && !allowedRoles.includes(user.role)) return <Navigate to="/dashboard" />;

  return children;
};

const DashboardRedirect = () => {
  const { user, loading } = useAuth();

  if (loading) return <div>Loading...</div>;
  if (!user) return <Navigate to="/login" />;

  switch (user.role) {
    case 'Admin': return <Navigate to="/admin" />;
    case 'Manager': return <Navigate to="/manager" />;
    case 'Developer': return <Navigate to="/developer" />;
    default: return <Navigate to="/login" />;
  }
};

function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password/:token" element={<ResetPassword />} />

          <Route path="/dashboard" element={<DashboardRedirect />} />

          {/* Admin Routes */}
          <Route path="/admin" element={
            <ProtectedRoute allowedRoles={['Admin']}>
              <DashboardLayout><AdminDashboard /></DashboardLayout>
            </ProtectedRoute>
          } />
          <Route path="/admin/users" element={
            <ProtectedRoute allowedRoles={['Admin']}>
              <DashboardLayout><UserManagement /></DashboardLayout>
            </ProtectedRoute>
          } />
          <Route path="/admin/projects" element={
            <ProtectedRoute allowedRoles={['Admin']}>
              <DashboardLayout><AdminProjectsView /></DashboardLayout>
            </ProtectedRoute>
          } />

          {/* Manager Routes */}
          <Route path="/manager" element={
            <ProtectedRoute allowedRoles={['Manager']}>
              <DashboardLayout><ManagerDashboard /></DashboardLayout>
            </ProtectedRoute>
          } />
          <Route path="/manager/projects" element={
            <ProtectedRoute allowedRoles={['Manager']}>
              <DashboardLayout><ProjectManagement /></DashboardLayout>
            </ProtectedRoute>
          } />

          {/* Developer Routes */}
          <Route path="/developer" element={
            <ProtectedRoute allowedRoles={['Developer']}>
              <DashboardLayout><DeveloperDashboard /></DashboardLayout>
            </ProtectedRoute>
          } />
          <Route path="/developer/kanban" element={
            <ProtectedRoute allowedRoles={['Developer']}>
              <DashboardLayout><KanbanBoard /></DashboardLayout>
            </ProtectedRoute>
          } />

          {/* Common Private Routes */}
          <Route path="/logs" element={
            <ProtectedRoute allowedRoles={['Admin', 'Manager']}>
              <DashboardLayout><ActivityLogs /></DashboardLayout>
            </ProtectedRoute>
          } />
          <Route path="/profile" element={
            <ProtectedRoute>
              <DashboardLayout><ProfilePage /></DashboardLayout>
            </ProtectedRoute>
          } />

          <Route path="/" element={<Navigate to="/dashboard" />} />
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;
