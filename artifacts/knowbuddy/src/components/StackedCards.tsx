import React, { useRef } from 'react';
import { motion, AnimatePresence, PanInfo } from 'framer-motion';
import type { PerspectiveData } from '@/mock-data';

interface StackedCardsProps {
  perspectives: PerspectiveData[];
  activeIndex: number;
  onChangeIndex: (index: number) => void;
  onReadMore: () => void;
}

const CARD_BG: Record<string, string> = {
  '#10b981': '#e8faf4',
  '#14b8a6': '#e6faf8',
  '#3b82f6': '#eef4ff',
  '#8b5cf6': '#f3f0ff',
  '#f97316': '#fff5ee',
  '#f59e0b': '#fefae8',
  '#eab308': '#fefce4',
  '#64748b': '#f6f7f8',
};

// Each peek strip height (visible portion of background card)
const PEEK_H = 9;
// How many cards peek behind the front card
const STACK_COUNT = 7;
// Total height reserved at the bottom for all peeks
const STACK_SPACE = PEEK_H * STACK_COUNT; // 63px

export const StackedCards: React.FC<StackedCardsProps> = ({
  perspectives,
  activeIndex,
  onChangeIndex,
  onReadMore,
}) => {
  const dragStartY = useRef(0);
  const total = perspectives.length;

  const nextCard = () => onChangeIndex((activeIndex + 1) % total);
  const prevCard = () => onChangeIndex((activeIndex - 1 + total) % total);

  const handleDragEnd = (_: unknown, info: PanInfo) => {
    if (info.offset.y < -40 || info.velocity.y < -300) nextCard();
    else if (info.offset.y > 40 || info.velocity.y > 300) prevCard();
  };

  const activeBg = CARD_BG[perspectives[activeIndex].color] ?? '#f6f7f8';
  const activeColor = perspectives[activeIndex].color;

  return (
    <div className="relative w-full h-full overflow-hidden">

      {/*
       * BACKGROUND PEEK STRIPS
       *
       * Render from furthest (i=STACK_COUNT-1) to closest (i=0).
       * Each strip is anchored by `bottom` from the container bottom.
       * The visible band of strip i is a PEEK_H-pixel slice between
       * the bottom of the card in front of it and its own bottom.
       *
       *   strip 0 (closest, z=STACK_COUNT):   bottom=(STACK_COUNT-1)*PEEK_H
       *   strip 1:                             bottom=(STACK_COUNT-2)*PEEK_H
       *   ...
       *   strip STACK_COUNT-1 (furthest, z=1): bottom=0
       *
       * Strips narrow slightly as they go further back.
       */}
      {Array.from({ length: STACK_COUNT }, (_, i) => {
        const cardIndex = (activeIndex + i + 1) % total;
        const bg = CARD_BG[perspectives[cardIndex].color] ?? '#f6f7f8';
        const fromBottom = (STACK_COUNT - 1 - i) * PEEK_H;
        const sideInset = 4 + i * 3;
        const zIndex = STACK_COUNT - i;

        return (
          <div
            key={`peek-${i}-${cardIndex}`}
            style={{
              position: 'absolute',
              left: sideInset,
              right: sideInset,
              bottom: fromBottom,
              height: 180,
              backgroundColor: bg,
              borderRadius: '14px 14px 0 0',
              zIndex,
            }}
          />
        );
      })}

      {/* FRONT (ACTIVE) CARD */}
      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={`card-${activeIndex}`}
          className="absolute flex flex-col"
          style={{
            top: 10,
            left: 10,
            right: 10,
            bottom: STACK_SPACE,
            zIndex: STACK_COUNT + 10,
            borderRadius: 16,
            backgroundColor: activeBg,
            boxShadow: '0 4px 20px rgba(0,0,0,0.14), 0 1px 4px rgba(0,0,0,0.08)',
            overflow: 'hidden',
          }}
          initial={{ y: 50, opacity: 0, scale: 0.97 }}
          animate={{ y: 0, opacity: 1, scale: 1 }}
          exit={{ y: -40, opacity: 0, scale: 0.97 }}
          transition={{ type: 'spring', stiffness: 400, damping: 38 }}
          drag="y"
          dragConstraints={{ top: -6, bottom: 6 }}
          dragElastic={0.08}
          onDragStart={(_, info) => { dragStartY.current = info.point.y; }}
          onDragEnd={handleDragEnd}
        >
          <div className="flex flex-col flex-1 px-5 pt-5 pb-4 min-h-0">
            {/* Category — small caps, colored */}
            <div
              className="text-[10px] font-bold tracking-[0.15em] uppercase mb-2"
              style={{ color: activeColor }}
            >
              {perspectives[activeIndex].category}
            </div>

            {/* Title */}
            <h2 className="text-[18px] font-bold text-[#1a2e45] leading-snug mb-3">
              {perspectives[activeIndex].title}
            </h2>

            {/* Summary body */}
            <p className="text-[13.5px] text-[#374151] leading-relaxed flex-1 min-h-0"
              style={{
                display: '-webkit-box',
                WebkitLineClamp: 4,
                WebkitBoxOrient: 'vertical',
                overflow: 'hidden',
              }}
            >
              {perspectives[activeIndex].summary}
            </p>

            {/* Button row — matching reference exactly */}
            <div className="flex items-center gap-2 mt-4 flex-shrink-0">
              {/* Outlined nav buttons */}
              <button
                onClick={(e) => { e.stopPropagation(); prevCard(); }}
                className="flex-1 py-2.5 rounded-xl border border-[#d1d5db] bg-white/60 text-[#374151] text-[13px] font-medium hover:bg-white transition-colors"
              >
                Vorherige
              </button>
              <button
                onClick={(e) => { e.stopPropagation(); nextCard(); }}
                className="flex-1 py-2.5 rounded-xl border border-[#d1d5db] bg-white/60 text-[#374151] text-[13px] font-medium hover:bg-white transition-colors"
              >
                Nächste
              </button>

              {/* Dark filled "Mehr erfahren" */}
              <button
                onClick={(e) => { e.stopPropagation(); onReadMore(); }}
                className="flex-[1.4] py-2.5 rounded-xl text-white text-[13px] font-semibold hover:opacity-90 transition-opacity active:scale-95"
                style={{ backgroundColor: '#1a2e45' }}
              >
                Mehr erfahren
              </button>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
};
