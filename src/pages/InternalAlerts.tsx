import React, { useState } from 'react';
import { Bell, Clock, Calendar, Phone, Plus, Trash2, ShieldAlert, Zap, Radio, Activity, ChevronRight, CheckCircle2 } from 'lucide-react';
import { useAppContext } from '../context/AppContext';

const SignalCore = () => {
  const { state, dispatch } = useAppContext();
  const [newTaskName, setNewTaskName] = useState('');
  const [newDate, setNewDate] = useState('');
  const [newTime, setNewTime] = useState('');
  const [newContact, setNewContact] = useState('');

  const handleAddAlert = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskName.trim() || !newDate || !newTime) return;

    const newAlert = {
      id: Date.now().toString(),
      taskName: newTaskName,
      date: newDate,
      time: newTime,
      contact: newContact || 'System Default',
      priority: 'Medium',
      enabled: true
    };

    dispatch.addAlert(newAlert);
    
    setNewTaskName('');
    setNewDate('');
    setNewTime('');
    setNewContact('');
  };

  return (
    <div className="max-w-7xl mx-auto space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-1000">
      {/* Dynamic Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 border-b border-glass-border pb-8">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-xs font-black tracking-[0.3em] text-primary/60 uppercase">
            <Radio size={12} className="animate-pulse" />
            Signal bridge active • Node {state.currentUser?.id.substring(0, 8) || 'Alpha-01'}
          </div>
          <h1 className="text-5xl font-black tracking-tighter uppercase leading-tight text-foreground">Signal Core</h1>
          <p className="text-foreground/40 font-semibold tracking-wide">Configure real-time system notifications and internal queue management protocols.</p>
        </div>
        <div className="flex gap-4">
          <button 
            type="button"
            onClick={() => {
              if ("Notification" in window) {
                Notification.requestPermission().then(permission => {
                  alert(permission === 'granted' ? "System bridge synchronized. Browser notifications enabled." : "Neural link failed. Notifications blocked.");
                });
              }
            }}
            className="px-6 py-3 bg-white/5 border border-glass-border rounded-xl text-[10px] font-black uppercase tracking-widest text-primary hover:bg-primary/10 transition-all flex items-center gap-3 cursor-pointer"
          >
            <Bell size={14} />
            Enable Browser Reminders
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        {/* Queue Manager */}
        <div className="lg:col-span-4 glass-card p-10 border-2 border-glass-border relative overflow-hidden group">
           <div className="absolute inset-0 bg-gradient-to-br from-primary/[0.02] to-transparent pointer-events-none" />
          <h3 className="text-sm font-black uppercase tracking-[0.4em] text-primary mb-10 flex items-center gap-3 relative z-10">
            <Plus size={16} />
            Initialization Queue
          </h3>
          <form className="space-y-8 relative z-10" onSubmit={handleAddAlert}>
            <div className="space-y-4">
              <label className="text-xs uppercase tracking-[0.4em] font-black text-foreground/50 ml-1">Protocol Identification</label>
              <input 
                value={newTaskName}
                onChange={e => setNewTaskName(e.target.value)}
                required
                placeholder="SYNCHRONIZE TARGET NAME..."
                className="w-full bg-white/5 border border-glass-border rounded-2xl px-6 py-4 text-sm focus:outline-none focus:border-primary focus:bg-primary/[0.02] transition-all placeholder:text-foreground/30 font-black uppercase tracking-widest text-foreground"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-4">
                <label className="text-xs uppercase tracking-[0.4em] font-black text-foreground/50 ml-1">Temporal Node</label>
                <div className="relative group/input">
                  <Calendar className="absolute left-5 top-1/2 -translate-y-1/2 text-foreground/40 group-focus-within/input:text-primary transition-colors" size={16} />
                  <input 
                    type="date" 
                    value={newDate}
                    onChange={e => setNewDate(e.target.value)}
                    required
                    className="w-full bg-white/5 border border-glass-border rounded-2xl pl-12 pr-4 py-4 text-sm focus:outline-none focus:border-primary transition-all appearance-none font-black uppercase tracking-widest text-foreground" 
                  />
                </div>
              </div>
              <div className="space-y-4">
                <label className="text-xs uppercase tracking-[0.4em] font-black text-foreground/50 ml-1">Precision</label>
                <div className="relative group/input">
                  <Clock className="absolute left-5 top-1/2 -translate-y-1/2 text-foreground/40 group-focus-within/input:text-primary transition-colors" size={16} />
                  <input 
                    type="time" 
                    value={newTime}
                    onChange={e => setNewTime(e.target.value)}
                    required
                    className="w-full bg-white/5 border border-glass-border rounded-2xl pl-12 pr-4 py-4 text-sm focus:outline-none focus:border-primary transition-all appearance-none font-black uppercase tracking-widest text-foreground" 
                  />
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <label className="text-xs uppercase tracking-[0.4em] font-black text-foreground/50 ml-1">Communication Bridge</label>
              <div className="relative group/input">
                <Phone className="absolute left-5 top-1/2 -translate-y-1/2 text-foreground/40 group-focus-within/input:text-primary transition-colors" size={16} />
                <input 
                  value={newContact}
                  onChange={e => setNewContact(e.target.value)}
                  placeholder="+X XXX XXX XXXX" 
                  className="w-full bg-white/5 border border-glass-border rounded-2xl pl-12 pr-6 py-4 text-sm focus:outline-none focus:border-primary transition-all placeholder:text-foreground/30 font-black uppercase tracking-widest text-foreground" 
                />
              </div>
            </div>

            <button type="submit" className="w-full py-6 bg-primary text-white font-black uppercase tracking-[0.4em] text-xs rounded-[2rem] shadow-[0_0_30px_rgba(99,102,241,0.2)] hover:shadow-[0_0_50px_rgba(99,102,241,0.4)] transition-all transform active:scale-95 border border-primary/20">
              Initialize Signal Node
            </button>
          </form>
        </div>

        {/* Active Signals List */}
        <div className="lg:col-span-8 space-y-8">
          <div className="glass-card p-10 border-2 border-glass-border relative overflow-hidden group">
            <h3 className="text-sm font-black uppercase tracking-[0.4em] text-secondary mb-10 flex items-center gap-3">
              <Bell size={16} />
              Active System Signals
            </h3>
            
            <div className="space-y-4">
              {state.alerts.length > 0 ? state.alerts.map((alert) => (
                <div key={alert.id} className="group p-6 bg-white/[0.02] border border-glass-border rounded-3xl flex flex-col sm:flex-row items-start sm:items-center justify-between hover:bg-white/[0.04] hover:border-primary/40 transition-all duration-500 gap-6">
                  <div className="flex items-center gap-6">
                    <button 
                      onClick={() => dispatch.toggleAlert(alert.id)}
                      className={`w-14 h-14 rounded-2xl flex items-center justify-center border transition-all duration-700 shrink-0 ${alert.enabled ? 'bg-primary/10 text-primary border-primary/20 shadow-[0_0_20px_rgba(99,102,241,0.1)]' : 'bg-white/5 text-foreground/20 border-glass-border opacity-40'}`}
                    >
                      <ShieldAlert size={28} />
                    </button>
                    <div>
                      <h4 className={`text-xl font-black tracking-tight uppercase group-hover:text-primary transition-colors ${alert.enabled ? 'text-foreground' : 'text-foreground/30 line-through'}`}>{alert.taskName}</h4>
                      <p className="text-[10px] font-black uppercase tracking-[0.2em] text-foreground/40 mt-1.5 flex flex-wrap gap-x-4 gap-y-2 items-center">
                        <span className="flex items-center gap-1.5"><Calendar size={12} className="text-primary/60" /> {alert.date}</span>
                        <span className="flex items-center gap-1.5"><Clock size={12} className="text-primary/60" /> {alert.time}</span>
                        <span className="flex items-center gap-1.5"><Phone size={12} className="text-primary/60" /> {alert.contact}</span>
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between w-full sm:w-auto gap-6 sm:border-l sm:border-white/5 sm:pl-6">
                    <span className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest border ${alert.priority === 'High' ? 'bg-red-500/10 text-red-500 border-red-500/20 shadow-[0_0_15px_rgba(239,68,68,0.1)]' : 'bg-primary/10 text-primary border-primary/20'} ${!alert.enabled && 'opacity-30'}`}>
                      {alert.priority} LOAD
                    </span>
                    <div className="flex items-center gap-3">
                       <button 
                        onClick={() => dispatch.toggleAlert(alert.id)}
                        className={`w-11 h-11 rounded-xl flex items-center justify-center transition-all ${alert.enabled ? 'bg-green-500/10 text-green-500 hover:bg-green-500/20' : 'bg-white/5 text-foreground/20 hover:text-foreground/40'}`}
                        title={alert.enabled ? "Acknowledge Signal" : "Re-activate Signal"}
                      >
                        <CheckCircle2 size={20} />
                      </button>
                      <button 
                        onClick={() => dispatch.removeAlert(alert.id)}
                        className="w-11 h-11 rounded-xl bg-white/5 text-foreground/30 hover:text-red-400 hover:bg-red-400/10 transition-all flex items-center justify-center group/btn"
                      >
                        <Trash2 size={20} className="group-hover/btn:scale-110 transition-transform" />
                      </button>
                    </div>
                  </div>
                </div>
              )) : (
                <div className="text-center py-20 border-2 border-dashed border-glass-border rounded-3xl opacity-20 group-hover:opacity-40 transition-opacity">
                   <Bell className="mx-auto mb-4" size={48} />
                   <p className="text-xs font-black uppercase tracking-[0.4em]">No active signals detected</p>
                </div>
              )}
            </div>
          </div>

          <div className="glass-card p-10 border-2 border-glass-border group relative overflow-hidden bg-gradient-to-br from-secondary/[0.03] to-transparent">
             <div className="absolute -bottom-12 -right-12 text-secondary opacity-5 group-hover:opacity-10 transition-all duration-1000 rotate-45">
              <Zap size={200} />
            </div>
            <h3 className="text-sm font-black uppercase tracking-[0.4em] text-secondary mb-8 flex items-center gap-3">
              <Activity size={16} />
              Protocol Log Core
            </h3>
            <div className="space-y-6 relative z-10">
              {[
                { log: 'Deep Work bandwidth allocated at 08:00', status: 'SYNCHRONIZED' },
                { log: `Protocol "${state.alerts[0]?.taskName || 'Architecture Review'}" recognize pending deadline`, status: 'WARNING' },
                { log: 'Neural skill growth evolution sync active', status: 'NOMINAL' },
              ].map((item, i) => (
                <div key={i} className="flex justify-between items-center group/log cursor-pointer py-1">
                  <div className="flex gap-4 items-center">
                    <span className="w-1.5 h-1.5 rounded-full bg-secondary group-hover/log:scale-150 transition-all" />
                    <p className="text-sm font-semibold text-foreground/40 group-hover/log:text-foreground transition-colors">{item.log}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-xs font-black tracking-widest text-foreground/40 italic">{item.status}</span>
                    <ChevronRight size={14} className="text-foreground/50 group-hover/log:text-secondary group-hover/log:translate-x-1 transition-all" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignalCore;
