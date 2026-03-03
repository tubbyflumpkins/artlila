import React from 'react';
import { motion } from 'framer-motion';

interface AnimationTitleSlideProps {
  language?: 'fr' | 'en';
}

// language prop received from PresentationViewer but not needed (title is same in both languages)
export default function AnimationTitleSlide(_props: AnimationTitleSlideProps) {
  const letters = 'ANIMATION'.split('');

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.06,
        delayChildren: 0.2,
      },
    },
  };

  const letterVariant = {
    hidden: { y: 80, opacity: 0, rotate: -15 },
    show: {
      y: 0,
      opacity: 1,
      rotate: 0,
      transition: {
        type: 'spring' as const,
        stiffness: 200,
        damping: 12,
      },
    },
  };

  const letterColors = [
    '#FF6B6B', '#FF9F43', '#FECA57', '#48DBFB', '#0ABDE3',
    '#A29BFE', '#FD79A8', '#FDCB6E', '#6C5CE7',
  ];

  return (
    <div className="h-full w-full bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-500 flex flex-col items-center justify-center relative overflow-hidden">
      {/* Decorative film sprocket holes - top */}
      <div className="absolute top-6 left-0 right-0 flex justify-center gap-8 opacity-20">
        {Array.from({ length: 12 }).map((_, i) => (
          <div key={`top-${i}`} className="w-4 h-4 rounded-full bg-white" />
        ))}
      </div>

      {/* Decorative film sprocket holes - bottom */}
      <div className="absolute bottom-6 left-0 right-0 flex justify-center gap-8 opacity-20">
        {Array.from({ length: 12 }).map((_, i) => (
          <div key={`bot-${i}`} className="w-4 h-4 rounded-full bg-white" />
        ))}
      </div>

      {/* Film reel decorations */}
      <motion.div
        initial={{ rotate: 0 }}
        animate={{ rotate: 360 }}
        transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
        className="absolute top-10 left-10 text-6xl opacity-15 select-none"
      >
        🎬
      </motion.div>
      <motion.div
        initial={{ rotate: 0 }}
        animate={{ rotate: -360 }}
        transition={{ duration: 25, repeat: Infinity, ease: 'linear' }}
        className="absolute bottom-10 right-10 text-6xl opacity-15 select-none"
      >
        🎞️
      </motion.div>

      {/* Main title */}
      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="flex items-center"
      >
        {letters.map((letter, index) => (
          <motion.span
            key={index}
            variants={letterVariant}
            className="font-cooper text-7xl md:text-8xl lg:text-9xl font-bold drop-shadow-2xl"
            style={{ color: letterColors[index % letterColors.length] }}
            whileHover={{ scale: 1.2, rotate: 5 }}
          >
            {letter}
          </motion.span>
        ))}
      </motion.div>

      {/* Subtle clapperboard */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1, duration: 0.5 }}
        className="mt-6 text-4xl select-none"
      >
        🎬
      </motion.div>
    </div>
  );
}
