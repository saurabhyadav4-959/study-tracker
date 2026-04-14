import React, { useState, useEffect } from 'react';
import { API_BASE_URL } from '../config';
import { 
  Zap, Clock, Target, Shield, Users, Search, 
  Activity, AlertCircle, TrendingUp, BarChart3,
  Calendar, Flame, ChevronRight, CheckCircle2,
  ArrowUpRight, ArrowDownRight, Layers
} from 'lucide-react';
import { 
  BarChart, Bar, ResponsiveContainer, XAxis, YAxis, 
  Tooltip, PieChart, Pie, Cell, LineChart, Line, CartesianGrid
} from 'recharts';

const COLORS = ['#6366f1', '#a855f7', '#10b981', '#f59e0b', '#ef4444'];

interface Milestone {
  _id: string;
  title: string;
  description: string;
  type: 'time' | 'tasks' | 'streak';
  targetValue: number;
  rewardBadge: string;
  status: 'active' | 'completed';
  progress: number;
}

interface ChildNode {
  id: string;
  name: string;
  email: string;
  studyMinutesToday: number;
  totalStudyTime: number;
  completedTasks: number;
  totalTasks: number;
  dailyGoalHours: number;
  streak: number;
  latestSubject: string;
  alerts: any[];
  milestones?: Milestone[];
}

