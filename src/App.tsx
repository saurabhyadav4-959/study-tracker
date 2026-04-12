import React, { useState, useEffect } from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import DashboardLayout from './layouts/DashboardLayout';
import Overview from './pages/Overview';
import Profile from './pages/Profile';
import TrackCore from './pages/Academic';
import SkillEvolution from './pages/SkillGrowth';
import SuccessMetrics from './pages/SuccessMetrics';
import BandwidthAllocation from './pages/TimeManagement';
import FocusMode from './pages/DeepWork';
import ContributionCore from './pages/ConsistencyHub';
import GlobalKnowledge from './pages/GlobalKnowledge';
import SignalCore from './pages/InternalAlerts';
import Account from './pages/Account';
import Login from './pages/Login';
import NotificationSystem from './components/NotificationSystem';
import Landing from './pages/Landing';
import Docs from './pages/Docs';

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

  useEffect(() => {
    const user = localStorage.getItem('systemhub_active_user');
    setIsAuthenticated(!!user);
  }, []);

  if (isAuthenticated === null) return null; // Avoid flicker
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  return <>{children}</>;
};

const App: React.FC = () => {
  return (
    <HashRouter>
      <NotificationSystem />
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/docs" element={<Docs />} />
        
        <Route 
          element={
            <ProtectedRoute>
              <DashboardLayout />
            </ProtectedRoute>
          }
        >
          <Route path="/dashboard" element={<Overview />} />
          <Route path="/account" element={<Account />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/academic" element={<TrackCore />} />
          <Route path="/skills" element={<SkillEvolution />} />
          <Route path="/metrics" element={<SuccessMetrics />} />
          <Route path="/time" element={<BandwidthAllocation />} />
          <Route path="/deep-work" element={<FocusMode />} />
          <Route path="/consistency" element={<ContributionCore />} />
          <Route path="/knowledge" element={<GlobalKnowledge />} />
          <Route path="/alerts" element={<SignalCore />} />
        </Route>
      </Routes>
    </HashRouter>
  );
};

export default App;
