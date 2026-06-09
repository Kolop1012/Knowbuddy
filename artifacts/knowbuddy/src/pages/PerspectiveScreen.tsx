import React, { useState } from 'react';
import { motion, PanInfo } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';
import { generateMockData, type PerspectiveData } from '@/mock-data';
import type { SearchSource } from '@/types';

interface PerspectiveScreenProps {
  topic: string;
  perspectives?: PerspectiveData[];
  source?: SearchSource | null;
  onBack: () => void;
  onOpenInfo: (index: number) => void;
}

const NODE_POS: { x: number; y: number }[] = [
  { x: 17, y: 24 },
  { x: 11, y: 48 },
  { x: 17, y: 72 },
  { x: 50, y: 86 },
  { x: 83, y: 72 },
  { x: 89, y: 48 },
  { x: 83, y: 24 },
  { x: 50, y: 8 },
];

const CARD_BG: Record<string, string> = {
  '#10b981': '#f0faf6',
  '#14b8a6': '#eefaf9',
  '#3b82f6': '#f1f5ff',
  '#8b5cf6': '#f5f2ff',
  '#f97316': '#fff8f2',
  '#f59e0b': '#fefbec',
  '#eab308': '#fefce8',
  '#64748b': '#f5f7f9',
};

const STRIP_CLR: Record<string, string> = {
  '#10b981': '#a7f3d0',
  '#14b8a6': '#99f6e4',
  '#3b82f6': '#bfdbfe',
  '#8b5cf6': '#ddd6fe',
  '#f97316': '#fed7aa',
  '#f59e0b': '#fde68a',
  '#eab308': '#fef08a',
  '#64748b': '#93c5fd',
};

const N_STRIPS = 7;
const STRIP_H = 8;
const FAN_H = N_STRIPS * STRIP_H;

