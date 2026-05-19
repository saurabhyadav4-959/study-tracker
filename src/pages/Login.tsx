import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Shield, Zap, Mail, Lock, AlertCircle, Fingerprint } from 'lucide-react';
import { GoogleLogin } from '@react-oauth/google';
import { API_BASE_URL } from '../config';

const Login: React.FC = () => {
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleGoogleSuccess = async (tokenResponse: any) => {
    setLoading(true);
    setError('');
    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/google`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ credential: tokenResponse.credential || tokenResponse.access_token || tokenResponse.id_token }), // useGoogleLogin implicit flow might just give access_token, wait, let's use standard credential flow if possible or fetch userinfo, but our backend expects id_token. Actually we can use useGoogleLogin with flow: 'implicit' which gives access_token, but backend needs idToken.
      });
      
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'GOOGLE AUTH FAILED');

      localStorage.setItem('systemhub_active_user', JSON.stringify({
        id: data.user.id,
        name: data.user.name,
        email: data.user.email,
        role: data.user.role,
        studentCode: data.user.studentCode,
        token: data.token
      }));

      const role = data.user.role;
      if (!role || role === 'pending') {
        navigate('/onboarding');
      } else {
        const targetPath = role === 'parent' ? '#/parent/dashboard' : '#/dashboard';
        setTimeout(() => {
          const base = window.location.pathname.endsWith('/') ? window.location.pathname : window.location.pathname + '/';
          window.location.href = window.location.origin + base + targetPath;
          window.location.reload();
        }, 1000);
      }
    } catch (err: any) {
      setError(err.message.toUpperCase());
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const endpoint = mode === 'login' ? 'api/auth/login' : 'api/auth/register';
    const body = mode === 'login' 
      ? { email: email.toLowerCase().trim(), password } 
      : { name: username, email: email.toLowerCase().trim(), password };

    try {
      const response = await fetch(`${API_BASE_URL}/${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      });

      const contentType = response.headers.get("content-type");
      if (!contentType || !contentType.includes("application/json")) {
        throw new Error(`SYNCHRONIZATION ERROR: EXPECTED JSON PACKET, RECEIVED ${response.status} PAGE`);
      }

      const data = await response.json();

      if (!response.ok) {
        let errorMessage = data.message || 'NEURAL SYNCHRONIZATION FAILED';
        if (data.tip) errorMessage += ` - ${data.tip}`;
        throw new Error(errorMessage);
      }

      // Store in local storage
      localStorage.setItem('systemhub_active_user', JSON.stringify({
        id: data.user.id,
        name: data.user.name,
        email: data.user.email,
        role: data.user.role,
        studentCode: data.user.studentCode,
        token: data.token
      }));

      // Divergence Sequence based on role
      const role = data.user.role;
      if (!role || role === 'pending') {
        navigate('/onboarding');
      } else {
        const targetPath = role === 'parent' ? '#/parent/dashboard' : '#/dashboard';
        setTimeout(() => {
          const base = window.location.pathname.endsWith('/') ? window.location.pathname : window.location.pathname + '/';
          window.location.href = window.location.origin + base + targetPath;
          window.location.reload();
        }, 1000);
      }

    } catch (err: any) {
      setError(err.message.toUpperCase());
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a0c] text-foreground flex items-center justify-center p-6 relative overflow-hidden font-['Inter']">
      {/* Background Dynamics */}
      <div className="absolute inset-0 z-0 opacity-[0.05] pointer-events-none" style={{ backgroundImage: 'radial-gradient(var(--primary) 1px, transparent 1px)', backgroundSize: '40px 40px' }} />
      <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-primary/5 via-transparent to-secondary/5 pointer-events-none" />
      <div className="absolute top-[-25%] left-[-15%] w-[70%] h-[70%] bg-primary/10 rounded-full blur-[160px] pointer-events-none" />

      <div className="relative z-10 w-full max-w-xl">
        <div className="glass-card border-2 border-white/5 bg-white/[0.01] backdrop-blur-[100px] p-12 relative overflow-hidden group rounded-[3rem] shadow-[0_40px_100px_rgba(0,0,0,0.5)]">
          {/* Internal Glow */}
          <div className="absolute top-0 right-0 w-48 h-48 bg-primary/10 rounded-full blur-[100px] pointer-events-none group-hover:bg-primary/20 transition-all duration-1000" />
          
          <div className="relative z-10">
            <div className="text-center mb-16">
              <div className="w-20 h-20 bg-primary/10 rounded-[2rem] flex items-center justify-center mx-auto mb-8 border-2 border-primary/20 shadow-[0_0_30px_rgba(99,102,241,0.2)]">
                <Shield className="text-primary" size={40} />
              </div>
              <h2 className="text-5xl font-black tracking-tighter uppercase italic leading-none mb-3">
                System<span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">Hub</span>
              </h2>
              <p className="text-[10px] font-black uppercase tracking-[0.6em] text-white/20">Neural OS • Global Hub v0.3</p>
            </div>

            <div className="flex bg-white/5 p-2 rounded-[1.5rem] mb-12 border border-white/10">
              <button 
                onClick={() => setMode('login')}
                className={`flex-1 py-4 rounded-[1.2rem] text-[10px] font-black uppercase tracking-widest transition-all duration-500 ${mode === 'login' ? 'bg-primary text-white shadow-[0_10px_30px_rgba(99,102,241,0.4)]' : 'text-foreground/40 hover:text-foreground/80'}`}
              >
                Access Hub
              </button>
              <button 
                onClick={() => setMode('register')}
                className={`flex-1 py-4 rounded-[1.2rem] text-[10px] font-black uppercase tracking-widest transition-all duration-500 ${mode === 'register' ? 'bg-primary text-white shadow-[0_10px_30px_rgba(99,102,241,0.4)]' : 'text-foreground/40 hover:text-foreground/80'}`}
              >
                Synthesize Node
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-8">
              {error && (
                <div className="p-5 bg-red-400/5 border-2 border-red-500/20 rounded-[1.5rem] flex items-center gap-4 text-red-500 animate-pulse-slow">
                  <AlertCircle size={20} />
                  <p className="text-[10px] font-black uppercase tracking-widest leading-tight">{error}</p>
                </div>
              )}

              <div className="space-y-5">
                {mode === 'register' && (
                  <div className="relative group/input">
                    <Fingerprint className="absolute left-6 top-1/2 -translate-y-1/2 text-white/10 group-focus-within/input:text-primary transition-colors" size={22} />
                    <input 
                      required
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      placeholder="OPERATOR NAME" 
                      className="w-full bg-white/[0.03] border-2 border-white/5 rounded-[1.8rem] pl-16 pr-8 py-6 text-xs focus:outline-none focus:border-primary/40 focus:bg-primary/[0.02] transition-all outline-none text-foreground uppercase tracking-widest font-black placeholder:text-white/10" 
                    />
                  </div>
                )}

                <div className="relative group/input">
                  <Mail className="absolute left-6 top-1/2 -translate-y-1/2 text-white/10 group-focus-within/input:text-primary transition-colors" size={22} />
                  <input 
                    required
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="NEURAL ADDRESS (EMAIL)" 
                    className="w-full bg-white/[0.03] border-2 border-white/5 rounded-[1.8rem] pl-16 pr-8 py-6 text-xs focus:outline-none focus:border-primary/40 focus:bg-primary/[0.02] transition-all outline-none text-foreground uppercase tracking-widest font-black placeholder:text-white/10" 
                  />
                </div>

                <div className="relative group/input">
                  <Lock className="absolute left-6 top-1/2 -translate-y-1/2 text-white/10 group-focus-within/input:text-primary transition-colors" size={22} />
                  <input 
                    required
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="ACCESS KEY (PASSWORD)" 
                    className="w-full bg-white/[0.03] border-2 border-white/5 rounded-[1.8rem] pl-16 pr-8 py-6 text-xs focus:outline-none focus:border-primary/40 focus:bg-primary/[0.02] transition-all outline-none text-foreground uppercase tracking-widest font-black placeholder:text-white/10" 
                  />
                </div>
              </div>

              <button 
                type="submit"
                disabled={loading}
                className="w-full py-6 bg-primary text-white font-black uppercase tracking-[0.4em] text-[11px] rounded-[1.8rem] shadow-[0_20px_60px_rgba(99,102,241,0.3)] hover:shadow-[0_25px_80px_rgba(99,102,241,0.5)] transition-all transform active:scale-[0.98] mt-10 flex items-center justify-center gap-4 overflow-hidden relative group/btn"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent translate-x-[-100%] group-hover/btn:translate-x-[100%] transition-transform duration-1000" />
                {loading ? 'SYNCHRONIZING...' : (
                  <>
                    <Zap size={20} className="fill-white" />
                    <span className="relative z-10">
                      {mode === 'login' ? 'Authorize Identity' : 'Synthesize Node'}
                    </span>
                  </>
                )}
              </button>

              <div className="relative flex items-center py-5">
                <div className="flex-grow border-t border-white/10"></div>
                <span className="flex-shrink-0 mx-4 text-white/40 text-[10px] font-black uppercase tracking-widest">or integrate via</span>
                <div className="flex-grow border-t border-white/10"></div>
              </div>

              <div className="w-full flex justify-center [&>div]:w-full [&>div>div]:!w-full [&>div>div]:!flex [&>div>div]:!justify-center [&>div>div]:!h-[52px]">
                <GoogleLogin 
                  onSuccess={handleGoogleSuccess}
                  onError={() => setError('GOOGLE AUTHENTICATION FAILED')}
                  theme="filled_black"
                  shape="pill"
                  size="large"
                  text="signin_with"
                  width="450px"
                />
              </div>

            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
