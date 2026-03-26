import React from 'react';
import { Search, Bell, Shield, Radio, Activity, Menu } from 'lucide-react';
import { NavLink, useLocation } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';

const Header = () => {
  const { state, dispatch } = useAppContext();
  const location = useLocation();

  const getPageTitle = () => {
    const path = location.pathname;
    if (path === '/') return 'SYSTEM OVERVIEW';
    if (path === '/profile') return 'IDENTITY MANAGER';
    if (path === '/academic') return 'TRACK CORE';
    if (path === '/skills') return 'SKILL EVOLUTION';
    if (path === '/metrics') return 'SUCCESS METRICS';
    if (path === '/time') return 'BANDWIDTH ALLOCATION';
    if (path === '/deep-work') return 'FOCUS MODE';
    if (path === '/consistency') return 'CONTRIBUTION CORE';
    if (path === '/knowledge') return 'GLOBAL KNOWLEDGE';
    if (path === '/alerts') return 'SIGNAL CORE';
    return 'OPERATIONAL HUB';
  };

  return (
    <header className="h-24 fixed top-0 right-0 left-0 lg:left-72 bg-background/40 backdrop-blur-2xl border-b border-glass-border flex items-center justify-between px-6 md:px-10 z-40">
      <div className="flex items-center gap-4">
        <button 
          onClick={() => dispatch.toggleSidebar()}
          className="lg:hidden p-2 text-foreground/40 hover:text-primary hover:bg-white/5 rounded-xl transition-all"
        >
          <Menu size={24} />
        </button>
        <div className="flex flex-col">
          <div className="flex items-center gap-2 mb-1">
             <span className="text-[10px] md:text-sm font-black tracking-[0.4em] text-primary/40 uppercase">Operational Node /</span>
             <span className="text-[10px] md:text-sm font-black tracking-[0.4em] text-primary uppercase">{getPageTitle()}</span>
          </div>
          <h2 className="text-lg md:text-xl font-black tracking-tight flex items-center gap-3">
            <span className="text-foreground/50 font-bold italic hidden sm:inline">User:</span> 
            <span className="uppercase tracking-tighter italic">{state.profile.name}</span>
          </h2>
        </div>
      </div>

      <div className="flex items-center gap-10">
        <div className="relative group hidden lg:block">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-foreground/40 group-focus-within:text-primary transition-all duration-500" size={16} />
          <input 
            type="text" 
            placeholder="NEURAL SEARCH..." 
            className="bg-white/[0.03] border-2 border-glass-border rounded-2xl py-3 pl-12 pr-6 w-80 text-xs font-black tracking-widest focus:outline-none focus:border-primary/40 focus:bg-primary/[0.02] transition-all duration-500 placeholder:text-foreground/50"
          />
        </div>

        <div className="flex items-center gap-8">
           <button className="relative text-foreground/40 hover:text-primary transition-colors group">
              <Bell size={20} className="group-hover:rotate-12 transition-transform" />
              <div className="absolute -top-1 -right-1 w-2 h-2 bg-primary rounded-full shadow-[0_0_10px_rgba(99,102,241,0.8)] animate-pulse" />
           </button>

          <NavLink to="/profile" className="flex items-center gap-5 border-l-2 border-glass-border pl-8 hover:opacity-80 transition-all duration-500 group shrink-0">
            <div className="text-right hidden sm:block">
              <p className="text-sm font-black tracking-tight text-foreground uppercase group-hover:text-primary transition-colors">{state.profile.name}</p>
              <div className="flex items-center gap-2 justify-end mt-1.5">
                <div className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
                <p className="text-sm text-primary/60 font-black uppercase tracking-widest italic">{state.profile.status}</p>
              </div>
            </div>
            <div className="relative shrink-0">
              <div className="w-12 h-12 rounded-2xl overflow-hidden border-2 border-glass-border p-0.5 group-hover:border-primary/40 transition-all duration-500 bg-gradient-to-br from-primary/10 to-[#1a1c1e] flex items-center justify-center">
                <span className="text-xl font-black text-foreground leading-none pb-0.5">{state.profile.name.charAt(0)}</span>
              </div>
              <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-primary rounded-lg border-4 border-background flex items-center justify-center shadow-xl">
                <Shield size={10} className="text-white fill-white" />
              </div>
            </div>
          </NavLink>
        </div>
      </div>
    </header>
  );
};
export default Header;
