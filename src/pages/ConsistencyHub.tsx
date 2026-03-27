import React from 'react';
import { Activity, Flame, Calendar, History, TrendingUp, Zap, ChevronRight } from 'lucide-react';
import { useAppContext } from '../context/AppContext';

const ConsistencyHub = () => {
  const { state } = useAppContext();

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
  const totalActivity = state.activityLogs.reduce((acc, curr) => acc + (curr.count || 0), 0);

  // Helper to get color based on intensity
  const getHeatColor = (intensity: number) => {
    if (intensity === 0) return 'bg-white/5';
    if (intensity === 1) return 'bg-blue-900/40'; 
    if (intensity === 2) return 'bg-blue-700/60';
    if (intensity === 3) return 'bg-blue-500/80';
    return 'bg-blue-400 shadow-[0_0_15px_rgba(96,165,250,0.4)]'; 
  };

  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  
  // Group logs into weeks (7 days each)
  const weeks = state.activityLogs.reduce((acc: any[][], curr, i) => {
    const weekIdx = Math.floor(i / 7);
    if (!acc[weekIdx]) acc[weekIdx] = [];
    acc[weekIdx].push(curr);
    return acc;
  }, []);

  const allWeeks = weeks;

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight">Contribution Core</h1>
          <p className="text-foreground/40 mt-1">Synchronize your activity across the temporal dimension.</p>
        </div>
        <div className="flex items-center gap-3 glass-card px-4 py-2 border-orange-500/20">
          <Flame className="text-orange-500" size={18} />
          <span className="text-sm font-bold tracking-tight uppercase tracking-widest">Streak: {currentStreak} Days</span>
        </div>
      </div>

      <div className="glass-card p-8">
        <div className="flex justify-between items-center mb-8">
          <h3 className="text-sm font-black uppercase tracking-[0.4em] text-foreground/40">
            {totalActivity} contributions in the last year
          </h3>
          <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-foreground/40 cursor-pointer hover:text-primary transition-colors">
            Contribution settings
            <ChevronRight size={10} className="rotate-90" />
          </div>
        </div>
        
        <h3 className="text-xl font-bold mb-8 flex items-center gap-2">
          <Calendar className="text-primary" size={20} />
          Synchronization Matrix
        </h3>
        
        <div className="flex gap-4">
          {/* Day Labels */}
          <div className="flex flex-col gap-[3px] pt-10 text-[9px] font-black uppercase text-foreground/20 w-8 select-none">
            {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(day => (
              <div key={day} className="h-3.5 flex items-center">{day}</div>
            ))}
          </div>

          <div className="flex-1 overflow-x-auto pb-6 custom-scrollbar pr-4 pt-2">
            <div className="flex gap-1 mb-2 relative h-8">
              {allWeeks.map((week, i) => {
                const date = new Date(week[0].date);
                const isFirstDayOfMonth = date.getDate() <= 7;
                return (
                  <div key={i} className="min-w-[14px] relative">
                    {isFirstDayOfMonth && (
                      <span className="text-[10px] font-black uppercase text-foreground/40 absolute -top-1 left-0 whitespace-nowrap z-10">
                        {months[date.getMonth()]}
                      </span>
                    )}
                  </div>
                );
              })}
            </div>

            <div className="flex gap-[3px]">
              {allWeeks.map((week, weekIdx) => (
                <div key={weekIdx} className="flex flex-col gap-[3px]">
                  {week.map((day, dayIdx) => (
                    <div 
                      key={dayIdx} 
                      className={`w-3.5 h-3.5 rounded-[2px] ${getHeatColor(day.intensity)} transition-all hover:scale-125 hover:ring-2 hover:ring-primary/40 cursor-crosshair relative group/tip`}
                    >
                      {/* Tactical Tooltip */}
                      <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover/tip:block z-50">
                        <div className="bg-background/95 backdrop-blur-xl border border-glass-border px-3 py-1.5 rounded-lg shadow-2xl whitespace-nowrap">
                          <p className="text-[10px] font-black text-foreground uppercase tracking-widest">{day.intensity > 0 ? `${day.count || 0} Synchronizations` : 'No Activity'}</p>
                          <p className="text-[9px] font-bold text-foreground/40 mt-0.5">{new Date(day.date).toDateString()}</p>
                        </div>
                        <div className="w-2 h-2 bg-background border-r border-b border-glass-border rotate-45 mx-auto -mt-1" />
                      </div>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>
        </div>
        
        <div className="flex justify-between items-center mt-6">
          <div className="flex items-center gap-4 text-xs font-black uppercase tracking-widest text-foreground/20">
            <span>Historical View</span>
            <div className="flex items-center gap-1">
              <span>Less</span>
              <div className="w-2.5 h-2.5 rounded-[1px] bg-white/5" />
              <div className="w-2.5 h-2.5 rounded-[1px] bg-blue-900/40" />
              <div className="w-2.5 h-2.5 rounded-[1px] bg-blue-700/60" />
              <div className="w-2.5 h-2.5 rounded-[1px] bg-blue-500/80" />
              <div className="w-2.5 h-2.5 rounded-[1px] bg-blue-400" />
              <span>More</span>
            </div>
          </div>
          <p className="text-xs font-black uppercase tracking-widest text-foreground/20">{totalActivity.toLocaleString()} Activity Nodes Registered</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 glass-card p-8">
          <h3 className="text-xl font-bold mb-8 flex items-center gap-2">
            <History className="text-secondary" size={20} />
            System Activity Log
          </h3>
          <div className="space-y-6">
            {state.tasks.filter(t => t.status === 'Done').length === 0 ? (
              <div className="py-12 border border-dashed border-white/5 rounded-2xl flex flex-col items-center justify-center text-center space-y-4 opacity-40 group-hover:opacity-60 transition-opacity">
                <Activity size={40} strokeWidth={1} />
                <p className="text-[10px] font-black uppercase tracking-[0.4em]">Intelligence Core Standby</p>
                <p className="text-xs font-bold uppercase tracking-widest italic">Awaiting First Node Initialization...</p>
              </div>
            ) : (
              state.tasks.filter(t => t.status === 'Done').slice(-4).map((task, idx) => (
                <div key={idx} className="flex gap-4 group">
                  <div className="relative flex flex-col items-center">
                    <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/5 flex items-center justify-center text-white/40 group-hover:bg-primary/10 group-hover:text-primary transition-all">
                      <Zap size={18} />
                    </div>
                    {idx !== state.tasks.filter(t => t.status === 'Done').slice(-4).length - 1 && <div className="w-[1px] flex-1 bg-white/5 my-2" />}
                  </div>
                  <div className="pt-1">
                    <div className="flex items-center gap-2">
                      <h4 className="font-bold text-sm text-foreground uppercase tracking-tight">{task.title} COMPLETE</h4>
                      <span className="text-xs text-foreground/20 font-black">SYNCED</span>
                    </div>
                    <p className="text-xs text-foreground/40 mt-1 uppercase tracking-widest font-medium">Protocol Optimized • {task.track}</p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="glass-card p-8 relative overflow-hidden group">
          <div className="relative z-10">
            <h3 className="text-xl font-bold mb-8">Streak Maintenance</h3>
            <div className="space-y-8">
              <div className="text-center">
                <p className="text-4xl font-black mb-1 text-foreground">{currentStreak}</p>
                <p className="text-xs uppercase tracking-[0.4em] font-black text-primary">Cumulative Days</p>
              </div>
              
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-xs font-black uppercase tracking-widest mb-2">
                    <span className="text-foreground/40">Today's Progress</span>
                    <span className="text-primary">{state.activityLogs[state.activityLogs.length-1]?.intensity > 0 ? '100%' : '0%'}</span>
                  </div>
                  <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden">
                    <div className="h-full bg-primary" style={{ width: state.activityLogs[state.activityLogs.length-1]?.intensity > 0 ? '100%' : '0%' }} />
                  </div>
                </div>
                <p className="text-xs text-foreground/40 leading-relaxed italic">
                  {state.activityLogs[state.activityLogs.length-1]?.intensity > 0 
                  ? 'Today\'s activity synchronized. Streak locked for another 24 hours.' 
                  : 'Complete any session or task to lock in today\'s streak and prevent entropy decay.'}
                </p>
              </div>
            </div>
          </div>
          <Flame className="absolute -bottom-10 -right-10 text-white/5 group-hover:text-primary/10 transition-colors" size={240} />
        </div>
      </div>
    </div>
  );
};

export default ConsistencyHub;
