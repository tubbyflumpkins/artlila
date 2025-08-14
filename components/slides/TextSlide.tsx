import React from 'react';
import { TextSlide as TextSlideType } from '@/lib/presentations/types';
import { getText } from '@/lib/presentations/bilingualHelpers';
import { motion } from 'framer-motion';

interface TextSlideProps {
  slide: TextSlideType;
  language?: 'fr' | 'en';
}

export default function TextSlide({ slide, language = 'fr' }: TextSlideProps) {
  const { heading, text, alignment = 'left' } = slide.content;

  const alignmentClass = {
    left: 'text-left',
    center: 'text-center',
    right: 'text-right'
  }[alignment];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
      className={`h-full flex flex-col justify-center p-12 md:p-16 lg:p-20 ${alignmentClass}`}
    >
      {heading && (
        <h2 className="font-cooper text-4xl md:text-5xl lg:text-6xl text-gray-800 mb-8">
          {getText(heading, language)}
        </h2>
      )}
      
      <div className="font-neue-haas text-xl md:text-2xl lg:text-3xl font-light text-gray-700 leading-relaxed whitespace-pre-wrap">
        {getText(text, language)}
      </div>
    </motion.div>
  );
}