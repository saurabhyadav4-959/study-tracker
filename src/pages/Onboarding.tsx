import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Shield, Zap, User as UserIcon, ChevronRight, Cpu } from 'lucide-react';

const Onboarding = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleRoleSelection = async (role: 'student' | 'parent') => {
    setLoading(true);
    setError('');
    
    // Neural Link Verification
    const userSession = JSON.parse(localStorage.getItem('systemhub_active_user') || '{}');
    if (!userSession.token) {
      navigate('/login');
      return;
    }

    try {
      // Relative path to current base
      const response = await fetch('api/auth/role', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${userSession.token}`
        },
        body: JSON.stringify({ role })
      });

      // Safe Response Parsing
      const contentType = response.headers.get("content-type");
      if (!contentType || !contentType.includes("application/json")) {
        throw new Error(`CORE PROTOCOL ERROR: EXPECTED JSON, RECEIVED ${response.status} DOCUMENT`);
      }

      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'DIVERGENCE REJECTED');

      // Update Local Pulse Data
      const updatedUser = {
        ...userSession,
        role: role,
        studentCode: data.user.studentCode
      };
      
      localStorage.setItem('systemhub_active_user', JSON.stringify(updatedUser));

      // Neural Stabilization Sequence - Immediate Redirection with Full Reload
      // Using direct window.location for absolute role sync across all components
      const targetPath = role === 'parent' ? '#/parent/dashboard' : '#/dashboard';
      
      setTimeout(() => {
        window.location.href = window.location.origin + window.location.pathname + targetPath;
        window.location.reload();
      }, 1000);

    } catch (err: any) {
      setError(err.message.toUpperCase());
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a0c] text-foreground flex items-center justify-center p-6 relative overflow-hidden font-['Inter']">
      {/* Background Grid & Particles */}
      <div className="absolute inset-0 z-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'radial-gradient(var(--primary) 1px, transparent 1px)', backgroundSize: '24px 24px' }} />
      <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] bg-primary/20 rounded-full blur-[120px] pointer-events-none mix-blend-screen opacity-30" />
      <div className="absolute bottom-[-20%] right-[-10%] w-[60%] h-[60%] bg-secondary/20 rounded-full blur-[120px] pointer-events-none mix-blend-screen opacity-30" />
      
      <div className="relative z-10 w-full max-w-5xl">
        <div className="text-center mb-20">
          <div className="relative inline-block mb-10">
            <div className="w-24 h-24 bg-primary/5 rounded-[2rem] flex items-center justify-center border border-white/10 backdrop-blur-3xl relative z-10 group overflow-hidden">
               <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
               <Cpu className="text-primary animate-pulse-slow relative z-20" size={48} />
            </div>
            <div className="absolute inset-0 bg-primary/20 rounded-[2rem] blur-2xl animate-pulse-slow" />
          </div>
          <h1 className="text-7xl font-black tracking-tighter uppercase italic leading-none mb-4">
            System <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent drop-shadow-[0_0_15px_rgba(99,102,241,0.3)]">Identity</span>
          </h1>
          <p className="text-xs font-black uppercase tracking-[0.8em] text-white/20">Select your operational protocol</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          {[
            { 
              id: 'student', 
              icon: UserIcon, 
              title: 'Student', 
              color: 'primary', 
              desc: 'Optimize academic trajectories, manage tasks, and streamline deep focus cycles. Identity shared via unique neural code.',
              action: 'Initialize Student Protocol',
              accent: <Zap size={160} className="text-primary group-hover:scale-110 transition-transform duration-1000" />
            },
            { 
              id: 'parent', 
              icon: Shield, 
              title: 'Parent', 
              color: 'secondary', 
              desc: 'Oversee student progress, analyze performance metrics, and assign strategic milestones via standard neural links.',
              action: 'Initialize Parent Protocol',
              accent: <Shield size={160} className="text-secondary group-hover:scale-110 transition-transform duration-1000" />
            }
          ].map((node) => (
            <button 
              key={node.id}
              disabled={loading}
              onClick={() => handleRoleSelection(node.id as any)}
              className={`group relative bg-white/[0.02] border-2 border-white/5 p-12 rounded-[3.5rem] text-left transition-all duration-700 hover:border-${node.color}/40 hover:bg-${node.color}/10 hover:shadow-[0_40px_80px_rgba(0,0,0,0.4)] transform hover:-translate-y-2 overflow-hidden backdrop-blur-xl`}
            >
              {/* Animated Background Aura */}
              <div className={`absolute top-0 right-0 p-12 opacity-[0.03] group-hover:opacity-10 transition-opacity duration-1000 pointer-events-none`}>
                 {node.accent}
              </div>
              
              <div className="relative z-10 space-y-8">
                <div className={`w-20 h-20 bg-${node.color}/10 rounded-3xl flex items-center justify-center text-${node.color} border border-${node.color}/20 group-hover:scale-105 transition-all duration-500 shadow-inner group-hover:shadow-${node.color}/20`}>
                  <node.icon size={40} />
                </div>
                
                <div className="space-y-4">
                  <h3 className={`text-4xl font-black uppercase italic tracking-tighter text-foreground group-hover:text-white transition-colors`}>{node.title}</h3>
                  <p className="text-foreground/40 text-base font-medium leading-relaxed max-w-[90%]">
                    {node.desc}
                  </p>
                </div>
                
                <div className={`flex items-center gap-3 text-[11px] font-black uppercase tracking-[0.2em] text-${node.color} pt-6 opacity-60 group-hover:opacity-100 transition-opacity`}>
                   <div className={`w-8 h-[2px] bg-${node.color}/20`} />
                   {loading ? 'Initializing...' : node.action}
                   <ChevronRight size={16} className="group-hover:translate-x-2 transition-transform duration-500" />
                </div>
              </div>

              {/* Interaction Ripple */}
              <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
            </button>
          ))}
        </div>

        {error && (
          <div className="mt-16 text-center animate-bounce-slow">
            <div className="inline-flex items-center gap-3 px-8 py-4 bg-red-500/10 border-2 border-red-500/20 rounded-2xl">
              <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
              <p className="text-[10px] font-black text-red-500 uppercase tracking-[0.4em]">
                {error}
              </p>
            </div>
            <div className="flex flex-col items-center gap-6 mt-20 pt-12 border-t border-white/5">
              <p className="text-[10px] font-black uppercase tracking-[0.4em] text-white/20">Operational Desync? Try Identity Re-Sync</p>
              <button 
                onClick={() => {
                  localStorage.removeItem('systemhub_active_user');
                  window.location.href = '#/login';
                  window.location.reload();
                }}
                className="px-8 py-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-[10px] font-black uppercase tracking-widest text-white/40 hover:text-white transition-all active:scale-95"
              >
                Reset Thermal Connection
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Onboarding;
