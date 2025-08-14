import React from 'react';
import { SplitSlide as SplitSlideType } from '@/lib/presentations/types';
import { getText } from '@/lib/presentations/bilingualHelpers';
import { motion } from 'framer-motion';

interface SplitSlideProps {
  slide: SplitSlideType;
  language?: 'fr' | 'en';
}

function renderContent(side: { type: string; content: any }, language: 'fr' | 'en') {
  switch (side.type) {
    case 'text':
      return (
        <div className="font-neue-haas text-lg md:text-xl lg:text-2xl font-light text-gray-700 leading-relaxed">
          {getText(side.content, language)}
        </div>
      );
    
    case 'bullets':
      return (
        <ul className="list-disc list-inside space-y-3">
          {side.content.map((bullet: any, index: number) => (
            <li key={index} className="font-neue-haas text-lg md:text-xl lg:text-2xl font-light text-gray-700">
              <span className="ml-2">{getText(bullet, language)}</span>
            </li>
          ))}
        </ul>
      );
    
    case 'image':
      return (
        <img
          src={side.content.url}
          alt={getText(side.content.alt || 'Slide image', language)}
          className="w-full h-full object-contain rounded-lg"
        />
      );
    
    default:
      return null;
  }
}

export default function SplitSlide({ slide, language = 'fr' }: SplitSlideProps) {
  const { title, left, right } = slide.content;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="h-full flex flex-col p-12 md:p-16 lg:p-20"
    >
      {title && (
        <h2 className="font-cooper text-5xl md:text-6xl text-gray-800 mb-12 text-center">
          {getText(title, language)}
        </h2>
      )}
      
      <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
          className="flex flex-col justify-center"
        >
          {renderContent(left, language)}
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="flex flex-col justify-center"
        >
          {renderContent(right, language)}
        </motion.div>
      </div>
    </motion.div>
  );
}