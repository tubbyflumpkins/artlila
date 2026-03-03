import React from 'react';
import { motion } from 'framer-motion';
import { BilingualText } from '@/lib/presentations/types';
import { getText } from '@/lib/presentations/bilingualHelpers';

interface VideoLinkSlideProps {
  title: BilingualText;
  description?: BilingualText;
  url: string;
  emoji?: string;
  language?: 'fr' | 'en';
}

export default function VideoLinkSlide({
  title,
  description,
  url,
  emoji = '🎬',
  language = 'fr',
}: VideoLinkSlideProps) {
  return (
    <div className="h-full w-full bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex flex-col items-center justify-center p-8 md:p-12 relative overflow-hidden">
      {/* Subtle film grain overlay */}
      <div className="absolute inset-0 opacity-5 bg-[radial-gradient(circle_at_50%_50%,_white_1px,_transparent_1px)] bg-[length:20px_20px]" />

      {/* Play button circle */}
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: 'spring', stiffness: 200, damping: 15, delay: 0.1 }}
        className="relative mb-8"
      >
        <div className="w-24 h-24 md:w-32 md:h-32 rounded-full bg-red-500 flex items-center justify-center shadow-2xl shadow-red-500/30">
          <svg className="w-10 h-10 md:w-14 md:h-14 text-white ml-1.5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M8 5v14l11-7z" />
          </svg>
        </div>
      </motion.div>

      {/* Title */}
      <motion.h1
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="font-cooper text-3xl md:text-4xl lg:text-5xl text-white text-center mb-3 drop-shadow-lg"
      >
        {getText(title, language)}
      </motion.h1>

      {/* Description */}
      {description && (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="font-neue-haas text-lg md:text-xl text-gray-300 text-center mb-8 max-w-2xl leading-relaxed"
        >
          {getText(description, language)}
        </motion.p>
      )}

      {/* URL display */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
        className="bg-white/10 backdrop-blur-sm rounded-xl px-6 py-3 md:px-8 md:py-4 border border-white/20"
      >
        <span className="font-neue-haas text-base md:text-lg text-cyan-300 break-all">
          {url}
        </span>
      </motion.div>

      {/* Emoji decoration */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
        className="absolute bottom-8 right-8 text-4xl opacity-30 select-none"
      >
        {emoji}
      </motion.div>
    </div>
  );
}
