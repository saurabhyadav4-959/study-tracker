import React from 'react';
import { 
  Zap, Clock, Layers, TrendingUp, 
  BarChart3, Target, Flame, Activity, Timer, ChevronRight, Shield, Radio
} from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';
import EmptyChart from '../components/EmptyChart';

// Helper to group activity logs for charts
const formatChartData = (logs: any[], timeframe: string) => {
  if (!logs || logs.length === 0) return [];

  if (timeframe === 'W') {
    // Current week: Monday to Sunday
    const today = new Date();
    const day = today.getDay(); // 0 is Sunday
    const diff = today.getDate() - day + (day === 0 ? -6 : 1); // Adjust when day is Sunday
    const monday = new Date(today.setDate(diff));
    monday.setHours(0,0,0,0);
    
    const weekLogs = logs.filter(l => new Date(l.date) >= monday);
    // Pad to 7 days if needed
    const result = [];
    for (let i = 0; i < 7; i++) {
      const d = new Date(monday);
      d.setDate(d.getDate() + i);
      const ds = d.toLocaleDateString('en-CA');
      const found = weekLogs.find(l => l.date === ds);
      result.push({
        name: d.toLocaleDateString('en-US', { weekday: 'short' }),
        productive: found?.count || 0,
        focus: (found?.intensity || 0) * 10
      });
    }
    return result;
  }

  if (timeframe === 'M') {
    // Rolling 30 days: end date is today, start is 29 days ago
    const result = logs.slice(-30).map(log => ({
      name: new Date(log.date).toLocaleDateString('en-US', { day: 'numeric', month: 'short' }),
      productive: log.count || 0,
      focus: (log.intensity || 0) * 10
    }));
    return result;
  }

  if (timeframe === 'Y') {
    // Return all 365 days for a dense "whole year" view
    return logs.slice(-365).map(log => ({
      name: new Date(log.date).toLocaleDateString('en-US', { day: 'numeric', month: 'short' }),
      productive: log.count || 0,
      focus: (log.intensity || 0) * 10
    }));
  }

  return logs.slice(-7).map(log => ({
    name: new Date(log.date).toLocaleDateString('en-US', { weekday: 'short' }),
    productive: log.count || 0,
    focus: (log.intensity || 0) * 10
  }));
};

const StatCard = ({ title, value, icon: Icon, color, trend, subtitle }: any) => (
  <div className="glass-card p-8 border-2 border-glass-border glass-card-hover relative overflow-hidden group">
    <div className={`absolute -right-4 -top-4 w-24 h-24 bg-${color}/5 rounded-full blur-3xl group-hover:bg-${color}/10 transition-all duration-500`} />
    <div className="flex justify-between items-start mb-8 relative z-10">
      <div className={`w-14 h-14 rounded-2xl bg-${color}/10 text-${color === 'primary' ? 'primary' : color} flex items-center justify-center shadow-inner group-hover:scale-105 transition-transform`}>
        <Icon size={28} />
      </div>
      {trend && (
        <div className={`flex items-center gap-1 font-black text-xs tracking-tighter px-2.5 py-1 rounded-full ${trend > 0 ? 'bg-green-500/10 text-green-500 shadow-[0_0_10px_rgba(34,197,94,0.2)]' : 'bg-red-500/10 text-red-500'}`}>
          {trend > 0 ? '▲' : '▼'} {Math.abs(trend)}%
        </div>
      )}
    </div>
    <div className="space-y-1 relative z-10">
      <p className="text-xs font-black uppercase tracking-[0.3em] text-foreground/50">{title}</p>
      <div className="flex items-baseline gap-2">
        <h3 className="text-4xl font-black tracking-tighter text-foreground">{value}</h3>
        {subtitle && <span className="text-xs font-bold text-foreground/40 uppercase tracking-widest">{subtitle}</span>}
      </div>
    </div>
  </div>
);

