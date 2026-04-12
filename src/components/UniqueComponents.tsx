import React from 'react';
import { motion } from 'framer-motion';

export const VanguardButton = ({ 
  children, 
  onClick, 
  className = "",
  variant = "primary" 
}: { 
  children: React.ReactNode; 
  onClick?: () => void; 
  className?: string;
  variant?: "primary" | "secondary" | "outline";
}) => {
  const variants = {
    primary: "bg-indigo-600 text-white shadow-[0_0_20px_rgba(79,70,229,0.4)] hover:shadow-[0_0_40px_rgba(79,70,229,0.6)]",
    secondary: "bg-purple-600 text-white shadow-[0_0_20px_rgba(147,51,234,0.4)] hover:shadow-[0_0_40px_rgba(147,51,234,0.6)]",
    outline: "bg-transparent border-2 border-white/20 text-white hover:bg-white/5"
  };

  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
      className={`px-8 py-4 rounded-2xl font-black uppercase tracking-[0.2em] text-xs transition-all duration-300 ${variants[variant]} ${className}`}
    >
      {children}
    </motion.button>
  );
};

export const NeuralCard = ({ 
  children, 
  title, 
  icon: Icon,
  className = "" 
}: { 
  children: React.ReactNode; 
  title: string; 
  icon?: any;
  className?: string;
}) => (
  <motion.div
    initial={{ opacity: 0, y: 30 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    whileHover={{ y: -10 }}
    className={`p-10 rounded-[3rem] bg-white/[0.02] border border-white/[0.05] backdrop-blur-3xl hover:bg-white/[0.04] transition-all duration-500 group ${className}`}
  >
    {Icon && (
      <div className="w-16 h-16 rounded-3xl bg-indigo-500/10 flex items-center justify-center text-indigo-400 mb-8 group-hover:scale-110 group-hover:bg-indigo-500 group-hover:text-white transition-all duration-500">
        <Icon size={32} />
      </div>
    )}
    <h3 className="text-2xl font-black text-white mb-4 uppercase tracking-tighter italic">{title}</h3>
    <div className="text-white/40 font-medium leading-relaxed">
      {children}
    </div>
  </motion.div>
);

export const ScanningLine = () => (
  <div className="fixed inset-0 pointer-events-none z-50 opacity-[0.03] overflow-hidden">
    <div className="w-full h-[1px] bg-indigo-400 shadow-[0_0_15px_rgba(129,140,248,0.8)] animate-scan" style={{
      animation: 'scan 10s linear infinite'
    }} />
  </div>
);
