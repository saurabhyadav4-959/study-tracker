import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Shield, Zap, Activity, Globe, Lock, Cpu, 
  Database, Network, BookOpen, ChevronLeft, 
  Terminal, Fingerprint, Server, Layers, 
  RefreshCw, Radio, HardDrive, Key, Code
} from 'lucide-react';
import { VanguardButton, ScanningLine } from '../components/UniqueComponents';

const Section = ({ id, title, subtitle, icon: Icon, children }: { id: string, title: string, subtitle: string, icon: any, children: React.ReactNode }) => (
  <motion.div 
    id={id}
    initial={{ opacity: 0, y: 30 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    className="pt-40 border-b border-white/5 pb-24"
  >
    <div className="flex items-start gap-8 mb-16">
      <div className="w-20 h-20 rounded-3xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 group-hover:scale-110 transition-transform">
        <Icon size={40} />
      </div>
      <div>
        <h2 className="text-5xl font-black uppercase tracking-tighter italic leading-none">{title}</h2>
        <p className="text-indigo-400/60 font-black uppercase tracking-[0.5em] text-[10px] mt-4">{subtitle}</p>
      </div>
    </div>
    <div className="prose prose-invert max-w-none text-white/60 space-y-8 text-lg leading-loose font-medium tracking-wide">
      {children}
    </div>
  </motion.div>
);

const Docs = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#050505] text-white selection:bg-indigo-500 selection:text-white font-['Inter'] overflow-x-hidden">
      <ScanningLine />
      
      {/* Dynamic Nav */}
      <nav className="fixed top-0 w-full z-50 border-b border-white/5 bg-black/40 backdrop-blur-3xl">
        <div className="max-w-7xl mx-auto px-8 h-24 flex items-center justify-between">
          <button 
            onClick={() => navigate('/')}
            className="flex items-center gap-4 group"
          >
            <div className="w-10 h-10 rounded-xl bg-indigo-600/10 border border-indigo-500/20 flex items-center justify-center group-hover:bg-indigo-500 group-hover:text-white transition-all">
              <ChevronLeft size={20} />
            </div>
            <span className="text-[10px] font-black uppercase tracking-[0.4em] hidden sm:block">Return to Hub</span>
          </button>
          
          <div className="flex items-center gap-10">
             <div className="hidden lg:flex items-center gap-6 text-[8px] font-black uppercase tracking-[0.3em] text-white/20">
                <span>Kernel: v9.42</span>
                <span>Uptime: 99.9%</span>
                <span>Node: Safe</span>
             </div>
             <div className="h-8 w-[1px] bg-white/5" />
             <div className="flex items-center gap-4">
               <Shield size={16} className="text-indigo-500 animate-pulse" />
               <span className="text-[10px] font-black uppercase tracking-[0.4em] text-white/60">System Specification</span>
             </div>
          </div>
        </div>
      </nav>

      <div className="max-w-5xl mx-auto px-8">
        {/* Header Archive */}
        <header className="pt-56 pb-24 border-b border-white/10">
          <div className="inline-flex items-center gap-3 px-4 py-1.5 rounded-full border border-indigo-500/30 bg-indigo-500/5 text-indigo-400 text-[9px] font-black uppercase tracking-[0.4em] mb-12">
            Intelligence Core // Archive_001
          </div>
          <h1 className="text-7xl md:text-9xl font-black tracking-tighter uppercase italic leading-[0.85] mb-10">
            System <br /><span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 to-white">Architecture</span>
          </h1>
          <p className="text-2xl text-white/30 max-w-3xl uppercase tracking-widest leading-relaxed">
            The comprehensive operational manual for the System Hub intelligence environment. detailing neural synchronization, kernel security, and focus protocols.
          </p>
        </header>

        {/* Technical Sections */}
        <Section id="protocols" title="Operational Protocols" subtitle="Logic Kernel // Vector Mapping" icon={Terminal}>
          <div className="space-y-12">
            <p>
              System Hub utilizes a **Multi-Threaded Cognitive Interface (MTCI)** to manage student productivity vectors. Unlike traditional planners, our protocols are derived from behavioral neuro-science to minimize context-switching latency.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10 my-16">
              <div className="p-10 bg-white/[0.02] border border-white/5 rounded-[2.5rem] relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-20 transition-opacity">
                  <Activity size={40} />
                </div>
                <h4 className="text-white font-black uppercase tracking-widest text-lg mb-6 leading-none italic">Deep Work Core</h4>
                <p className="text-sm leading-relaxed mb-8 text-white/60 font-medium">
                  The focal engine implements a proprietary **Metabolic Tempo Filter**. It synchronizes your break intervals with detected cognitive load levels, ensuring that peak neurotransmitter availability is utilized for high-intensity academic tasks.
                </p>
                <div className="flex gap-2">
                  <span className="px-3 py-1 bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-[8px] font-black uppercase rounded-lg">Adaptive Timers</span>
                  <span className="px-3 py-1 bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-[8px] font-black uppercase rounded-lg">Focus Locking</span>
                </div>
              </div>

              <div className="p-10 bg-white/[0.02] border border-white/5 rounded-[2.5rem] relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-20 transition-opacity">
                  <Layers size={40} />
                </div>
                <h4 className="text-white font-black uppercase tracking-widest text-lg mb-6 leading-none italic">Academic Evolution</h4>
                <p className="text-sm leading-relaxed mb-8 text-white/60 font-medium">
                  A hierarchical dependency matrix that maps curriculum requirements against temporal availability. It automatically calculates the **Critical Academic Path (CAP)** to ensure priority nodes are addressed before deadline synchronization.
                </p>
                <div className="flex gap-2">
                  <span className="px-3 py-1 bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-[8px] font-black uppercase rounded-lg">CAP Logic</span>
                  <span className="px-3 py-1 bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-[8px] font-black uppercase rounded-lg">Node Mapping</span>
                </div>
              </div>
            </div>
          </div>
        </Section>

        <Section id="synchronization" title="Data Synchronization" subtitle="Bridge Node // Real-Time Flux" icon={RefreshCw}>
          <div className="space-y-10">
            <p>
              Data integrity in System Hub is maintained via a **High-Fidelity Bridge Node (HFBN)**. This architecture ensures that your intelligence footprint is consistent across all authenticated system entry points without sacrificing local performance.
            </p>
            
            <div className="bg-indigo-500/[0.03] border border-indigo-500/10 rounded-[3rem] p-12">
               <h4 className="text-white font-black uppercase tracking-widest text-xl mb-10 text-center">Synchronization Lifecycle</h4>
               <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 relative">
                  <div className="space-y-4 text-center">
                    <div className="w-16 h-16 rounded-2xl bg-indigo-500/10 flex items-center justify-center mx-auto mb-6 border border-indigo-500/20">
                      <Radio className="text-indigo-400 animate-pulse" />
                    </div>
                    <h5 className="text-white font-black text-xs uppercase tracking-widest italic">Signal Capture</h5>
                    <p className="text-[10px] leading-relaxed text-white/60 font-medium">Captures real-time tactical changes at 120ms intervals.</p>
                  </div>
                  <div className="space-y-4 text-center">
                    <div className="w-16 h-16 rounded-2xl bg-indigo-500/10 flex items-center justify-center mx-auto mb-6 border border-indigo-500/20">
                      <Network className="text-indigo-400" />
                    </div>
                    <h5 className="text-white font-black text-xs uppercase tracking-widest italic">Cross-Bridge Sync</h5>
                    <p className="text-[10px] leading-relaxed text-white/60 font-medium">Validates state consistency using distributed ledger logic.</p>
                  </div>
                  <div className="space-y-4 text-center">
                    <div className="w-16 h-16 rounded-2xl bg-indigo-500/10 flex items-center justify-center mx-auto mb-6 border border-indigo-500/20">
                      <HardDrive className="text-indigo-400" />
                    </div>
                    <h5 className="text-white font-black text-xs uppercase tracking-widest italic">Local Persistence</h5>
                    <p className="text-[10px] leading-relaxed text-white/60 font-medium">Finalizes atomic commit to hardware persistent storage.</p>
                  </div>
               </div>
            </div>
          </div>
        </Section>

        <Section id="security" title="Core Security" subtitle="Neural Shield // AES-256" icon={Lock}>
          <div className="space-y-12">
            <p>
              Security is not an add-on; it is the **Core Kernel Foundation** of System Hub. Every bit of academic data is sharded and encrypted before it ever leaves the local environment.
            </p>
            <div className="p-12 border border-indigo-500/20 bg-indigo-500/10 rounded-[3rem] text-center max-w-3xl mx-auto shadow-[0_0_50px_rgba(99,102,241,0.1)]">
               <Shield size={48} className="mx-auto text-indigo-400 mb-8" />
               <h4 className="text-2xl font-black text-white italic mb-6">Zero-Knowledge Architecture</h4>
               <p className="text-sm leading-relaxed text-indigo-100/60 mb-8">
                 System Hub operatives retain the only master key for their data nodes. Not even our own infrastructure can decrypt your academic performance metrics or personal identification protocols.
               </p>
               <div className="flex justify-center gap-12 font-mono text-[10px] text-white/40">
                 <div className="flex items-center gap-2"><Key size={12} /> RSA-4096</div>
                 <div className="flex items-center gap-2"><Zap size={12} /> End-to-End</div>
                 <div className="flex items-center gap-2"><Fingerprint size={12} /> Hardware-Keyed</div>
               </div>
            </div>
          </div>
        </Section>

        <Section id="privacy" title="Privacy Protocol" subtitle="Operative Isolation // Zero Tracking" icon={Fingerprint}>
          <div className="space-y-10">
            <p>
              Privacy in System Hub is governed by the **Operative Isolation Standard (OIS)**. We believe your cognitive data belongs to you—period.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
               <ul className="list-none p-0 space-y-6">
                  <li className="flex gap-4">
                    <div className="w-6 h-6 rounded-full bg-green-500/10 flex items-center justify-center text-green-500 shrink-0"><Shield size={12} /></div>
                    <span className="text-sm">No third-party data telemetry or behavioral harvesting.</span>
                  </li>
                  <li className="flex gap-4">
                    <div className="w-6 h-6 rounded-full bg-green-500/10 flex items-center justify-center text-green-500 shrink-0"><Shield size={12} /></div>
                    <span className="text-sm">Complete local-first autonomy for all task management.</span>
                  </li>
               </ul>
               <ul className="list-none p-0 space-y-6">
                  <li className="flex gap-4">
                    <div className="w-6 h-6 rounded-full bg-green-500/10 flex items-center justify-center text-green-500 shrink-0"><Shield size={12} /></div>
                    <span className="text-sm">Anonymous performance analytics (strictly opt-in).</span>
                  </li>
                  <li className="flex gap-4">
                    <div className="w-6 h-6 rounded-full bg-green-500/10 flex items-center justify-center text-green-500 shrink-0"><Shield size={12} /></div>
                    <span className="text-sm">Operative-requested data wipes executed in &lt;100ms.</span>
                  </li>
               </ul>
            </div>
          </div>
        </Section>

        <Section id="auth" title="Auth Kernel" subtitle="Identity Link // Secure Handshake" icon={Server}>
          <div className="space-y-12">
            <p>
              The Authentication Kernel utilizes a **Secure Handshake Module (SHM)** that manages session lifecycle with zero persistent overhead.
            </p>
            <div className="p-10 bg-black/40 border border-white/5 rounded-3xl font-mono text-[11px] leading-relaxed shadow-inner">
               <div className="flex items-center gap-2 text-indigo-500 mb-4 border-b border-indigo-500/20 pb-4">
                  <Terminal size={14} />
                  <span>INITIALIZING AUTHENTICATION SEQUENCE</span>
               </div>
               <div className="space-y-1">
                  <div className="text-white/40"><span className="text-indigo-400">[00.01]</span> Fetching System Identity...</div>
                  <div className="text-white/40"><span className="text-indigo-400">[00.04]</span> Node Response: OK</div>
                  <div className="text-white/40"><span className="text-indigo-400">[00.09]</span> Symmetric Key Handshake in Progress...</div>
                  <div className="text-white/60 font-bold"><span className="text-green-500">[STATUS]</span> Identity Bound to Local Shell</div>
               </div>
               <div className="mt-8 text-indigo-400 animate-pulse">&gt; SYNC_LINK_ESTABLISHED_...</div>
            </div>
            <p className="text-sm italic">
              Every login creates a fresh session token with randomized salt, preventing session hijacking or replay attacks across the local academic network.
            </p>
          </div>
        </Section>

        <Section id="logic" title="Core Logic" subtitle="Heuristic Intelligence // SYNC Metric" icon={Cpu}>
          <div className="space-y-12">
            <p>
              The logic core is where the "System Hub magic" happens. It uses a **Heuristic Performance Engine (HPE)** to calculate your daily **Synchronization Metric (SYNM)**.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
               <div className="space-y-8">
                  <div className="space-y-3">
                    <div className="flex justify-between text-[10px] font-black uppercase tracking-widest text-indigo-400">
                      <span>SYNC INTENSITY</span>
                      <span>HIGH FLOW</span>
                    </div>
                    <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                      <div className="h-full w-[84%] bg-indigo-500 shadow-[0_0_15px_rgba(99,102,241,0.5)]" />
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div className="flex justify-between text-[10px] font-black uppercase tracking-widest text-indigo-400">
                      <span>LATENCY REDUCTION</span>
                      <span>0.4MS NODE</span>
                    </div>
                    <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                      <div className="h-full w-[98%] bg-indigo-500 shadow-[0_0_15px_rgba(99,102,241,0.5)]" />
                    </div>
                  </div>
               </div>
               <div className="p-8 border-l border-white/5 space-y-4">
                  <p className="text-xs uppercase font-black tracking-widest text-white/20 italic mb-4">Calculated Logic:</p>
                  <p className="text-sm leading-relaxed">
                    By analyzing task density against historical focus windows, the Logic Core adjusts your suggested "Sync Stability" threshold. It learns your unique academic rhythms to optimize the timing of complex neural tasks.
                  </p>
               </div>
            </div>
          </div>
        </Section>

        <Section id="documentation" title="Documentation" subtitle="Manual // Source Alpha" icon={BookOpen}>
          <p>
            This manual serves as the **Source-of-Truth Hub Archive**. It is version-controlled and updated alongside the core kernel to ensure that all operatives have real-time access to system specifications.
          </p>
          <div className="mt-12 flex flex-col md:flex-row gap-8">
             <VanguardButton variant="secondary" onClick={() => navigate('/login')} className="h-20 flex-1">
               Go To Login
             </VanguardButton>
             <VanguardButton variant="outline" onClick={() => navigate('/')} className="h-20 flex-1">
               Back to Home
             </VanguardButton>
          </div>
        </Section>
      </div>

      <footer className="relative py-24 px-8 border-t border-white/5 bg-black/40">
        <div className="max-w-7xl mx-auto flex justify-between items-center opacity-40">
           <div className="flex items-center gap-4">
              <Code size={20} className="text-indigo-500" />
              <span className="text-[10px] font-black uppercase tracking-[0.4em]">System Hub Documentation Archive // 2026 Edition</span>
           </div>
           <p className="text-[8px] font-black text-indigo-400 uppercase tracking-widest italic">All Protocols Operational</p>
        </div>
      </footer>
    </div>
  );
};

export default Docs;
