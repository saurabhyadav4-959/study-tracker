import React, { useState, useEffect, useRef } from 'react';
import { 
  Activity, Clock, Zap, 
  Search, Filter, ChevronDown, MessageSquare, Check
} from 'lucide-react';
import { API_BASE_URL } from '../config';
import { ActionLog } from '../types';

const SupervisorFeed = () => {
  const [logs, setLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('');
  const [selectedStudent, setSelectedStudent] = useState('');
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

  const fetchFeed = async () => {
    const user = JSON.parse(localStorage.getItem('systemhub_active_user') || '{}');
    try {
      const res = await fetch(`${API_BASE_URL}/api/parent/activity-feed`, {
        headers: { 'Authorization': `Bearer ${user.token}` }
      });
      const data = await res.json();
      if (Array.isArray(data)) {
        setLogs(data);
      } else {
        setLogs([]);
      }
    } catch (err) {
      console.error('Feed fetch failed', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFeed();
  }, []);

  const uniqueStudents = Array.from(new Set(logs.map(log => log.childName)));

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
              {(['', ...uniqueStudents] as string[]).map((name, i) => (
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
        {filteredLogs.length > 0 ? filteredLogs.map((log, i) => (
          <div key={i} className="glass-card group hover:border-secondary/40 transition-all duration-500 overflow-hidden relative">
             <div className="absolute top-0 left-0 w-1 h-full bg-secondary opacity-0 group-hover:opacity-100 transition-opacity" />
             <div className="p-8 flex flex-col md:flex-row gap-8 items-start md:items-center">
                <div className="flex items-center gap-4 shrink-0">
                   <div className="w-14 h-14 bg-secondary/10 rounded-2xl flex items-center justify-center text-secondary border border-secondary/20 group-hover:scale-110 transition-transform shadow-lg shadow-secondary/5">
                      <Zap size={24} />
                   </div>
                   <div className="space-y-1">
                      <p className="text-xl font-black tracking-tighter text-foreground italic uppercase leading-none">{log.childName}</p>
                      <p className="text-[10px] font-black uppercase tracking-widest text-foreground/30">Node Active</p>
                   </div>
                </div>

                <div className="flex-1 space-y-2">
                   <div className="flex items-center gap-3">
                      <span className="px-3 py-1 bg-secondary/10 text-secondary border border-secondary/20 rounded-full text-[9px] font-black tracking-[0.2em] uppercase">
                         {log.actionType.replace('_', ' ')}
                      </span>
                      <span className="text-[9px] font-black text-foreground/30 uppercase tracking-widest flex items-center gap-1 bg-foreground/5 px-2 py-1 rounded">
                         <Clock size={10} /> {new Date(log.timestamp).toLocaleDateString()} at {new Date(log.timestamp).toLocaleTimeString()}
                      </span>
                   </div>
                   <p className="text-sm font-semibold text-foreground/70 leading-relaxed italic">
                      "{log.description}"
                   </p>
                </div>

                <div className="shrink-0 flex items-center gap-4">
                   <div className="text-right">
                      <p className="text-[10px] font-black text-foreground/40 uppercase tracking-widest leading-none mb-1">Impact</p>
                      <p className="text-xl font-black text-secondary leading-none">+{log.timeSpent || 0} <span className="text-xs italic">MIN</span></p>
                   </div>
                   <button className="p-3 bg-foreground/5 rounded-xl border border-glass-border text-foreground/30 hover:text-secondary hover:bg-secondary/10 transition-all">
                      <MessageSquare size={18} />
                   </button>
                </div>
             </div>
          </div>
        )) : (
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
    </div>
  );
};

export default SupervisorFeed;
