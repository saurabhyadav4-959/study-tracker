import React, { useState } from 'react';
import { Rocket, Box, Database, Cpu, ChevronRight, TrendingUp, Medal, Activity, Radio, Target, Plus, CheckCircle2, MoreVertical, Layers } from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import { Priority } from '../types';

const SkillEvolution = () => {
  const { state, dispatch } = useAppContext();
  const [showForm, setShowForm] = useState(false);
  const [isInitializingSkill, setIsInitializingSkill] = useState(false);
  const [newTarget, setNewTarget] = useState({
    title: '',
    skillId: '',
    deadline: new Date().toISOString().split('T')[0],
  });
  const [newSkillData, setNewSkillData] = useState({
    name: '',
    category: 'Core Logic'
  });

  const handleAddTarget = () => {
    if (!newTarget.title || !newTarget.skillId) return;
    const selectedSkill = state.skills.find(s => s.id === newTarget.skillId);
    if (!selectedSkill) return;

    dispatch.addTask({
      id: Math.random().toString(36).substr(2, 9),
      title: newTarget.title,
      track: selectedSkill.name, // Use skill name as track
      deadline: newTarget.deadline,
      priority: 'High' as Priority,
      status: 'Todo'
    });
    
    setNewTarget({
      title: '',
      skillId: '',
      deadline: new Date().toISOString().split('T')[0],
    });
    setShowForm(false);
  };

  const handleInitializeSkill = () => {
    if (!newSkillData.name) return;
    dispatch.addSkill({
      name: newSkillData.name,
      category: newSkillData.category
    });
    setNewSkillData({ name: '', category: 'Core Logic' });
    setIsInitializingSkill(false);
  };

  const totalXP = state.profile.xp || 0;
  const getRank = (xp: number) => {
    if (xp >= 1000) return 'Grandmaster I';
    if (xp >= 500) return 'Veteran III';
    if (xp >= 200) return 'Adept II';
    if (xp >= 100) return 'Apprentice IV';
    return 'Novice I';
  };

  const tasksDone = state.tasks.filter(t => t.status === 'Done').length;
  const totalTasks = state.tasks.length;
  const consistencyVelocity = totalTasks > 0 ? Math.round((tasksDone / totalTasks) * 100) : 0;
  const skillCount = state.skills.length;
  const avgProgress = skillCount > 0 ? Math.round(state.skills.reduce((acc, s) => acc + s.progress, 0) / skillCount) : 0;

  return (
    <div className="max-w-7xl mx-auto space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-1000">
      {/* Dynamic Header */}
      <div className="flex justify-between items-start">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-xs font-black tracking-[0.3em] text-primary/60 uppercase">
            <Radio size={12} className="animate-pulse" />
            Skill matrix synchronization active
          </div>
          <h1 className="text-5xl font-black tracking-tighter uppercase leading-tight">Skill Evolution</h1>
          <p className="text-foreground/40 font-semibold tracking-wide">Monitor your technical talent pulse and neural evolution across all core skill nodes.</p>
        </div>
        <div className="flex items-center gap-4">
          <button 
            onClick={() => setShowForm(!showForm)}
            className="px-6 py-3 bg-primary/10 text-primary border border-primary/20 font-black uppercase tracking-[0.2em] text-[10px] rounded-xl hover:bg-primary/20 hover:scale-105 active:scale-95 transition-all flex items-center gap-2"
          >
            <Plus size={14} />
            <span>{showForm ? 'Cancel Sync' : 'Set Skill Target'}</span>
          </button>
          <div className="glass-card px-8 py-4 border-2 border-yellow-500/20 flex items-center gap-4 bg-yellow-500/5 shadow-[0_0_20px_rgba(234,179,8,0.05)]">
            <Medal className="text-yellow-500 animate-bounce" size={24} />
            <div className="flex flex-col">
              <span className="text-sm font-black uppercase tracking-[0.2em] text-yellow-500/60">
                Mastery Level
              </span>
              <span className="text-xl font-black text-foreground leading-none uppercase">{getRank(totalXP)}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Inline Goal Form */}
      {showForm && (
        <div className="glass-card p-10 border-2 border-primary/30 bg-gradient-to-br from-primary/[0.05] to-transparent animate-in zoom-in-95 duration-500">
           <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="space-y-4">
                <label className="text-[10px] font-black uppercase tracking-[0.4em] text-foreground/40 ml-1">Target Definition</label>
                <input 
                  value={newTarget.title}
                  onChange={e => setNewTarget({...newTarget, title: e.target.value})}
                  className="quantum-input font-black uppercase placeholder:text-foreground/30 text-sm"
                  placeholder="e.g. Build REST API..."
                />
              </div>
              <div className="space-y-4">
                <label className="text-[10px] font-black uppercase tracking-[0.4em] text-foreground/40 ml-1">Assigned Skill Node</label>
                <select
                  value={newTarget.skillId}
                  onChange={e => setNewTarget({...newTarget, skillId: e.target.value})}
                  className="w-full bg-background border border-glass-border rounded-xl px-5 py-4 text-xs font-black uppercase tracking-widest text-foreground outline-none focus:border-primary appearance-none cursor-pointer"
                >
                  <option className="bg-background text-foreground" value="" disabled>Select Skill...</option>
                  {state.skills.map(skill => (
                    <option className="bg-background text-foreground" key={skill.id} value={skill.id}>{skill.name}</option>
                  ))}
                </select>
              </div>
              <div className="space-y-4">
                <label className="text-[10px] font-black uppercase tracking-[0.4em] text-foreground/40 ml-1">Deadline Date</label>
                <div className="flex gap-4">
                  <input 
                    type="date"
                    value={newTarget.deadline}
                    onChange={e => setNewTarget({...newTarget, deadline: e.target.value})}
                    className="quantum-input font-black uppercase flex-1 text-xs"
                  />
                  <button 
                    onClick={handleAddTarget}
                    className="px-6 bg-primary text-white font-black uppercase tracking-widest text-[10px] rounded-xl hover:shadow-[0_0_20px_rgba(99,102,241,0.4)] transition-all active:scale-95 border border-primary/20"
                  >
                    Lock Target
                  </button>
                </div>
              </div>
           </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        {/* Progression Feed */}
        <div className="lg:col-span-8 space-y-8">
          <div className="glass-card p-10 border-2 border-glass-border relative overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/[0.02] to-transparent pointer-events-none" />
            <h3 className="text-sm font-black uppercase tracking-[0.4em] text-primary mb-10 flex items-center gap-3 relative z-10">
              <TrendingUp size={16} />
              Evolutionary Vector
            </h3>
            
            <div className="space-y-8 relative z-10">
              {state.skills.map((skill) => (
                <div key={skill.id} className="group p-6 rounded-2xl bg-foreground/[0.02] border border-glass-border hover:bg-primary/[0.03] hover:border-primary/30 transition-all duration-500">
                  <div className="flex justify-between items-end mb-6">
                    <div className="flex items-center gap-6">
                      <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-all shadow-inner border border-primary/10">
                        <Box size={24} />
                      </div>
                      <div>
                        <h4 className="text-xl font-black tracking-tight uppercase group-hover:text-primary transition-colors text-foreground">{skill.name}</h4>
                        <p className="text-sm text-foreground/50 font-black uppercase tracking-[0.2em] mt-1">{skill.category} • {skill.streak} Day Neural Sync</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="text-2xl font-black text-foreground">{skill.progress}%</span>
                      <p className="text-xs font-black uppercase tracking-widest text-foreground/40 italic">Mastery Completion</p>
                    </div>
                  </div>
                  <div className="w-full h-3 bg-foreground/5 rounded-full overflow-hidden p-0.5 border border-glass-border relative">
                    <div 
                      className="h-full bg-primary rounded-full transition-all duration-1000 shadow-[0_0_20px_rgba(99,102,241,0.5)] relative overflow-hidden" 
                      style={{ width: `${skill.progress}%` }} 
                    >
                      <div className="absolute inset-0 bg-[linear-gradient(90deg,transparent_0%,rgba(255,255,255,0.2)_50%,transparent_100%)] animate-shimmer" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="glass-card p-10 border-2 border-glass-border bg-gradient-to-br from-primary/[0.03] to-transparent">
            <h3 className="text-sm font-black uppercase tracking-[0.4em] text-primary mb-10 flex items-center gap-3">
              <Database size={16} />
              Talent Pulse Matrix
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
              {[
                { label: 'Logic', val: avgProgress + 5 },
                { label: 'Architecture', val: Math.min(100, (skillCount * 15)) },
                { label: 'Creativity', val: Math.min(100, (tasksDone * 8)) },
                { label: 'Focus', val: Math.min(100, Math.round(state.pomodoro.totalMinutes / 6)) },
                { label: 'Stability', val: consistencyVelocity },
                { label: 'Speed', val: Math.max(0, 100 - (totalTasks - tasksDone) * 5) },
                { label: 'Complexity', val: Math.min(100, state.skills.filter(s => s.progress > 80).length * 25) },
                { label: 'Persistence', val: Math.min(100, consistencyVelocity + 10) },
              ].map((stat, idx) => (
                <div key={idx} className="p-6 bg-white/5 rounded-2xl border border-glass-border flex flex-col items-center text-center group hover:bg-white/10 hover:border-primary/40 transition-all duration-500">
                  <p className="text-sm text-foreground/50 font-black uppercase tracking-[0.2em] mb-3 group-hover:text-primary transition-colors">{stat.label}</p>
                  <p className="text-3xl font-black text-foreground tracking-widest leading-none">{stat.val}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Active Skill Targets list */}
          <div className="glass-card p-10 border-2 border-glass-border mt-8">
            <h3 className="text-sm font-black uppercase tracking-[0.4em] text-primary mb-10 flex items-center gap-3">
              <Target size={16} />
              Active Skill Targets
            </h3>
            
            <div className="space-y-4">
              {state.tasks.filter(t => state.skills.some(s => s.name === t.track)).length === 0 && (
                <div className="py-12 text-center border-2 border-dashed border-glass-border rounded-3xl">
                   <p className="text-[10px] font-black uppercase tracking-widest text-foreground/40">No localized skill targets locked. Initialize sync to begin.</p>
                </div>
              )}
              {state.tasks.filter(t => state.skills.some(s => s.name === t.track)).map(task => (
                <div key={task.id} className="group flex flex-col sm:flex-row items-start sm:items-center justify-between p-5 bg-white/[0.02] border border-glass-border rounded-2xl hover:bg-primary/[0.03] hover:border-primary/30 transition-all duration-500 gap-6">
                  <div className="flex items-center gap-5">
                    <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-all shadow-inner border border-primary/10 shrink-0">
                      <Layers size={18} />
                    </div>
                    <div>
                      <h4 className="font-black text-base tracking-tight uppercase group-hover:text-primary transition-colors text-foreground">{task.title}</h4>
                      <p className="text-[10px] text-foreground/50 uppercase tracking-[0.2em] font-black mt-1">{task.track} • Target: {task.deadline}</p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between w-full sm:w-auto gap-4 sm:border-l sm:border-white/5 sm:pl-4">
                    <div className={`px-3 py-1 rounded-[4px] border border-white/5 text-[9px] font-black uppercase tracking-widest ${task.status === 'Done' ? 'bg-green-500/10 text-green-500 border-green-500/20' : 'bg-white/5 text-foreground/40'}`}>
                      {task.status}
                    </div>
                    <div className="flex items-center gap-2">
                       <button 
                        onClick={() => dispatch.toggleTaskStatus(task.id)}
                        className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all ${task.status === 'Done' ? 'bg-green-500/10 text-green-500' : 'bg-white/5 text-foreground/40 hover:text-white hover:bg-white/10'}`}
                      >
                        <CheckCircle2 size={16} />
                      </button>
                      <button 
                        onClick={() => dispatch.removeTask(task.id)}
                        className="w-10 h-10 rounded-xl bg-white/5 text-foreground/50 hover:text-red-400 hover:bg-red-400/10 transition-all flex items-center justify-center"
                      >
                        <MoreVertical size={16} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Intelligence Hub */}
        <div className="lg:col-span-4 space-y-8">
          <div className="glass-card p-10 relative overflow-hidden group border-2 border-glass-border">
            <div className="absolute -top-12 -right-12 text-secondary opacity-5 group-hover:opacity-10 transition-all duration-700">
              <Cpu size={200} />
            </div>
            
            <div className="relative z-10">
              <h3 className="text-sm font-black uppercase tracking-[0.4em] text-secondary mb-12 flex items-center gap-3">
                <Cpu size={16} />
                Intelligence Core
              </h3>
              
              <div className="space-y-10">
                {[
                  { label: 'Consistency Velocity', val: `${consistencyVelocity}%`, icon: Activity, color: 'text-green-500' },
                  { label: 'Time Threshold Nodes', val: `${(state.pomodoro.totalMinutes / 60).toFixed(1)}h`, icon: Target, color: 'text-blue-500' },
                  { label: 'Complexity Average', val: `Grade ${avgProgress > 90 ? 'S' : avgProgress > 75 ? 'A' : avgProgress > 50 ? 'B' : 'C'}`, icon: Database, color: 'text-purple-500' },
                ].map((item, i) => (
                  <div key={i} className="flex justify-between items-center group/item cursor-pointer">
                    <div className="space-y-1">
                      <p className="text-sm text-foreground/50 font-black uppercase tracking-[0.2em]">{item.label}</p>
                      <p className="text-3xl font-black tracking-tighter text-foreground group-hover/item:text-primary transition-colors">{item.val}</p>
                    </div>
                    <div className={`w-12 h-12 rounded-xl bg-foreground/5 flex items-center justify-center text-foreground/40 group-hover/item:scale-110 group-hover/item:bg-primary group-hover/item:text-white transition-all border border-glass-border`}>
                      <ChevronRight size={24} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="glass-card p-10 border-none overflow-hidden relative group bg-gradient-to-br from-primary to-secondary p-0.5">
            <div className="bg-background w-full h-full rounded-[1.4rem] p-10 relative overflow-hidden">
              <div className="relative z-10 flex flex-col h-full justify-between min-h-[200px]">
                {isInitializingSkill ? (
                  <div className="space-y-4 pt-2">
                    <h4 className="text-xl font-black text-foreground uppercase tracking-tight">Node Architect</h4>
                    <div className="space-y-3">
                      <input 
                        value={newSkillData.name}
                        onChange={e => setNewSkillData({...newSkillData, name: e.target.value})}
                        placeholder="SKILL DESIGNATION..." 
                        className="w-full bg-foreground/5 border border-glass-border px-4 py-3 rounded-xl text-xs font-black uppercase tracking-widest outline-none focus:border-primary text-foreground"
                      />
                      <select
                        value={newSkillData.category}
                        onChange={e => setNewSkillData({...newSkillData, category: e.target.value})}
                        className="w-full bg-background border border-glass-border px-4 py-3 rounded-xl text-xs font-black uppercase tracking-widest outline-none focus:border-primary text-foreground appearance-none cursor-pointer"
                      >
                        {['Core Logic', 'Architecture', 'Creativity', 'Endurance'].map(cat => (
                          <option className="bg-background text-foreground" key={cat} value={cat}>{cat.toUpperCase()}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="w-14 h-14 rounded-2xl bg-primary/10 text-primary flex items-center justify-center border border-primary/20">
                      <Rocket size={28} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                    </div>
                    <h4 className="text-3xl font-black text-foreground leading-tight uppercase tracking-tighter">Sync New Skill Memory</h4>
                    <p className="text-xs text-foreground/40 font-semibold tracking-wide">Initialize a new evolution track to expand your neural footprint.</p>
                  </div>
                )}
                <div className="flex gap-2">
                  {isInitializingSkill && (
                    <button 
                      onClick={() => setIsInitializingSkill(false)}
                      className="w-1/3 mt-4 py-3 bg-white/5 border border-white/10 text-white/50 font-black uppercase tracking-widest text-[10px] rounded-xl hover:text-white transition-all active:scale-95 z-20"
                    >
                      Abort
                    </button>
                  )}
                  <button 
                    onClick={isInitializingSkill ? handleInitializeSkill : () => setIsInitializingSkill(true)}
                    className="flex-1 mt-4 py-4 bg-primary text-white font-black uppercase tracking-[0.2em] text-[10px] rounded-xl hover:shadow-[0_0_30px_rgba(99,102,241,0.4)] transition-all transform active:scale-95 border border-primary/20 z-20"
                  >
                    {isInitializingSkill ? 'Deploy Node' : 'Initialize Matrix'}
                  </button>
                </div>
              </div>
              <Rocket className="absolute -bottom-16 -right-16 text-primary/5 -rotate-45 transition-transform group-hover:scale-150 duration-1000 z-0" size={240} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SkillEvolution;