const Overview = () => {
  const { state, dispatch } = useAppContext();
  const [timeframe, setTimeframe] = React.useState('W');

  const getActiveData = () => {
    return formatChartData(state.activityLogs, timeframe);
  };

  const hasActivity = React.useMemo(() => {
    const tasksDone = state.tasks.filter(t => t.status === 'Done').length;
    return (state.activityLogs && state.activityLogs.some(l => (l.count || 0) > 0)) || tasksDone > 0;
  }, [state.activityLogs, state.tasks]);

  const simulateActivity = () => {
    const today = new Date().toISOString().split('T')[0];
    // In a real app, we'd use a dispatch. For this demo, we can just suggest completing a task
    // or we can add a specific dispatch if we want to be thorough.
    // For now, let's keep it simple and check tasks.
  };

  const tasksDone = state.tasks.filter(t => t.status === 'Done').length;
  const totalTasks = state.tasks.length;
  const focusMinutes = state.pomodoro.totalMinutes;
  const skillsCount = state.skills.length;

  // Calculate scores based on real data
  const productiveScore = totalTasks > 0 ? Math.round((tasksDone / totalTasks) * 100) : 0;
  const focusScore = Math.min(100, Math.round((focusMinutes / 300) * 100)); // 300 mins as 100% bench

  return (
    <div className="max-w-7xl mx-auto space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-1000">
      {/* Dynamic Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 border-b border-glass-border pb-8">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-xs font-black tracking-[0.3em] text-primary/60 uppercase">
            <Radio size={12} className="animate-pulse" />
            System Live • Node {state.currentUser?.id.substring(0, 8) || 'Alpha-01'}
          </div>
          <h1 className="text-5xl font-black tracking-tighter uppercase leading-tight">System Overview</h1>
          <div className="flex gap-4 items-center">
            <p className="text-foreground/40 font-semibold tracking-wide">Synthesizing real-time diagnostics of your academic OS.</p>
            <button 
              onClick={() => {
                if (confirm("CRITICAL: This will wipe all neural logs and task history. Proceed?")) {
                  dispatch.resetData();
                }
              }}
              className="px-3 py-1 border border-red-500/20 bg-red-500/5 text-red-500 text-[10px] font-black uppercase tracking-widest rounded-lg hover:bg-red-500/10 transition-all opacity-40 hover:opacity-100"
            >
              Master Reset
            </button>
          </div>
        </div>
        
        <div className="flex items-center gap-6">
          <div className="px-6 py-3 bg-white/5 border border-glass-border rounded-2xl flex items-center gap-4">
            <div className="text-right">
              <p className="text-sm font-black uppercase tracking-widest text-foreground/40 mb-1 leading-none">Intelligence Index</p>
              <p className="text-xl font-black text-primary leading-none">{100 + (skillsCount * 2) + Math.floor(focusMinutes / 60)} <span className="text-xs text-foreground/40 italic">iQ</span></p>
            </div>
          </div>
          <div className="px-6 py-3 bg-green-500/5 border border-green-500/20 rounded-2xl flex items-center gap-4">
            <div className="text-right">
              <p className="text-sm font-black uppercase tracking-widest text-green-500/40 mb-1 leading-none">Core Stability</p>
              <p className="text-xl font-black text-green-500 leading-none">{totalTasks > 0 ? Math.round((tasksDone / totalTasks) * 100) : 0}%</p>
            </div>
          </div>
        </div>
      </div>

      {/* Primary Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard title="Productive Score" value={productiveScore} subtitle="/ 100" icon={TrendingUp} color="primary" trend={productiveScore > 0 ? 5 : 0} />
        <StatCard title="Focus Score" value={focusMinutes} subtitle="min" icon={Zap} color="secondary" trend={focusMinutes > 0 ? 2 : 0} />
        <StatCard title="Tasks Complete" value={`${tasksDone}/${totalTasks}`} subtitle="total" icon={Target} color="primary" />
        <StatCard title="Skills Mastered" value={skillsCount} subtitle="nodes" icon={Layers} color="green-400" trend={skillsCount > 0 ? 1 : 0} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* Performance Hub */}
        <div className="lg:col-span-2 space-y-8">
          <div className="glass-card p-10 border-2 border-glass-border relative overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/[0.02] to-transparent pointer-events-none" />
            <div className="flex justify-between items-center mb-12 relative z-10">
              <h3 className="text-sm font-black uppercase tracking-[0.4em] text-primary flex items-center gap-3">
                <BarChart3 size={16} />
                Neural Flux Capacitors
              </h3>
              <div className="flex items-center gap-4">
                {!hasActivity && (
                  <button 
                    onClick={() => {
                      alert("Complete a task in the 'Tasks' section to initialize real-time data flow!");
                    }}
                    className="text-[10px] font-black uppercase tracking-widest text-primary/40 hover:text-primary transition-colors border border-primary/20 px-3 py-1 rounded-lg"
                  >
                    How to Sync?
                  </button>
                )}
                <div className="flex gap-2">
                  {['W', 'M', 'Y'].map(t => (
                    <button 
                      key={t} 
                      onClick={() => setTimeframe(t)}
                      className={`px-4 py-1.5 rounded-lg text-xs font-black uppercase tracking-widest transition-all ${timeframe === t ? 'bg-primary text-foreground shadow-[0_0_15px_rgba(99,102,241,0.3)]' : 'bg-white/5 text-foreground/40 hover:bg-white/10'}`}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </div>
            </div>
            
            <div className="h-64 w-full flex items-end justify-between gap-4 relative z-10">
              {hasActivity ? (
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={getActiveData()} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <defs>
                      <linearGradient id="colorProd" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#6366f1" stopOpacity={0.4}/>
                        <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                      </linearGradient>
                      <linearGradient id="colorFocus" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#a855f7" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#a855f7" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#ffffff05" vertical={false} />
                    <XAxis 
                      dataKey="name" 
                      stroke="#ffffff30" 
                      tick={{ fill: '#ffffff60', fontSize: 10, fontWeight: 900, fontFamily: 'monospace' }} 
                      tickLine={false} 
                      axisLine={false}
                      minTickGap={30}
                      dy={10}
                    />
                    <YAxis 
                      stroke="#ffffff30" 
                      tick={{ fill: '#ffffff60', fontSize: 10, fontWeight: 900 }} 
                      tickLine={false} 
                      axisLine={false}
                    />
                    <Tooltip 
                      contentStyle={{ backgroundColor: 'var(--background)', borderColor: 'var(--glass-border)', borderRadius: '12px' }}
                      itemStyle={{ color: 'var(--foreground)', fontWeight: 900 }}
                    />
                    <Area type="monotone" dataKey="productive" stroke="#6366f1" strokeWidth={3} fillOpacity={1} fill="url(#colorProd)" />
                    <Area type="monotone" dataKey="focus" stroke="#a855f7" strokeWidth={3} fillOpacity={1} fill="url(#colorFocus)" />
                  </AreaChart>
                </ResponsiveContainer>
              ) : (
                <EmptyChart height="100%" />
              )}
            </div>
          </div>

          <div className="glass-card p-10 border-2 border-glass-border flex items-center justify-between group cursor-pointer hover:bg-primary/[0.03]">
            <div className="flex items-center gap-8">
              <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center text-primary border border-primary/20 group-hover:scale-110 transition-all">
                <Activity size={32} />
              </div>
              <div>
                <h4 className="text-2xl font-black tracking-tight mb-1 uppercase">Advanced Core Metrics</h4>
                <p className="text-xs text-foreground/50 font-black uppercase tracking-[0.2em]">Deeper analysis of neural synchronization</p>
              </div>
            </div>
            <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center text-foreground/40 group-hover:bg-primary group-hover:text-foreground transition-all">
              <ChevronRight size={24} />
            </div>
          </div>
        </div>

        {/* Biological Sync */}
        <div className="lg:col-span-1">
          <div className="glass-card p-10 border-2 border-glass-border h-full relative overflow-hidden flex flex-col group">
             <div className="absolute -top-12 -right-12 text-primary opacity-5 group-hover:opacity-10 transition-all duration-700">
              <Flame size={240} />
            </div>
            
            <h3 className="text-sm font-black uppercase tracking-[0.4em] text-primary mb-12 flex items-center gap-3">
              <Flame size={16} />
              Biological Sync
            </h3>
            
            <div className="flex-1 flex flex-col justify-center items-center relative z-10">
              <div className="relative w-56 h-56">
                <svg className="w-full h-full -rotate-90 scale-110">
                  <circle cx="112" cy="112" r="90" fill="transparent" stroke="currentColor" strokeWidth="2" className="text-white/5" />
                  <circle 
                    cx="112" cy="112" r="90" 
                    fill="transparent" 
                    stroke="currentColor" 
                    strokeWidth="4" 
                    strokeDasharray={565} 
                    strokeDashoffset={565 * (1 - (focusScore / 100))} 
                    className="text-primary transition-all duration-1000 shadow-[0_0_20px_rgba(99,102,241,0.5)]" 
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-6xl font-black text-foreground leading-none tracking-tighter">{focusScore}<span className="text-xl text-foreground/40 font-bold ml-1">%</span></span>
                  <p className="text-sm uppercase tracking-[0.4em] font-black text-primary mt-4 animate-pulse">{focusScore > 80 ? 'Optimal State' : focusScore > 40 ? 'Active Sync' : 'Standby Mode'}</p>
                </div>
              </div>

              <div className="mt-16 space-y-8 w-full">
                <div className="space-y-3">
                  <div className="flex justify-between items-center text-xs font-black uppercase tracking-[0.2em]">
                    <span className="text-foreground/40">Neural Energy</span>
                    <span className="text-primary">{Math.min(100, Math.floor(focusMinutes / 2))}%</span>
                  </div>
                  <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden p-0.5 border border-white/5">
                    <div className="h-full bg-primary rounded-full transition-all duration-1000" style={{ width: `${Math.min(100, Math.floor(focusMinutes / 2))}%` }} />
                  </div>
                </div>
                
                <div className="space-y-3">
                  <div className="flex justify-between items-center text-xs font-black uppercase tracking-[0.2em]">
                    <span className="text-foreground/40">Metabolic Logic</span>
                    <span className="text-secondary">{productiveScore}%</span>
                  </div>
                  <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden p-0.5 border border-white/5">
                    <div className="h-full bg-secondary rounded-full shadow-[0_0_15px_rgba(168,85,247,0.4)] transition-all duration-1000" style={{ width: `${productiveScore}%` }} />
                  </div>
                </div>
              </div>
            </div>
            
            <div className="mt-auto pt-10 border-t border-glass-border relative z-10">
              <div className="p-4 bg-primary/5 border border-primary/20 rounded-2xl flex items-center justify-between group-hover:bg-primary/10 transition-colors">
                <div className="flex items-center gap-3">
                  <Timer size={18} className="text-primary" />
                  <span className="text-xs font-black uppercase tracking-widest text-foreground/60">Next Cycle: 14:00</span>
                </div>
                <ChevronRight size={14} className="text-foreground/40" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Overview;
