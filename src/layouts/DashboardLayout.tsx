import React, { useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';
import { useAppContext } from '../context/AppContext';

const DashboardLayout: React.FC = () => {
  const { state, dispatch } = useAppContext();

  useEffect(() => {
    if (state.isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [state.isDarkMode]);

  return (
    <div className="min-h-screen bg-background text-foreground transition-colors duration-300">
      <Sidebar />
      
      {/* Mobile Backdrop Overlay */}
      {state.isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[90] lg:hidden animate-in fade-in duration-300"
          onClick={() => dispatch.setSidebarOpen(false)}
        />
      )}

      <div className="flex flex-col min-h-screen lg:ml-72 transition-all duration-500">
        <Header />
        <main className="flex-1 mt-24 p-4 md:p-8 overflow-y-auto w-full max-w-[1600px] mx-auto">
          {state.profile.isLocked ? (
            <div className="min-h-[70vh] flex flex-col items-center justify-center text-center space-y-8 animate-in zoom-in duration-700">
              <div className="w-24 h-24 rounded-3xl bg-red-500/10 border border-red-500/20 flex items-center justify-center text-red-500 shadow-[0_0_50px_rgba(239,68,68,0.2)]">
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                </svg>
              </div>
              <div className="space-y-4 max-w-2xl">
                <h1 className="text-5xl font-black tracking-tighter uppercase italic text-red-500">System Restricted</h1>
                <p className="text-xl font-bold text-foreground/60 leading-relaxed italic">
                  {state.profile.lockMessage || 'CORE ACCESS SUSPENDED: SYNCHRONIZE WITH SUPERVISOR TO RESTORE PROTOCOLS.'}
                </p>
              </div>
              <div className="pt-8 flex flex-col items-center gap-4">
                 <div className="flex items-center gap-3 px-6 py-3 bg-foreground/5 border border-glass-border rounded-full text-[10px] font-black uppercase tracking-[0.3em] text-foreground/40 animate-pulse">
                   <div className="w-2 h-2 rounded-full bg-red-500" />
                   Neural Sync Monitor Active
                 </div>
                 <p className="text-xs font-black uppercase tracking-widest text-foreground/20 italic">Contact your parent/supervisor to initiate re-authorization.</p>
              </div>
            </div>
          ) : (
            <Outlet />
          )}
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
