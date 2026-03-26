import React from 'react';
import { BarChart3, Database, ShieldAlert } from 'lucide-react';

interface EmptyChartProps {
  title?: string;
  message?: string;
  height?: string | number;
}

const EmptyChart: React.FC<EmptyChartProps> = ({ 
  title = "No Data Available", 
  message = "System diagnostics require active neural synchronization. Begin a task to populate this module.",
  height = "300px" 
}) => {
  return (
    <div 
      className="w-full flex flex-col items-center justify-center p-8 rounded-3xl border-2 border-dashed border-glass-border bg-white/5 relative overflow-hidden group"
      style={{ height }}
    >
      {/* Background Decorative Elements */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-secondary/5 opacity-50 group-hover:opacity-80 transition-opacity duration-700" />
      <div className="absolute -top-24 -left-24 w-64 h-64 bg-primary/10 rounded-full blur-[80px] group-hover:bg-primary/20 transition-all duration-700" />
      <div className="absolute -bottom-24 -right-24 w-64 h-64 bg-secondary/10 rounded-full blur-[80px] group-hover:bg-secondary/20 transition-all duration-700" />

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center text-center space-y-6 max-w-md">
        <div className="relative">
          <div className="w-20 h-20 rounded-2xl bg-glass-card border border-glass-border flex items-center justify-center text-primary/40 group-hover:text-primary transition-colors duration-500 shadow-xl">
            <BarChart3 size={40} strokeWidth={1.5} />
          </div>
          <div className="absolute -top-2 -right-2 w-8 h-8 rounded-lg bg-background border border-glass-border flex items-center justify-center text-secondary animate-pulse">
            <Database size={16} />
          </div>
        </div>

        <div className="space-y-2">
          <h3 className="text-xl font-black uppercase tracking-tighter text-foreground/80 group-hover:text-foreground transition-colors">
            {title}
          </h3>
          <p className="text-sm font-medium text-foreground/40 leading-relaxed tracking-wide">
            {message}
          </p>
        </div>

        <div className="pt-4">
          <div className="px-6 py-2 rounded-full border border-primary/20 bg-primary/5 text-primary text-[10px] font-black uppercase tracking-[0.3em] flex items-center gap-2">
            <ShieldAlert size={12} />
            Awaiting Data Ingress
          </div>
        </div>
      </div>

      {/* Decorative Grid Over */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.03]" 
        style={{ 
          backgroundImage: `linear-gradient(to right, currentColor 1px, transparent 1px), linear-gradient(to bottom, currentColor 1px, transparent 1px)`,
          backgroundSize: '20px 20px'
        }} 
      />
    </div>
  );
};

export default EmptyChart;
