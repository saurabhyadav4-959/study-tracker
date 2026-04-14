import React, { useState, useEffect } from 'react';
import { API_BASE_URL } from '../config';
import { 
  Zap, Clock, Target, Shield, ChevronLeft, 
  Activity, Rocket, BookOpen, Layers, Search,
  AlertCircle, MessageSquare, TrendingUp
} from 'lucide-react';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, 
  Tooltip, ResponsiveContainer, BarChart, Bar 
} from 'recharts';
import { AcademicTask, Skill, ActionLog } from '../types';

interface ChildProfile {
  id: string;
  name: string;
  email: string;
  xp: number;
  level: number;
}

interface DeepScanData {
  profile: ChildProfile;
  tasks: AcademicTask[];
  skills: Skill[];
  logs: ActionLog[];
}

const ParentInsight = () => {
  const [children, setChildren] = useState<any[]>([]);
  const [selectedId, setSelectedId] = useState<string>('');
  const [data, setData] = useState<DeepScanData | null>(null);
  const [loading, setLoading] = useState(true);
  const [scanLoading, setScanLoading] = useState(false);

  useEffect(() => {
    fetchChildren();
  }, []);

  const fetchChildren = async () => {
    const user = JSON.parse(localStorage.getItem('systemhub_active_user') || '{}');
    try {
      const res = await fetch(`${API_BASE_URL}/api/parent/children`, {
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
      const res = await fetch(`${API_BASE_URL}/api/parent/child/${childId}`, {
        headers: { 'Authorization': `Bearer ${user.token}` }
      });
      const deepData = await res.json();
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
    <div className="max-w-7xl mx-auto space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-1200">
      {/* Search & Selector */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 border-b border-glass-border pb-8">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-xs font-black tracking-[0.3em] text-secondary/60 uppercase">
            <Rocket size={12} className="animate-pulse" />
            Insight Engine • Selective Deep Scan
          </div>
          <h1 className="text-5xl font-black tracking-tighter uppercase leading-tight italic text-foreground">
            Node<span className="text-primary">Intelligence</span>
          </h1>
          <p className="text-foreground/40 font-semibold tracking-wide">Detailed diagnostic audit of student neural evolution and academic stability.</p>
        </div>

        <div className="flex gap-4">
          <div className="relative group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-foreground/20 group-focus-within:text-primary transition-colors" size={16} />
            <select 
              value={selectedId}
              onChange={(e) => {
                setSelectedId(e.target.value);
                performDeepScan(e.target.value);
              }}
              className="bg-foreground/5 border border-glass-border rounded-xl pl-12 pr-10 py-4 text-[10px] font-black uppercase tracking-widest text-foreground outline-none hover:bg-foreground/10 transition-all appearance-none cursor-pointer"
            >
              {children.map(c => <option key={c.id} value={c.id}>{c.name.toUpperCase()}</option>)}
            </select>
          </div>
        </div>
      </div>

      {data && !scanLoading ? (
        <div className="space-y-12">
          {/* Node Summary */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
             <div className="glass-card p-8 border-2 border-primary/20 bg-primary/5">
                <p className="text-[10px] font-black uppercase tracking-widest text-primary/60 mb-4 flex items-center gap-2">
                   <Target size={12} /> Sync Status
                </p>
                <h3 className="text-3xl font-black text-foreground uppercase italic">{data.profile.name}</h3>
                <p className="text-[10px] font-black text-foreground/40 mt-1 uppercase tracking-widest leading-none">ID: {data.profile.id.substring(0,12)}</p>
             </div>
             <div className="glass-card p-8 border-2 border-glass-border">
                <p className="text-[10px] font-black uppercase tracking-widest text-foreground/40 mb-4">Neural XP</p>
                <h3 className="text-3xl font-black text-foreground">{data.profile.xp} <span className="text-sm font-bold opacity-30 italic">PTS</span></h3>
             </div>
             <div className="glass-card p-8 border-2 border-glass-border">
                <p className="text-[10px] font-black uppercase tracking-widest text-foreground/40 mb-4">Evolution Stage</p>
                <h3 className="text-3xl font-black text-foreground">LEVEL {data.profile.level}</h3>
             </div>
             <div className="glass-card p-8 border-2 border-glass-border">
                <p className="text-[10px] font-black uppercase tracking-widest text-foreground/40 mb-4">Core Objectives</p>
                <h3 className="text-3xl font-black text-foreground">{data.tasks.filter(t => t.status === 'Done').length}/{data.tasks.length}</h3>
             </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {/* Skill Matrix */}
            <div className="lg:col-span-2 space-y-8">
               <h3 className="text-sm font-black uppercase tracking-[0.4em] text-primary px-2 flex items-center gap-3">
                 <Layers size={16} />
                 Skill Evolution Tracks
               </h3>
               
               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                 {data.skills && data.skills.length > 0 ? data.skills.map((skill) => (
                    <div key={skill.id} className="glass-card p-6 border-2 border-glass-border group hover:border-primary/40 transition-all duration-500">
                      <div className="flex justify-between items-start mb-6">
                        <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
                          <Rocket size={20} />
                        </div>
                        <div className="text-right">
                          <p className="text-[10px] font-black text-primary uppercase tracking-widest">{skill.progress}% SYNC</p>
                          <h4 className="text-xl font-black text-foreground uppercase tracking-tighter">{skill.name}</h4>
                        </div>
                      </div>
                      <div className="h-2 w-full bg-foreground/5 rounded-full overflow-hidden border border-glass-border">
                        <div 
                          className="h-full bg-primary transition-all duration-1000" 
                          style={{ width: `${skill.progress}%` }} 
                        />
                      </div>
                      <div className="flex justify-between items-center mt-3">
                        <span className="text-[9px] font-black text-foreground/30 uppercase tracking-widest">{skill.category}</span>
                        <span className="text-[9px] font-black text-foreground italic uppercase tracking-widest">{skill.streak} DAY STREAK</span>
                      </div>
                    </div>
                 )) : (
                    <div className="col-span-2 py-20 text-center border-2 border-dashed border-glass-border rounded-3xl">
                       <p className="text-[10px] font-black uppercase tracking-widest text-foreground/20">No active skill nodes detected for this operator.</p>
                    </div>
                 )}
               </div>

               {/* Activity Log Feed */}
               <h3 className="text-sm font-black uppercase tracking-[0.4em] text-secondary px-2 pt-8 flex items-center gap-3">
                 <Activity size={16} />
                 Real-time Neural Logs
               </h3>
               <div className="glass-card border-2 border-glass-border overflow-hidden">
                  <table className="w-full text-left">
                    <thead>
                      <tr className="border-b border-glass-border bg-foreground/[0.02]">
                        <th className="px-6 py-4 text-[9px] font-black uppercase tracking-widest text-foreground/40">Timestamp</th>
                        <th className="px-6 py-4 text-[9px] font-black uppercase tracking-widest text-foreground/40">Protocol</th>
                        <th className="px-6 py-4 text-[9px] font-black uppercase tracking-widest text-foreground/40">Diagnostic Meta</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-glass-border">
                      {data.logs.map((log, i) => (
                        <tr key={i} className="hover:bg-foreground/5 transition-all">
                          <td className="px-6 py-4">
                            <p className="text-[9px] font-black leading-none text-foreground">{new Date(log.timestamp).toLocaleDateString()}</p>
                            <p className="text-[7px] font-bold text-foreground/30 uppercase mt-1">{new Date(log.timestamp).toLocaleTimeString()}</p>
                          </td>
                          <td className="px-6 py-4">
                            <span className="px-2 py-0.5 bg-secondary/10 text-secondary border border-secondary/20 rounded text-[7px] font-black tracking-widest uppercase">
                              {log.actionType}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-[10px] font-semibold text-foreground/60">{log.description}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
               </div>
            </div>

            {/* Strategic Intervention */}
            <div className="space-y-8">
               <h3 className="text-sm font-black uppercase tracking-[0.4em] text-foreground/40 px-2 flex items-center gap-3">
                 <MessageSquare size={16} />
                 Supervisor Directives
               </h3>
               
               <div className="glass-card p-8 border-2 border-glass-border space-y-6">
                  <div className="p-4 bg-primary/5 border border-primary/20 rounded-2xl flex gap-4">
                    <AlertCircle size={20} className="text-primary shrink-0" />
                    <p className="text-[10px] font-semibold text-foreground/60 leading-relaxed italic">
                      Strategic diagnostics indicate {data.tasks.filter(t => t.status === 'Todo').length} pending objectives. Recommendations: Assign mandatory deep work cycle.
                    </p>
                  </div>

                  <div className="space-y-4 pt-4">
                     <div className="space-y-2">
                        <label className="text-[9px] font-black uppercase tracking-widest text-foreground/40 ml-1 italic">Inject Neural Remark</label>
                        <input 
                          onKeyDown={async (e) => {
                            if (e.key === 'Enter') {
                              const val = (e.target as HTMLInputElement).value;
                              if (!val) return;
                              const user = JSON.parse(localStorage.getItem('systemhub_active_user') || '{}');
                              await fetch(`${API_BASE_URL}/api/logs`, {
                                method: 'POST',
                                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${user.token}` },
                                body: JSON.stringify({ actionType: 'SUPERVISOR_REMARK', description: `[SUPERVISOR INSIGHT]: ${val}`, studentId: data.profile.id })
                              });
                              alert('INSIGHT INJECTED INTO NODE FEED');
                              (e.target as HTMLInputElement).value = '';
                              performDeepScan(data.profile.id);
                            }
                          }}
                          placeholder="TYPE REMARK & ENTER..." 
                          className="w-full bg-foreground/5 border border-glass-border rounded-xl px-5 py-4 text-[10px] font-black uppercase tracking-widest outline-none focus:border-primary placeholder:text-foreground/10 text-foreground" 
                        />
                     </div>

                     <div className="space-y-2 pt-6">
                        <label className="text-[9px] font-black uppercase tracking-widest text-foreground/40 ml-1 italic">Assign Strategic Objective</label>
                        <div className="p-6 bg-foreground/5 border border-glass-border rounded-2xl space-y-4">
                           <input 
                             id="task-title"
                             placeholder="OBJECTIVE TITLE" 
                             className="w-full bg-transparent border-b border-glass-border text-[10px] font-black uppercase tracking-widest outline-none focus:border-primary py-2 placeholder:text-foreground/10" 
                           />
                           <button 
                             onClick={async () => {
                               const title = (document.getElementById('task-title') as HTMLInputElement).value;
                               if (!title) return;
                               const user = JSON.parse(localStorage.getItem('systemhub_active_user') || '{}');
                               await fetch(`${API_BASE_URL}/api/parent/assign-task`, {
                                 method: 'POST',
                                 headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${user.token}` },
                                 body: JSON.stringify({ studentId: data.profile.id, title, priority: 'High' })
                               });
                               alert('STRATEGIC OBJECTIVE ASSIGNED');
                               (document.getElementById('task-title') as HTMLInputElement).value = '';
                               performDeepScan(data.profile.id);
                             }}
                             className="w-full py-4 bg-primary text-white font-black uppercase tracking-widest text-[9px] rounded-xl shadow-lg hover:shadow-primary/30 transition-all active:scale-95"
                           >
                              Synthesize Directive
                           </button>
                        </div>
                     </div>
                  </div>
               </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center min-h-[40vh] space-y-6 text-center">
           <div className="w-16 h-16 bg-foreground/5 rounded-full flex items-center justify-center text-foreground/20 animate-pulse border-2 border-glass-border border-dashed">
              <Shield size={32} />
           </div>
           <div>
              <p className="text-[10px] font-black uppercase tracking-[0.5em] text-foreground/40">Initializing neural scan sequence...</p>
              <p className="text-[8px] font-bold text-foreground/20 uppercase tracking-widest mt-2 px-12 max-w-sm">Divergence detected. Synchronizing hub with student node diagnostics.</p>
           </div>
        </div>
      )}
    </div>
  );
};

export default ParentInsight;
