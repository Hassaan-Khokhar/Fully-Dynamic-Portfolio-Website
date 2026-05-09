"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Cookie, ShieldCheck, X } from "lucide-react";

export default function CookieBanner() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem("cookie-consent");
    if (!consent) {
      const timer = setTimeout(() => setIsVisible(true), 2000);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem("cookie-consent", "accepted");
    setIsVisible(false);
    // Trigger GA refresh if needed
    window.location.reload(); 
  };

  const handleDecline = () => {
    localStorage.setItem("cookie-consent", "declined");
    setIsVisible(false);
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ type: "spring", damping: 25, stiffness: 200 }}
          className="fixed bottom-6 left-6 right-6 md:left-auto md:right-8 md:max-w-md z-[100]"
        >
          <div className="relative overflow-hidden bg-[#030305]/80 backdrop-blur-2xl border border-white/10 rounded-2xl p-6 shadow-[0_20px_50px_rgba(0,0,0,0.5)] group">
            {/* Animated Glow Backdrop */}
            <div className="absolute -top-24 -right-24 w-48 h-48 bg-neon-blue/10 rounded-full blur-[80px] pointer-events-none" />
            <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-neon-purple/10 rounded-full blur-[80px] pointer-events-none" />

            <div className="flex gap-4 items-start relative z-10">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-neon-blue/20 to-neon-purple/20 border border-white/10 flex items-center justify-center shrink-0 shadow-[0_0_15px_rgba(59,130,246,0.2)]">
                <Cookie className="w-6 h-6 text-neon-blue" />
              </div>
              
              <div className="flex-1">
                <div className="flex justify-between items-center mb-2">
                  <h3 className="text-white font-bold tracking-tight flex items-center gap-2">
                    Cookie Protocol <ShieldCheck className="w-4 h-4 text-neon-blue" />
                  </h3>
                  <button 
                    onClick={() => setIsVisible(false)}
                    className="text-white/30 hover:text-white transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
                <p className="text-white/60 text-sm leading-relaxed mb-6">
                  We use cookies to optimize your terminal experience and analyze neural traffic. By accepting, you consent to our data processing protocols.
                </p>
                
                <div className="flex gap-3">
                  <button
                    onClick={handleAccept}
                    className="flex-1 py-2.5 rounded-xl bg-white text-black font-bold text-xs uppercase tracking-widest hover:bg-neon-blue hover:text-white transition-all duration-300 shadow-[0_0_15px_rgba(255,255,255,0.1)]"
                  >
                    Accept
                  </button>
                  <button
                    onClick={handleDecline}
                    className="px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white/50 font-bold text-xs uppercase tracking-widest hover:bg-white/10 hover:text-white transition-all duration-300"
                  >
                    Decline
                  </button>
                </div>
              </div>
            </div>
            
            {/* Bottom Accent Line */}
            <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-neon-blue to-transparent opacity-50" />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