export const PerspectiveScreen: React.FC<PerspectiveScreenProps> = ({
  topic,
  perspectives: injected,
  source,
  onBack,
  onOpenInfo,
}) => {
  const [active, setActive] = useState(0);
  const [perspectives] = useState(() =>
    injected && injected.length > 0 ? injected : generateMockData(topic),
  );
  const total = perspectives.length;

  const [dir, setDir] = useState(0);
  const go = (d: number) => {
    setDir(d);
    setActive((p) => (p + d + total) % total);
  };
  const next = () => go(1);
  const prev = () => go(-1);
  const onDrag = (_: unknown, info: PanInfo) => {
    if (info.offset.y < -40 || info.velocity.y < -300) next();
    else if (info.offset.y > 40 || info.velocity.y > 300) prev();
  };

  const ap = perspectives[active];
  const apBg = CARD_BG[ap.color] ?? '#f5f7f9';
  const nextIdx = (active + 1) % total;
  const np = perspectives[nextIdx];
  const npBg = CARD_BG[np.color] ?? '#f5f7f9';

  const centerSource: SearchSource | null =
    source ?? (topic ? { kind: 'phrase', phrase: topic } : null);

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="h-[100dvh] w-full bg-navy-gradient flex flex-col overflow-hidden"
    >
      {/* HEADER */}
      <div
        className="flex items-center px-4 pb-1 flex-shrink-0 z-30"
        style={{ paddingTop: 'calc(env(safe-area-inset-top) + 1.25rem)' }}
      >
        <button
          onClick={onBack}
          className="p-2 -ml-2 text-white/70 hover:text-white rounded-full hover:bg-white/10 transition-colors"
        >
          <ArrowLeft size={22} />
        </button>
        <div className="flex-1" />
      </div>

      {/* GRAPH */}
      <div className="flex-[55] min-h-0 relative w-full px-7 py-6">
        <div className="relative w-full h-full">
        <svg
          className="absolute inset-0 w-full h-full pointer-events-none z-[5]"
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
        >
          {/* Radial spokes from the center to each node */}
          {NODE_POS.map((pos, i) => (
            <line
              key={`spoke-${i}`}
              x1={50} y1={50}
              x2={pos.x} y2={pos.y}
              stroke={i === active ? 'rgba(255,255,255,0.5)' : 'rgba(255,255,255,0.15)'}
              strokeWidth={i === active ? 1.2 : 0.8}
              vectorEffect="non-scaling-stroke"
            />
          ))}
        </svg>

        {perspectives.map((p, i) => {
          const pos = NODE_POS[i];
          const isAct = i === active;
          return (
            <button
              key={p.id}
              onClick={() => { setDir(i > active ? 1 : -1); setActive(i); }}
              className="absolute flex items-center justify-center text-center z-20"
              style={{
                left: `${pos.x}%`,
                top: `${pos.y}%`,
                width: isAct ? 110 : 100,
                height: 54,
                transform: 'translate(-50%,-50%)',
                padding: '6px 6px',
                borderRadius: 10,
                backgroundColor: p.color,
                boxShadow: isAct
                  ? '0 0 0 2.5px white, 0 0 14px rgba(255,255,255,0.15)'
                  : '0 2px 6px rgba(0,0,0,0.3)',
                opacity: isAct ? 1 : 0.85,
                transition: 'box-shadow .2s, opacity .2s',
              }}
            >
              <span
                className="text-white leading-[1.2]"
                style={{
                  fontSize: isAct ? 11.5 : 10.5,
                  fontWeight: isAct ? 700 : 600,
                  display: '-webkit-box',
                  WebkitLineClamp: 3,
                  WebkitBoxOrient: 'vertical',
                  overflow: 'hidden',
                  wordBreak: 'break-word',
                }}
              >
                {p.title}
              </span>
            </button>
          );
        })}

        {/* Center subject — the photo or phrase that drove the search */}
        {centerSource && (
          <div
            className="absolute left-1/2 top-1/2 z-10 flex items-center justify-center pointer-events-none"
            style={{ transform: 'translate(-50%, -50%)' }}
          >
            {centerSource.kind === 'image' ? (
              <div
                className="rounded-full overflow-hidden bg-white/5"
                style={{
                  width: 116,
                  height: 116,
                  boxShadow:
                    '0 0 0 3px rgba(255,255,255,0.9), 0 0 26px rgba(255,255,255,0.18), 0 6px 18px rgba(0,0,0,0.5)',
                }}
              >
                <img
                  src={centerSource.imageUrl}
                  alt={topic}
                  className="w-full h-full object-cover"
                />
              </div>
            ) : (
              <div
                className="flex items-center justify-center text-center rounded-full bg-white/[0.07] backdrop-blur-sm"
                style={{
                  width: 132,
                  height: 132,
                  padding: 14,
                  border: '1px solid rgba(255,255,255,0.22)',
                  boxShadow: '0 0 26px rgba(255,255,255,0.08), 0 6px 18px rgba(0,0,0,0.4)',
                }}
              >
                <span
                  className="text-white font-serif font-bold italic leading-[1.15]"
                  style={{
                    fontSize: 18,
                    display: '-webkit-box',
                    WebkitLineClamp: 4,
                    WebkitBoxOrient: 'vertical',
                    overflow: 'hidden',
                    wordBreak: 'break-word',
                  }}
                >
                  {centerSource.phrase}
                </span>
              </div>
            )}
          </div>
        )}
        </div>
      </div>

      {/* CARD DECK */}
      <div className="flex-[42] min-h-0 relative w-full">
        {/*
          Fan strips anchored from BOTTOM of fan area.
          strip 0 = closest to card = widest, shortest, highest z
          strip 6 = farthest from card = narrowest, tallest, lowest z
        */}
        {Array.from({ length: N_STRIPS }, (_, i) => {
          const ci = (active + i + 1) % total;
          const bg = STRIP_CLR[perspectives[ci].color] ?? '#93c5fd';
          const inset = 14 + i * 4;
          return (
            <div
              key={`s-${i}`}
              style={{
                position: 'absolute',
                top: FAN_H - (i + 1) * STRIP_H,
                left: inset,
                right: inset,
                height: FAN_H,
                backgroundColor: bg,
                borderRadius: '10px 10px 0 0',
                zIndex: N_STRIPS - i,
              }}
            />
          );
        })}

        {/* Next card — sits behind front card, fully rendered */}
        <div
          className="absolute flex flex-col overflow-hidden"
          style={{
            top: FAN_H,
            left: 14,
            right: 14,
            bottom: 0,
            zIndex: N_STRIPS + 2,
            borderRadius: 16,
            backgroundColor: npBg,
          }}
        >
          <div className="flex flex-col flex-1 px-5 pt-5 pb-3 min-h-0">
            <div
              className="text-[10px] font-bold tracking-[0.14em] uppercase mb-1.5"
              style={{ color: np.color }}
            >
              {np.category}
            </div>
            <h2 className="text-[17px] font-bold text-[#1a2e45] leading-snug mb-2">
              {np.title}
            </h2>
            <p
              className="text-[13px] text-[#4b5563] leading-relaxed flex-1 min-h-0"
              style={{
                display: '-webkit-box',
                WebkitLineClamp: 4,
                WebkitBoxOrient: 'vertical',
                overflow: 'hidden',
              }}
            >
              {np.summary}
            </p>
          </div>
        </div>

        {/* Front card — draggable, sits on top */}
          <motion.div
            key={`c-${active}`}
            className="absolute flex flex-col overflow-hidden"
            style={{
              top: FAN_H,
              left: 14,
              right: 14,
              bottom: 0,
              zIndex: N_STRIPS + 5,
              borderRadius: 16,
              backgroundColor: apBg,
              boxShadow: '0 -4px 16px rgba(0,0,0,0.15)',
            }}
            initial={false}
            animate={{ y: 0 }}
            transition={{ type: 'spring', stiffness: 300, damping: 30, mass: 0.8 }}
            drag="y"
            dragConstraints={{ top: -8, bottom: 8 }}
            dragElastic={0.18}
            onDragEnd={onDrag}
          >
            <div className="flex flex-col flex-1 px-5 pt-5 pb-3 min-h-0">
              <div
                className="text-[10px] font-bold tracking-[0.14em] uppercase mb-1.5"
                style={{ color: ap.color }}
              >
                {ap.category}
              </div>
              <h2 className="text-[17px] font-bold text-[#1a2e45] leading-snug mb-2">
                {ap.title}
              </h2>
              <p
                className="text-[13px] text-[#4b5563] leading-relaxed flex-1 min-h-0"
                style={{
                  display: '-webkit-box',
                  WebkitLineClamp: 4,
                  WebkitBoxOrient: 'vertical',
                  overflow: 'hidden',
                }}
              >
                {ap.summary}
              </p>
              <div className="flex items-center gap-2 mt-3 flex-shrink-0">
                <button
                  onClick={(e) => { e.stopPropagation(); prev(); }}
                  className="flex-1 py-2.5 rounded-xl border border-[#d1d5db] bg-white/70 text-[#374151] text-[13px] font-medium"
                >
                  Vorherige
                </button>
                <button
                  onClick={(e) => { e.stopPropagation(); next(); }}
                  className="flex-1 py-2.5 rounded-xl border border-[#d1d5db] bg-white/70 text-[#374151] text-[13px] font-medium"
                >
                  Nächste
                </button>
                <button
                  onClick={(e) => { e.stopPropagation(); onOpenInfo(active); }}
                  className="flex-[1.4] py-2.5 rounded-xl text-white text-[13px] font-semibold"
                  style={{ backgroundColor: '#1a2e45' }}
                >
                  Mehr erfahren
                </button>
              </div>
            </div>
          </motion.div>
      </div>
    </motion.div>
  );
};
