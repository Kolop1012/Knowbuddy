import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Play, Square } from 'lucide-react';
import { generateMockData, type PerspectiveData } from '@/mock-data';
import { cn } from '@/lib/utils';

interface InfoPageProps {
  topic: string;
  perspectives?: PerspectiveData[];
  perspectiveIndex: number;
  onBack: () => void;
}

type TabLevel = 'intro' | 'analysis' | 'comprehensive';

export const InfoPage: React.FC<InfoPageProps> = ({ topic, perspectives: injected, perspectiveIndex, onBack }) => {
  const [activeTab, setActiveTab] = useState<TabLevel>('intro');
  const [isPlaying, setIsPlaying] = useState(false);
  const synthRef = useRef<SpeechSynthesis | null>(null);
  
  const perspectives = injected && injected.length > 0 ? injected : generateMockData(topic);
  const data = perspectives[perspectiveIndex];

  // Initialize SpeechSynthesis
  useEffect(() => {
    synthRef.current = window.speechSynthesis;
    
    return () => {
      // Cleanup: stop speaking when component unmounts
      if (synthRef.current) {
        synthRef.current.cancel();
      }
    };
  }, []);

  // Handle playing/stopping audio based on tab changes too
  useEffect(() => {
    if (isPlaying && synthRef.current) {
      synthRef.current.cancel();
      setIsPlaying(false);
    }
  }, [activeTab]);

  const toggleSpeech = () => {
    if (!synthRef.current) return;

    if (isPlaying) {
      synthRef.current.cancel();
      setIsPlaying(false);
    } else {
      // Remove markdown asterisks for cleaner reading
      const cleanText = data[activeTab].replace(/\*\*/g, '');
      const utterance = new SpeechSynthesisUtterance(cleanText);
      utterance.lang = 'de-DE';
      utterance.rate = 0.95; // Slightly slower for better comprehension
      
      utterance.onend = () => setIsPlaying(false);
      utterance.onerror = () => setIsPlaying(false);
      
      synthRef.current.speak(utterance);
      setIsPlaying(true);
    }
  };

  const tabs = [
    { id: 'intro', label: 'Einführung' },
    { id: 'analysis', label: 'Analyse' },
    { id: 'comprehensive', label: 'Detailliert' }
  ] as const;

  // Format markdown-ish bold text for analysis section
  const formatText = (text: string) => {
    return text.split('\n').map((line, i) => {
      if (line.trim() === '') return <br key={i} />;
      
      // Basic bold parsing for `**text**`
      const parts = line.split(/(\*\*.*?\*\*)/g);
      return (
        <p key={i} className="mb-4 text-foreground/90 leading-relaxed">
          {parts.map((part, j) => {
            if (part.startsWith('**') && part.endsWith('**')) {
              return <strong key={j} className="font-bold text-foreground block mb-1 mt-2 text-lg">{part.slice(2, -2)}</strong>;
            }
            return part;
          })}
        </p>
      );
    });
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      className="h-[100dvh] w-full theme-light bg-background flex flex-col overflow-y-auto"
    >
      {/* Top Navigation Bar */}
      <div
        className="sticky top-0 z-10 bg-background/80 backdrop-blur-xl border-b border-border px-4 pb-4 flex items-center justify-between"
        style={{ paddingTop: 'calc(env(safe-area-inset-top) + 1rem)' }}
      >
        <button 
          onClick={onBack}
          className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors font-medium"
        >
          <ArrowLeft size={20} />
          Zurück
        </button>
        <button 
          onClick={toggleSpeech}
          className={cn(
            "flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium transition-colors border",
            isPlaying 
              ? "bg-primary/10 text-primary border-primary/20 shadow-inner" 
              : "bg-secondary text-secondary-foreground border-transparent hover:bg-secondary/80"
          )}
        >
          {isPlaying ? <Square size={16} fill="currentColor" /> : <Play size={16} fill="currentColor" />}
          {isPlaying ? 'Stop' : 'Vorlesen'}
        </button>
      </div>

      {/* Header Content */}
      <div className="px-6 pt-8 pb-6">
        <div 
          className="inline-block px-3 py-1 rounded-full text-xs font-bold tracking-widest uppercase mb-4 text-white"
          style={{ backgroundColor: data.color }}
        >
          {data.category}
        </div>
        <h1 className="text-4xl font-serif font-bold text-foreground mb-2 leading-tight">
          {data.title}
        </h1>
        <p className="text-muted-foreground italic font-serif">
          Perspektive auf {topic}
        </p>
      </div>

      {/* Depth Tabs */}
      <div className="px-4 mb-6">
        <div className="flex p-1 bg-secondary rounded-xl">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                "flex-1 py-2 text-sm font-semibold rounded-lg transition-all",
                activeTab === tab.id 
                  ? "bg-card text-card-foreground shadow-sm" 
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Content Area */}
      <div className="flex-grow px-6 pb-32">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="prose prose-lg prose-slate"
          >
            {formatText(data[activeTab])}
          </motion.div>
        </AnimatePresence>
      </div>
    </motion.div>
  );
};
