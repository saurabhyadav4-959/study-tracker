import React, { useState, useEffect, useMemo, useRef } from 'react';
import { 
  Zap, Clock, Layers, TrendingUp, 
  BarChart3, Target, Flame, Activity, Timer, ChevronRight, ChevronDown, Check
} from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import EmptyChart from '../components/EmptyChart';

const formatChartData = (logs: any[], timeframe: string) => {
  if (!logs || logs.length === 0) return [];
  if (timeframe === 'W') {
    const today = new Date();
    const day = today.getDay(); 
    const diff = today.getDate() - day + (day === 0 ? -6 : 1); 
    const monday = new Date(today.setDate(diff));
    monday.setHours(0,0,0,0);
    
    const weekLogs = logs.filter(l => new Date(l.date) >= monday);
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
    return logs.slice(-30).map(log => ({
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
  <div className={`glass-card p-8 border-2 border-glass-border glass-card-hover relative overflow-hidden group`}>
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

const ParentStudentMirror = () => {
  const [children, setChildren] = useState<any[]>([]);
  const [selectedId, setSelectedId] = useState<string>('');
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [scanLoading, setScanLoading] = useState(false);
  const [timeframe, setTimeframe] = useState('W');

  const [dropOpen, setDropOpen] = useState(false);
  const [dropPos, setDropPos] = useState({ top: 0, left: 0, width: 0 });
  const dropRef = useRef<HTMLDivElement>(null);
  const btnRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      const target = e.target as Node;
      if (
        dropRef.current && !dropRef.current.contains(target) &&
        btnRef.current && !btnRef.current.contains(target)
      ) setDropOpen(false);
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  const handleDropToggle = () => {
    if (btnRef.current) {
      const rect = btnRef.current.getBoundingClientRect();
      setDropPos({ top: rect.bottom + window.scrollY + 8, left: rect.left + window.scrollX, width: rect.width });
    }
    setDropOpen(p => !p);
  };

  useEffect(() => {
    fetchChildren();
  }, []);

  const fetchChildren = async () => {
    const user = JSON.parse(localStorage.getItem('systemhub_active_user') || '{}');
    try {
      const res = await fetch('/api/parent/children', {
        headers: { 'Authorization': `Bearer ${user.token}` }
      });
      const childrenData = await res.json();
      setChildren(childrenData);
      if (childrenData.length > 0) {
        setSelectedId(childrenData[0].id);
        performDeepScan(childrenData[0].id);
      }
    } catch (err) {
      console.error('Failed to fetch children', err);
    } finally {
      setLoading(false);
    }
  };

  const performDeepScan = async (childId: string) => {
    setScanLoading(true);
    const user = JSON.parse(localStorage.getItem('systemhub_active_user') || '{}');
    try {
      const res = await fetch(`/api/parent/child/${childId}`, {
        headers: { 'Authorization': `Bearer ${user.token}` }
      });
      const deepData = await res.json();
      // Ensure safe fallback structures
      if (!deepData.tasks) deepData.tasks = [];
      if (!deepData.skills) deepData.skills = [];
      if (!deepData.logs) deepData.logs = [];
      setData(deepData);
    } catch (err) {
      console.error('Deep scan failed', err);
    } finally {
      setScanLoading(false);
    }
  };

  if (loading) return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-rotate" />
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-1000">
      {/* Dynamic Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 border-b border-glass-border pb-8">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-xs font-black tracking-[0.3em] text-primary/60 uppercase">
            <Activity size={12} className="animate-pulse" />
            Supervisor Protocol active
          </div>
          <h1 className="text-5xl font-black tracking-tighter uppercase leading-tight text-foreground">Node Dashboard</h1>
          <p className="text-foreground/40 font-semibold tracking-wide">Select a student node to mirror their active dashboard and operations.</p>
        </div>
        
        <div className="flex gap-4">
          {/* Custom Fixed-position Dropdown */}
          <div className="relative">
            <button
              ref={btnRef}
              onClick={handleDropToggle}
              className="flex items-center gap-3 bg-background border border-glass-border rounded-xl px-5 py-4 text-[10px] font-black uppercase tracking-widest text-foreground hover:border-primary/40 transition-all cursor-pointer min-w-[220px]"
            >
              <span className="flex-1 text-left">
                {children.find((c: any) => c.id === selectedId)?.name?.toUpperCase() || 'SELECT STUDENT'}
              </span>
              <ChevronDown size={14} className={`text-foreground/30 transition-transform duration-300 ${dropOpen ? 'rotate-180' : ''}`} />
            </button>
          </div>

          {/* Portal-style fixed dropdown */}
          {dropOpen && (
            <div
              ref={dropRef}
              style={{ position: 'fixed', top: dropPos.top, left: dropPos.left, width: dropPos.width, zIndex: 9999 }}
              className="bg-background border border-glass-border rounded-xl overflow-hidden shadow-[0_20px_60px_rgba(0,0,0,0.5)]"
            >
              {children.length === 0 ? (
                <div className="px-4 py-4 text-[10px] font-black uppercase tracking-widest text-foreground/30 text-center">
                  No students linked
                </div>
              ) : (
                children.map((c: any) => (
                  <button
                    key={c.id}
                    onClick={() => {
                      setSelectedId(c.id);
                      performDeepScan(c.id);
                      setDropOpen(false);
                    }}
                    className={`w-full flex items-center justify-between px-4 py-3 text-[10px] font-black uppercase tracking-widest text-left transition-all hover:bg-primary/10 hover:text-primary ${
                      selectedId === c.id ? 'bg-primary/10 text-primary' : 'text-foreground/70'
                    }`}
                  >
                    <span>{c.name.toUpperCase()}</span>
                    {selectedId === c.id && <Check size={12} />}
                  </button>
                ))
              )}
            </div>
          )}
        </div>
      </div>

      {!data || scanLoading ? (
         <div className="flex flex-col items-center justify-center min-h-[40vh] space-y-6 text-center">
            <div className="w-16 h-16 bg-foreground/5 rounded-full flex items-center justify-center text-foreground/20 animate-pulse border-2 border-glass-border border-dashed">
               <Activity size={32} />
            </div>
            <p className="text-[10px] font-black uppercase tracking-[0.5em] text-foreground/40">Synchronizing Mirror Sequence...</p>
         </div>
      ) : (
        <MirrorDashboardView data={data} timeframe={timeframe} setTimeframe={setTimeframe} />
      )}
    </div>
  );
};

// Extracted exact visuals from Dashboard Layout
const MirrorDashboardView = ({ data, timeframe, setTimeframe }: { data: any, timeframe: string, setTimeframe: any }) => {
  const getActiveData = () => {
    // Generate mock activity logs if none exist but tasks are done, because parent data payload only sends actionLogs, not "activityLogs" yet. 
    // We map ActionLogs to ActivityLogs chart format
    const mockLogs = data.logs.map((log: any) => ({
      date: new Date(log.timestamp).toLocaleDateString('en-CA'),
      intensity: 1, 
      count: 1
    }));
    return formatChartData(mockLogs, timeframe);
  };

  const tasksDone = data.tasks.filter((t: any) => t.status === 'Done').length;
  const totalTasks = data.tasks.length;
  const skillsCount = data.skills.length;
  
  // Calculate scores
  const productiveScore = totalTasks > 0 ? Math.round((tasksDone / totalTasks) * 100) : 0;
  const focusMinutes = 0; // Pomodoro isn't saved in deepData yet in parent.js, fallback to 0 or mock
  const focusScore = Math.min(100, Math.round((focusMinutes / 300) * 100)); 
  const hasActivity = data.logs && data.logs.length > 0;

  return (
    <div className="space-y-12">
      {/* Primary Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard title="Productive Score" value={productiveScore} subtitle="/ 100" icon={TrendingUp} color="primary" trend={productiveScore > 0 ? 5 : 0} />
        <StatCard title="Total XP Points" value={data.profile.xp || 0} subtitle="pts" icon={Zap} color="secondary" />
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
                Action Node Timeline
              </h3>
              <div className="flex gap-2">
                {['W', 'M', 'Y'].map(t => (
                  <button 
                    key={t} 
                    onClick={() => setTimeframe(t)}
                    className={`px-4 py-1.5 rounded-lg text-xs font-black uppercase tracking-widest transition-all ${timeframe === t ? 'bg-primary text-white shadow-[0_0_15px_rgba(99,102,241,0.3)]' : 'bg-foreground/5 text-foreground/40 hover:bg-foreground/10'}`}
                  >
                    {t}
                  </button>
                ))}
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
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#ffffff05" vertical={false} />
                    <XAxis dataKey="name" stroke="#ffffff30" tick={{ fill: '#ffffff60', fontSize: 10, fontWeight: 900 }} tickLine={false} axisLine={false} />
                    <YAxis stroke="#ffffff30" tick={{ fill: '#ffffff60', fontSize: 10, fontWeight: 900 }} tickLine={false} axisLine={false} />
                    <Tooltip contentStyle={{ backgroundColor: 'var(--background)', borderColor: 'var(--glass-border)', borderRadius: '12px' }} itemStyle={{ color: 'var(--foreground)', fontWeight: 900 }} />
                    <Area type="monotone" dataKey="productive" stroke="#6366f1" strokeWidth={3} fillOpacity={1} fill="url(#colorProd)" />
                  </AreaChart>
                </ResponsiveContainer>
              ) : (
                <EmptyChart height="100%" />
              )}
            </div>
          </div>
        </div>

        {/* Biological Sync */}
        <div className="lg:col-span-1 border-2 border-glass-border glass-card p-10 h-full relative overflow-hidden flex flex-col group">
             <div className="absolute -top-12 -right-12 text-primary opacity-5 group-hover:opacity-10 transition-all duration-700">
              <Flame size={240} />
            </div>
            
            <h3 className="text-sm font-black uppercase tracking-[0.4em] text-primary mb-12 flex items-center gap-3">
              <Flame size={16} />
              Core Execution Status
            </h3>
            
            <div className="flex-1 flex flex-col justify-center items-center relative z-10 w-full mt-4">
              <div className="relative w-56 h-56">
                <svg className="w-full h-full -rotate-90 scale-110">
                  <circle cx="112" cy="112" r="90" fill="transparent" stroke="currentColor" strokeWidth="2" className="text-white/5" />
                  <circle 
                    cx="112" cy="112" r="90" fill="transparent" stroke="currentColor" strokeWidth="4" 
                    strokeDasharray={565} strokeDashoffset={565 * (1 - (productiveScore / 100))} 
                    className="text-primary transition-all duration-1000 shadow-[0_0_20px_rgba(99,102,241,0.5)]" 
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-6xl font-black text-foreground leading-none tracking-tighter">{productiveScore}<span className="text-xl text-foreground/40 font-bold ml-1">%</span></span>
                  <p className="text-[10px] uppercase tracking-[0.4em] font-black text-primary mt-4 animate-pulse">Sync Rate</p>
                </div>
              </div>
            </div>
            
            <div className="mt-auto pt-10 border-t border-glass-border relative z-10 mt-12 w-full text-center hover:bg-white/5 transition-colors p-4 rounded-xl cursor-not-allowed">
              <span className="text-xs uppercase tracking-widest font-black text-foreground/40">Read Only Mirror</span>
            </div>
        </div>
      </div>
    </div>
  );
};

export default ParentStudentMirror;
