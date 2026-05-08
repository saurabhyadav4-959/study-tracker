import React, { createContext, useContext, ReactNode } from 'react';
import { AppState, UserProfile, AuthUser, PersonalMaterial, Recommendation, ActivityLog, TaskStatus, Skill } from '../types';
import { API_BASE_URL } from '../config';

const generateEmptyLogs = (): ActivityLog[] => {
  const logs: ActivityLog[] = [];
  const today = new Date();
  for (let i = 364; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(d.getDate() - i);
    
    // Normalize to YYYY-MM-DD in local time
    const dateStr = d.toLocaleDateString('en-CA');
    
    logs.push({
      date: dateStr,
      intensity: 0,
      count: 0
    });
  }
  return logs;
};

const defaultProfile: UserProfile = {
  name: '',
  institution: '',
  primaryTrack: 'Engineering',
  academicLevel: '1st Year',
  studyPreference: 'Deep Focus',
  dailyXPTarget: 0,
  personalHubLink: '',
  motivationStatement: '',
  xp: 0,
  level: 1,
  email: '',
  status: 'Pending Choice',
  academicStream: 'Engineering'
};

const zeroState: AppState = {
  currentUser: null,
  profile: defaultProfile,
  tasks: [],
  skills: [],
  alerts: [],
  pomodoro: { totalMinutes: 0, sessionsDone: 0, lastCompleted: '' },
  activityLogs: [],
  isDarkMode: true,
  isSidebarOpen: false,
  personalMaterials: [],
  recommendations: []
};

interface AppContextType {
  state: AppState;
  dispatch: {
    updateProfile: (profile: Partial<UserProfile>) => void;
    addTask: (task: any) => void;
    removeTask: (id: string) => void;
    addSkill: (skill: Omit<Skill, 'id' | 'progress' | 'streak' | 'lastUpdated'>) => void;
    toggleTaskStatus: (id: string) => void;
    toggleDarkMode: () => void;
    addPersonalMaterial: (material: Omit<PersonalMaterial, 'id' | 'dateAdded'>) => void;
    removePersonalMaterial: (id: string) => void;
    addAlert: (alert: any) => void;
    removeAlert: (id: string) => void;
    markAlertTriggered: (id: string) => void;
    toggleAlert: (id: string) => void;
    logout: () => void;
    setSidebarOpen: (isOpen: boolean) => void;
    toggleSidebar: () => void;
    resetData: () => void;
    completeFocusSession: (minutes: number) => void;
  };
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // Use a temporary key until we determine the active user
  const [activeUserKey, setActiveUserKey] = React.useState<string | null>(null);
  const [state, setState] = React.useState<AppState>(zeroState);

