import React from 'react';
import { motion } from 'framer-motion';
import { BilingualText } from '@/lib/presentations/types';
import { getText } from '@/lib/presentations/bilingualHelpers';

interface CreativeTextSlideProps {
  items: Array<{
    text: BilingualText;
    emoji?: string;
    color?: string;
    size?: 'small' | 'medium' | 'large' | 'huge';
  }>;
  layout?: 'scattered' | 'circular' | 'wave' | 'grid';
  background?: string;
  language?: 'fr' | 'en';
}

export default function CreativeTextSlide({ items, layout = 'scattered', background = 'bg-gradient-to-br from-purple-100 via-pink-50 to-blue-100', language = 'fr' }: CreativeTextSlideProps) {
  const getPositionStyles = (index: number, total: number) => {
    switch (layout) {
      case 'circular':
        const angle = (index * 360) / total;
        const radius = 35;
        const x = radius * Math.cos((angle * Math.PI) / 180);
        const y = radius * Math.sin((angle * Math.PI) / 180);
        return {
          left: `${50 + x}%`,
          top: `${50 + y}%`,
          transform: 'translate(-50%, -50%)',
        };
      
      case 'wave':
        return {
          left: `${15 + (index * 70) / total}%`,
          top: `${50 + Math.sin(index * 0.8) * 20}%`,
          transform: 'translate(-50%, -50%)',
        };
      
      case 'grid':
        const cols = 3;
        const row = Math.floor(index / cols);
        const col = index % cols;
        return {
          left: `${25 + col * 25}%`,
          top: `${30 + row * 30}%`,
          transform: 'translate(-50%, -50%)',
        };
      
      case 'scattered':
      default:
        const positions = [
          { left: '20%', top: '25%' },
          { left: '70%', top: '20%' },
          { left: '15%', top: '60%' },
          { left: '75%', top: '55%' },
          { left: '45%', top: '40%' },
          { left: '35%', top: '75%' },
          { left: '60%', top: '80%' },
          { left: '50%', top: '15%' },
        ];
        return positions[index % positions.length];
    }
  };

  const getSizeClass = (size?: string) => {
    switch (size) {
      case 'huge': return 'text-5xl md:text-6xl lg:text-7xl';
      case 'large': return 'text-3xl md:text-4xl lg:text-5xl';
      case 'medium': return 'text-xl md:text-2xl lg:text-3xl';
      case 'small': 
      default: return 'text-lg md:text-xl lg:text-2xl';
    }
  };

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.1
      }
    }
  };

  const item = {
    hidden: { scale: 0, rotate: -180 },
    show: { 
      scale: 1, 
      rotate: 0,
      transition: {
        type: "spring" as const,
        stiffness: 260,
        damping: 20
      }
    }
  };

  return (
    <div className={`h-full w-full relative ${background} overflow-hidden`}>
      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="relative h-full w-full"
      >
        {items.map((textItem, index) => (
          <motion.div
            key={index}
            variants={item}
            className={`absolute p-4 ${textItem.color || ''}`}
            style={getPositionStyles(index, items.length)}
            whileHover={{ scale: 1.2, rotate: 5 }}
          >
            <div className={`${getSizeClass(textItem.size)} font-cooper text-center`}>
              {textItem.emoji && (
                <span className="block text-6xl mb-2">{textItem.emoji}</span>
              )}
              <span className={textItem.color ? '' : 'text-gray-800'}>
                {getText(textItem.text, language)}
              </span>
            </div>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
}