import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Radio, Shield, Fingerprint, ChevronRight, Zap, Mail, Lock } from 'lucide-react';

const Login = () => {
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [users, setUsers] = useState<any[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    // Load existing local users
    const storedUsers = localStorage.getItem('systemhub_users');
    if (storedUsers) {
      try {
        setUsers(JSON.parse(storedUsers));
      } catch (e) {
        setUsers([]);
      }
    }

    // Auto-redirect if already active
    const activeSession = localStorage.getItem('systemhub_active_user');
    if (activeSession) {
      navigate('/');
    }
  }, [navigate]);

  const handleAuth = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    let activeUser;

    if (mode === 'login') {
      // Find user by email and verify password
      const user = users.find(u => u.email.toLowerCase() === email.toLowerCase());
      if (!user) {
        setError('NODE NOT FOUND IN SYSTEM ARCHIVE');
        return;
      }
      if (user.password !== password) {
        setError('INVALID CREDENTIALS: AUTH DENIED');
        return;
      }
      activeUser = { id: user.id, username: user.username, email: user.email };
    } else {
      // Register New User
      if (!username.trim() || !email.trim() || !password.trim()) {
        setError('ALL NEURAL FIELDS REQUIRED');
        return;
      }

      if (users.some(u => u.email.toLowerCase() === email.toLowerCase())) {
        setError('EMAIL ALREADY INDEXED IN SYSTEM');
        return;
      }

      const newId = `node_${Math.random().toString(36).substr(2, 9)}`;
      const newUser = {
        id: newId,
        username: username.trim(),
        email: email.trim().toLowerCase(),
        password: password // In real app, hash this
      };
      
      const updatedUsers = [...users, newUser];
      localStorage.setItem('systemhub_users', JSON.stringify(updatedUsers));
      setUsers(updatedUsers);
      
      activeUser = { id: newUser.id, username: newUser.username, email: newUser.email };
    }

    // Set active session
    localStorage.setItem('systemhub_active_user', JSON.stringify(activeUser));
    
    // Simulate boot sequence
    setTimeout(() => {
      window.location.href = '/'; 
    }, 800);
  };

  return (
    <div className="min-h-screen bg-[#060608] text-white flex items-center justify-center p-6 relative overflow-hidden font-sans">
      {/* Premium Background Elements */}
      <div className="absolute inset-0 z-0 opacity-[0.05] pointer-events-none" style={{ backgroundImage: 'radial-gradient(#6366f1 1px, transparent 1px)', backgroundSize: '30px 30px' }} />
      <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-primary/10 via-transparent to-secondary/10 pointer-events-none" />
      <div className="absolute -top-[20%] -left-[10%] w-[60%] h-[60%] bg-primary/20 rounded-full blur-[150px] opacity-20 animate-pulse pointer-events-none" />
      <div className="absolute -bottom-[20%] -right-[10%] w-[60%] h-[60%] bg-secondary/20 rounded-full blur-[150px] opacity-20 animate-pulse pointer-events-none" />

      <div className="relative z-10 w-full max-w-[440px] glass-card border border-white/10 bg-[#121217]/60 backdrop-blur-3xl shadow-[0_0_100px_rgba(0,0,0,0.5)] overflow-hidden animate-in fade-in zoom-in duration-1000">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary via-secondary to-primary" />
        
        <div className="p-12">
          <div className="text-center mb-12">
            <div className="w-24 h-24 bg-primary/10 rounded-[2.5rem] flex items-center justify-center mx-auto mb-8 relative group">
              <div className="absolute inset-0 bg-primary/20 blur-xl group-hover:bg-primary/30 transition-all duration-700" />
              <Zap className="text-primary relative z-10 drop-shadow-[0_0_15px_rgba(99,102,241,0.8)]" size={48} fill="currentColor" />
            </div>
            <h1 className="text-5xl font-black tracking-tighter text-white uppercase italic leading-none mb-4">
              System<span className="text-primary">Hub</span>
            </h1>
            <div className="inline-block px-4 py-1.5 rounded-full bg-white/5 border border-white/10">
              <p className="text-[10px] font-black uppercase tracking-[0.5em] text-white/40">Neural Identity Protocol v0.1</p>
            </div>
          </div>    

          <div className="space-y-8">
            <div className="flex items-center gap-4">
              <div className="h-[1px] flex-1 bg-gradient-to-r from-transparent to-white/10" />
              <span className="text-[10px] font-black tracking-[0.4em] uppercase text-primary">
                {mode === 'login' ? 'Validate Access' : 'Initialize Node'}
              </span>
              <div className="h-[1px] flex-1 bg-gradient-to-l from-transparent to-white/10" />
            </div>

            <form onSubmit={handleAuth} className="space-y-6">
              {error && (
                <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-2xl text-[10px] font-black tracking-widest text-red-500 uppercase text-center animate-shake">
                  {error}
                </div>
              )}

              <div className="space-y-4">
                {mode === 'register' && (
                  <div className="relative group/input">
                    <Fingerprint className="absolute left-5 top-1/2 -translate-y-1/2 text-white/20 group-focus-within/input:text-primary transition-colors" size={20} />
                    <input 
                      required
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      placeholder="OPERATOR NAME" 
                      className="w-full bg-black/40 border border-white/5 rounded-2xl pl-14 pr-6 py-5 text-xs focus:outline-none focus:border-primary focus:bg-primary/5 transition-all placeholder:text-white/10 font-black uppercase tracking-widest text-white" 
                    />
                  </div>
                )}

                <div className="relative group/input">
                  <Mail className="absolute left-5 top-1/2 -translate-y-1/2 text-white/20 group-focus-within/input:text-primary transition-colors" size={20} />
                  <input 
                    required
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="NEURAL ADDRESS" 
                    className="w-full bg-black/40 border border-white/5 rounded-2xl pl-14 pr-6 py-5 text-xs focus:outline-none focus:border-primary focus:bg-primary/5 transition-all placeholder:text-white/10 font-black uppercase tracking-widest text-white" 
                  />
                </div>

                <div className="relative group/input">
                  <Lock className="absolute left-5 top-1/2 -translate-y-1/2 text-white/20 group-focus-within/input:text-primary transition-colors" size={20} />
                  <input 
                    required
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="ACCESS KEYCODE" 
                    className="w-full bg-black/40 border border-white/5 rounded-2xl pl-14 pr-6 py-5 text-xs focus:outline-none focus:border-primary focus:bg-primary/5 transition-all placeholder:text-white/10 font-black uppercase tracking-widest text-white" 
                  />
                </div>
              </div>
              
              <button 
                type="submit" 
                className="w-full py-6 bg-primary text-white font-black uppercase tracking-[0.4em] text-xs rounded-2xl shadow-[0_20px_50px_rgba(99,102,241,0.2)] hover:shadow-[0_20px_70px_rgba(99,102,241,0.4)] transition-all transform active:scale-95 border border-primary/20 flex items-center justify-center gap-3 relative overflow-hidden group/btn"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-primary via-white/20 to-primary translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
                <span className="relative z-10 flex items-center gap-3">
                  <Zap size={16} fill="currentColor" /> {mode === 'login' ? 'Authorize Identity' : 'Synthesize Neural Node'}
                </span>
              </button>

              <div className="pt-6 text-center">
                <button 
                  type="button"
                  onClick={() => {
                    setMode(mode === 'login' ? 'register' : 'login');
                    setError('');
                  }}
                  className="text-[10px] font-black tracking-[0.3em] uppercase text-white/30 hover:text-primary transition-all hover:tracking-[0.4em]"
                >
                  {mode === 'login' ? "Initialize New Authentication Node" : "Return to Validation Sequence"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
