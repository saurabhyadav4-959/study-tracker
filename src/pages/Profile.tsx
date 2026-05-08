import React, { useState, useEffect } from 'react';
import { API_BASE_URL } from '../config';
import { User, Shield, Edit3, Save, Globe, Target, Terminal, ChevronRight, BookOpen, Layers, Music, MapPin, Crosshair, HelpCircle, Activity, Users } from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import QuantumSelect from '../components/ui/QuantumSelect';

const Profile = () => {
  const { state, dispatch } = useAppContext();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState(state.profile);
  const [managedNodes, setManagedNodes] = useState<any[]>([]);

  const fetchManagedNodes = async () => {
    if (state.currentUser?.role !== 'parent') return;
    const user = JSON.parse(localStorage.getItem('systemhub_active_user') || '{}');
    if (!user.token) return;
    try {
      const res = await fetch(`${API_BASE_URL}/api/parent/children`, {
        headers: { 'Authorization': `Bearer ${user.token}` }
      });
      const data = await res.json();
      if (Array.isArray(data)) {
        setManagedNodes(data);
      } else {
        setManagedNodes([]);
      }
    } catch (err) {
      console.error('Failed to fetch managed nodes', err);
      setManagedNodes([]);
    }
  };

  useEffect(() => {
    fetchManagedNodes();
  }, [state.currentUser]);

  const handleSeverLink = async (studentId: string) => {
    if (!window.confirm('WARNING: Are you sure you want to sever the neural link with this node?')) return;
    const user = JSON.parse(localStorage.getItem('systemhub_active_user') || '{}');
    try {
      const res = await fetch(`${API_BASE_URL}/api/parent/link/${studentId}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${user.token}` }
      });
      if (res.ok) fetchManagedNodes();
    } catch (err) {
      console.error('Failed to sever link', err);
    }
  };

  const handleSave = () => {
    dispatch.updateProfile(formData);
    setIsEditing(false);
  };

  const streams = ['Engineering', 'Medical', 'Commerce', 'Humanities'];
  const levels = ['1st Year', '2nd Year', '3rd Year', 'Final Year', 'Post Grad'];
  const preferences = ['Deep Focus', 'Silent Focus', 'Group Study', 'Flashcard Grind'];

  return (
    <div className="max-w-7xl mx-auto space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-1000">
      {/* Header section with specific breadcrumb */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 border-b border-glass-border pb-8">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-[10px] font-black tracking-[0.3em] text-primary/60 uppercase">
            <Activity size={12} className="animate-pulse" />
            Operational Mode • Mar 14, 2026
          </div>
          <h1 className="text-3xl md:text-5xl font-black tracking-tighter uppercase leading-tight text-foreground">Identity Manager</h1>
          <p className="text-xs md:text-sm text-foreground/40 font-semibold tracking-wide">Personalize your system identity and academic data.</p>
        </div>
        <button 
          onClick={isEditing ? handleSave : () => setIsEditing(true)}
          className={`group flex items-center justify-center gap-3 px-6 md:px-10 py-4 rounded-2xl font-black uppercase tracking-[0.2em] text-xs md:text-sm transition-all duration-500 hover:scale-[1.02] active:scale-95 w-full md:w-auto ${
            isEditing 
              ? 'bg-green-500/10 border-2 border-green-500 text-green-500 shadow-[0_0_30px_rgba(34,197,94,0.2)]' 
              : 'bg-primary/10 border-2 border-primary text-primary shadow-[0_0_30px_rgba(99,102,241,0.2)]'
          }`}
        >
          {isEditing ? <Save size={16} /> : <Edit3 size={16} />}
          {isEditing ? 'Sync Changes' : 'Modify Identity'}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 pt-4">
        {/* Left Column: Reimagined Identity Card */}
        <div className="lg:col-span-4 space-y-8">
          <div className="glass-card p-12 flex flex-col items-center relative overflow-hidden group border-2 border-glass-border">
            {/* Background geometric accents */}
            <div className="absolute inset-0 bg-gradient-to-b from-primary/5 to-transparent pointer-events-none" />
            <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full blur-[100px] -mr-32 -mt-32" />
            
            {/* The "S" Logo Container */}
            <div className="relative mb-10">
              <div className="w-56 h-56 rounded-[3rem] bg-gradient-to-br from-[#2a303c] to-[#1a1c1e] p-1 shadow-2xl relative">
                <div className="w-full h-full rounded-[2.8rem] bg-[#1a1c1e] overflow-hidden flex items-center justify-center border border-white/5 relative">
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-500/20 to-transparent" />
                  {/* Stylized "S" from the logo mockup */}
                  <div className="text-[120px] font-black text-foreground tracking-widest leading-none drop-shadow-[0_0_15px_rgba(255,255,255,0.1)]">S</div>
                </div>
              </div>
              {/* Green status checkmark */}
              <div className="absolute -bottom-2 -right-2 bg-green-500 w-12 h-12 rounded-2xl border-4 border-[#1a1c1e] flex items-center justify-center text-foreground shadow-xl">
                <Save size={24} strokeWidth={4} />
              </div>
            </div>

            <h2 className="text-3xl font-black tracking-tight mb-2 mb-4 text-center">{formData.name}</h2>
            <div className="space-y-2 w-full mb-8">
              <div className="px-6 py-2 bg-white/5 border border-white/5 rounded-full text-xs font-black uppercase tracking-[0.3em] text-white/30 w-full text-center">
                {formData.email || 'SAURABHY4959@GMAIL.COM'}
              </div>
              {state.currentUser?.studentCode && (
                <div className="px-6 py-2 bg-primary/10 border border-primary/20 rounded-full text-xs font-black uppercase tracking-[0.3em] text-primary w-full text-center group-hover:bg-primary/20 transition-all cursor-pointer" title="Click to copy Student ID">
                  ID: {state.currentUser.studentCode}
                </div>
              )}
            </div>
            
            <div className="flex flex-col gap-3 w-full">
              <div className="px-6 py-3 bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-black uppercase tracking-[0.2em] rounded-xl flex items-center justify-center gap-2">
                User Access: <span className="text-foreground uppercase">{state.currentUser?.role || 'SCOUT'}</span>
              </div>
              {state.currentUser?.role === 'student' && (
                <div className="px-6 py-3 bg-primary/10 border border-primary/20 text-primary text-xs font-black uppercase tracking-[0.2em] rounded-xl flex items-center justify-center gap-2">
                  {formData.academicStream} TRACK
                </div>
              )}
            </div>
            
            {state.currentUser?.role === 'student' && (
              <div className="mt-12 pt-12 border-t border-glass-border w-full grid grid-cols-2 gap-8 text-center">
                <div className="space-y-1">
                  <p className="text-4xl font-black text-foreground">{formData.xp}</p>
                  <p className="text-xs font-black uppercase tracking-widest text-foreground/40">Total XP</p>
                </div>
                <div className="space-y-1 border-l border-glass-border">
                  <p className="text-4xl font-black text-foreground">0</p>
                  <p className="text-xs font-black uppercase tracking-widest text-foreground/40">Mindfulness</p>
                </div>
              </div>
            )}
            {state.currentUser?.role === 'parent' && (
              <div className="mt-12 pt-12 border-t border-glass-border w-full text-center">
                <p className="text-4xl font-black text-primary uppercase italic tracking-tighter">Supervised</p>
                <p className="text-xs font-black uppercase tracking-widest text-foreground/40">Operational Status</p>
              </div>
            )}
          </div>

          <div className="glass-card p-10 bg-gradient-to-br from-primary/5 to-transparent border-primary/10 relative overflow-hidden group">
            <div className="absolute -top-10 -left-10 w-40 h-40 bg-primary/5 rounded-full blur-3xl" />
            <h3 className="text-xs font-black uppercase tracking-[0.3em] text-primary mb-6 flex items-center gap-3">
              <Terminal size={14} className="text-primary/70" />
              Your Motto / Statement
            </h3>
            <p className="text-base italic text-foreground/70 leading-relaxed font-semibold">
              "{formData.motivationStatement}"
            </p>
          </div>
        </div>

        {/* Right Column: High-Density Configuration */}
        <div className="lg:col-span-8 space-y-8">
          <div className="glass-card p-12 border-2 border-glass-border">
            <h3 className="text-sm font-black uppercase tracking-[0.4em] text-primary mb-12 flex items-center gap-3">
              <Target size={16} />
              System Preferences
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
              {state.currentUser?.role === 'student' && (
                <>
                  {/* Field 1: Primary Track */}
                  <div className="space-y-4">
                    <div className="flex items-center gap-3 text-xs uppercase tracking-[0.2em] font-black text-foreground/40 ml-1">
                      <BookOpen size={14} className="text-primary" />
                      Primary Track
                    </div>
                    <QuantumSelect 
                      disabled={!isEditing}
                      value={formData.academicStream}
                      onChange={(val) => setFormData({...formData, academicStream: val as any})}
                      options={streams}
                    />
                  </div>

                  {/* Field 2: Study Preference */}
                  <div className="space-y-4">
                    <div className="flex items-center gap-3 text-xs uppercase tracking-[0.2em] font-black text-foreground/40 ml-1">
                      <Music size={14} className="text-primary" />
                      Study Preference
                    </div>
                    <QuantumSelect 
                      disabled={!isEditing}
                      value={formData.studyPreference}
                      onChange={(val) => setFormData({...formData, studyPreference: val})}
                      options={preferences}
                    />
                  </div>
                </>
              )}

              {/* Field 3: Institution */}
              <div className="space-y-4">
                <div className="flex items-center gap-3 text-xs uppercase tracking-[0.2em] font-black text-foreground/40 ml-1">
                  <MapPin size={14} className="text-primary" />
                  Your Institution
                </div>
                <input 
                  disabled={!isEditing}
                  value={formData.institution}
                  onChange={(e) => setFormData({...formData, institution: e.target.value})}
                  className="quantum-input"
                  placeholder="e.g. slrtce"
                />
              </div>

              {state.currentUser?.role === 'student' && (
                <>
                  {/* Field 4: Daily XP Target */}
                  <div className="space-y-4">
                    <div className="flex items-center gap-3 text-xs uppercase tracking-[0.2em] font-black text-foreground/40 ml-1">
                      <Crosshair size={14} className="text-primary" />
                      Daily XP Target
                    </div>
                    <input 
                      type="number"
                      disabled={!isEditing}
                      value={formData.dailyXPTarget}
                      onChange={(e) => setFormData({...formData, dailyXPTarget: parseInt(e.target.value)})}
                      className="quantum-input"
                    />
                  </div>

                  {/* Field 5: Academic Level */}
                  <div className="space-y-4">
                    <div className="flex items-center gap-3 text-xs uppercase tracking-[0.2em] font-black text-foreground/40 ml-1">
                      <Layers size={14} className="text-primary" />
                      Academic Level
                    </div>
                    <QuantumSelect 
                      disabled={!isEditing}
                      value={formData.academicLevel}
                      onChange={(val) => setFormData({...formData, academicLevel: val})}
                      options={levels}
                    />
                  </div>
                </>
              )}

              {/* Field 6: Personal Hub */}
              <div className="space-y-4">
                <div className="flex items-center gap-3 text-xs uppercase tracking-[0.2em] font-black text-foreground/40 ml-1">
                  <Globe size={14} className="text-primary" />
                  Personal Hub / Link
                </div>
                <input 
                  disabled={!isEditing}
                  value={formData.personalHubLink}
                  onChange={(e) => setFormData({...formData, personalHubLink: e.target.value})}
                  className="quantum-input"
                  placeholder="https://yourpage.com"
                />
              </div>

              {/* Field 7: Motto Statement */}
              <div className="md:col-span-2 space-y-4 pt-4">
                <div className="flex items-center gap-3 text-xs uppercase tracking-[0.2em] font-black text-foreground/40 ml-1">
                  <Edit3 size={14} className="text-primary" />
                  System Motto
                </div>
                <textarea 
                  rows={4}
                  disabled={!isEditing}
                  value={formData.motivationStatement}
                  onChange={(e) => setFormData({...formData, motivationStatement: e.target.value})}
                  className="quantum-input resize-none"
                  placeholder="What drives you today?"
                />
              </div>
            </div>
          </div>

          <div className="glass-card p-6 md:p-10 flex flex-col sm:flex-row items-center justify-between group cursor-pointer hover:bg-primary/[0.05] border-2 border-glass-border gap-6">
            <div className="flex flex-col sm:flex-row items-center gap-6 md:gap-8 text-center sm:text-left">
              <div className="w-16 h-16 md:w-20 md:h-20 rounded-3xl bg-primary/10 flex items-center justify-center text-primary border border-primary/20 group-hover:scale-105 transition-all shadow-inner">
                <HelpCircle size={32} className="md:size-[36px]" />
              </div>
              <div>
                <h4 className="text-xl md:text-2xl font-black tracking-tight mb-1">Advanced Diagnostics</h4>
                <p className="text-[10px] md:text-sm text-foreground/40 font-semibold tracking-wide uppercase leading-relaxed max-w-[200px] md:max-w-none">Review system metrics and biological sync status</p>
              </div>
            </div>
            <div className="w-12 h-12 md:w-14 md:h-14 rounded-2xl bg-white/5 flex items-center justify-center text-white/30 group-hover:bg-primary group-hover:text-white transition-all self-end sm:self-auto">
              <ChevronRight size={28} className="md:size-[32px]" />
            </div>
          </div>

          {/* Managed Nodes Registry (for Parents only) */}
          {state.currentUser?.role === 'parent' && (
            <div className="glass-card p-12 border-2 border-glass-border">
              <h3 className="text-sm font-black uppercase tracking-[0.4em] text-primary mb-12 flex items-center gap-3">
                <Users size={16} />
                Managed Nodes
              </h3>
              
              <div className="space-y-4">
                {managedNodes.map(node => (
                  <div key={node.id} className="flex flex-col sm:flex-row justify-between items-center bg-white/5 border border-glass-border rounded-2xl p-6 hover:bg-white/[0.08] transition-colors gap-6">
                     <div className="flex items-center gap-4 w-full sm:w-auto">
                        <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary font-black text-xl uppercase shadow-inner border border-primary/20">
                          {(node.name || 'U').charAt(0)}
                        </div>
                        <div>
                           <h4 className="font-black text-lg tracking-wide uppercase">{node.name || 'Unknown Node'}</h4>
                           <p className="text-xs font-bold text-foreground/40">{node.email || 'NO EMAIL'}</p>
                        </div>
                     </div>
                     <div className="flex items-center gap-4 w-full sm:w-auto justify-between sm:justify-end">
                        <span className="px-4 py-2 bg-foreground/5 rounded-xl border border-glass-border text-xs font-black text-foreground/60 tracking-widest truncate max-w-[120px]">
                          {node.id}
                        </span>
                        <button 
                          onClick={() => handleSeverLink(node.id)}
                          className="px-6 py-2.5 bg-red-500/10 hover:bg-red-500 text-red-500 hover:text-white border-2 border-red-500/20 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all active:scale-95"
                        >
                          Remove
                        </button>
                     </div>
                  </div>
                ))}
                
                {managedNodes.length === 0 && (
                  <div className="text-center p-12 bg-white/5 border border-glass-border border-dashed rounded-2xl">
                     <p className="text-xs font-black uppercase tracking-[0.4em] text-foreground/30">No Active Student Nodes Linked</p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;
