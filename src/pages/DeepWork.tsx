import React, { useState, useEffect } from 'react';
import { Zap, Play, Pause, RotateCcw, Award, Target, Trophy, ChevronRight, Activity, Timer } from 'lucide-react';
import { useAppContext } from '../context/AppContext';

const FocusMode = () => {
  const { state, dispatch } = useAppContext();
  const [timeLeft, setTimeLeft] = useState(25 * 60);
  const [isActive, setIsActive] = useState(false);
  const [isBreak, setIsBreak] = useState(false);

  useEffect(() => {
    let interval: any = null;
    if (isActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft(prev => prev - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      setIsActive(false);
      if (!isBreak) {
        // Complete focus session and record activity
        dispatch.completeFocusSession(25);
        setTimeLeft(5 * 60);
        setIsBreak(true);
      } else {
        setTimeLeft(25 * 60);
        setIsBreak(false);
      }
    }
    return () => clearInterval(interval);
  }, [isActive, timeLeft, isBreak]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const toggleTimer = () => setIsActive(!isActive);
  const resetTimer = () => {
    setIsActive(false);
    setTimeLeft(isBreak ? 5 * 60 : 25 * 60);
  };

  return (
    <div className="max-w-7xl mx-auto space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-1000">
      {/* Header section */}
      <div className="flex justify-between items-start">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-xs font-black tracking-[0.3em] text-primary/60 uppercase">
            <Activity size={12} className="animate-pulse" />
            Neural Isolation State • protocol active
          </div>
          <h1 className="text-5xl font-black tracking-tighter uppercase leading-tight">Focus Mode</h1>
          <p className="text-foreground/40 font-semibold tracking-wide">Isolate your cognitive cycles for maximum output.</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="glass-card px-8 py-4 border-2 border-primary/20 flex items-center gap-4 bg-primary/5">
            <div className={`w-3 h-3 rounded-full ${isActive ? 'bg-blue-500 animate-pulse shadow-[0_0_10px_rgba(59,130,246,0.5)]' : 'bg-foreground/20'}`} />
            <span className="text-sm font-black uppercase tracking-[0.2em] text-foreground/60">
              System: {isActive ? (isBreak ? 'Cooling Down' : 'Neural Lock') : 'Standby'}
            </span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        {/* Timer Module */}
        <div className="lg:col-span-8">
          <div className="glass-card p-8 md:p-20 flex flex-col items-center justify-center relative overflow-hidden border-2 border-glass-border bg-gradient-to-b from-white/[0.02] to-primary/[0.02]">
            {/* Background geometric accents */}
            <div className={`absolute inset-0 transition-opacity duration-1000 ${isActive ? 'opacity-100' : 'opacity-20'}`}>
              <div className={`absolute top-0 right-0 w-96 h-96 rounded-full blur-[120px] -mr-48 -mt-48 transition-colors duration-1000 ${isBreak ? 'bg-cyan-500/10' : 'bg-primary/20'}`} />
              <div className={`absolute bottom-0 left-0 w-96 h-96 rounded-full blur-[120px] -ml-48 -mb-48 transition-colors duration-1000 ${isBreak ? 'bg-cyan-500/10' : 'bg-primary/20'}`} />
            </div>
            
            <div className="relative z-10 text-center space-y-12">
              <div className="space-y-2">
                <h3 className="text-sm uppercase tracking-[0.6em] font-black text-foreground/60">
                  {isBreak ? 'RESTORATION ARCHITECTURE' : 'SYSTEM LOCKDOWN'}
                </h3>
                <div className="h-0.5 w-24 bg-primary/40 mx-auto rounded-full overflow-hidden">
                  <div className={`h-full bg-primary transition-all duration-1000 ${isActive ? 'w-full' : 'w-0'}`} />
                </div>
              </div>
              
              <div className="relative group">
                {/* Enhanced glow effect */}
                <div className={`absolute inset-0 blur-[100px] rounded-full transition-all duration-1000 scale-150 ${isActive ? (isBreak ? 'bg-cyan-500/20' : 'bg-primary/30') : 'bg-white/5'}`} />
                <p className={`text-7xl sm:text-9xl md:text-[200px] font-black leading-none tracking-tighter relative tabular-nums transition-colors duration-500 ${isActive ? (isBreak ? 'text-cyan-400 drop-shadow-[0_0_50px_rgba(34,211,238,0.3)]' : 'text-primary drop-shadow-[0_0_50px_rgba(99,102,241,0.3)]') : 'text-foreground/80'}`}>
                  {formatTime(timeLeft)}
                </p>
              </div>

              <div className="flex gap-8 justify-center relative">
                <button 
                  onClick={toggleTimer}
                  className={`w-24 h-24 rounded-[2.5rem] flex items-center justify-center transition-all duration-500 active:scale-90 shadow-2xl group border-2 ${
                    isActive 
                      ? 'bg-white/5 border-white/10 text-white hover:bg-white/10' 
                      : 'bg-primary border-primary text-white shadow-[0_0_40px_rgba(99,102,241,0.4)] hover:shadow-[0_0_60px_rgba(99,102,241,0.6)] hover:scale-105'
                  }`}
                >
                  {isActive ? <Pause size={40} /> : <Play size={40} className="ml-2" />}
                </button>
                <button 
                  onClick={resetTimer}
                  className="w-24 h-24 rounded-[2.5rem] border-2 border-white/5 bg-white/5 flex items-center justify-center text-foreground/50 hover:text-white hover:border-white/10 hover:bg-white/10 transition-all duration-500"
                >
                  <RotateCcw size={32} />
                </button>
              </div>
            </div>
            
            {/* Tactical Corners */}
            <div className="absolute top-0 left-0 w-24 h-24 border-t-2 border-l-2 border-primary/20 rounded-tl-[1.5rem]" />
            <div className="absolute top-0 right-0 w-24 h-24 border-t-2 border-r-2 border-primary/20 rounded-tr-[1.5rem]" />
            <div className="absolute bottom-0 left-0 w-24 h-24 border-b-2 border-l-2 border-primary/20 rounded-bl-[1.5rem]" />
            <div className="absolute bottom-0 right-0 w-24 h-24 border-b-2 border-r-2 border-primary/20 rounded-br-[1.5rem]" />
          </div>
        </div>

        {/* Diagnostics Module */}
        <div className="lg:col-span-4 space-y-8">
          <div className="glass-card p-10 border-2 border-glass-border">
            <h3 className="text-sm font-black uppercase tracking-[0.4em] text-primary mb-10 flex items-center gap-3">
              <Award size={16} />
              Session Metrics
            </h3>
            <div className="grid grid-cols-1 gap-6">
              {[
                { label: 'Cumulative Focus', val: `${(state.pomodoro.totalMinutes / 60).toFixed(1)}h`, icon: Timer },
                { label: 'Neural Efficiency', val: '94%', icon: Activity },
                { label: 'Deep Nodes', val: state.pomodoro.sessionsDone.toString(), icon: Zap },
              ].map((stat, i) => (
                <div key={i} className="flex flex-col items-center p-6 bg-white/5 rounded-3xl border border-glass-border group hover:border-primary/40 transition-all">
                  <stat.icon className="text-primary/40 mb-4 group-hover:text-primary transition-colors" size={24} />
                  <span className="text-2xl font-black text-foreground mb-1">{stat.val}</span>
                  <span className="text-[10px] font-black uppercase tracking-widest text-foreground/30">{stat.label}</span>
                </div>
              ))}
              <div className="p-6 bg-primary/10 rounded-2xl border border-primary/20 group hover:bg-primary/20 transition-all shadow-inner">
                <p className="text-xs text-primary font-black uppercase tracking-widest mb-2">Focus Rewards</p>
                <p className="text-4xl font-black text-white">{state.pomodoro.sessionsDone * 100} XP</p>
              </div>
            </div>
          </div>

          <div className="glass-card p-10 group cursor-pointer border-2 border-glass-border bg-gradient-to-br from-yellow-500/5 to-transparent hover:border-yellow-500/30 transition-all relative overflow-hidden">
            <div className="absolute -right-8 -bottom-8 opacity-5 group-hover:opacity-10 transition-opacity">
              <Trophy size={160} />
            </div>
            <div className="flex justify-between items-start mb-8">
              <h3 className="text-sm font-black uppercase tracking-[0.4em] text-yellow-500">Peak Performance</h3>
              <Trophy className="text-yellow-500 group-hover:scale-110 transition-transform" size={20} />
            </div>
            <div className="text-center space-y-4">
                <p className="text-[10px] font-black uppercase tracking-[0.6em] text-primary">Temporal Sync Active</p>
                <h2 className="text-6xl sm:text-7xl md:text-9xl font-black tracking-tighter text-foreground italic flex justify-center tabular-nums">
                  {formatTime(timeLeft)}
                </h2>
              </div>
            <div className="space-y-6">
              <div>
                <p className="text-2xl font-black text-white tracking-tight">Hyper Focus lvl. 5</p>
                <p className="text-xs text-foreground/40 mt-1 font-semibold uppercase tracking-wider">Complete 2 more cycles to evolve</p>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-xs font-black uppercase tracking-widest">
                  <span className="text-yellow-500/60">Progress</span>
                  <span className="text-white">75%</span>
                </div>
                <div className="w-full h-2 bg-white/5 rounded-full overflow-hidden p-0.5 border border-white/5">
                  <div className="h-full bg-yellow-500 rounded-full shadow-[0_0_10px_rgba(234,179,8,0.5)]" style={{ width: '75%' }} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FocusMode;
