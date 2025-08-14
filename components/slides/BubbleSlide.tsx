import React from 'react';
import { motion } from 'framer-motion';
import { BilingualText } from '@/lib/presentations/types';
import { getText } from '@/lib/presentations/bilingualHelpers';

interface BubbleSlideProps {
  title?: BilingualText;
  bubbles: Array<{
    text: BilingualText;
    emoji?: string;
    color: string;
    colorHex?: string;
    size?: 'small' | 'medium' | 'large';
  }>;
  language?: 'fr' | 'en';
}

export default function BubbleSlide({ title, bubbles, language = 'fr' }: BubbleSlideProps) {
  const getSizeClass = (size?: string) => {
    switch (size) {
      case 'large': return 'w-40 h-40 md:w-48 md:h-48 lg:w-56 lg:h-56';
      case 'medium': return 'w-32 h-32 md:w-36 md:h-36 lg:w-44 lg:h-44';
      case 'small': 
      default: return 'w-24 h-24 md:w-28 md:h-28 lg:w-32 lg:h-32';
    }
  };

  const getColorStyle = (color: string, colorHex?: string) => {
    if (colorHex) return { backgroundColor: colorHex };
    
    // Map Tailwind classes to hex colors
    const colorMap: Record<string, string> = {
      'bg-purple-500': '#a855f7',
      'bg-yellow-500': '#eab308',
      'bg-pink-500': '#ec4899',
      'bg-green-500': '#22c55e',
      'bg-orange-500': '#f97316',
      'bg-blue-500': '#3b82f6',
      'bg-red-500': '#ef4444',
      'bg-indigo-500': '#6366f1',
      'bg-cyan-500': '#06b6d4',
      'bg-emerald-500': '#10b981'
    };
    
    if (colorMap[color]) {
      return { backgroundColor: colorMap[color] };
    }
    
    // Handle gradient classes
    if (color.includes('gradient')) {
      return {}; // Let the className handle gradients
    }
    
    return {};
  };

  const getTextSize = (size?: string) => {
    switch (size) {
      case 'large': return 'text-lg md:text-xl lg:text-2xl';
      case 'medium': return 'text-base md:text-lg lg:text-xl';
      case 'small': 
      default: return 'text-sm md:text-base lg:text-lg';
    }
  };

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15
      }
    }
  };

  const bubble = {
    hidden: { scale: 0, y: 100 },
    show: { 
      scale: 1, 
      y: 0,
      transition: {
        type: "spring",
        bounce: 0.4,
        duration: 0.8
      }
    }
  };

  return (
    <div className="h-full w-full bg-gradient-to-br from-gray-50 to-gray-100 p-6 overflow-hidden flex flex-col justify-center">
      {title && (
        <motion.h1 
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="text-3xl md:text-4xl lg:text-5xl font-cooper text-center text-gray-800 mb-6"
        >
          {getText(title, language)}
        </motion.h1>
      )}
      
      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="flex flex-wrap justify-center items-center gap-4"
      >
        {bubbles.map((item, index) => (
          <motion.div
            key={index}
            variants={bubble}
            whileHover={{ 
              scale: 1.1, 
              rotate: [0, -5, 5, -5, 0],
              transition: { duration: 0.5 }
            }}
            className={`${getSizeClass(item.size)} ${item.color.includes('gradient') ? item.color : ''} rounded-full flex flex-col items-center justify-center p-4 shadow-xl cursor-pointer`}
            style={getColorStyle(item.color, item.colorHex)}
          >
            {item.emoji && (
              <span className="text-2xl md:text-3xl lg:text-4xl mb-2">{item.emoji}</span>
            )}
            <span className={`${getTextSize(item.size)} font-neue-haas font-medium text-white text-center`}>
              {getText(item.text, language)}
            </span>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
}