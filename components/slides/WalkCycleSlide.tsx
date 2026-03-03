import React from 'react';
import { motion } from 'framer-motion';
import { BilingualText } from '@/lib/presentations/types';
import { getText } from '@/lib/presentations/bilingualHelpers';

interface WalkCycleSlideProps {
  title: BilingualText;
  language?: 'fr' | 'en';
}

// Simple stick figure SVG component
function StickFigure({ pose }: { pose: 'left' | 'center' | 'right' }) {
  // Head center at (60, 25), body to (60, 70), legs/arms vary by pose
  const armLeft = {
    left: { x: 35, y: 65 },
    center: { x: 40, y: 75 },
    right: { x: 80, y: 55 },
  };
  const armRight = {
    left: { x: 80, y: 55 },
    center: { x: 80, y: 75 },
    right: { x: 35, y: 65 },
  };
  const legLeft = {
    left: { x: 35, y: 120 },
    center: { x: 48, y: 120 },
    right: { x: 80, y: 120 },
  };
  const legRight = {
    left: { x: 80, y: 120 },
    center: { x: 72, y: 120 },
    right: { x: 35, y: 120 },
  };

  return (
    <svg viewBox="0 0 120 130" className="w-full h-full">
      {/* Head */}
      <circle cx="60" cy="22" r="16" fill="none" stroke="#374151" strokeWidth="3.5" />
      {/* Body */}
      <line x1="60" y1="38" x2="60" y2="78" stroke="#374151" strokeWidth="3.5" strokeLinecap="round" />
      {/* Left arm */}
      <line x1="60" y1="50" x2={armLeft[pose].x} y2={armLeft[pose].y} stroke="#374151" strokeWidth="3.5" strokeLinecap="round" />
      {/* Right arm */}
      <line x1="60" y1="50" x2={armRight[pose].x} y2={armRight[pose].y} stroke="#374151" strokeWidth="3.5" strokeLinecap="round" />
      {/* Left leg */}
      <line x1="60" y1="78" x2={legLeft[pose].x} y2={legLeft[pose].y} stroke="#374151" strokeWidth="3.5" strokeLinecap="round" />
      {/* Right leg */}
      <line x1="60" y1="78" x2={legRight[pose].x} y2={legRight[pose].y} stroke="#374151" strokeWidth="3.5" strokeLinecap="round" />
    </svg>
  );
}

export default function WalkCycleSlide({ title, language = 'fr' }: WalkCycleSlideProps) {
  const poses: Array<{ pose: 'left' | 'center' | 'right'; label: BilingualText }> = [
    { pose: 'left', label: { fr: 'Image 1', en: 'Frame 1' } },
    { pose: 'center', label: { fr: 'Image 2', en: 'Frame 2' } },
    { pose: 'right', label: { fr: 'Image 3', en: 'Frame 3' } },
  ];

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.25, delayChildren: 0.3 },
    },
  };

  const item = {
    hidden: { opacity: 0, y: 30 },
    show: {
      opacity: 1,
      y: 0,
      transition: { type: 'spring' as const, stiffness: 200, damping: 15 },
    },
  };

  return (
    <div className="h-full w-full bg-gradient-to-b from-white to-gray-50 flex flex-col justify-center items-center p-8 md:p-12">
      {/* Title */}
      <motion.h1
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="font-cooper text-4xl md:text-5xl lg:text-6xl text-gray-800 mb-12 text-center"
      >
        {getText(title, language)}
      </motion.h1>

      {/* Three frames */}
      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="flex items-end gap-6 md:gap-10 lg:gap-14"
      >
        {poses.map((frame, index) => (
          <motion.div
            key={index}
            variants={item}
            className="flex flex-col items-center"
          >
            {/* Frame box */}
            <div className="bg-white border-3 border-gray-300 rounded-xl shadow-lg w-32 h-40 md:w-40 md:h-48 lg:w-48 lg:h-56 flex items-center justify-center p-4"
              style={{ borderWidth: '3px' }}
            >
              <StickFigure pose={frame.pose} />
            </div>

            {/* Label */}
            <span className="font-neue-haas font-bold text-base md:text-lg lg:text-xl text-gray-600 mt-3">
              {getText(frame.label, language)}
            </span>
          </motion.div>
        ))}

        {/* Arrows between frames */}
      </motion.div>

      {/* Playful arrow row */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2 }}
        className="flex items-center gap-3 mt-6 text-gray-400"
      >
        <span className="text-2xl">▶</span>
        <span className="text-2xl">▶</span>
        <span className="text-2xl">▶</span>
        <span className="font-neue-haas text-lg ml-2">
          {language === 'fr' ? '= Mouvement !' : '= Movement!'}
        </span>
      </motion.div>
    </div>
  );
}
