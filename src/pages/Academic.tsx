import React from 'react';
import { BookOpen, Calendar, Plus, MoreVertical, Layout, CheckCircle2, Clock, Activity, ChevronRight, Shield, Target } from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import { Priority } from '../types';

const TrackCore = () => {
  const { state, dispatch } = useAppContext();
  const [showForm, setShowForm] = React.useState(false);
  const [newTask, setNewTask] = React.useState({
    title: '',
    track: '',
    deadline: new Date().toISOString().split('T')[0],
    priority: 'Medium' as Priority
  });

  const handleAddTask = () => {
    if (!newTask.title || !newTask.track) return;
    
    dispatch.addTask({
      id: Math.random().toString(36).substr(2, 9),
      title: newTask.title,
      track: newTask.track,
      deadline: newTask.deadline,
      priority: newTask.priority,
      status: 'Todo'
    });
    
    setNewTask({
      title: '',
      track: '',
      deadline: new Date().toISOString().split('T')[0],
      priority: 'Medium'
    });
    setShowForm(false);
  };

  const tasksDone = state.tasks.filter(t => t.status === 'Done').length;
  const totalTasks = state.tasks.length;
  const efficiency = totalTasks > 0 ? Math.round((tasksDone / totalTasks) * 100) : 0;
  
  // Calculate current streak
  const calculateStreak = (logs: any[]) => {
    let streak = 0;
    const sortedLogs = [...logs].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    for (const log of sortedLogs) {
      if (log.intensity > 0) streak++;
      else break;
    }
    return streak;
  };
  const currentStreak = calculateStreak(state.activityLogs);

  // Get unique tracks for the roadmap
  const uniqueTracks = Array.from(new Set(state.tasks.map(t => t.track)));
  const displayTracks = uniqueTracks.length > 0 ? uniqueTracks : ['Computer Systems', 'Advanced Calculus', 'Neural Networks', 'Discrete Structures'].slice(0, 4);

  // Activity Density (last 42 days)
  const recentLogs = state.activityLogs.slice(-42);
  
  const getIntensityColor = (intensity: number) => {
    if (intensity === 0) return 'bg-white/5';
    if (intensity === 1) return 'bg-blue-500/30';
    if (intensity === 2) return 'bg-blue-500/50';
    if (intensity === 3) return 'bg-blue-500/80';
    return 'bg-blue-400 shadow-[0_0_15px_rgba(96,165,250,0.4)]';
  };

  return (
    <div className="max-w-7xl mx-auto space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-1000">
      {/* Dynamic Header */}
      <div className="flex justify-between items-start">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-xs font-black tracking-[0.3em] text-primary/60 uppercase">
            <Activity size={12} className="animate-pulse" />
            Curriculum synchronization active
          </div>
          <h1 className="text-5xl font-black tracking-tighter uppercase leading-tight">Track Core</h1>
          <p className="text-foreground/40 font-semibold tracking-wide">Manage your curriculum, tasks, and activity density with precision.</p>
        </div>
        <button 
          onClick={() => setShowForm(!showForm)}
          className="px-8 py-4 bg-primary text-white font-black uppercase tracking-[0.2em] text-xs rounded-2xl shadow-[0_0_30px_rgba(99,102,241,0.3)] hover:shadow-[0_0_50px_rgba(99,102,241,0.5)] hover:scale-105 active:scale-95 transition-all flex items-center gap-3 border border-primary/20"
        >
          <Plus size={18} />
          <span>{showForm ? 'Cancel Initialization' : 'Initialize Protocol'}</span>
        </button>
      </div>

      {/* Inline Initialization Form */}
      {showForm && (
        <div className="glass-card p-10 border-2 border-primary/30 bg-gradient-to-br from-primary/[0.05] to-transparent animate-in zoom-in-95 duration-500">
           <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
              <div className="space-y-4">
                <label className="text-xs font-black uppercase tracking-[0.4em] text-foreground/40 ml-1">Task Details</label>
                <input 
                  value={newTask.title}
                  onChange={e => setNewTask({...newTask, title: e.target.value})}
                  className="quantum-input font-black uppercase placeholder:text-foreground/50"
                  placeholder="Enter protocol name..."
                />
              </div>
              <div className="space-y-4">
                <label className="text-xs font-black uppercase tracking-[0.4em] text-foreground/40 ml-1">Subject / Track</label>
                <input 
                  value={newTask.track}
                  onChange={e => setNewTask({...newTask, track: e.target.value})}
                  className="quantum-input font-black uppercase placeholder:text-foreground/50"
                  placeholder="Enter track category..."
                />
              </div>
              <div className="space-y-4">
                <label className="text-xs font-black uppercase tracking-[0.4em] text-foreground/40 ml-1">Deadline Date</label>
                <input 
                  type="date"
                  value={newTask.deadline}
                  onChange={e => setNewTask({...newTask, deadline: e.target.value})}
                  className="quantum-input font-black uppercase"
                />
              </div>
              <div className="space-y-4">
                <label className="text-xs font-black uppercase tracking-[0.4em] text-foreground/40 ml-1">Priority Level</label>
                <div className="flex gap-2">
                  {(['Low', 'Medium', 'High'] as const).map((p) => (
                    <button
                      key={p}
                      onClick={() => setNewTask({...newTask, priority: p})}
                      className={`flex-1 py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-all border-2 ${
                        newTask.priority === p 
                          ? 'bg-primary border-primary shadow-[0_0_20px_rgba(99,102,241,0.4)] text-white' 
                          : 'bg-white/5 border-glass-border text-foreground/40 hover:border-primary/40'
                      }`}
                    >
                      {p}
                    </button>
                  ))}
                  <button 
                    onClick={handleAddTask}
                    className="ml-4 px-8 bg-white text-zinc-900 font-black uppercase tracking-widest text-xs rounded-xl hover:bg-zinc-200 transition-all shadow-xl active:scale-95 border border-white/20"
                  >
                    Save
                  </button>
                </div>
              </div>
           </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        {/* Main Task Feed */}
        <div className="lg:col-span-8 space-y-8">
          <div className="glass-card p-10 border-2 border-glass-border relative overflow-hidden group">
            <h3 className="text-sm font-black uppercase tracking-[0.4em] text-primary mb-10 flex items-center gap-3 relative z-10">
              <Layout size={16} />
              Protocol Reservoir
            </h3>
            
            <div className="space-y-4 relative z-10">
              {state.tasks.map((task) => (
                <div key={task.id} className="group flex flex-col sm:flex-row items-start sm:items-center justify-between p-6 bg-white/[0.02] border border-glass-border rounded-2xl hover:bg-primary/[0.03] hover:border-primary/30 transition-all duration-500 gap-6">
                  <div className="flex items-center gap-6">
                    <div className={`w-3 h-3 rounded-full shrink-0 ${task.priority === 'High' ? 'bg-red-500 shadow-[0_0_15px_rgba(239,68,68,0.5)]' : task.priority === 'Medium' ? 'bg-yellow-500 shadow-[0_0_15px_rgba(234,179,8,0.3)]' : 'bg-blue-500'}`} />
                    <div>
                      <h4 className="font-black text-lg tracking-tight uppercase group-hover:text-primary transition-colors text-foreground">{task.title}</h4>
                      <p className="text-sm text-foreground/50 uppercase tracking-[0.2em] font-black mt-1">{task.track} • Timeline Node: {task.deadline}</p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between w-full sm:w-auto gap-6 sm:border-l sm:border-white/5 sm:pl-6">
                    <div className={`px-3 py-1 rounded-[4px] border border-white/5 text-[10px] font-black uppercase tracking-widest ${task.status === 'Done' ? 'bg-green-500/10 text-green-500 border-green-500/20' : 'bg-white/5 text-foreground/40'}`}>
                      {task.status}
                    </div>
                    <div className="flex items-center gap-2">
                       <button 
                        onClick={() => dispatch.toggleTaskStatus(task.id)}
                        className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all ${task.status === 'Done' ? 'bg-green-500/10 text-green-500' : 'bg-white/5 text-foreground/40 hover:text-white hover:bg-white/10'}`}
                      >
                        <CheckCircle2 size={18} />
                      </button>
                      <button 
                        onClick={() => dispatch.removeTask(task.id)}
                        className="w-10 h-10 rounded-xl bg-white/5 text-foreground/50 hover:text-red-400 hover:bg-red-400/10 transition-all flex items-center justify-center"
                      >
                        <MoreVertical size={18} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="glass-card p-10 border-2 border-glass-border">
            <h3 className="text-sm font-black uppercase tracking-[0.4em] text-secondary mb-10 flex items-center gap-3">
              <Calendar size={16} />
              Curriculum Roadmap
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {displayTracks.map((subject, idx) => (
                <div key={idx} className="p-6 bg-white/5 border border-glass-border rounded-2xl flex items-center justify-between group hover:border-primary/30 transition-all">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-all shadow-inner border border-primary/10">
                      <BookOpen size={22} />
                    </div>
                    <div>
                      <h4 className="text-sm font-black uppercase tracking-tight">{subject}</h4>
                      <p className="text-sm text-foreground/50 font-black tracking-widest uppercase mt-1">Architecture v{idx + 1}.0</p>
                    </div>
                  </div>
                  <ChevronRight size={18} className="text-foreground/40 group-hover:text-white transition-colors" />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Modular Info Panels */}
        <div className="lg:col-span-4 space-y-8">
          <div className="glass-card p-10 border-2 border-glass-border">
            <h3 className="text-sm font-black uppercase tracking-[0.4em] text-primary mb-10 flex items-center gap-3">
              <Target size={16} />
              Activity Density
            </h3>
            <div className="grid grid-cols-7 gap-2 py-2">
              {recentLogs.map((log, i) => {
                const isToday = i === recentLogs.length - 1;
                return (
                  <div 
                    key={i} 
                    className={`w-4 h-4 rounded-[3px] transition-all hover:scale-150 hover:z-10 cursor-crosshair border ${isToday ? 'border-primary ring-2 ring-primary/20 shadow-[0_0_10px_rgba(99,102,241,0.3)]' : 'border-white/5'} ${getIntensityColor(log.intensity)}`} 
                    title={`Sync Node: ${log.date} ${isToday ? '(Today)' : ''}`}
                  />
                );
              })}
              {recentLogs.length === 0 && Array.from({ length: 42 }).map((_, i) => (
                <div key={i} className="w-4 h-4 rounded-[3px] bg-white/5 border border-white/5" />
              ))}
            </div>
            <div className="flex justify-between mt-8 items-center border-t border-glass-border pt-6">
              <div className="flex flex-col">
                <span className="text-xs text-foreground/40 font-black uppercase tracking-widest">Efficiency</span>
                <span className="text-xl font-black text-foreground">{efficiency}%</span>
              </div>
              <div className="h-8 w-[1px] bg-glass-border" />
              <div className="flex flex-col items-end">
                <span className="text-xs text-foreground/40 font-black uppercase tracking-widest">Load State</span>
                <span className="text-xl font-black text-primary uppercase">{efficiency > 80 ? 'Optimal' : efficiency > 40 ? 'Moderate' : 'Stable'}</span>
              </div>
            </div>
          </div>

          <div className="glass-card p-10 relative overflow-hidden group border-2 border-glass-border bg-gradient-to-br from-green-500/[0.03] to-transparent">
             <div className="absolute -bottom-10 -right-10 text-green-500 opacity-5 group-hover:opacity-10 transition-all duration-700">
              <Clock size={200} />
            </div>
            <div className="relative z-10">
              <h3 className="text-sm font-black uppercase tracking-[0.4em] text-green-500 mb-10">Academic Longevity</h3>
              <div className="flex items-baseline gap-2 mb-1">
                <p className="text-6xl font-black text-foreground tracking-tighter">{currentStreak}</p>
                <span className="text-lg text-foreground/50 font-black uppercase">Days</span>
              </div>
              <p className="text-xs text-green-500 font-black uppercase tracking-[0.2em] flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                Consistency Streak Active
              </p>
              
              <div className="mt-12 space-y-6">
                {[
                  { 
                    label: 'Neural Index', 
                    val: totalTasks === 0 ? '---' : efficiency > 90 ? 'A+' : efficiency > 80 ? 'A' : efficiency > 70 ? 'B+' : efficiency > 50 ? 'B' : 'C', 
                    color: 'text-foreground' 
                  },
                  { 
                    label: 'Sync Rate', 
                    val: totalTasks === 0 ? 'CALIBRATING' : `${efficiency}%`, 
                    color: 'text-secondary' 
                  },
                  { 
                    label: 'Core Load', 
                    val: totalTasks === 0 ? '0.0' : (state.tasks.filter(t => t.status !== 'Done').length * 1.5).toFixed(1), 
                    color: 'text-foreground' 
                  },
                ].map((item, i) => (
                  <div key={i} className="flex justify-between items-center py-3 border-b border-white/5 last:border-0">
                    <span className="text-xs text-foreground/50 font-black uppercase tracking-widest">{item.label}</span>
                    <span className={`text-lg font-black ${item.color}`}>{item.val}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TrackCore;
