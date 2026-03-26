import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown } from 'lucide-react';

interface QuantumSelectProps {
  options: string[];
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
  label?: string;
}

const QuantumSelect: React.FC<QuantumSelectProps> = ({ options, value, onChange, disabled, label }) => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative w-full" ref={containerRef}>
      <button
        type="button"
        disabled={disabled}
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full flex items-center justify-between px-6 py-4 rounded-2xl border-2 transition-all duration-300 font-bold uppercase tracking-widest text-xs
          ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer hover:bg-white/5'}
          ${isOpen 
            ? 'bg-primary/10 border-primary shadow-[0_0_25px_rgba(99,102,241,0.25)] text-foreground' 
            : 'bg-white/5 border-glass-border text-foreground/60'}`}
      >
        <span className="truncate">{value || 'Select Node...'}</span>
        <ChevronDown 
          size={16} 
          className={`transition-transform duration-500 ${isOpen ? 'rotate-180 text-primary' : 'text-foreground/20'}`} 
        />
      </button>

      {isOpen && (
        <div className="absolute z-[100] w-full mt-3 bg-[#0f0f12]/95 backdrop-blur-2xl border-2 border-glass-border rounded-2xl overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.5)] animate-in fade-in zoom-in-95 duration-200 origin-top">
          <div className="max-h-64 overflow-y-auto custom-scrollbar">
            {options.map((option) => (
              <button
                key={option}
                type="button"
                onClick={() => {
                  onChange(option);
                  setIsOpen(false);
                }}
                className={`w-full text-left px-6 py-4 text-xs font-black uppercase tracking-widest transition-all
                  ${value === option 
                    ? 'bg-primary text-white shadow-inner' 
                    : 'text-foreground/50 hover:bg-white/10 hover:text-foreground'}`}
              >
                {option}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default QuantumSelect;
