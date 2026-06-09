import React from 'react';
import { motion } from 'framer-motion';
import type { PerspectiveData } from '@/mock-data';

interface NetworkGraphProps {
  topic: string;
  perspectives: PerspectiveData[];
  activeIndex: number;
  onNodeClick: (index: number) => void;
}

/*
 * Fixed positions (x%, y%) for 8 nodes matching the reference design:
 *   layout: 1 top-center, 2 upper, 2 middle, 2 lower, 1 bottom-center
 *
 * Mapped by perspective index (same order as generateMockData):
 *  0 = green  (Erfahrungen)    → upper-left
 *  1 = teal   (Umwelt)         → middle-left
 *  2 = blue   (Ursachen)       → lower-left
 *  3 = purple (Identität)      → lower-right
 *  4 = orange (Integration)    → middle-right
 *  5 = amber  (Arbeit)         → upper-right
 *  6 = yellow (Gerechtigkeit)  → bottom-center
 *  7 = gray   (Macht)          → top-center
 */
const POSITIONS: { x: number; y: number }[] = [
  { x: 19, y: 23 }, // 0 upper-left
  { x: 12, y: 49 }, // 1 middle-left
  { x: 19, y: 75 }, // 2 lower-left
  { x: 81, y: 75 }, // 3 lower-right
  { x: 88, y: 49 }, // 4 middle-right
  { x: 81, y: 23 }, // 5 upper-right
  { x: 50, y: 91 }, // 6 bottom-center
  { x: 50, y: 8  }, // 7 top-center
];

export const NetworkGraph: React.FC<NetworkGraphProps> = ({
  perspectives,
  activeIndex,
  onNodeClick,
}) => {
  const nodes = perspectives.map((p, i) => ({
    ...p,
    x: POSITIONS[i % POSITIONS.length].x,
    y: POSITIONS[i % POSITIONS.length].y,
    index: i,
  }));

  const allConnections: { i: number; j: number }[] = [];
  for (let i = 0; i < nodes.length; i++) {
    for (let j = i + 1; j < nodes.length; j++) {
      allConnections.push({ i, j });
    }
  }

  const activeNode = nodes[activeIndex];

  return (
    <div className="relative w-full h-full">
      {/* SVG layer — connection lines */}
      <svg
        className="absolute inset-0 w-full h-full pointer-events-none"
        viewBox="0 0 100 100"
        preserveAspectRatio="xMidYMid meet"
      >
        {allConnections.map(({ i, j }) => {
          const a = nodes[i];
          const b = nodes[j];
          const isActive = i === activeIndex || j === activeIndex;
          return (
            <line
              key={`line-${i}-${j}`}
              x1={a.x} y1={a.y}
              x2={b.x} y2={b.y}
              stroke={isActive ? 'rgba(255,255,255,0.22)' : 'rgba(255,255,255,0.07)'}
              strokeWidth={isActive ? '0.35' : '0.2'}
            />
          );
        })}

        {/* Pulsing ring behind active node */}
        <motion.circle
          key={`ring-${activeIndex}`}
          cx={activeNode.x}
          cy={activeNode.y}
          r="6"
          fill="none"
          stroke="rgba(255,255,255,0.35)"
          strokeWidth="0.6"
          initial={{ opacity: 0.7, scale: 1 }}
          animate={{ opacity: 0, scale: 2.4 }}
          transition={{ repeat: Infinity, duration: 1.8, ease: 'easeOut' }}
        />
      </svg>

      {/* HTML node buttons */}
      <div className="absolute inset-0">
        {nodes.map((node) => {
          const isActive = node.index === activeIndex;
          return (
            <motion.button
              key={node.id}
              onClick={() => onNodeClick(node.index)}
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.3, delay: node.index * 0.04 + 0.05 }}
              style={{
                position: 'absolute',
                left: `${node.x}%`,
                top: `${node.y}%`,
                transform: 'translate(-50%, -50%)',
                backgroundColor: node.color,
                boxShadow: isActive
                  ? `0 0 0 2.5px white, 0 0 18px ${node.color}bb`
                  : `0 2px 8px rgba(0,0,0,0.45)`,
                opacity: isActive ? 1 : 0.72,
                zIndex: isActive ? 30 : 10,
                width: 90,
                borderRadius: 10,
                padding: '7px 8px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'box-shadow 0.25s, opacity 0.25s, transform 0.25s',
                scale: isActive ? 1.08 : 1,
              }}
            >
              <span
                style={{
                  color: 'white',
                  fontSize: isActive ? 10.5 : 10,
                  fontWeight: isActive ? 700 : 600,
                  lineHeight: 1.3,
                  textAlign: 'center',
                  display: '-webkit-box',
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: 'vertical',
                  overflow: 'hidden',
                }}
              >
                {node.title}
              </span>
            </motion.button>
          );
        })}
      </div>
    </div>
  );
};
