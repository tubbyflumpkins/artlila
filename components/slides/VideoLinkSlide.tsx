import React from 'react';
import { motion } from 'framer-motion';
import { BilingualText } from '@/lib/presentations/types';
import { getText } from '@/lib/presentations/bilingualHelpers';

interface VideoLinkSlideProps {
  title: BilingualText;
  description?: BilingualText;
  url: string;
  embed?: boolean;
  emoji?: string;
  language?: 'fr' | 'en';
}

function getYouTubeId(url: string): string | null {
  const match = url.match(
    /(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/|v\/))([a-zA-Z0-9_-]{11})/
  );
  return match ? match[1] : null;
}

export default function VideoLinkSlide({
  title,
  description,
  url,
  embed = false,
  emoji = '🎬',
  language = 'fr',
}: VideoLinkSlideProps) {
  const videoId = embed ? getYouTubeId(url) : null;

  return (
    <div className="h-full w-full bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex flex-col items-center justify-center p-8 md:p-12 relative overflow-hidden">
      {/* Subtle film grain overlay */}
      <div className="absolute inset-0 opacity-5 bg-[radial-gradient(circle_at_50%_50%,_white_1px,_transparent_1px)] bg-[length:20px_20px]" />

      {/* Title */}
      <motion.h1
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="font-cooper text-2xl md:text-3xl lg:text-4xl text-white text-center mb-4 drop-shadow-lg"
      >
        {getText(title, language)}
      </motion.h1>

      {/* Description */}
      {description && (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.25 }}
          className="font-neue-haas text-base md:text-lg text-gray-300 text-center mb-6 max-w-2xl leading-relaxed"
        >
          {getText(description, language)}
        </motion.p>
      )}

      {/* Embedded video or play button + URL */}
      {videoId ? (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.4, type: 'spring', stiffness: 200, damping: 20 }}
          className="w-full max-w-3xl aspect-video rounded-xl overflow-hidden shadow-2xl shadow-black/50 border border-white/10"
        >
          <iframe
            src={`https://www.youtube.com/embed/${videoId}`}
            title={typeof title === 'string' ? title : title.en || title.fr}
            className="w-full h-full"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </motion.div>
      ) : (
        <>
          {/* Play button circle */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', stiffness: 200, damping: 15, delay: 0.3 }}
            className="relative mb-6"
          >
            <div className="w-20 h-20 md:w-28 md:h-28 rounded-full bg-red-500 flex items-center justify-center shadow-2xl shadow-red-500/30">
              <svg className="w-8 h-8 md:w-12 md:h-12 text-white ml-1" fill="currentColor" viewBox="0 0 24 24">
                <path d="M8 5v14l11-7z" />
              </svg>
            </div>
          </motion.div>

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
        </>
      )}

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
