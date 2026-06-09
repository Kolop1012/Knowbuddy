import React, { useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Camera, Loader2, AlertCircle } from 'lucide-react';
import {
  useGeneratePerspectivesFromText,
  useGeneratePerspectivesFromImage,
} from '@workspace/api-client-react';
import type { PerspectiveData } from '@/mock-data';
import type { SearchSource, PerspectiveMode } from '@/types';
import { compressImage } from '@/lib/image';

const MODES: { value: PerspectiveMode; label: string; hint: string }[] = [
  {
    value: 'wissenschaft',
    label: 'Wissenschaft',
    hint: 'Disziplinen & Geisteswissenschaften',
  },
  {
    value: 'stakeholder',
    label: 'Stakeholder',
    hint: 'Beteiligte Akteure & Betroffene',
  },
  {
    value: 'politische_debatte',
    label: 'Politische Debatte',
    hint: 'Positionen der Debatte',
  },
];

interface InputScreenProps {
  onSearch: (
    topic: string,
    perspectives: PerspectiveData[],
    source: SearchSource,
  ) => void;
}

const TOPICS = [
  ["Mobilitätswende", "Migration", "Deindustrialisierung"],
  ["Antisemitismus", "Künstliche Intelligenz", "Rechtsextremismus"],
  ["Energiewende", "Europäische Integration", "Klimakrise"],
  ["Globale Instabilität", "Populismus", "Medienwandel"]
];

