import React from 'react';
import { motion } from 'framer-motion';
import { BilingualText } from '@/lib/presentations/types';
import { getText } from '@/lib/presentations/bilingualHelpers';

interface FrameConceptSlideProps {
  title: BilingualText;
  description: BilingualText;
  frameCount?: number;
  language?: 'fr' | 'en';
}

export default function FrameConceptSlide({
  title,
  description,
  frameCount = 5,
  language = 'fr',
}: FrameConceptSlideProps) {
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.12, delayChildren: 0.3 },
    },
  };

  const frameVariant = {
    hidden: { scale: 0, opacity: 0 },
    show: {
      scale: 1,
      opacity: 1,
      transition: { type: 'spring' as const, stiffness: 260, damping: 20 },
    },
  };

  // Simple shapes that progressively move/change to illustrate animation
  const frameShapes = [
    { x: 20, y: 70 },
    { x: 35, y: 55 },
    { x: 50, y: 40 },
    { x: 65, y: 55 },
    { x: 80, y: 70 },
  ];

  return (
    <div className="h-full w-full bg-gradient-to-b from-gray-50 to-gray-100 flex flex-col justify-center items-center p-8 md:p-12">
      {/* Title */}
      <motion.h1
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="font-cooper text-4xl md:text-5xl lg:text-6xl text-gray-800 mb-4 text-center"
      >
        {getText(title, language)}
      </motion.h1>

      {/* Description */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="font-neue-haas text-lg md:text-xl lg:text-2xl text-gray-600 mb-10 text-center max-w-3xl leading-relaxed"
      >
        {getText(description, language)}
      </motion.p>

      {/* Filmstrip */}
      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="relative bg-gray-800 rounded-lg px-3 py-4 md:px-4 md:py-5 flex items-center gap-3 md:gap-4 shadow-2xl"
      >
        {/* Sprocket holes top */}
        <div className="absolute -top-1 left-4 right-4 flex justify-between">
          {Array.from({ length: frameCount * 2 + 1 }).map((_, i) => (
            <div key={`st-${i}`} className="w-2 h-2 rounded-full bg-gray-600" />
          ))}
        </div>

        {/* Sprocket holes bottom */}
        <div className="absolute -bottom-1 left-4 right-4 flex justify-between">
          {Array.from({ length: frameCount * 2 + 1 }).map((_, i) => (
            <div key={`sb-${i}`} className="w-2 h-2 rounded-full bg-gray-600" />
          ))}
        </div>

        {/* Frames */}
        {Array.from({ length: frameCount }).map((_, i) => (
          <motion.div
            key={i}
            variants={frameVariant}
            className="relative bg-white rounded w-20 h-20 md:w-28 md:h-28 lg:w-32 lg:h-32 flex flex-col items-center justify-center shadow-inner"
          >
            {/* Simple bouncing ball illustration in each frame */}
            <svg viewBox="0 0 100 100" className="w-full h-full p-2">
              <circle
                cx={frameShapes[i % frameShapes.length].x}
                cy={frameShapes[i % frameShapes.length].y}
                r="10"
                fill="#FF6B6B"
              />
              {/* Ground line */}
              <line x1="10" y1="85" x2="90" y2="85" stroke="#E2E8F0" strokeWidth="2" />
            </svg>

            {/* Frame number label */}
            <span className="absolute bottom-1 font-neue-haas text-xs md:text-sm font-bold text-gray-400">
              {i + 1}
            </span>
          </motion.div>
        ))}
      </motion.div>

      {/* Arrow indicating direction */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2 }}
        className="mt-4 flex items-center gap-2 text-gray-400"
      >
        <span className="font-neue-haas text-sm md:text-base">
          {language === 'fr' ? 'Direction' : 'Direction'}
        </span>
        <span className="text-xl">→</span>
      </motion.div>
    </div>
  );
}
