import React, { useState, useEffect } from 'react';
import { 
  Zap, Clock, Target, Shield, Download, Filter, 
  TrendingUp, Activity, AlertCircle, CheckCircle2,
  FileText, Info
} from 'lucide-react';
import { ChildSummary, PerformanceInsights, ActionLog } from '../types';

const PerformanceAnalysis = () => {
  const [children, setChildren] = useState<ChildSummary[]>([]);
  const [filteredLogs, setFilteredLogs] = useState<ActionLog[]>([]);
  const [selectedChild, setSelectedChild] = useState<string>('all');
  const [dateRange, setDateRange] = useState<string>('week');
  const [loading, setLoading] = useState(true);

  const fetchPerformance = async () => {
    const user = JSON.parse(localStorage.getItem('systemhub_active_user') || '{}');
    try {
      const res = await fetch('/api/parent/children', {
        headers: { 'Authorization': `Bearer ${user.token}` }
      });
      const data = await res.json();
      setChildren(data);

      const logsRes = await fetch(`/api/logs?studentId=${selectedChild === 'all' ? '' : selectedChild}`, {
        headers: { 'Authorization': `Bearer ${user.token}` }
      });
      const logsData = await logsRes.json();
      setFilteredLogs(logsData);
    } catch (err) {
      console.error('Performance fetch error', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPerformance();
  }, [selectedChild, dateRange]);

  const exportToCSV = () => {
    const headers = ['Timestamp', 'Node', 'Action', 'Description', 'Time (Min)'];
    const rows = filteredLogs.map(log => [
      new Date(log.timestamp).toLocaleString(),
      children.find(c => c.id === log.userId)?.name || 'Unknown',
      log.actionType,
      log.description,
      log.timeSpent || 0
    ]);

    const csvContent = [headers, ...rows].map(e => e.join(",")).join("\n");
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `neural_performance_v02_${new Date().toLocaleDateString()}.csv`;
    a.click();
  };

  const getStatusIndicator = (completionRate: number) => {
    if (completionRate >= 80) return { color: 'text-green-500', bg: 'bg-green-500/10', border: 'border-green-500/20', label: 'OPTIMAL' };
    if (completionRate >= 40) return { color: 'text-yellow-500', bg: 'bg-yellow-500/10', border: 'border-yellow-500/20', label: 'STABLE' };
    return { color: 'text-red-500', bg: 'bg-red-500/10', border: 'border-red-500/20', label: 'CRITICAL' };
  };

  const insights: PerformanceInsights = {
    mostActive: children.sort((a,b) => b.totalStudyTime - a.totalStudyTime)[0]?.name || '---',
    leastActive: children.sort((a,b) => a.totalStudyTime - b.totalStudyTime)[0]?.name || '---',
    avgStudyTime: children.length > 0 ? Math.round(children.reduce((acc,c) => acc + c.totalStudyTime, 0) / children.length) : 0,
    overallCompletionRate: children.length > 0 ? Math.round((children.reduce((acc,c) => acc + (c.completedTasks/c.totalTasks || 0), 0) / children.length) * 100) : 0
  };

  return (
    <div className="max-w-7xl mx-auto space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-1000">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 border-b border-glass-border pb-8">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-xs font-black tracking-[0.3em] text-primary/60 uppercase">
            <Activity size={12} className="animate-pulse" />
            Performance Diagnostics • Advanced Analytics
          </div>
          <h1 className="text-5xl font-black tracking-tighter uppercase leading-tight italic text-foreground">
            Neural<span className="text-primary">Performance</span>
          </h1>
          <p className="text-foreground/40 font-semibold tracking-wide">In-depth audit of student node synchronization and output consistency.</p>
        </div>

        <button 
          onClick={exportToCSV}
          className="flex items-center gap-3 px-8 py-4 bg-foreground/5 border border-glass-border rounded-xl text-[10px] font-black uppercase tracking-widest text-foreground hover:bg-foreground/10 transition-all active:scale-95 group"
        >
          <Download size={14} className="group-hover:translate-y-0.5 transition-transform" />
          Export System Census (CSV)
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="glass-card p-8 border-2 border-glass-border space-y-4">
          <p className="text-[10px] font-black uppercase tracking-widest text-foreground/40 flex items-center gap-2">
            <TrendingUp size={12} className="text-green-500" /> Alpha Operator
          </p>
          <h3 className="text-3xl font-black text-foreground">{insights.mostActive}</h3>
          <p className="text-[10px] font-black uppercase tracking-widest text-green-500/60">Top Activity Lead</p>
        </div>
        <div className="glass-card p-8 border-2 border-glass-border space-y-4">
          <p className="text-[10px] font-black uppercase tracking-widest text-foreground/40 flex items-center gap-2">
            <Clock size={12} className="text-primary" /> Global Mean
          </p>
          <h3 className="text-3xl font-black text-foreground">{insights.avgStudyTime}<span className="text-sm font-bold ml-1">MIN</span></h3>
          <p className="text-[10px] font-black uppercase tracking-widest text-primary/60">Avg Synchrony Cycle</p>
        </div>
        <div className="glass-card p-8 border-2 border-glass-border space-y-4">
          <p className="text-[10px] font-black uppercase tracking-widest text-foreground/40 flex items-center gap-2">
            <Target size={12} className="text-secondary" /> Core Stability
          </p>
          <h3 className="text-3xl font-black text-foreground">{insights.overallCompletionRate}<span className="text-sm font-bold ml-1">%</span></h3>
          <p className="text-[10px] font-black uppercase tracking-widest text-secondary/60">Global Accuracy Index</p>
        </div>
        <div className="glass-card p-8 border-2 border-glass-border space-y-4">
          <p className="text-[10px] font-black uppercase tracking-widest text-foreground/40 flex items-center gap-2">
            <AlertCircle size={12} className="text-red-500" /> High Drift Mode
          </p>
          <h3 className="text-3xl font-black text-foreground">{insights.leastActive}</h3>
          <p className="text-[10px] font-black uppercase tracking-widest text-red-500/60">Critical Support Vector</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        <div className="lg:col-span-2 space-y-8">
          <div className="flex items-center justify-between px-2">
            <div className="flex gap-4">
              <div className="relative">
                <Filter className="absolute left-4 top-1/2 -translate-y-1/2 text-foreground/20" size={12} />
                <select 
                  value={selectedChild}
                  onChange={(e) => setSelectedChild(e.target.value)}
                  className="bg-foreground/5 border border-glass-border rounded-xl pl-10 pr-6 py-2.5 text-[10px] font-black uppercase tracking-widest text-foreground outline-none hover:bg-foreground/10 transition-all appearance-none cursor-pointer"
                >
                  <option value="all">ALL NODES</option>
                  {children.map(c => <option key={c.id} value={c.id}>{c.name.toUpperCase()}</option>)}
                </select>
              </div>
            </div>
            
            <div className="flex items-center gap-2 px-4 py-2 bg-primary/5 border border-primary/20 rounded-xl">
               <Info size={12} className="text-primary" />
               <span className="text-[10px] font-black uppercase tracking-widest text-primary/60 italic">AI INFERENCE ACTIVE</span>
            </div>
          </div>

          <div className="glass-card border-2 border-glass-border overflow-hidden">
             <table className="w-full text-left">
                <thead>
                   <tr className="border-b border-glass-border bg-foreground/[0.02]">
                      <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-foreground/40">Timestamp</th>
                      <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-foreground/40">Node Action</th>
                      <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-foreground/40">Diagnostic Data</th>
                      <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-foreground/40 text-right">Consumption</th>
                   </tr>
                </thead>
                <tbody className="divide-y divide-glass-border">
                   {filteredLogs.map((log, i) => (
                      <tr key={i} className="hover:bg-foreground/5 transition-all group">
                         <td className="px-8 py-6">
                            <p className="text-[10px] font-black text-foreground">{new Date(log.timestamp).toLocaleDateString()}</p>
                            <p className="text-[12px] text-foreground/30 font-bold">{new Date(log.timestamp).toLocaleTimeString()}</p>
                         </td>
                         <td className="px-8 py-6">
                            <span className="px-3 py-1 bg-primary/10 text-primary border border-primary/20 rounded-full text-[9px] font-black tracking-widest uppercase">
                               {log.actionType.replace('_', ' ')}
                            </span>
                         </td>
                         <td className="px-8 py-6">
                            <p className="text-[12px] font-semibold text-foreground/60">{log.description}</p>
                         </td>
                         <td className="px-8 py-6 text-right">
                            <span className="text-[14px] font-black text-foreground">{log.timeSpent || 0} <span className="text-[10px] text-foreground/30 ml-1 italic">MIN</span></span>
                         </td>
                      </tr>
                   ))}
                </tbody>
             </table>
          </div>
        </div>

        <div className="space-y-8">
           <h3 className="text-sm font-black uppercase tracking-[0.4em] text-foreground/40 px-2 flex items-center gap-3">
             <CheckCircle2 size={16} />
             Node Indicators
           </h3>
           
           <div className="space-y-4">
              {children.map(child => {
                 const completionRate = Math.round((child.completedTasks/child.totalTasks || 0) * 100);
                 const status = getStatusIndicator(completionRate);
                 return (
                    <div key={child.id} className="glass-card p-6 border-2 border-glass-border space-y-6">
                       <div className="flex justify-between items-start">
                          <div>
                             <h4 className="text-xl font-black tracking-tighter text-foreground uppercase italic">{child.name}</h4>
                             <p className="text-[9px] font-black uppercase tracking-widest text-foreground/30">ID: {child.id.substring(0,8)}</p>
                          </div>
                          <div className={`px-3 py-1 rounded-lg border ${status.border} ${status.bg} ${status.color} text-[9px] font-black tracking-[0.2em] animate-pulse`}>
                             {status.label}
                          </div>
                       </div>
                       
                       <div className="space-y-4">
                          <div className="p-4 bg-foreground/5 border border-glass-border rounded-xl">
                              <div className="flex gap-2 items-start mb-2">
                                 <Zap size={12} className="text-primary mt-1" />
                                 <p className="text-[9px] font-black uppercase tracking-widest text-primary/80 italic">Neural Suggestion</p>
                              </div>
                              <p className="text-[11px] font-semibold text-foreground/60 leading-relaxed">
                                 {completionRate < 40 ? "CRITICAL: Advise 2 hour deep work cycle immediately." : 
                                  completionRate < 80 ? "ALERT: Efficiency is stabilizing. Add one more core objective." : 
                                  "PROCEED: Node operating at peak capacity. Maintain energy levels."}
                              </p>
                           </div>

                           <div className="space-y-3">
                              <div className="flex gap-2 items-start mb-2">
                                 <FileText size={12} className="text-secondary mt-1" />
                                 <p className="text-[9px] font-black uppercase tracking-widest text-secondary/80 italic">Supervisor Feed</p>
                              </div>
                              <input 
                                 onKeyDown={async (e) => {
                                   if (e.key === 'Enter') {
                                     const val = (e.target as HTMLInputElement).value;
                                     if (!val) return;
                                     const user = JSON.parse(localStorage.getItem('systemhub_active_user') || '{}');
                                     await fetch('/api/logs', {
                                       method: 'POST',
                                       headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${user.token}` },
                                       body: JSON.stringify({ actionType: 'SUPERVISOR_REMARK', description: `[FROM ${user.name}]: ${val}`, studentId: child.id })
                                     });
                                     (e.target as HTMLInputElement).value = '';
                                   }
                                 }}
                                 placeholder="SEND NEURAL REMARK..." 
                                 className="w-full bg-foreground/5 border border-glass-border rounded-xl px-4 py-3 text-[10px] font-black uppercase tracking-widest outline-none focus:border-secondary placeholder:text-foreground/20 transition-all font-bold text-foreground" 
                              />
                           </div>
                       </div>
                    </div>
                 );
              })}
           </div>
        </div>
      </div>
    </div>
  );
};

export default PerformanceAnalysis;
