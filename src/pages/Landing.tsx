import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Terminal, Shield, Zap, Activity, Globe, Rocket, 
  ChevronRight, Brain, Cpu, Database, Network, Key
} from 'lucide-react';
import { VanguardButton, NeuralCard, ScanningLine } from '../components/UniqueComponents';

const Landing = () => {
  const navigate = useNavigate();

  const handleDocs = (section: string) => {
    navigate(`/docs#${section}`);
    setTimeout(() => {
      const el = document.getElementById(section);
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  return (
    <div className="min-h-screen bg-[#050505] text-white selection:bg-indigo-500 selection:text-white font-['Inter'] overflow-x-hidden">
      <ScanningLine />
      
      {/* HUD Background Elements */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-indigo-600/10 rounded-full blur-[150px] animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-purple-600/10 rounded-full blur-[150px] animate-pulse-slow" />
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 brightness-100 contrast-150" />
      </div>

      {/* Nav */}
      <nav className="fixed top-0 w-full z-50 border-b border-white/5 bg-black/20 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-8 h-24 flex items-center justify-between">
          <div className="flex items-center gap-4 group cursor-default">
            <div className="w-10 h-10 rounded-xl bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center shadow-[0_0_20px_rgba(79,70,229,0.2)] group-hover:bg-indigo-500 group-hover:text-white transition-all duration-500">
              <Brain size={20} className="text-indigo-400 group-hover:text-white transition-colors" />
            </div>
            <div>
              <h1 className="text-lg font-black tracking-tighter uppercase leading-none opacity-90">System Hub</h1>
              <p className="text-[9px] uppercase tracking-[0.4em] text-indigo-400 font-bold opacity-70">Neural OS // entry</p>
            </div>
          </div>
          <div className="hidden md:flex items-center gap-12 text-[10px] font-black uppercase tracking-[0.3em] text-white/40">
            <button onClick={() => handleDocs('protocols')} className="hover:text-white transition-colors">Protocols</button>
            <button onClick={() => handleDocs('synchronization')} className="hover:text-white transition-colors">Synchronization</button>
            <button onClick={() => handleDocs('security')} className="hover:text-white transition-colors">Core Security</button>
            <button onClick={() => navigate('/docs')} className="hover:text-white transition-colors">Documentation</button>
          </div>
          <VanguardButton variant="outline" onClick={() => navigate('/login')}>
            Initialize Node
          </VanguardButton>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="relative pt-48 pb-32 px-8">
        <div className="max-w-7xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
            className="inline-flex items-center gap-3 px-6 py-2 rounded-full border border-indigo-500/20 bg-indigo-500/5 text-indigo-400 text-[10px] font-bold uppercase tracking-[0.3em] mb-12 shadow-[0_0_20px_rgba(79,70,229,0.05)] backdrop-blur-md"
          >
            <div className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-pulse" />
            System Hub Intelligence Core Active
          </motion.div>
          
          <motion.h1 
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.8 }}
            className="text-7xl md:text-9xl font-black tracking-tighter uppercase italic leading-[0.9] mb-12"
          >
            Evolutionary <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-br from-white via-indigo-200 to-indigo-600 drop-shadow-[0_0_30px_rgba(79,70,229,0.15)]">Intelligence</span>
          </motion.h1>

          <motion.p 
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.8 }}
            className="text-lg md:text-xl text-white/50 max-w-2xl mx-auto font-medium leading-relaxed mb-16 tracking-wide"
          >
            Synchronize your academic journey with a high-fidelity productivity kernel. Data-driven growth, prioritized by neural logic.
          </motion.p>

          <motion.div 
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.8 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-8"
          >
            <VanguardButton onClick={() => navigate('/login')} className="h-20 px-12 text-sm">
              Access System Hub
            </VanguardButton>
            <button onClick={() => navigate('/docs')} className="flex items-center gap-4 text-white/40 hover:text-white transition-all font-black uppercase tracking-[0.3em] text-[10px] group">
              View Documentation <ChevronRight size={16} className="group-hover:translate-x-2 transition-transform" />
            </button>
          </motion.div>
        </div>
      </main>

      {/* Bento Grid Features */}
      <section id="features" className="relative py-32 px-8 border-t border-white/5">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-end gap-12 mb-24">
            <div className="space-y-4">
              <h2 className="text-sm font-black text-indigo-500 uppercase tracking-[0.5em]">System Modules</h2>
              <p className="text-4xl md:text-6xl font-black uppercase tracking-tighter italic">Operational Subsystems</p>
            </div>
            <p className="text-white/30 font-medium max-w-sm uppercase tracking-widest text-xs leading-relaxed italic">
              Each module is engineered to optimize a specific vector of your academic performance inside the System Hub environment.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
            <NeuralCard title="Neural Mapping" icon={Rocket}>
              Track skill acquisition through probabilistic growth vectors. Visualize your mastery as a living intelligence matrix.
            </NeuralCard>
            <NeuralCard title="Tactical deep work" icon={Zap} className="lg:scale-105 border-indigo-500/20 bg-indigo-500/[0.03]">
              Engage the focus engine for hyper-productive output. Zero-latency time allocation and metabolic sync protocols.
            </NeuralCard>
            <NeuralCard title="Global Database" icon={Globe}>
              A comprehensive archive of curriculum materials, curated by research-grade indexing algorithms.
            </NeuralCard>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="relative py-48 px-8 overflow-hidden">
        <div className="absolute inset-0 bg-indigo-600/[0.02]" />
        <div className="max-w-4xl mx-auto text-center relative z-10 border border-white/5 bg-[#08080a]/80 p-16 md:p-24 rounded-[3rem] backdrop-blur-3xl shadow-[0_40px_100px_-20px_rgba(0,0,0,0.8)] shadow-indigo-500/10 transition-all duration-700 hover:border-indigo-500/20 group">
          <Terminal size={40} className="mx-auto text-indigo-500/50 group-hover:text-indigo-400 group-hover:scale-110 group-hover:-translate-y-2 transition-all duration-700 mb-10" />
          <h2 className="text-4xl md:text-6xl font-black uppercase tracking-tighter italic mb-8 drop-shadow-lg">Initialize <span className="text-indigo-400">Sync</span></h2>
          <p className="text-white/60 font-medium text-base md:text-lg leading-relaxed mb-14 max-w-xl mx-auto tracking-wide">
            Your unique performance signature is ready for synchronization. Join the elite academic network today.
          </p>
          <VanguardButton variant="secondary" onClick={() => navigate('/login')} className="h-16 px-12 text-xs">
            Deploy Intelligence Node
          </VanguardButton>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative py-24 px-8 border-t border-white/5 bg-black/40">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-12">
          <div className="flex items-center gap-4 opacity-40">
             <Brain size={24} />
             <span className="text-[10px] font-black uppercase tracking-[0.4em]">System Hub Intelligence // 2026</span>
          </div>
          <div className="flex flex-wrap justify-center gap-12 text-[10px] font-black uppercase tracking-[0.3em] text-white/40">
            <button onClick={() => handleDocs('privacy')} className="hover:text-white transition-colors">Privacy Protocol</button>
            <button onClick={() => handleDocs('auth')} className="hover:text-white transition-colors">Auth Kernel</button>
            <button onClick={() => handleDocs('logic')} className="hover:text-white transition-colors">Core Logic</button>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
