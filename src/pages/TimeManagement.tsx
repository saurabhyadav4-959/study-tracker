import React, { useState } from 'react';
import { Clock, AlertCircle, Zap, Timer, Brain, ChevronRight, Calculator, Radio, Activity, Shield } from 'lucide-react';
import { useAppContext } from '../context/AppContext';

const BandwidthAllocation = () => {
  const { state } = useAppContext();
  const activityCount = state.activityLogs.filter(l => l.intensity > 0).length;
  const isNewUser = activityCount < 2;
  
  const [importance, setImportance] = useState('Medium');
  const [timeReq, setTimeReq] = useState(60);
  const [stress, setStress] = useState('Medium');
  const [recommendation, setRecommendation] = useState<null | { action: string, color: string, border: string, text: string, reason: string }>(null);

  const analyzePriority = () => {
    let score = 0;
    if (importance === 'High') score += 5;
    else if (importance === 'Medium') score += 3;
    else score += 1;

    if (stress === 'High') score += 3;
    else if (stress === 'Medium') score += 2;
    else score += 1;

    if (timeReq < 30) score += 4;
    else if (timeReq < 120) score += 2;
    else score += 1;

    if (score >= 9) {
      setRecommendation({ 
        action: 'EXECUTE NOW', 
        color: 'bg-red-500/10', 
        border: 'border-red-500/30',
        text: 'text-red-500',
        reason: 'High impact and immediate feasibility identified. Critical path component requiring immediate focus.' 
      });
    } else if (score >= 6) {
      setRecommendation({ 
        action: 'SCHEDULE NODE', 
        color: 'bg-yellow-500/10', 
        border: 'border-yellow-500/30',
        text: 'text-yellow-500',
        reason: 'Significant value but requires a dedicated deep-work window. Optimal for next high-energy cycle.' 
      });
    } else {
      setRecommendation({ 
        action: 'DEFER PROTOCOL', 
        color: 'bg-blue-500/10', 
        border: 'border-blue-500/30',
        text: 'text-blue-500',
        reason: 'Distraction potential high. Defer to low-energy windows or automate via existing systems.' 
      });
    }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-1000">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 border-b border-glass-border pb-8">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-[10px] font-black tracking-[0.3em] text-primary/60 uppercase mb-2">
            <Radio size={12} className="animate-pulse" />
            Neural Link Active
          </div>
          <h1 className="text-4xl md:text-6xl font-black tracking-tighter uppercase italic">Neural Sync</h1>
          <p className="text-foreground/40 font-semibold tracking-wide max-w-xl">Algorithmic priority calculation and cognitive bandwidth distribution mapping.</p>
        </div>
        <button 
          onClick={() => {
            alert('SIGNAL SENT: CHECK PARENT DASHBOARD');
          }}
          className="px-6 py-3 bg-primary/10 border-2 border-primary/20 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] text-primary hover:bg-primary/20 hover:border-primary/40 transition-all shadow-[0_0_30px_rgba(99,102,241,0.1)] active:scale-95 group"
        >
          <span className="flex items-center gap-2">
            <Zap size={14} className="fill-current group-hover:animate-pulse" />
            Test Neural Link
          </span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        {/* Calculator Control Panel */}
        <div className="lg:col-span-7 glass-card p-6 md:p-10 border-2 border-glass-border relative overflow-hidden group">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/[0.02] to-transparent pointer-events-none" />
          <h3 className="text-sm font-black uppercase tracking-[0.4em] text-primary mb-12 flex items-center gap-3 relative z-10">
            <Calculator size={16} />
            Priority Vector Calculator
          </h3>
          
          <div className="space-y-12 relative z-10">
            <div className="space-y-6">
              <label className="text-xs uppercase tracking-[0.4em] font-black text-foreground/50 ml-1">Importance Protocol</label>
              <div className="grid grid-cols-3 gap-4">
                {['Low', 'Medium', 'High'].map((level) => (
                  <button
                    key={level}
                    onClick={() => setImportance(level)}
                    className={`py-3 md:py-5 rounded-2xl border-2 transition-all font-black uppercase tracking-widest text-xs ${importance === level ? 'bg-primary/20 border-primary text-primary shadow-[0_0_20px_rgba(99,102,241,0.2)]' : 'bg-white/5 border-glass-border text-foreground/40 hover:bg-white/10 hover:border-white/20'}`}
                  >
                    {level}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-6">
              <div className="flex justify-between items-end ml-1">
                <label className="text-xs uppercase tracking-[0.4em] font-black text-foreground/50">Time Requirement Nodes</label>
                <span className="text-3xl font-black text-primary tracking-tighter italic">{timeReq} <span className="text-xs text-foreground/40 italic tracking-widest">MINS</span></span>
              </div>
              <div className="relative group/slider">
                <input 
                  type="range" min="5" max="240" step="5"
                  value={timeReq}
                  onChange={(e) => setTimeReq(parseInt(e.target.value))}
                  className="w-full h-1.5 bg-white/5 rounded-full appearance-none cursor-crosshair accent-primary border border-white/5"
                />
                <div className="flex justify-between mt-4 text-sm font-black text-foreground/40 uppercase tracking-[0.2em]">
                  <span>Micro Sync</span>
                  <span>Deep Work Core</span>
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <label className="text-xs uppercase tracking-[0.4em] font-black text-foreground/50 ml-1">Neuro-Stress Threshold</label>
              <div className="grid grid-cols-3 gap-4">
                {['Low', 'Medium', 'High'].map((level) => (
                  <button
                    key={level}
                    onClick={() => setStress(level)}
                    className={`py-3 md:py-5 rounded-2xl border-2 transition-all font-black uppercase tracking-widest text-xs ${stress === level ? 'bg-secondary/20 border-secondary text-secondary shadow-[0_0_20px_rgba(168,85,247,0.2)]' : 'bg-white/5 border-glass-border text-foreground/40 hover:bg-white/10 hover:border-white/20'}`}
                  >
                    {level}
                  </button>
                ))}
              </div>
            </div>

            <button 
              onClick={analyzePriority}
              className="w-full py-6 bg-primary text-white font-black uppercase tracking-[0.4em] text-sm rounded-[2rem] shadow-[0_0_40px_rgba(99,102,241,0.3)] hover:shadow-[0_0_60px_rgba(99,102,241,0.5)] hover:scale-[1.02] active:scale-[0.98] transition-all border border-primary/20 mt-4"
            >
              Analyze Priority Vector
            </button>
          </div>
        </div>

        {/* Results & Analytics */}
        <div className="lg:col-span-5 space-y-8">
          <div className="glass-card p-6 md:p-10 min-h-[300px] md:min-h-[400px] flex flex-col items-center justify-center text-center relative overflow-hidden border-2 border-glass-border bg-gradient-to-br from-white/[0.01] to-transparent group">
            <div className="absolute inset-0 bg-primary/[0.02] mix-blend-overlay pointer-events-none" />
            {recommendation ? (
              <div className="relative z-10 animate-in zoom-in-95 duration-700 space-y-8">
                <div className={`mx-auto w-24 h-24 rounded-[2.5rem] ${recommendation.color} ${recommendation.border} border-2 flex items-center justify-center shadow-2xl relative`}>
                  <Zap className={`${recommendation.text} fill-current`} size={40} />
                   <div className={`absolute -inset-4 ${recommendation.color} blur-2xl opacity-20 animate-pulse`} />
                </div>
                <div className="space-y-2">
                  <h3 className="text-[10px] uppercase tracking-[0.5em] font-black text-primary">Core Recommendation</h3>
                  <h2 className={`text-3xl md:text-6xl font-black tracking-tighter italic uppercase ${recommendation.text}`}>{recommendation.action}</h2>
                </div>
                <p className="text-sm text-foreground/40 font-semibold leading-relaxed max-w-sm mx-auto italic">
                  "{recommendation.reason}"
                </p>
              </div>
            ) : (
              <div className="text-foreground/50 space-y-6 group-hover:text-foreground/40 transition-colors duration-700 relative z-10">
                <Brain size={60} className="mx-auto md:w-20 md:h-20" />
                <div className="space-y-2">
                   <p className="text-[10px] font-black uppercase tracking-[0.4em]">Intelligence Core Standby</p>
                   <p className="text-xs font-bold uppercase tracking-widest italic">Awaiting Input Nodes...</p>
                </div>
              </div>
            )}
            <div className="absolute -top-12 -right-12 text-foreground/5 transition-transform group-hover:scale-110 duration-1000 rotate-12">
              <Timer size={180} />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-8">
            <div className="glass-card p-6 md:p-8 border-2 border-glass-border hover:border-primary/30 transition-all group">
              <h4 className="text-[10px] md:text-sm font-black uppercase tracking-[0.3em] text-foreground/50 mb-4 md:mb-6 flex items-center gap-3">
                <Clock size={12} />
                Peak Focus Window
              </h4>
              <p className="text-lg md:text-xl font-black text-foreground italic group-hover:text-primary transition-colors tracking-widest whitespace-nowrap">
                {isNewUser ? 'CALIBRATING...' : '14:00 - 16:30'}
              </p>
              <div className="mt-4 flex items-center gap-2">
                 <div className={`w-1.5 h-1.5 rounded-full ${isNewUser ? 'bg-foreground/20' : 'bg-primary animate-pulse'}`} />
                 <p className={`text-[9px] md:text-[10px] ${isNewUser ? 'text-foreground/40' : 'text-primary'} font-black uppercase tracking-widest whitespace-nowrap`}>
                   {isNewUser ? 'Insufficient Data Node' : 'Optimal Sync Predictive'}
                 </p>
              </div>
            </div>
            <div className="glass-card p-8 border-2 border-glass-border hover:border-green-500/30 transition-all group">
              <h4 className="text-sm font-black uppercase tracking-[0.3em] text-foreground/50 mb-6 flex items-center gap-3">
                <Shield size={12} />
                Entropy Risk
              </h4>
              <p className="text-3xl font-black text-green-500 italic tracking-tighter">
                {isNewUser ? '-- %' : '12%'}
              </p>
              <div className="mt-4 flex items-center gap-2">
                 <div className="w-1.5 h-1.5 rounded-full bg-green-500" />
                 <p className="text-sm text-green-500/60 font-black uppercase tracking-widest">
                   {isNewUser ? 'Baseline Stability' : 'Minimal Data Noise'}
                 </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BandwidthAllocation;