export const InputScreen: React.FC<InputScreenProps> = ({ onSearch }) => {
  const [query, setQuery] = useState('');
  const [mode, setMode] = useState<PerspectiveMode>('wissenschaft');
  const [error, setError] = useState<string | null>(null);
  const [loadingLabel, setLoadingLabel] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const textMutation = useGeneratePerspectivesFromText();
  const imageMutation = useGeneratePerspectivesFromImage();

  const isLoading = textMutation.isPending || imageMutation.isPending;

  const runTextSearch = (topic: string) => {
    if (isLoading) return;
    setError(null);
    setLoadingLabel(`„${topic}“ wird analysiert …`);
    textMutation.mutate(
      { data: { topic, mode } },
      {
        onSuccess: (result) => {
          onSearch(result.topic, result.perspectives as PerspectiveData[], {
            kind: 'phrase',
            phrase: topic,
          });
        },
        onError: () => {
          setError(
            'Die Perspektiven konnten nicht erstellt werden. Bitte versuche es erneut.',
          );
        },
      },
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = query.trim();
    if (trimmed) runTextSearch(trimmed);
  };

  const handleChipClick = (topic: string) => {
    setQuery(topic);
    runTextSearch(topic);
  };

  const handlePhotoClick = () => {
    if (isLoading) return;
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (!file) return;

    setError(null);
    setLoadingLabel('Foto wird analysiert …');
    try {
      const { base64, mimeType } = await compressImage(file);
      const imageUrl = `data:${mimeType};base64,${base64}`;
      imageMutation.mutate(
        { data: { image: base64, mimeType, mode } },
        {
          onSuccess: (result) => {
            onSearch(result.topic, result.perspectives as PerspectiveData[], {
              kind: 'image',
              imageUrl,
            });
          },
          onError: () => {
            setError(
              'Das Foto konnte nicht analysiert werden. Bitte versuche es erneut.',
            );
          },
        },
      );
    } catch {
      setError('Das Bild konnte nicht verarbeitet werden. Bitte versuche ein anderes Foto.');
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, y: -20 }}
      className="min-h-[100dvh] w-full bg-navy-gradient flex flex-col pt-[15vh] px-4 overflow-hidden relative"
    >
      <div className="w-full max-w-md mx-auto flex flex-col items-center z-10 relative">
        {/* Header */}
        <div className="text-center mb-10">
          <h1 className="text-4xl sm:text-5xl font-bold italic font-serif text-white tracking-tight mb-2">
            Knowbuddy
          </h1>
          <p className="text-white/60 text-base font-serif italic">
            Perspektivenvielfalt für Selbstdenker
          </p>
        </div>

        {/* Search Input */}
        <form onSubmit={handleSubmit} className="w-full mb-4">
          <div className="relative mb-3">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              disabled={isLoading}
              placeholder="Begriff eingeben"
              className="w-full block px-5 py-4 rounded-2xl bg-[#dce8f0] text-[#1a2e45] placeholder-[#6b8aa0] focus:outline-none focus:ring-2 focus:ring-white/30 transition-all text-base shadow-xl disabled:opacity-60"
            />
          </div>

          {/* Perspective Mode Selector */}
          <div className="w-full mb-3">
            <div className="grid grid-cols-3 gap-2">
              {MODES.map((m) => {
                const active = mode === m.value;
                return (
                  <button
                    key={m.value}
                    type="button"
                    onClick={() => setMode(m.value)}
                    disabled={isLoading}
                    aria-pressed={active}
                    className={`flex flex-col items-center justify-center text-center rounded-xl px-2 py-3 transition-all disabled:opacity-50 ${
                      active
                        ? 'bg-[#2d4a6e] border border-white/40 shadow-lg'
                        : 'bg-white/5 border border-white/15 hover:bg-white/10'
                    }`}
                  >
                    <span
                      className={`text-sm font-semibold leading-tight ${
                        active ? 'text-white' : 'text-white/80'
                      }`}
                    >
                      {m.label}
                    </span>
                    <span
                      className={`mt-1 text-[10px] leading-tight ${
                        active ? 'text-white/70' : 'text-white/40'
                      }`}
                    >
                      {m.hint}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          <button
            type="submit"
            disabled={!query.trim() || isLoading}
            className="w-full py-4 rounded-2xl bg-[#2d4a6e] text-white font-semibold hover:bg-[#3a5a82] disabled:opacity-50 transition-colors flex items-center justify-center gap-2 shadow-lg text-base"
          >
            <Search className="h-4 w-4" />
            Suchen
          </button>
        </form>

        {/* Photo Capture */}
        <div className="w-full flex items-center gap-3 mb-4">
          <div className="flex-1 h-px bg-white/15" />
          <span className="text-white/40 text-xs uppercase tracking-widest">oder</span>
          <div className="flex-1 h-px bg-white/15" />
        </div>
        <button
          type="button"
          onClick={handlePhotoClick}
          disabled={isLoading}
          className="w-full py-4 rounded-2xl bg-white/5 border border-white/15 text-white/90 font-semibold hover:bg-white/15 disabled:opacity-50 transition-colors flex items-center justify-center gap-2 shadow-lg text-base"
        >
          <Camera className="h-4 w-4" />
          Foto aufnehmen
        </button>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          capture="environment"
          onChange={handleFileChange}
          className="hidden"
        />

        {/* Error */}
        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="w-full mt-4 flex items-start gap-2 px-4 py-3 rounded-xl bg-red-500/15 border border-red-400/30 text-red-100 text-sm"
            >
              <AlertCircle className="h-4 w-4 mt-0.5 flex-shrink-0" />
              <span>{error}</span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Topics Marquee */}
      <div className="w-full flex-grow flex flex-col justify-start mt-8 overflow-hidden">
        <h3 className="text-white/50 text-sm font-semibold tracking-widest uppercase mb-6 px-4 text-center">
          Aktuelle Themen
        </h3>

        <div className="flex flex-col gap-4 overflow-hidden py-2">
          {TOPICS.map((row, rowIndex) => {
            const isEven = rowIndex % 2 === 0;
            const items = [...row, ...row, ...row, ...row];
            
            return (
              <div 
                key={rowIndex}
                className="flex gap-3 w-max"
                style={{
                  animation: `${isEven ? 'scroll-left' : 'scroll-right'} ${35 + rowIndex * 5}s linear infinite`,
                }}
              >
                {items.map((topic, index) => (
                  <button
                    key={`${rowIndex}-${index}`}
                    onClick={() => handleChipClick(topic)}
                    disabled={isLoading}
                    className="px-5 py-2.5 rounded-full bg-white/5 border border-white/15 text-white/80 whitespace-nowrap text-sm hover:bg-white/15 hover:text-white transition-all active:scale-95 disabled:opacity-50"
                  >
                    {topic}
                  </button>
                ))}
              </div>
            );
          })}
        </div>
      </div>

      {/* Loading Overlay */}
      <AnimatePresence>
        {isLoading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-[#0a1424]/85 backdrop-blur-sm px-8"
          >
            <Loader2 className="h-10 w-10 text-white animate-spin mb-5" />
            <p className="text-white text-lg font-serif italic text-center mb-2">
              {loadingLabel}
            </p>
            <p className="text-white/55 text-sm text-center">
              Knowbuddy erstellt acht Perspektiven. Das kann einen Moment dauern.
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};