const ParentDashboard = () => {
  const [children, setChildren] = useState<ChildNode[]>([]);
  const [studentCode, setStudentCode] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [milestoneForm, setMilestoneForm] = useState({
    childId: '',
    title: '',
    description: '',
    type: 'tasks' as 'time' | 'tasks' | 'streak',
    targetValue: 0,
    rewardBadge: '🏅 Neural Pioneer'
  });
  const [isMilestoneModalOpen, setIsMilestoneModalOpen] = useState(false);

  const fetchChildren = async () => {
    const user = JSON.parse(localStorage.getItem('systemhub_active_user') || '{}');
    if (!user.token) return setLoading(false);
    
    try {
      const res = await fetch(`${API_BASE_URL}/api/parent/children`, {
        headers: { 'Authorization': `Bearer ${user.token}` }
      });
      
      const data = await res.json();
      if (Array.isArray(data)) {
        setChildren(data);
      } else {
        setChildren([]);
        if (res.status === 401) {
          setError('SESSION CORRUPTED: RE-AUTHORIZATION REQUIRED');
        }
      }
    } catch (err) {
      console.error('Failed to fetch children', err);
      setChildren([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchChildren();
  }, []);

  const handleLink = async (e: React.FormEvent) => {
    e.preventDefault();
    const user = JSON.parse(localStorage.getItem('systemhub_active_user') || '{}');
    try {
      const res = await fetch(`${API_BASE_URL}/api/parent/link`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${user.token}` },
        body: JSON.stringify({ studentCode: studentCode.trim() })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'LINKAGE FAILED');
      setStudentCode('');
      fetchChildren();
    } catch (err: any) {
      setError(err.message.toUpperCase());
    }
  };

  const updateGoal = async (studentId: string, hours: number) => {
    const user = JSON.parse(localStorage.getItem('systemhub_active_user') || '{}');
    await fetch(`${API_BASE_URL}/api/parent/set-goal`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${user.token}` },
      body: JSON.stringify({ studentId, dailyGoalHours: hours })
    });
    fetchChildren();
  };

  const handleUnlink = async (studentId: string) => {
    if (!window.confirm('SEVER NEURAL LINK? ALL TRACKING DATA FOR THIS NODE WILL BE DISCONNECTED.' )) return;
    const user = JSON.parse(localStorage.getItem('systemhub_active_user') || '{}');
    try {
      const res = await fetch(`${API_BASE_URL}/api/parent/link/${studentId}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${user.token}` }
      });
      if (res.ok) fetchChildren();
    } catch (err) {
      console.error('Divergence failed', err);
    }
  };

  const handleCreateMilestone = async (e: React.FormEvent) => {
    e.preventDefault();
    const user = JSON.parse(localStorage.getItem('systemhub_active_user') || '{}');
    try {
      const res = await fetch(`${API_BASE_URL}/api/milestones`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${user.token}` },
        body: JSON.stringify(milestoneForm)
      });
      if (res.ok) {
        setIsMilestoneModalOpen(false);
        setMilestoneForm({ ...milestoneForm, title: '', description: '', targetValue: 0 });
        fetchChildren();
      }
    } catch (err) {
      console.error('Milestone deployment failed', err);
    }
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center"><div className="w-10 h-10 border-4 border-primary/20 border-t-primary rounded-full animate-rotate" /></div>;

  const totalAggregatedTime = children.reduce((acc, c) => acc + (c.studyMinutesToday || 0), 0);
  const totalTasksDone = children.reduce((acc, c) => acc + (c.completedTasks || 0), 0);
  const totalTasksPending = children.reduce((acc, c) => acc + ((c.totalTasks || 0) - (c.completedTasks || 0)), 0);
  const globalAlerts = children.flatMap(c => (c.alerts || []).map(a => ({ ...a, childName: c.name || 'Unknown Node' })));

  return (
    <div className="max-w-7xl mx-auto space-y-10 animate-in fade-in duration-700">
      {/* 1. Header & Quick Summary */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-6 border-b border-glass-border pb-8 text-foreground">
        <div>
           <div className="flex items-center gap-2 text-[10px] font-black tracking-[0.3em] text-primary/60 uppercase mb-2">
             <Shield size={12} /> Supervisor Hub • v0.2
           </div>
           <h1 className="text-5xl font-black tracking-tighter uppercase italic">Control<span className="text-primary">Center</span></h1>
           <p className="text-foreground/40 font-semibold mt-2">One screen. Full summary. Real-time tactical diagnostics.</p>
           <button 
             onClick={() => setIsMilestoneModalOpen(true)}
             className="mt-6 flex items-center gap-3 px-6 py-3 bg-primary/10 border border-primary/20 rounded-xl text-primary text-[10px] font-black uppercase tracking-widest hover:bg-primary hover:text-white transition-all active:scale-95"
           >
              <Target size={14} /> Deploy Strategic Milestone
           </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 w-full lg:w-auto">
          {[
            { label: 'System Time', val: `${Math.round(totalAggregatedTime/60)}h`, icon: Clock, color: 'text-primary' },
            { label: 'Task Load', val: totalTasksPending, icon: Target, color: 'text-secondary' },
            { label: 'Avg Streak', val: `${Math.round(children.reduce((acc,c) => acc + c.streak, 0)/children.length || 0)}d`, icon: Flame, color: 'text-orange-500' },
            { label: 'Active Nodes', val: children.length, icon: Users, color: 'text-green-500' },
          ].map((stat, i) => (
            <div key={i} className="glass-card px-5 py-3 border border-glass-border flex flex-col justify-center">
              <span className="text-[8px] font-black uppercase tracking-widest text-foreground/30 flex items-center gap-1">
                <stat.icon size={8} className={stat.color} /> {stat.label}
              </span>
              <span className="text-xl font-black">{stat.val}</span>
            </div>
          ))}
        </div>
      </div>

      {/* 2. Alert Hub (CRITICAL) */}
      {globalAlerts.length > 0 && (
        <div className="space-y-3">
          <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-red-500/60 px-2 flex items-center gap-2">
            <AlertCircle size={14} /> Critical System Alerts
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {globalAlerts.map((alert, i) => (
              <div key={i} className={`p-4 rounded-2xl border-2 flex items-center gap-4 animate-pulse-slow ${alert.type === 'CRITICAL' ? 'bg-red-500/10 border-red-500/20 text-red-500' : 'bg-yellow-500/10 border-yellow-500/20 text-yellow-500'}`}>
                <div className="w-10 h-10 rounded-xl bg-current opacity-10 flex items-center justify-center">
                   <AlertCircle size={20} />
                </div>
                <div>
                   <p className="text-[10px] font-black uppercase tracking-widest leading-none mb-1">{alert.childName}</p>
                   <p className="text-[11px] font-bold leading-tight">{alert.message}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 3. Student Nodes (THE CORE) */}
      <div className="space-y-6">
        <div className="flex justify-between items-center px-2">
           <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-foreground/40 flex items-center gap-2">
             <Activity size={14} /> Active Node Matrix
           </h3>
           <form onSubmit={handleLink} className="flex gap-3 relative z-20 items-stretch h-14">
              <div className="relative flex-1 min-w-[280px]">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-primary/40" size={16} />
                <input 
                  value={studentCode}
                  onChange={(e) => setStudentCode(e.target.value)}
                  placeholder="ENTER STUDENT UNIQUE ID (E.G. STU-XXXXX)" 
                  className="w-full h-full bg-background border-2 border-glass-border rounded-2xl pl-12 pr-6 text-[10px] font-black uppercase tracking-widest outline-none focus:border-primary/40 focus:bg-foreground/5 transition-all cursor-text placeholder:text-foreground/20 text-foreground" 
                />
              </div>
              <button 
                type="submit"
                disabled={!studentCode}
                className="bg-primary hover:bg-primary/80 text-white px-8 rounded-2xl flex items-center gap-3 transition-all active:scale-95 disabled:opacity-30 disabled:pointer-events-none group shadow-[0_10px_30px_rgba(99,102,241,0.2)] hover:shadow-[0_15px_40px_rgba(99,102,241,0.4)]"
              >
                <Users size={18} className="group-hover:scale-110 transition-transform" />
                <span className="text-[10px] font-black uppercase tracking-[0.2em] whitespace-nowrap">Connect Node</span>
              </button>
           </form>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {children.map(child => {
            const progress = child.dailyGoalHours ? (child.studyMinutesToday / (child.dailyGoalHours * 60)) * 100 : 0;
            const validProgress = isNaN(progress) || !isFinite(progress) ? 0 : progress;
            const isGoalMet = validProgress >= 100;

            return (
              <div key={child.id} className="glass-card p-8 border-2 border-glass-border group relative overflow-hidden">
                <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-all pointer-events-none">
                   <Zap size={150} />
                </div>
                
                <div className="flex justify-between items-start relative z-10 mb-8">
                   <div className="space-y-1">
                      <div className="flex items-center gap-2">
                         <h4 className="text-3xl font-black tracking-tighter uppercase italic">{child.name}</h4>
                         <div className={`px-2 py-0.5 rounded text-[8px] font-black uppercase ${child.streak > 7 ? 'bg-orange-500/10 text-orange-500' : 'bg-foreground/5 text-foreground/40'}`}>
                           {child.streak} DAY STREAK
                         </div>
                      </div>
                      <p className="text-[10px] font-black text-foreground/30 uppercase tracking-[0.2em]">{child.email}</p>
                   </div>
                   <div className="text-right">
                      <div className="flex items-center justify-end gap-2 mb-1">
                        <span className="text-[9px] font-black text-foreground/40 uppercase">Daily Goal:</span>
                        <input 
                          type="number"
                          value={child.dailyGoalHours || 0}
                          onChange={(e) => updateGoal(child.id, parseInt(e.target.value) || 0)}
                          className="w-12 bg-background border border-glass-border rounded px-2 py-1 text-[10px] font-black text-center text-foreground outline-none focus:border-primary/50"
                        />
                        <span className="text-[9px] font-black text-foreground/40 uppercase">HRS</span>
                      </div>
                      <p className="text-xl font-black text-primary">{Math.round(child.studyMinutesToday)} <span className="text-xs italic opacity-30">MIN TODAY</span></p>
                   </div>
                </div>

                {/* Progress toward Goal */}
                <div className="space-y-3 mb-8 relative z-10">
                   <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest">
                      <span>Goal Progress</span>
                      <span className={isGoalMet ? 'text-green-500' : 'text-primary'}>{Math.round(validProgress)}%</span>
                   </div>
                   <div className="h-4 w-full bg-foreground/5 rounded-full overflow-hidden p-0.5 border border-glass-border">
                      <div 
                        className={`h-full rounded-full transition-all duration-1000 ${isGoalMet ? 'bg-green-500 shadow-[0_0_20px_rgba(34,197,94,0.4)]' : 'bg-primary'}`} 
                        style={{ width: `${Math.min(100, Math.max(0, validProgress))}%` }} 
                      />
                   </div>
                </div>

                {/* Tactical Stats */}
                <div className="grid grid-cols-3 gap-4 border-t border-glass-border pt-6">
                   <div className="text-center">
                      <p className="text-[8px] font-black text-foreground/30 uppercase tracking-widest mb-1">Status</p>
                      <p className={`text-[10px] font-black uppercase ${child.alerts && child.alerts.length > 0 ? 'text-red-500' : 'text-green-500'}`}>
                        {child.alerts && child.alerts.length > 0 ? 'NEEDS ATTENTION' : 'CORE STABLE'}
                      </p>
                   </div>
                   <div className="text-center">
                      <p className="text-[8px] font-black text-foreground/30 uppercase tracking-widest mb-1">Last Log</p>
                      <p className="text-[10px] font-black text-foreground line-clamp-1 uppercase">{child.latestSubject || 'None'}</p>
                   </div>
                   <div className="text-center">
                      <p className="text-[8px] font-black text-foreground/30 uppercase tracking-widest mb-1">Tasks</p>
                      <p className="text-[10px] font-black text-foreground uppercase">{child.completedTasks || 0}/{child.totalTasks || 0}</p>
                   </div>
                </div>

                {/* Active Milestones Section */}
                {child.milestones && child.milestones.length > 0 && (
                  <div className="mt-8 space-y-4 relative z-10 p-4 bg-primary/5 rounded-2xl border border-primary/10">
                     <h5 className="text-[9px] font-black uppercase tracking-[0.3em] text-primary flex items-center gap-2">
                       <Target size={12} /> Active Strategic Objectives
                     </h5>
                     <div className="space-y-3">
                       {child.milestones.map(m => (
                         <div key={m._id} className="flex justify-between items-center bg-background/50 p-3 rounded-xl border border-glass-border">
                           <div>
                              <p className="text-[10px] font-black uppercase">{m.title}</p>
                              <p className="text-[8px] font-bold text-foreground/40 uppercase tracking-widest">{m.rewardBadge}</p>
                           </div>
                           <div className={`px-3 py-1 rounded-lg text-[9px] font-black uppercase ${m.status === 'completed' ? 'bg-green-500/20 text-green-500' : 'bg-primary/20 text-primary'}`}>
                              {m.status}
                           </div>
                         </div>
                       ))}
                     </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* 4. Connected Node Registry (Management UI) */}
      <div className="space-y-6">
        <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-foreground/40 flex items-center gap-2 px-2">
          <Layers size={14} /> Node Management Registry
        </h3>
        <div className="glass-card overflow-hidden border-2 border-glass-border">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-white/5 border-b border-glass-border">
                <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-foreground/40">Operational Node</th>
                <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-foreground/40">Neural Link ID</th>
                <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-foreground/40 text-right">Operational Status</th>
              </tr>
            </thead>
            <tbody>
              {children.map(child => (
                <tr key={child.id} className="border-b border-glass-border hover:bg-white/[0.02] transition-colors group">
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary font-black uppercase">
                        {(child.name || 'U').charAt(0)}
                      </div>
                      <div>
                        <p className="text-sm font-black uppercase">{child.name || 'Unknown'}</p>
                        <p className="text-[10px] font-bold text-foreground/30">{child.email || 'NO EMAIL CONNECTED'}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <span className="px-3 py-1 bg-foreground/5 rounded-lg text-[10px] font-black tracking-widest text-foreground/50 border border-glass-border">
                      {child.id}
                    </span>
                  </td>
                  <td className="px-8 py-6 text-right">
                    <button 
                      onClick={() => handleUnlink(child.id)}
                      className="px-6 py-2 bg-red-500/10 hover:bg-red-500 text-red-500 hover:text-white border border-red-500/20 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all active:scale-95"
                    >
                      Sever Link
                    </button>
                  </td>
                </tr>
              ))}
              {children.length === 0 && (
                <tr>
                  <td colSpan={3} className="px-8 py-20 text-center">
                    <p className="text-[10px] font-black uppercase tracking-[0.5em] text-foreground/20 italic">No Active Student Nodes Detected</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* 5. Strategic Reports (Simplified - EXACTLY 2) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 pt-6">
         <div className="glass-card p-10 border-2 border-glass-border">
            <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-primary mb-10 flex items-center gap-3 italic">
              <BarChart3 size={16} /> 01 • Weekly Capacity Sync
            </h3>
            <div className="h-64">
               <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={children}>
                     <XAxis dataKey="name" stroke="currentColor" strokeOpacity={0.1} tick={{ fontSize: 10, fontWeight: 900 }} />
                     <YAxis hide />
                     <Tooltip 
                       contentStyle={{ backgroundColor: 'var(--background)', borderColor: 'var(--glass-border)', borderRadius: '12px' }}
                       itemStyle={{ color: 'var(--primary)', textTransform: 'uppercase', fontWeight: 900, fontSize: '10px' }}
                     />
                     <Bar dataKey="totalStudyTime" fill="var(--primary)" radius={[8, 8, 0, 0]} barSize={40} />
                  </BarChart>
               </ResponsiveContainer>
            </div>
         </div>

         <div className="glass-card p-10 border-2 border-glass-border">
            <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-secondary mb-10 flex items-center gap-3 italic">
              <TrendingUp size={16} /> 02 • Global Task Distribution
            </h3>
            <div className="h-64">
               <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                     <Pie
                       data={children}
                       dataKey="completedTasks"
                       nameKey="name"
                       cx="50%"
                       cy="50%"
                       innerRadius={60}
                       outerRadius={90}
                     >
                        {children.map((_, index) => <Cell key={index} fill={COLORS[index % COLORS.length]} stroke="none" />)}
                     </Pie>
                     <Tooltip 
                       contentStyle={{ backgroundColor: 'var(--background)', borderColor: 'var(--glass-border)', borderRadius: '12px' }}
                       itemStyle={{ textTransform: 'uppercase', fontWeight: 900, fontSize: '10px' }}
                     />
                  </PieChart>
               </ResponsiveContainer>
            </div>
         </div>

         {/* 6. Milestone Deployment Modal */}
         {isMilestoneModalOpen && (
           <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/80 backdrop-blur-md text-white">
             <div className="glass-card w-full max-w-2xl p-10 border-2 border-primary/20 animate-in zoom-in duration-300 relative overflow-hidden bg-background">
                <div className="absolute top-0 right-0 p-12 opacity-5 pointer-events-none text-primary">
                   <Target size={200} />
                </div>
               <div className="flex justify-between items-center mb-10 relative z-10">
                 <h3 className="text-3xl font-black uppercase italic tracking-tighter">Deploy <span className="text-primary">Milestone</span></h3>
                 <button onClick={() => setIsMilestoneModalOpen(false)} className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center hover:bg-white/10 transition-colors">
                    <Shield size={20} className="text-foreground/40" />
                 </button>
               </div>

               <form onSubmit={handleCreateMilestone} className="space-y-6 relative z-10">
                 <div className="grid grid-cols-2 gap-6">
                   <div className="space-y-2">
                     <label className="text-[10px] font-black uppercase tracking-widest text-foreground/40">Target Node</label>
                     <select 
                       value={milestoneForm.childId}
                       onChange={(e) => setMilestoneForm({...milestoneForm, childId: e.target.value})}
                       className="w-full bg-background border border-glass-border p-4 rounded-xl text-xs font-black uppercase outline-none focus:border-primary/50 text-foreground"
                     >
                       <option value="">SELECT STUDENT</option>
                       {children.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                     </select>
                   </div>
                   <div className="space-y-2">
                     <label className="text-[10px] font-black uppercase tracking-widest text-foreground/40">Protocol Type</label>
                     <select 
                       value={milestoneForm.type}
                       onChange={(e) => setMilestoneForm({...milestoneForm, type: e.target.value as any})}
                       className="w-full bg-background border border-glass-border p-4 rounded-xl text-xs font-black uppercase outline-none focus:border-primary/50 text-foreground"
                     >
                       <option value="tasks">TASK COMPLETION</option>
                       <option value="time">STUDY CAPACITY (MIN)</option>
                       <option value="streak">CONSISTENCY STREAK</option>
                     </select>
                   </div>
                 </div>

                 <div className="space-y-2">
                   <label className="text-[10px] font-black uppercase tracking-widest text-foreground/40">Objective Title</label>
                   <input 
                     required
                     value={milestoneForm.title}
                     onChange={(e) => setMilestoneForm({...milestoneForm, title: e.target.value})}
                     placeholder="E.G. NEURAL MASTERY: PHYSICS"
                     className="w-full bg-background border border-glass-border p-4 rounded-xl text-xs font-black uppercase outline-none focus:border-primary/50 text-foreground"
                   />
                 </div>

                 <div className="grid grid-cols-2 gap-6">
                   <div className="space-y-2">
                     <label className="text-[10px] font-black uppercase tracking-widest text-foreground/40">Target Value</label>
                     <input 
                       type="number"
                       required
                       value={milestoneForm.targetValue}
                       onChange={(e) => setMilestoneForm({...milestoneForm, targetValue: parseInt(e.target.value) || 0})}
                       className="w-full bg-background border border-glass-border p-4 rounded-xl text-xs font-black uppercase outline-none focus:border-primary/50 text-foreground"
                     />
                   </div>
                   <div className="space-y-2">
                     <label className="text-[10px] font-black uppercase tracking-widest text-foreground/40">Reward Badge</label>
                     <select 
                       value={milestoneForm.rewardBadge}
                       onChange={(e) => setMilestoneForm({...milestoneForm, rewardBadge: e.target.value})}
                       className="w-full bg-background border border-glass-border p-4 rounded-xl text-xs font-black uppercase outline-none focus:border-primary/50 text-foreground"
                     >
                       <option value="🏅 Neural Pioneer">NEURAL PIONEER</option>
                       <option value="⚡ Speed Demon">SPEED DEMON</option>
                       <option value="🧠 Alpha Thinker">ALPHA THINKER</option>
                       <option value="🔥 Consistency King">CONSISTENCY KING</option>
                     </select>
                   </div>
                 </div>

                 <button 
                   type="submit"
                   disabled={!milestoneForm.childId || !milestoneForm.title}
                   className="w-full py-6 bg-primary text-white font-black uppercase tracking-[0.4em] text-[10px] rounded-2xl shadow-lg hover:shadow-primary/20 transition-all active:scale-95 disabled:opacity-30 mt-6"
                 >
                   Deploy Strategic Objective
                 </button>
               </form>
             </div>
           </div>
         )}
      </div>
    </div>
  );
};

export default ParentDashboard;
