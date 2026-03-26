import React, { useState } from 'react';
import { Search, Filter, Globe, Book, Archive, PlayCircle, Code, ChevronRight, Atom, HeartPulse, Landmark, Scale, FileText, Plus, Trash2, ExternalLink, Zap, Sparkles, BookOpen } from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import QuantumSelect from '../components/ui/QuantumSelect';

const GlobalKnowledge = () => {
  const { state, dispatch } = useAppContext();
  const [search, setSearch] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [newMaterial, setNewMaterial] = useState({ title: '', link: '', category: 'General' });

  const handleAddMaterial = (e: React.FormEvent) => {
    e.preventDefault();
    if (newMaterial.title && newMaterial.link) {
      dispatch.addPersonalMaterial(newMaterial);
      setNewMaterial({ title: '', link: '', category: 'General' });
      setShowAddModal(false);
    }
  };

  const getTailoredResources = () => {
    const stream = state.profile.academicStream;
    
    const common = [
      { title: 'Global Archive', description: 'Session logs and academic history.', icon: Archive, count: '2.4 GB' },
      { title: 'Video Terminal', description: 'Visual learning modules.', icon: PlayCircle, count: '12 videos' },
    ];

    const streamSpecific: Record<string, any[]> = {
      Engineering: [
        { title: 'System Architecture', description: 'Advanced structural Engineering principles.', icon: Code, count: '45 docs' },
        { title: 'Calculus Library', description: 'Differential and Integral theories.', icon: Atom, count: '124 files' },
        { title: 'Circuit Schematics', description: 'Electrical node documentation.', icon: Book, count: '89 PDF' },
      ],
      Medical: [
        { title: 'Anatomy Core', description: '3D Biological structures database.', icon: HeartPulse, count: '210 models' },
        { title: 'Biochemistry', description: 'Molecular interaction logs.', icon: Atom, count: '56 files' },
        { title: 'Pathogens DB', description: 'Disease vector analysis.', icon: Book, count: 'Archive' },
      ],
      Commerce: [
        { title: 'Market Dynamics', description: 'Real-time financial analysis logs.', icon: Landmark, count: 'Live' },
        { title: 'Macroeconomics', description: 'Global fiscal policy theory.', icon: Book, count: '32 modules' },
        { title: 'Audit Protocols', description: 'Business compliance frameworks.', icon: FileText, count: '12 guides' },
      ],
      Humanities: [
        { title: 'Social Science', description: 'Human behavior and history archives.', icon: Scale, count: '1k+ logs' },
        { title: 'Modern Philosophy', description: 'Core existential algorithms.', icon: Book, count: '45 texts' },
        { title: 'History Maps', description: 'Geopolitical timeline data.', icon: Globe, count: 'Interactive' },
      ],
    };

    return [...(streamSpecific[stream] || streamSpecific.Engineering), ...common];
  };

  const resources = getTailoredResources();

  return (
    <div className="max-w-7xl mx-auto space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-1000">
      {/* Header with high-tech typography */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 border-b border-glass-border pb-8">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-xs font-black tracking-[0.3em] text-primary/60 uppercase">
            <Zap size={12} className="animate-pulse" />
            Planetary Intelligence Sync • active
          </div>
          <h1 className="text-5xl font-black tracking-tighter uppercase leading-tight">Global Knowledge</h1>
          <p className="text-foreground/40 font-semibold tracking-wide flex items-center gap-2">
            Accessing tailored modules for <span className="text-primary">{state.profile.academicStream} Track</span>.
          </p>
        </div>
        
        <div className="flex items-center gap-4 w-full md:w-auto">
          <div className="relative flex-1 md:w-80 group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-foreground/50 group-focus-within:text-primary transition-colors" size={18} />
            <input 
              type="text" 
              placeholder="Query intelligence archive..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="quantum-input pl-12"
            />
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-12">
        {/* Top Section: Personal Hub (Full Width) */}
        <div className="glass-card p-10 border-2 border-primary/20 bg-gradient-to-br from-primary/[0.05] to-transparent">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-sm font-black uppercase tracking-[0.3em] text-primary flex items-center gap-3">
              <Archive size={20} />
              Personal Archive
            </h2>
            <button 
              onClick={() => setShowAddModal(true)}
              className="px-6 py-3 rounded-xl bg-primary text-white font-black uppercase text-xs tracking-widest flex items-center gap-3 hover:scale-105 active:scale-95 transition-all shadow-[0_0_20px_rgba(99,102,241,0.3)]"
            >
              <Plus size={16} />
              Index Material
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {state.personalMaterials.filter(mat => mat.title.toLowerCase().includes(search.toLowerCase()) || mat.category.toLowerCase().includes(search.toLowerCase())).length === 0 ? (
              <div className="col-span-full py-16 flex flex-col items-center text-center space-y-4 opacity-30 bg-white/5 rounded-2xl border border-glass-border border-dashed">
                <Archive size={48} strokeWidth={1} />
                <p className="text-xs font-black uppercase tracking-widest">No materials found</p>
              </div>
            ) : (
              state.personalMaterials
                .filter(mat => mat.title.toLowerCase().includes(search.toLowerCase()) || mat.category.toLowerCase().includes(search.toLowerCase()))
                .map((mat) => (
                <div key={mat.id} className="group p-6 bg-white/5 border border-glass-border rounded-2xl hover:border-primary/40 transition-all flex flex-col gap-4">
                  <div className="flex items-start justify-between">
                    <h4 className="font-bold text-base tracking-tight truncate flex-1 pr-4">{mat.title}</h4>
                    <div className="flex items-center gap-2">
                      <a href={mat.link} target="_blank" rel="noopener noreferrer" className="p-2 bg-white/5 rounded-lg text-foreground/40 hover:text-primary hover:bg-primary/10 transition-all">
                        <ExternalLink size={16} />
                      </a>
                      <button 
                        onClick={() => dispatch.removePersonalMaterial(mat.id)}
                        className="p-2 bg-white/5 rounded-lg text-foreground/40 hover:text-red-500 hover:bg-red-500/10 transition-all"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 mt-auto">
                    <span className="px-3 py-1 bg-primary/10 text-primary text-xs font-black uppercase tracking-widest rounded-md border border-primary/20">
                      {mat.category}
                    </span>
                    <span className="text-xs font-semibold text-foreground/50 uppercase">
                      Indexed: {new Date(mat.dateAdded).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Lower Section: System Curated (Neural Streams & Archive Grid) */}
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-10 pt-8 border-t border-glass-border">
          {/* Neural Recommendations Sidebar */}
          <div className="xl:col-span-4 space-y-6">
            <h2 className="text-sm font-black uppercase tracking-[0.4em] text-primary flex items-center gap-3 ml-2">
              <Sparkles size={18} className="text-primary animate-pulse" />
              Neural Recommendations
            </h2>
            <div className="grid grid-cols-1 gap-5">
              {state.recommendations.map((rec) => (
                <div key={rec.id} className="glass-card p-6 flex items-center justify-between group hover:bg-primary/[0.03] border-primary/20 bg-gradient-to-r from-primary/[0.02] to-transparent border-l-4">
                  <div className="flex items-center gap-5">
                    <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center text-primary border border-primary/30 shrink-0">
                      {rec.type === 'Video' ? <PlayCircle size={22} /> : rec.type === 'Repo' ? <Code size={22} /> : <FileText size={22} />}
                    </div>
                    <div className="pr-4">
                      <h4 className="font-black uppercase tracking-tight text-lg leading-tight mb-1.5">{rec.title}</h4>
                      <p className="text-xs text-foreground/60 font-semibold leading-relaxed">{rec.description}</p>
                    </div>
                  </div>
                  <a href={rec.link} target="_blank" rel="noopener noreferrer" className="p-3 bg-white/5 rounded-xl text-foreground/40 hover:text-primary hover:bg-primary/10 transition-all shrink-0">
                    <ExternalLink size={20} />
                  </a>
                </div>
              ))}
            </div>
          </div>

          {/* Main Resource Grid */}
          <div className="xl:col-span-8 space-y-6">
             <h2 className="text-sm font-black uppercase tracking-[0.4em] text-foreground/60 flex items-center gap-3 mb-6 ml-2">
              <Book size={18} />
              System Curated Modules
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {resources.filter(r => r.title.toLowerCase().includes(search.toLowerCase())).map((res, idx) => (
                <div key={idx} className="glass-card p-8 glass-card-hover group cursor-pointer border-2 border-glass-border flex flex-col h-full">
                  <div className="flex justify-between items-start mb-6">
                  <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-all shadow-inner border border-primary/10">
                    <BookOpen size={22} />
                  </div>
                  <span className="text-[10px] font-black uppercase tracking-widest text-primary bg-primary/5 px-3 py-1 rounded-full border border-primary/10">
                    {res.count}
                  </span>
                </div>
                <h4 className="text-xl font-black text-foreground mb-2 group-hover:text-primary transition-colors tracking-tight uppercase">{res.title}</h4>
                <p className="text-xs text-foreground/40 font-black tracking-[0.2em] mb-8 uppercase">{res.description}</p>
                  <div className="pt-6 border-t border-glass-border flex items-center justify-between mt-auto">
                    <span className="text-xs font-black uppercase tracking-[0.2em] text-primary group-hover:text-primary transition-colors">Access Interface</span>
                    <ChevronRight size={18} className="text-foreground/50 group-hover:text-primary transition-all translate-x-0 group-hover:translate-x-2" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Add Material Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-6 animate-in fade-in duration-300">
          <div className="absolute inset-0 bg-background/80 backdrop-blur-sm" onClick={() => setShowAddModal(false)} />
          <div className="glass-card p-10 max-w-md w-full relative z-10 border-2 border-primary/50 shadow-[0_0_50px_rgba(99,102,241,0.2)]">
            <h2 className="text-2xl font-black uppercase tracking-tight mb-8">Index New Material</h2>
            <form onSubmit={handleAddMaterial} className="space-y-6">
              <div className="space-y-2">
                <label className="text-xs font-black uppercase tracking-widest text-foreground/40 ml-1">Title / Label</label>
                <input 
                  autoFocus
                  required
                  value={newMaterial.title}
                  onChange={e => setNewMaterial({...newMaterial, title: e.target.value})}
                  className="quantum-input"
                  placeholder="e.g. OS Lecture Notes"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-black uppercase tracking-widest text-foreground/40 ml-1">Source Link (URL)</label>
                <input 
                  required
                  type="url"
                  value={newMaterial.link}
                  onChange={e => setNewMaterial({...newMaterial, link: e.target.value})}
                  className="quantum-input"
                  placeholder="https://..."
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-black uppercase tracking-widest text-foreground/40 ml-1">Classification</label>
                <QuantumSelect 
                  value={newMaterial.category}
                  onChange={(val) => setNewMaterial({...newMaterial, category: val})}
                  options={['General', 'Notes', 'Research', 'Tool']}
                />
              </div>
              <div className="flex gap-4 pt-4">
                <button 
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="flex-1 px-6 py-3 rounded-xl border border-glass-border font-black uppercase text-xs tracking-widest hover:bg-white/5 transition-all"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  className="flex-1 btn-primary"
                >
                  Sync Material
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default GlobalKnowledge;
