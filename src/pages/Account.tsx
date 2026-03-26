import React from 'react';
import { User, HardDrive, Database, Shield, Activity, Fingerprint } from 'lucide-react';
import { useAppContext } from '../context/AppContext';

const Account = () => {
  const { state } = useAppContext();
  const user = state.currentUser;

  const stats = [
    { label: 'Storage Used', value: '1.2 MB', icon: HardDrive, color: 'text-blue-400' },
    { label: 'Cloud Sync', value: 'Enabled', icon: Database, color: 'text-green-400' },
    { label: 'Security Level', value: 'Tier 5', icon: Shield, color: 'text-purple-400' },
    { label: 'System Uptime', value: '1,420h', icon: Activity, color: 'text-orange-400' },
  ];

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight">Account Details</h1>
          <p className="text-white/40 mt-1">Manage system-level credentials and data synchronization.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1 space-y-6">
          <div className="glass-card p-8 flex flex-col items-center text-center">
            <div className="w-24 h-24 rounded-full bg-primary/10 flex items-center justify-center text-primary mb-6 border border-primary/20 shadow-[0_0_20px_rgba(99,102,241,0.2)]">
              <User size={40} />
            </div>
            <h2 className="text-xl font-bold">{user?.username}</h2>
            <p className="text-white/40 text-xs font-black uppercase tracking-widest mt-1">{user?.email}</p>
            <div className="mt-8 pt-8 border-t border-white/5 w-full">
              <span className="px-3 py-1 bg-primary/20 text-primary text-xs font-black uppercase tracking-widest rounded-full">Primary Neural Link</span>
            </div>
          </div>

          <div className="glass-card p-6">
            <h3 className="text-sm font-bold mb-4 flex items-center gap-2">
              <Fingerprint size={16} className="text-primary" />
              Machine Identification
            </h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center p-3 bg-white/5 rounded-xl">
                <span className="text-xs text-white/30">Node ID</span>
                <span className="text-xs font-mono">{user?.id?.substring(0, 12)}...</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-white/5 rounded-xl">
                <span className="text-xs text-white/30">Registry</span>
                <span className="text-xs font-mono text-primary">HUB-V0.1</span>
              </div>
            </div>
          </div>
        </div>

        <div className="lg:col-span-2 space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {stats.map((stat, idx) => (
              <div key={idx} className="glass-card p-6 flex items-center gap-4">
                <div className={`p-3 rounded-2xl bg-white/5 ${stat.color}`}>
                  <stat.icon size={24} />
                </div>
                <div>
                  <p className="text-xs text-white/30 font-bold uppercase tracking-widest">{stat.label}</p>
                  <p className="text-lg font-black">{stat.value}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="glass-card p-8">
            <h3 className="text-xl font-bold mb-6">System Management</h3>
            <div className="space-y-6">
              <div className="flex items-center justify-between p-4 bg-white/5 border border-white/5 rounded-2xl hover:bg-white/10 transition-all cursor-pointer group">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-400 group-hover:bg-blue-500 group-hover:text-white transition-all">
                    <Database size={24} />
                  </div>
                  <div>
                    <h4 className="font-bold">Backup Core Data</h4>
                    <p className="text-xs text-white/30">Export all patterns and logs to JSON.</p>
                  </div>
                </div>
                <div className="text-white/20 hover:text-white transition-colors">
                  <Activity size={20} />
                </div>
              </div>

              <div className="flex items-center justify-between p-4 bg-white/5 border border-white/5 rounded-2xl hover:bg-white/10 transition-all cursor-pointer group">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-purple-500/10 flex items-center justify-center text-purple-400 group-hover:bg-purple-500 group-hover:text-white transition-all">
                    <Shield size={24} />
                  </div>
                  <div>
                    <h4 className="font-bold">Neural Link Encryption</h4>
                    <p className="text-xs text-white/30">Configure advanced security protocols.</p>
                  </div>
                </div>
                <div className="text-white/20 hover:text-white transition-colors">
                  <Shield size={20} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Account;
