import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, User, BookOpen, Rocket, LineChart, 
  Clock, Zap, Activity, Globe, Bell, Power, Moon, Sun, X,
  Shield, BarChart3, Presentation
} from 'lucide-react';
import { useAppContext } from '../context/AppContext';

const Sidebar = () => {
  const { state, dispatch } = useAppContext();
  const userData = JSON.parse(localStorage.getItem('systemhub_active_user') || '{}');
  const isParent = userData.role === 'parent';

  const navItems = isParent ? [
    { name: 'Command Center', path: '/parent/dashboard', icon: Shield },
    { name: 'Identity Manager', path: '/profile', icon: User },
    { name: 'Student Dashboard', path: '/parent/mirror', icon: Presentation },
    { name: 'Global Logs', path: '/parent/feed', icon: Activity },
  ] : [
    { name: 'Overview', path: '/dashboard', icon: LayoutDashboard },
    { name: 'Identity Manager', path: '/profile', icon: User },
    { name: 'Track Core', path: '/academic', icon: BookOpen },
    { name: 'Skill Evolution', path: '/skills', icon: Rocket },
    { name: 'Success Metrics', path: '/metrics', icon: LineChart },
    { name: 'Bandwidth Allocation', path: '/time', icon: Clock },
    { name: 'Focus Mode', path: '/deep-work', icon: Zap },
    { name: 'Contribution Core', path: '/consistency', icon: Activity },
    { name: 'Global Knowledge', path: '/knowledge', icon: Globe },
    { name: 'Signal Core', path: '/alerts', icon: Bell },
  ];

  return (
    <aside className={`
      w-72 fixed left-0 top-0 h-screen bg-sidebar backdrop-blur-3xl border-r border-glass-border flex flex-col p-6 z-[100]
      transition-transform duration-500 ease-[cubic-bezier(0.4, 0, 0.2, 1)]
      ${state.isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
    `}>
      <div className="flex items-center justify-between mb-10 px-2 group">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-accent-gradient rounded-xl flex items-center justify-center shadow-lg shadow-primary/30">
            <Zap className="text-white fill-white" size={24} />
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tight uppercase">{state.profile.name || 'Anonymous Node'}</h1>
            <p className="text-[10px] uppercase tracking-[0.2em] text-foreground/40 font-black">
              {isParent ? 'Supervisor OS' : 'Operator OS'} • v0.2
            </p>
            {userData.studentCode && !isParent && (
              <div className="mt-2 px-2 py-0.5 bg-primary/10 border border-primary/20 rounded-lg inline-block">
                <p className="text-[8px] font-black tracking-widest text-primary uppercase">ID: {userData.studentCode}</p>
              </div>
            )}
          </div>
        </div>
        <button 
          onClick={() => dispatch.setSidebarOpen(false)}
          className="lg:hidden p-2 text-foreground/40 hover:text-primary hover:bg-white/5 rounded-xl transition-all"
        >
          <X size={20} />
        </button>
      </div>

      <nav className="flex-1 space-y-1 overflow-y-auto no-scrollbar pr-2">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) => `nav-item group ${isActive ? 'nav-item-active' : ''}`}
          >
            <item.icon size={20} className="group-hover:scale-110 transition-transform" />
            <span className="font-medium">{item.name}</span>
          </NavLink>
        ))}
      </nav>

      <div className="mt-auto pt-6 border-t border-glass-border space-y-3">
        <button 
          onClick={() => dispatch.toggleDarkMode()}
          className="w-full h-11 flex items-center justify-between px-4 py-2 rounded-xl bg-white/5 border border-glass-border hover:bg-white/10 transition-all group"
        >
          <div className="flex items-center gap-3">
            {state.isDarkMode ? <Moon size={16} className="text-secondary" /> : <Sun size={16} className="text-yellow-500" />}
            <span className="text-xs font-black uppercase tracking-widest text-foreground/60">{state.isDarkMode ? 'Dark Mode' : 'Light Mode'}</span>
          </div>
          <div className={`w-8 h-4 rounded-full relative transition-colors ${state.isDarkMode ? 'bg-secondary' : 'bg-slate-300'}`}>
            <div className={`absolute top-1 w-2 h-2 rounded-full bg-white transition-all ${state.isDarkMode ? 'left-5' : 'left-1'}`} />
          </div>
        </button>

        <button 
          onClick={() => dispatch.logout()}
          className="w-full h-11 flex items-center gap-3 px-4 py-2 rounded-xl bg-red-500/10 border border-red-500/20 text-red-500 hover:bg-red-500/20 transition-all group"
        >
          <Power size={16} className="group-hover:rotate-12 transition-transform" />
          <span className="text-xs font-black uppercase tracking-widest">Terminate Sync</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
