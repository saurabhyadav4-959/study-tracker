import React, { useState, useEffect, useRef } from 'react';
import { 
  Activity, Clock, Zap, X,
  Search, Filter, ChevronDown, MessageSquare, Check,
  Plus, CheckCircle, LogIn, Brain, Trash
} from 'lucide-react';
import { API_BASE_URL } from '../config';
import { ActionLog } from '../types';

const getActionTheme = (actionType: string) => {
  switch (actionType) {
    case 'ADD_TASK': return { color: 'text-yellow-500', bg: 'bg-yellow-500/10', border: 'border-yellow-500/20', solid: 'bg-yellow-500', Icon: Plus };
    case 'COMPLETE_TASK': return { color: 'text-green-500', bg: 'bg-green-500/10', border: 'border-green-500/20', solid: 'bg-green-500', Icon: CheckCircle };
    case 'LOGIN': return { color: 'text-blue-500', bg: 'bg-blue-500/10', border: 'border-blue-500/20', solid: 'bg-blue-500', Icon: LogIn };
    case 'STUDY_SESSION': return { color: 'text-purple-500', bg: 'bg-purple-500/10', border: 'border-purple-500/20', solid: 'bg-purple-500', Icon: Brain };
    case 'DELETE_TASK': return { color: 'text-red-500', bg: 'bg-red-500/10', border: 'border-red-500/20', solid: 'bg-red-500', Icon: Trash };
    default: return { color: 'text-secondary', bg: 'bg-secondary/10', border: 'border-secondary/20', solid: 'bg-secondary', Icon: Zap };
  }
};

