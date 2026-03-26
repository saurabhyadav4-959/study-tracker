import React, { useEffect, useState } from 'react';
import { useAppContext } from '../context/AppContext';
import { MessageSquare, X } from 'lucide-react';

const NotificationSystem = () => {
  const { state, dispatch } = useAppContext();
  const [activeToast, setActiveToast] = useState<any>(null);

  useEffect(() => {
    const checkAlerts = () => {
      const now = new Date();
      // Use local date string comparison to avoid timezone offsets
      const year = now.getFullYear();
      const month = String(now.getMonth() + 1).padStart(2, '0');
      const day = String(now.getDate()).padStart(2, '0');
      const currentDate = `${year}-${month}-${day}`;
      const currentTime = now.toTimeString().split(' ')[0].substring(0, 5); // HH:mm

      state.alerts.forEach(alert => {
        if (alert.enabled && !alert.triggered && alert.date === currentDate && alert.time === currentTime) {
          // Trigger!
          setActiveToast(alert);
          dispatch.markAlertTriggered(alert.id);

          // Real Browser Notification
          if ("Notification" in window && Notification.permission === "granted") {
            try {
              new Notification(`SMS: ${alert.taskName}`, {
                body: `Protocol alert for ${alert.contact}: ${alert.taskName} is due now.`,
                icon: '/vite.svg'
              });
            } catch (e) {
              console.error("Browser notification failed", e);
            }
          }
        }
      });
    };

    const interval = setInterval(checkAlerts, 5000); // Check every 5s for responsiveness
    return () => clearInterval(interval);
  }, [state.alerts, dispatch]);

  if (!activeToast) return null;

  return (
    <div className="fixed bottom-8 right-8 z-[9999] animate-in slide-in-from-right-10 duration-500">
      <div className="bg-[#1c1c1e] border border-white/10 rounded-[2rem] w-84 shadow-2xl p-6 relative overflow-hidden group">
        {/* iOS-Style Background Blur/Glassmorphism */}
        <div className="absolute inset-0 bg-gradient-to-br from-white/[0.05] to-transparent pointer-events-none" />
        
        <div className="flex justify-between items-start mb-4 relative z-10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-green-500 shadow-[0_0_15px_rgba(34,197,94,0.3)] flex items-center justify-center text-white">
              <MessageSquare size={20} />
            </div>
            <div>
              <p className="text-[10px] font-black uppercase tracking-widest text-foreground/40">Messages • Now</p>
              <p className="text-sm font-bold text-foreground">{activeToast.contact || 'System Bridge'}</p>
            </div>
          </div>
          <button 
            onClick={() => setActiveToast(null)} 
            className="w-8 h-8 flex items-center justify-center hover:bg-white/5 rounded-full transition-colors"
          >
            <X size={16} className="text-foreground/40" />
          </button>
        </div>

        <div className="bg-white/5 rounded-2xl p-4 border border-white/5 relative z-10">
          <p className="text-sm text-foreground/80 leading-relaxed font-medium">
            <span className="text-primary font-black uppercase tracking-widest text-[10px] block mb-1">Signal Protocol:</span>
            "{activeToast.taskName} initialization required now. Neural sync established at bridge node."
          </p>
        </div>

        <div className="mt-5 flex gap-2 relative z-10">
          <button 
            onClick={() => setActiveToast(null)} 
            className="flex-1 py-3 bg-white/5 border border-white/10 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-white/10 transition-all text-foreground/60"
          >
            Clear
          </button>
          <button 
            onClick={() => setActiveToast(null)} 
            className="flex-1 py-3 bg-primary text-white rounded-xl text-[10px] font-black uppercase tracking-widest shadow-[0_0_20px_rgba(99,102,241,0.3)] hover:scale-105 active:scale-95 transition-all"
          >
            Acknowledge
          </button>
        </div>
      </div>
    </div>
  );
};

export default NotificationSystem;