  // Sync Helper
  const logActivity = async (actionType: string, description: string, timeSpent: number = 0) => {
    const user = JSON.parse(localStorage.getItem('systemhub_active_user') || '{}');
    if (!user.token) return;

    try {
      const res = await fetch(`${API_BASE_URL}/api/logs`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${user.token}` },
        body: JSON.stringify({ actionType, description, timeSpent })
      });
      if (!res.ok) console.error('SYNC ERROR: FAILED TO LOG ACTIVITY', await res.text());
    } catch (err) {
      console.error('NEURAL LINK ERROR:', err);
    }
  };

  React.useEffect(() => {
    const activeSession = localStorage.getItem('systemhub_active_user');
    if (activeSession) {
      try {
        const user = JSON.parse(activeSession);
        const userKey = `systemhub_data_${user.id}`;
        setActiveUserKey(userKey);
        
        const storedData = localStorage.getItem(userKey);
        if (storedData) {
          const parsed = JSON.parse(storedData);
          if (!parsed.activityLogs || parsed.activityLogs.length === 0) {
            parsed.activityLogs = generateEmptyLogs();
          }
          if (!parsed.personalMaterials) parsed.personalMaterials = [];
          if (!parsed.recommendations) parsed.recommendations = [];
          setState(parsed);
        } else {
          const newUserState: AppState = { 
            ...zeroState, 
            currentUser: user, 
            profile: { ...defaultProfile, name: user.name || user.username, email: user.email },
            activityLogs: generateEmptyLogs()
          };
          setState(newUserState);
          localStorage.setItem(userKey, JSON.stringify(newUserState));
        }
        
        // Initial Login Log
        logActivity('LOGIN', `Operational Link Established: Node ${user.name} online`);
        
        // Initial Restriction Check
        checkRestrictions();
        const statusInterval = setInterval(checkRestrictions, 15000); // Check every 15s
        return () => clearInterval(statusInterval);
        
      } catch (e) {
        console.error("Failed to parse active user session", e);
      }
    }
  }, []);

  const checkRestrictions = async () => {
    const user = JSON.parse(localStorage.getItem('systemhub_active_user') || '{}');
    if (!user.token || user.role !== 'student') return;

    try {
      const res = await fetch(`${API_BASE_URL}/api/auth/status`, {
        headers: { 'Authorization': `Bearer ${user.token}` }
      });
      const data = await res.json();
      if (data.restrictions) {
        setState(prev => ({
          ...prev,
          profile: {
            ...prev.profile,
            isLocked: data.restrictions.isLocked,
            lockMessage: data.restrictions.lockMessage
          }
        }));
      }
    } catch (err) {
      console.error('Restriction check failed', err);
    }
  };

  // Sync state changes to local storage AND backend
  React.useEffect(() => {
    if (activeUserKey && state.currentUser) {
      localStorage.setItem(activeUserKey, JSON.stringify(state));
      
      // Sync Tasks to Backend
      const user = JSON.parse(localStorage.getItem('systemhub_active_user') || '{}');
      if (user.token) {
        // Sync Tasks
        if (state.tasks.length > 0) {
          fetch(`${API_BASE_URL}/api/tasks/sync`, {
            method: 'POST',
            headers: { 
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${user.token}`
            },
            body: JSON.stringify({ tasks: state.tasks })
          }).catch(err => console.error('Task sync failed', err));
        }

        // Sync Full Dashboard State (for Parent Mirror)
        fetch(`${API_BASE_URL}/api/auth/state`, {
          method: 'POST',
          headers: { 
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${user.token}`
          },
          body: JSON.stringify({ state })
        }).catch(err => console.error('Full state sync failed', err));
      }
    }
  }, [state, activeUserKey]);


  const updateProfile = (profile: Partial<UserProfile>) => {
    setState(prev => ({ ...prev, profile: { ...prev.profile, ...profile } }));
  };

  const addTask = (task: any) => {
    setState(prev => ({ ...prev, tasks: [...prev.tasks, task] }));
    logActivity('ADD_TASK', `Initialized new objective: ${task.title}`);
  };

  const toggleDarkMode = () => {
    setState(prev => ({ ...prev, isDarkMode: !prev.isDarkMode }));
  };

  const removeTask = (id: string) => {
    const task = state.tasks.find(t => t.id === id);
    setState(prev => ({ ...prev, tasks: prev.tasks.filter(t => t.id !== id) }));
    logActivity('DELETE_TASK', `Purged objective: ${task?.title || 'Unknown'}`);
  };

  const addSkill = (skill: Omit<Skill, 'id' | 'progress' | 'streak' | 'lastUpdated'>) => {
    setState(prev => {
      const newSkill: Skill = { 
        ...skill, 
        id: Math.random().toString(36).substr(2, 9),
        progress: 0,
        streak: 0,
        lastUpdated: new Date().toISOString()
      };
      return { ...prev, skills: [...prev.skills, newSkill] };
    });
    logActivity('NEW_SKILL_SYNC', `Initialized new skill node: ${skill.name}`);
  };

  const toggleTaskStatus = (id: string) => {
    const task = state.tasks.find(t => t.id === id);
    const isFinishing = task && task.status !== 'Done';
    if (isFinishing) {
      logActivity('COMPLETE_TASK', `Objective Achieved: ${task.title}`);
    }

    setState(prev => {
      const newState: AppState = {
        ...prev,
        tasks: prev.tasks.map(t => t.id === id ? { ...t, status: (t.status === 'Done' ? 'Todo' : 'Done') as TaskStatus } : t)
      };

      if (isFinishing) {
        const todayStr = new Date().toLocaleDateString('en-CA');
        const updatedLogs = [...newState.activityLogs];
        const logIndex = updatedLogs.findIndex(l => l.date === todayStr);
        
        if (logIndex !== -1) {
          const currentCount = (updatedLogs[logIndex].count || 0) + 1;
          updatedLogs[logIndex] = {
            ...updatedLogs[logIndex],
            count: currentCount,
            intensity: Math.min(4, Math.floor(currentCount / 2) + 1)
          };
        } else {
          updatedLogs.push({ date: todayStr, count: 1, intensity: 1 });
          updatedLogs.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
        }
        newState.activityLogs = updatedLogs;
      }
      return newState;
    });
  };

  const addPersonalMaterial = (material: Omit<PersonalMaterial, 'id' | 'dateAdded'>) => {
    const newMaterial: PersonalMaterial = {
      ...material,
      id: Math.random().toString(36).substr(2, 9),
      dateAdded: new Date().toISOString()
    };
    setState(prev => ({ ...prev, personalMaterials: [...prev.personalMaterials, newMaterial] }));
    logActivity('ADD_MATERIAL', `Synthesized resource: ${material.title}`);
  };

  const removePersonalMaterial = (id: string) => {
    setState(prev => ({ ...prev, personalMaterials: prev.personalMaterials.filter(m => m.id !== id) }));
  };

  const addAlert = (alert: any) => {
    setState(prev => ({ ...prev, alerts: [alert, ...prev.alerts] }));
    logActivity('ADD_ALERT', `Neural signal established: ${alert.taskName}`);
  };

  const removeAlert = (id: string) => {
    setState(prev => ({ ...prev, alerts: prev.alerts.filter(a => a.id !== id) }));
  };

  const markAlertTriggered = (id: string) => {
    setState(prev => ({
      ...prev,
      alerts: prev.alerts.map(a => a.id === id ? { ...a, triggered: true } : a)
    }));
  };

  const toggleAlert = (id: string) => {
    setState(prev => ({
      ...prev,
      alerts: prev.alerts.map(a => a.id === id ? { ...a, enabled: !a.enabled } : a)
    }));
  };

  const logout = () => {
    logActivity('LOGOUT', 'Identity disconnected from core');
    localStorage.removeItem('systemhub_active_user');
    window.location.hash = '/login';
  };
  
  const setSidebarOpen = (isOpen: boolean) => {
    setState(prev => ({ ...prev, isSidebarOpen: isOpen }));
  };

  const toggleSidebar = () => {
    setState(prev => ({ ...prev, isSidebarOpen: !prev.isSidebarOpen }));
  };

  const resetData = () => {
    setState(prev => ({
      ...zeroState,
      currentUser: prev.currentUser,
      profile: { ...defaultProfile, name: prev.currentUser?.name || prev.profile.name, email: prev.currentUser?.email || prev.profile.email },
      activityLogs: generateEmptyLogs()
    }));
    logActivity('RESET_DATA', 'Wiped all local neural nodes');
  };

  const completeFocusSession = (minutes: number) => {
    setState(prev => {
      const todayStr = new Date().toLocaleDateString('en-CA');
      const newState: AppState = {
        ...prev,
        pomodoro: {
          ...prev.pomodoro,
          totalMinutes: prev.pomodoro.totalMinutes + minutes,
          sessionsDone: prev.pomodoro.sessionsDone + 1,
          lastCompleted: new Date().toISOString()
        }
      };

      const updatedLogs = [...newState.activityLogs];
      const logIndex = updatedLogs.findIndex(l => l.date === todayStr);
      
      if (logIndex !== -1) {
        const currentCount = (updatedLogs[logIndex].count || 0) + 1;
        updatedLogs[logIndex] = {
          ...updatedLogs[logIndex],
          count: currentCount,
          intensity: Math.min(4, Math.floor(currentCount / 2) + 1)
        };
      } else {
        updatedLogs.push({ date: todayStr, count: 1, intensity: 1 });
        updatedLogs.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
      }
      newState.activityLogs = updatedLogs;
      return newState;
    });
    logActivity('STUDY_SESSION', `Deep Work Cycle completed`, minutes);
  };

  const dispatch = { 
    updateProfile, 
    addTask, 
    removeTask, 
    addSkill,
    toggleTaskStatus, 
    toggleDarkMode,
    addPersonalMaterial,
    removePersonalMaterial,
    addAlert,
    removeAlert,
    markAlertTriggered,
    toggleAlert,
    logout,
    setSidebarOpen,
    toggleSidebar,
    resetData,
    completeFocusSession
  };

  return (
    <AppContext.Provider value={{ state, dispatch }}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useAppContext must be used within AppProvider');
  return context;
};
