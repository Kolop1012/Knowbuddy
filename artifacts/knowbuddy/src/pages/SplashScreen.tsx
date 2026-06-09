import React, { useEffect } from 'react';
import { motion } from 'framer-motion';

interface SplashScreenProps {
  onComplete: () => void;
}

export const SplashScreen: React.FC<SplashScreenProps> = ({ onComplete }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onComplete();
    }, 2500);
    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <div className="min-h-[100dvh] w-full bg-navy-gradient flex flex-col items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ 
          duration: 1.2, 
          ease: [0.22, 1, 0.36, 1] 
        }}
        className="text-center flex flex-col items-center"
      >
        <motion.div 
          className="w-24 h-24 sm:w-32 sm:h-32 rounded-3xl bg-white/5 border border-white/10 shadow-[0_0_40px_rgba(255,255,255,0.05)] flex items-center justify-center mb-6"
          initial={{ rotate: -10 }}
          animate={{ rotate: 0 }}
          transition={{ duration: 1, delay: 0.2 }}
        >
          <span className="text-6xl sm:text-7xl font-serif text-white italic pl-2">
            K
          </span>
        </motion.div>
        
        <h1 className="text-4xl sm:text-5xl font-bold italic font-serif text-white tracking-tight mb-3">
          Knowbuddy
        </h1>
        
        <motion.p 
          className="text-white/60 text-lg font-serif italic"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
        >
          Perspektivenvielfalt für Selbstdenker
        </motion.p>
      </motion.div>
    </div>
  );
};
