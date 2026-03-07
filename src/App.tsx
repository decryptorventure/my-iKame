import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useAuthStore } from './store';
import { Layout } from './components/Layout';
import { Login } from './pages/Login';
import { Dashboard } from './pages/Dashboard';
import { AppHub } from './pages/AppHub';
import { Rewards } from './pages/Rewards';
import { Team } from './pages/Team';
import { Contributions } from './pages/Contributions';
import { Profile } from './pages/Profile';
import { Settings } from './pages/Settings';
import { Events } from './pages/Events';
import { EventDetail } from './pages/EventDetail';
import { AdminLayout } from './pages/admin/AdminLayout';
import { AdminDashboard } from './pages/admin/AdminDashboard';
import { AdminUsers } from './pages/admin/AdminUsers';
import { AdminQuests } from './pages/admin/AdminQuests';
import { AdminRewards } from './pages/admin/AdminRewards';
import { AdminBadges } from './pages/admin/AdminBadges';
import { AdminEvents } from './pages/admin/AdminEvents';

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useAuthStore();
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  return <Layout>{children}</Layout>;
}

function AdminRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, currentUser } = useAuthStore();
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  if (currentUser?.role !== 'admin')
    return <Navigate to="/dashboard" replace />;
  return <AdminLayout>{children}</AdminLayout>;
}

function ManagerRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, currentUser } = useAuthStore();
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  if (currentUser?.role !== 'manager' && currentUser?.role !== 'admin')
    return <Navigate to="/dashboard" replace />;
  return <Layout>{children}</Layout>;
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
        <Route path="/icheck" element={<ProtectedRoute><AppHub appId="icheck" /></ProtectedRoute>} />
        <Route path="/igoal" element={<ProtectedRoute><AppHub appId="igoal" /></ProtectedRoute>} />
        <Route path="/iquest" element={<ProtectedRoute><Contributions /></ProtectedRoute>} />
        <Route path="/iwiki" element={<ProtectedRoute><AppHub appId="iwiki" /></ProtectedRoute>} />
        <Route path="/ireward" element={<ProtectedRoute><Rewards /></ProtectedRoute>} />
        <Route path="/events" element={<ProtectedRoute><Events /></ProtectedRoute>} />
        <Route path="/events/:id" element={<ProtectedRoute><EventDetail /></ProtectedRoute>} />
        <Route path="/hris" element={<ManagerRoute><Team /></ManagerRoute>} />
        <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
        <Route path="/settings" element={<ProtectedRoute><Settings /></ProtectedRoute>} />

        {/* Admin Routes */}
        <Route path="/admin" element={<AdminRoute><AdminDashboard /></AdminRoute>} />
        <Route path="/admin/users" element={<AdminRoute><AdminUsers /></AdminRoute>} />
        <Route path="/admin/quests" element={<AdminRoute><AdminQuests /></AdminRoute>} />
        <Route path="/admin/rewards" element={<AdminRoute><AdminRewards /></AdminRoute>} />
        <Route path="/admin/badges" element={<AdminRoute><AdminBadges /></AdminRoute>} />
        <Route path="/admin/events" element={<AdminRoute><AdminEvents /></AdminRoute>} />

        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