const SupervisorFeed = () => {
  const [logs, setLogs] = useState<any[]>([]);
  const [children, setChildren] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('');
  const [selectedStudent, setSelectedStudent] = useState('');
  const [dropOpen, setDropOpen] = useState(false);
  const [dropPos, setDropPos] = useState({ top: 0, left: 0, width: 0 });
  const dropRef = useRef<HTMLDivElement>(null);
  const btnRef = useRef<HTMLButtonElement>(null);
  
  const [assignModalOpen, setAssignModalOpen] = useState(false);
  const [assignTaskName, setAssignTaskName] = useState('');
  const [assignPriority, setAssignPriority] = useState('Medium');
  const [assignTargetStudent, setAssignTargetStudent] = useState('');
  const [assigning, setAssigning] = useState(false);
  const [assignNodeDropOpen, setAssignNodeDropOpen] = useState(false);

  const fetchData = async () => {
    const user = JSON.parse(localStorage.getItem('systemhub_active_user') || '{}');
    try {
      // Fetch Children for Filter
      const childRes = await fetch(`${API_BASE_URL}/api/parent/children`, {
        headers: { 'Authorization': `Bearer ${user.token}` }
      });
      const childData = await childRes.json();
      if (Array.isArray(childData)) setChildren(childData);

      // Fetch Feed Logs
      const feedRes = await fetch(`${API_BASE_URL}/api/parent/activity-feed`, {
        headers: { 'Authorization': `Bearer ${user.token}` }
      });
      const feedData = await feedRes.json();
      if (Array.isArray(feedData)) {
        setLogs(feedData);
      } else {
        setLogs([]);
      }
    } catch (err) {
      console.error('Data fetch failed', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

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

  const studentNames = Array.from(new Set(children.map(c => c.name)));

  const handleAssign = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!assignTaskName || !assignTargetStudent) return;
    setAssigning(true);
    const user = JSON.parse(localStorage.getItem('systemhub_active_user') || '{}');
    try {
      const student = children.find(c => c.name === assignTargetStudent);
      if (!student) return;
      
      const res = await fetch(`${API_BASE_URL}/api/parent/assign-alert`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${user.token}`
        },
        body: JSON.stringify({
          studentId: student.id,
          taskName: assignTaskName,
          priority: assignPriority
        })
      });
      if (res.ok) {
        setAssignModalOpen(false);
        setAssignTaskName('');
        setAssignTargetStudent('');
        setAssignPriority('Medium');
      }
    } catch (err) {
      console.error(err);
    } finally {
      setAssigning(false);
    }
  };

  const filteredLogs = logs.filter(log => {
    const matchesText = (log.childName || '').toLowerCase().includes(filter.toLowerCase()) ||
                        (log.description || '').toLowerCase().includes(filter.toLowerCase()) ||
                        (log.actionType || '').toLowerCase().includes(filter.toLowerCase());
    const matchesStudent = selectedStudent === '' || log.childName === selectedStudent;
    return matchesText && matchesStudent;
  });

  if (loading) return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-rotate" />
    </div>
  );

  return (
    <div className="max-w-5xl mx-auto space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-1200">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 border-b border-glass-border pb-8 text-foreground">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-xs font-black tracking-[0.3em] text-secondary/60 uppercase">
             <Activity size={12} className="animate-pulse" />
             Neural Sync • Global Activity Feed
          </div>
          <h1 className="text-5xl font-black tracking-tighter uppercase leading-tight italic">
            Supervisor<span className="text-secondary">Feed</span>
          </h1>
          <p className="text-foreground/40 font-semibold tracking-wide">Combined real-time activity stream of all linked student nodes.</p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
          <button
            onClick={() => setAssignModalOpen(true)}
            className="flex items-center justify-center gap-2 bg-primary text-white px-6 py-4 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-primary/90 transition-all shadow-lg shadow-primary/20 shrink-0"
          >
            <Plus size={16} />
            Assign Objective
          </button>
          
          {/* Custom Student Dropdown */}
          <div className="relative w-full md:w-60">
            <button
              ref={btnRef}
              onClick={handleDropToggle}
              className="w-full flex items-center gap-3 bg-background border border-glass-border rounded-xl px-4 py-4 text-[10px] font-black uppercase tracking-widest text-foreground hover:border-secondary/40 transition-all cursor-pointer"
            >
              <Filter size={14} className="text-secondary/60 shrink-0" />
              <span className="flex-1 text-left truncate">{selectedStudent || 'ALL STUDENTS'}</span>
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
              {(['', ...studentNames] as string[]).map((name, i) => (
                <button
                  key={i}
                  onClick={() => { setSelectedStudent(name); setDropOpen(false); }}
                  className={`w-full flex items-center justify-between px-4 py-3 text-[10px] font-black uppercase tracking-widest text-left transition-all hover:bg-secondary/10 hover:text-secondary ${
                    selectedStudent === name ? 'bg-secondary/10 text-secondary' : 'text-foreground/70'
                  }`}
                >
                  <span>{name || 'ALL STUDENTS'}</span>
                  {selectedStudent === name && <Check size={12} />}
                </button>
              ))}
            </div>
          )}
          <div className="relative group w-full md:w-80">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-foreground/20 group-focus-within:text-secondary transition-colors" size={16} />
            <input 
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              placeholder="SEARCH (ACTION, DATA)"
              className="w-full bg-background border border-glass-border rounded-xl pl-12 pr-6 py-4 text-[10px] font-black uppercase tracking-widest text-foreground outline-none focus:border-secondary transition-all placeholder:text-foreground/10"
            />
          </div>
        </div>
      </div>

      {/* Feed List */}
      <div className="space-y-6">
        {filteredLogs.length > 0 ? filteredLogs.map((log, i) => {
          const theme = getActionTheme(log.actionType);
          return (
          <div key={i} className={`glass-card group hover:${theme.border.replace('border-', 'border-')} transition-all duration-500 overflow-hidden relative`}>
             <div className={`absolute top-0 left-0 w-1 h-full ${theme.solid} opacity-0 group-hover:opacity-100 transition-opacity`} />
             <div className="p-8 flex flex-col md:flex-row gap-8 items-start md:items-center">
                <div className="flex items-center gap-4 shrink-0">
                   <div className={`w-14 h-14 ${theme.bg} rounded-2xl flex items-center justify-center ${theme.color} border ${theme.border} group-hover:scale-110 transition-transform shadow-lg shadow-black/20`}>
                      <theme.Icon size={24} />
                   </div>
                   <div className="space-y-1">
                      <p className="text-xl font-black tracking-tighter text-foreground italic uppercase leading-none">{log.childName}</p>
                      <p className="text-[10px] font-black uppercase tracking-widest text-foreground/30">Node Active</p>
                   </div>
                </div>

                <div className="flex-1 space-y-2">
                   <div className="flex items-center gap-3">
                      <span className={`px-3 py-1 ${theme.bg} ${theme.color} border ${theme.border} rounded-full text-[9px] font-black tracking-[0.2em] uppercase`}>
                         {log.actionType.replace('_', ' ')}
                      </span>
                      <span className="text-[10px] font-bold text-foreground/40 tracking-[0.1em] flex items-center gap-1.5 bg-foreground/[0.03] border border-glass-border px-3 py-1 rounded-md">
                         <Clock size={10} className="text-secondary/60" /> 
                         {new Date(log.timestamp).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }).toUpperCase()} 
                         <span className="text-foreground/20 mx-0.5">•</span> 
                         {new Date(log.timestamp).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }).toUpperCase()}
                      </span>
                   </div>
                   <div className="text-sm leading-relaxed mt-1">
                      {log.description.includes(':') ? (
                        <div className="flex flex-col sm:flex-row sm:items-baseline gap-1 sm:gap-2">
                           <span className={`text-[10px] font-black uppercase tracking-[0.2em] ${theme.color} opacity-70`}>
                             {log.description.split(':')[0]}:
                           </span>
                           <span className="text-base font-bold text-foreground/90">
                             {log.description.split(':').slice(1).join(':').trim()}
                           </span>
                        </div>
                      ) : (
                        <span className="text-base font-bold text-foreground/90">
                          {log.description}
                        </span>
                      )}
                   </div>
                </div>

                <div className="shrink-0 flex items-center gap-4">
                   {log.timeSpent > 0 && (
                     <div className="text-right">
                        <p className="text-[10px] font-black text-foreground/40 uppercase tracking-widest leading-none mb-1">Impact</p>
                        <p className="text-xl font-black text-secondary leading-none">+{log.timeSpent} <span className="text-xs italic">MIN</span></p>
                     </div>
                   )}
                   <button className="p-3 bg-foreground/5 rounded-xl border border-glass-border text-foreground/30 hover:text-secondary hover:bg-secondary/10 transition-all">
                      <MessageSquare size={18} />
                   </button>
                </div>
              </div>
           </div>
          );
        }) : (
          <div className="py-32 text-center glass-card border-dashed border-2">
             <div className="w-20 h-20 bg-foreground/5 rounded-full flex items-center justify-center mx-auto mb-6 text-foreground/10 animate-pulse">
                <Activity size={40} />
             </div>
             <p className="text-[10px] font-black uppercase tracking-[0.5em] text-foreground/30 italic">No activity logs detected in the global neural feed.</p>
          </div>
        )}
      </div>

      <div className="text-center pt-8">
         <p className="text-[9px] font-black text-foreground/20 uppercase tracking-[0.8em]">End of Global Feed • Synchronized v0.2</p>
      </div>

      {/* Assign Modal */}
      {assignModalOpen && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
          <div className="bg-[#1c1c1e] border border-white/10 w-full max-w-md rounded-[2rem] p-8 shadow-2xl relative">
            <button onClick={() => setAssignModalOpen(false)} className="absolute top-6 right-6 text-foreground/40 hover:text-foreground">
               <X size={20} />
            </button>
            <h2 className="text-2xl font-black uppercase italic tracking-tighter mb-2">Assign Objective</h2>
            <p className="text-xs text-foreground/40 font-semibold tracking-widest uppercase mb-8">Send a priority alert to a linked node</p>
            
            <form onSubmit={handleAssign} className="space-y-6">
              <div className="relative">
                <label className="block text-[10px] font-black uppercase tracking-widest text-foreground/60 mb-2">Select Node</label>
                <div
                  onClick={() => setAssignNodeDropOpen(p => !p)}
                  className="w-full flex items-center justify-between bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-xs font-semibold text-foreground cursor-pointer hover:border-primary transition-all"
                >
                  <span className={!assignTargetStudent ? 'text-foreground/40' : ''}>
                    {assignTargetStudent || 'Select a student...'}
                  </span>
                  <ChevronDown size={14} className={`text-foreground/30 transition-transform duration-300 ${assignNodeDropOpen ? 'rotate-180' : ''}`} />
                </div>
                
                {assignNodeDropOpen && (
                  <div className="absolute top-full left-0 right-0 mt-2 bg-[#2c2c2e] border border-white/10 rounded-xl overflow-hidden shadow-2xl z-50">
                    {studentNames.map((n, i) => (
                      <button
                        type="button"
                        key={i}
                        onClick={() => { setAssignTargetStudent(n as string); setAssignNodeDropOpen(false); }}
                        className={`w-full flex items-center justify-between px-4 py-3 text-[10px] font-black uppercase tracking-widest text-left transition-all hover:bg-primary/10 hover:text-primary ${
                          assignTargetStudent === n ? 'bg-primary/10 text-primary' : 'text-foreground/70'
                        }`}
                      >
                        <span>{n as string}</span>
                        {assignTargetStudent === n && <Check size={12} />}
                      </button>
                    ))}
                  </div>
                )}
              </div>
              
              <div>
                <label className="block text-[10px] font-black uppercase tracking-widest text-foreground/60 mb-2">Objective Description</label>
                <input 
                  value={assignTaskName} 
                  onChange={e => setAssignTaskName(e.target.value)}
                  placeholder="e.g. Complete chapter 4"
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-xs font-semibold text-foreground outline-none focus:border-primary transition-all"
                  required
                />
              </div>

              <div>
                <label className="block text-[10px] font-black uppercase tracking-widest text-foreground/60 mb-2">Priority Level</label>
                <div className="flex gap-2">
                  {['High', 'Medium', 'Low'].map(p => (
                    <button
                      key={p}
                      type="button"
                      onClick={() => setAssignPriority(p)}
                      className={`flex-1 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                        assignPriority === p 
                          ? p === 'High' ? 'bg-red-500 text-white' : p === 'Medium' ? 'bg-yellow-500 text-white' : 'bg-green-500 text-white'
                          : 'bg-white/5 text-foreground/40 hover:bg-white/10'
                      }`}
                    >
                      {p}
                    </button>
                  ))}
                </div>
              </div>

              <button 
                type="submit" 
                disabled={assigning}
                className="w-full py-4 bg-primary text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-primary/90 transition-all shadow-lg shadow-primary/20 mt-4 disabled:opacity-50"
              >
                {assigning ? 'Transmitting...' : 'Transmit Directive'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default SupervisorFeed;
