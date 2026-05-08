import React, { useState, useEffect } from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AppProvider, useAppContext } from './context/AppContext';
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
import ParentDashboard from './pages/ParentDashboard';
import ParentPerformance from './pages/ParentPerformance';
import ParentInsight from './pages/ParentInsight';
import SupervisorFeed from './pages/SupervisorFeed';
import ParentStudentMirror from './pages/ParentStudentMirror';
import Onboarding from './pages/Onboarding';

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { state } = useAppContext();
  const location = useLocation();
  const [authChecked, setAuthChecked] = useState(false);
  const [userData, setUserData] = useState<any>(null);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('systemhub_active_user') || '{}');
    setUserData(user);
    setAuthChecked(true);
  }, [location.pathname]);

  if (!authChecked) return null;
  if (!userData?.token) return <Navigate to="/login" replace />;

  const role = userData.role;
  const path = location.pathname;

  // Force onboarding if role is pending
  if (role === 'pending' && path !== '/onboarding') {
    return <Navigate to="/onboarding" replace />;
  }

  // Role-based access control
  if (role === 'parent') {
    // Parents shouldn't be on student dashboard
    if (path === '/dashboard') {
      return <Navigate to="/parent/dashboard" replace />;
    }
  }

  if (role === 'student') {
    // Students shouldn't be on parent routes
    if (path.startsWith('/parent')) {
      return <Navigate to="/dashboard" replace />;
    }
  }

  return <>{children}</>;
};

const AppContent: React.FC = () => {
  const { state } = useAppContext();

  useEffect(() => {
    if (state.isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [state.isDarkMode]);

  return (
    <HashRouter>
      <NotificationSystem />
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/docs" element={<Docs />} />
        <Route path="/onboarding" element={<Onboarding />} />
        
        <Route 
          element={
            <ProtectedRoute>
              <DashboardLayout />
            </ProtectedRoute>
          }
        >
          <Route path="/dashboard" element={<Overview />} />
          <Route path="/parent/dashboard" element={<ParentDashboard />} />
          <Route path="/parent/mirror" element={<ParentStudentMirror />} />
          <Route path="/parent/performance" element={<ParentPerformance />} />
          <Route path="/parent/insight" element={<ParentInsight />} />
          <Route path="/parent/feed" element={<SupervisorFeed />} />
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

const App: React.FC = () => {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
};

export default App;
