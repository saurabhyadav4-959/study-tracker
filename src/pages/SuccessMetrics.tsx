import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';
import EmptyChart from '../components/EmptyChart';
import { TrendingUp, Award, Zap, BrainCircuit, Activity, ChevronRight, Shield, Radio, Timer } from 'lucide-react';
import { useAppContext } from '../context/AppContext';

// Helper to derive metrics from activity logs
const getDynamicChartData = (logs: any[]) => {
  if (!logs || logs.length === 0) return [];
  // Take last 7 entries for weekly view
  return logs.slice(-7).map(log => ({
    name: new Date(log.date).toLocaleDateString('en-US', { weekday: 'short' }),
    iq: 100 + (log.count || 0) * 2, // Base IQ + intensity boost
    vector: 1.0 + (log.intensity || 0) * 0.1
  }));
};

const SuccessMetrics = () => {
  const { state } = useAppContext();
  
  const tasksDone = state.tasks.filter(t => t.status === 'Done').length;
  const totalTasks = state.tasks.length;
  const focusMinutes = state.pomodoro.totalMinutes;
  const skillsCount = state.skills.length;
  
  const focusScore = Math.min(100, Math.round((focusMinutes / 300) * 100));
  const activeData = getDynamicChartData(state.activityLogs);
  const coreStability = totalTasks > 0 ? Math.round((tasksDone / totalTasks) * 100) : 0;
  const retentionProgress = Math.min(100, (skillsCount * 10) + (tasksDone * 5));
  const hasActivity = React.useMemo(() => {
    return (state.activityLogs && state.activityLogs.some(l => (l.count || 0) > 0)) || tasksDone > 0;
  }, [state.activityLogs, tasksDone]);

  return (
    <div className="max-w-7xl mx-auto space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-1000">
      {/* Dynamic Header */}
      <div className="flex justify-between items-start">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-xs font-black tracking-[0.3em] text-primary/60 uppercase">
            <Radio size={12} className="animate-pulse" />
            Predictive Analytics Protocol Online
          </div>
          <h1 className="text-5xl font-black tracking-tighter uppercase leading-tight">Success Metrics</h1>
          <p className="text-foreground/40 font-semibold tracking-wide">Deep analytical synthesis of your cognitive and academic performance vectors.</p>
        </div>
        <button className="px-8 py-4 bg-white/5 border border-glass-border text-foreground/60 font-black uppercase tracking-[0.2em] text-xs rounded-2xl hover:bg-white/10 hover:text-white transition-all shadow-inner">
          Export DNA Report
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* Main Neural Flux Chart (Spanning 2 columns) */}
        <div className="lg:col-span-2 glass-card p-10 border-2 border-glass-border flex flex-col justify-between group overflow-hidden relative bg-gradient-to-br from-primary/[0.02] to-transparent">
          <div className="relative z-10 flex justify-between items-start mb-12">
            <h3 className="text-sm font-black uppercase tracking-[0.4em] text-primary flex items-center gap-3">
              <Activity size={18} />
              Neural Flux Capacitors
            </h3>
            <div className="flex gap-2">
              <div className="px-4 py-2 rounded-xl bg-primary text-white text-xs font-black shadow-[0_0_15px_rgba(99,102,241,0.4)] uppercase tracking-widest">
                Weekly View
              </div>
            </div>
          </div>
          <div className="w-full h-64 relative z-10 mt-auto">
            {hasActivity && activeData && activeData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={activeData} margin={{ top: 20, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" vertical={false} />
                  <XAxis 
                    dataKey="name" 
                    stroke="#ffffff30" 
                    tick={{ fill: 'var(--foreground)', opacity: 0.6, fontSize: 10, fontWeight: 900, fontFamily: 'monospace' }} 
                    tickLine={false} 
                    axisLine={false}
                    dy={10}
                  />
                  <YAxis 
                    stroke="#ffffff30" 
                    tick={{ fill: 'var(--foreground)', opacity: 0.6, fontSize: 10, fontWeight: 900 }} 
                    tickLine={false} 
                    axisLine={false}
                    domain={[80, 150]}
                  />
                  <Tooltip 
                    contentStyle={{ backgroundColor: 'var(--background)', borderColor: 'var(--glass-border)', borderRadius: '12px' }}
                    itemStyle={{ color: 'var(--foreground)', fontWeight: 900 }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="iq" 
                    stroke="#6366f1" 
                    strokeWidth={4} 
                    dot={{ r: 4, fill: '#0a0a0c', strokeWidth: 2, stroke: '#6366f1' }} 
                    activeDot={{ r: 6, stroke: '#fff', strokeWidth: 2 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <EmptyChart 
                height="100%" 
                message="Neural trajectory modeling is locked. Complete tasks to initialize your success vector."
              />
            )}
          </div>
        </div>

        {/* Overview Sync Panel */}
        <div className="glass-card p-10 border-2 border-glass-border flex flex-col justify-between overflow-hidden relative">
          <div className="absolute -top-10 -right-10 text-primary opacity-[0.03] group-hover:opacity-[0.05] transition-all duration-700 pointer-events-none">
            <TrendingUp size={300} />
          </div>
          <h3 className="text-sm font-black uppercase tracking-[0.4em] text-primary flex items-center gap-3 relative z-10 mb-8">
             <Zap size={18} />
             Biological Sync
          </h3>
          
          <div className="flex-1 flex flex-col items-center justify-center relative z-10">
            <div className="relative w-48 h-48 rounded-full border-4 border-white/5 flex items-center justify-center mb-12">
              <svg className="absolute inset-0 w-full h-full -rotate-90">
                <circle cx="92" cy="92" r="92" fill="none" stroke="#6366f1" strokeWidth="4" strokeDasharray="578" strokeDashoffset={578 * (1 - (focusScore / 100))} className="drop-shadow-[0_0_15px_rgba(99,102,241,0.5)] transition-all duration-1000" />
              </svg>
              <div className="text-center">
                <span className="text-6xl font-black tracking-tighter italic text-foreground">{focusScore}<span className="text-2xl">%</span></span>
                <p className="text-[10px] text-primary tracking-[0.3em] uppercase font-black mt-1">{focusScore > 80 ? 'Optimal State' : 'Calibration'}</p>
              </div>
            </div>

            <div className="w-full space-y-6">
              {[
                { label: 'Neural Energy', val: `${Math.min(100, Math.floor(focusMinutes / 2))}%` },
                { label: 'Metabolic Logic', val: `${coreStability}%` }
              ].map((item, i) => (
                <div key={i} className="w-full">
                  <div className="flex justify-between text-[11px] font-black uppercase tracking-widest mb-3">
                    <span className="text-foreground/80">{item.label}</span>
                    <span className="text-primary">{item.val}</span>
                  </div>
                  <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                    <div className="h-full bg-white/20 rounded-full transition-all duration-1000" style={{ width: item.val }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">

        {/* Snapshot Panel */}
        <div className="glass-card p-10 border-2 border-primary/20 bg-primary/[0.05] relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-8 text-primary opacity-5 group-hover:opacity-10 transition-all duration-700">
            <Award size={160} />
          </div>
          <div className="relative z-10 flex flex-col h-full justify-between">
            <h3 className="text-sm font-black uppercase tracking-[0.4em] text-primary mb-12">Performance Snapshot</h3>
            <div className="space-y-10">
              {[
                { label: 'Curriculum Coverage', val: `${Math.min(100, tasksDone * 5)}%`, color: 'bg-white' },
                { label: 'Module Retention', val: `${retentionProgress}%`, color: 'bg-white/60' },
                { label: 'Skill Acquisition', val: `${Math.min(100, skillsCount * 12.5)}%`, color: 'bg-white/30' },
              ].map((item, i) => (
                <div key={i} className="space-y-3">
                  <div className="flex justify-between items-center text-xs font-black uppercase tracking-widest">
                    <span className="text-foreground/40">{item.label}</span>
                    <span className="text-foreground font-black">{item.val}</span>
                  </div>
                  <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden p-0.5 border border-white/5">
                    <div className={`h-full ${item.color} rounded-full transition-all duration-1000`} style={{ width: item.val }} />
                  </div>
                </div>
              ))}
            </div>
            <button className="w-full mt-12 py-5 bg-primary text-white font-black uppercase tracking-[0.3em] text-xs rounded-2xl hover:shadow-[0_0_30px_rgba(99,102,241,0.3)] transition-all transform active:scale-95 border border-primary/20">
              Register New Metric Node
            </button>
          </div>
        </div>
      </div>

      <div className="glass-card p-12 border-2 border-glass-border group overflow-hidden relative">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/[0.02] to-transparent pointer-events-none" />
        <div className="absolute -bottom-24 -right-24 text-primary opacity-5 group-hover:opacity-10 transition-all duration-1000">
           <BrainCircuit size={400} />
        </div>
        
        <div className="relative z-10 flex flex-col md:flex-row gap-12 items-center">
          <div className="flex-1 space-y-6">
            <h3 className="text-sm font-black uppercase tracking-[0.4em] text-primary flex items-center gap-3">
              <Activity size={16} />
              Predictive Analytics Core
            </h3>
            <p className="text-4xl font-black tracking-tighter text-foreground uppercase leading-tight italic">Simulation Engine <span className="text-red-500">Offline</span></p>
            <p className="text-foreground/40 font-semibold tracking-wide max-w-xl">
              Connect your neural identity and synchronize 14+ cycles of activity data to initialize the predictive core and unlock future trajectory modeling.
            </p>
            <div className="flex gap-4">
              <div className="px-6 py-2 bg-white/5 border border-glass-border rounded-xl text-sm font-black uppercase tracking-widest text-foreground/50 flex items-center gap-2">
                <Shield size={12} />
                Protocol Locked
              </div>
              <div className="px-6 py-2 bg-white/5 border border-glass-border rounded-xl text-sm font-black uppercase tracking-widest text-foreground/50 flex items-center gap-2">
                <Timer size={12} />
                ETA: 14:00:00
              </div>
            </div>
          </div>
          
          <div className="w-64 h-64 border-2 border-dashed border-glass-border rounded-[3rem] flex items-center justify-center group cursor-pointer hover:border-primary/50 transition-all hover:bg-primary/5 duration-700">
            <div className="text-center">
              <div className="w-20 h-20 bg-white/5 rounded-[2rem] flex items-center justify-center mx-auto mb-6 group-hover:bg-primary/20 transition-all group-hover:scale-110 duration-500 shadow-inner">
                <Zap className="text-foreground/50 group-hover:text-primary transition-all group-hover:rotate-12" size={32} />
              </div>
              <p className="text-sm font-black text-foreground/50 uppercase tracking-[0.4em]">Init Core</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SuccessMetrics;
