import React from 'react';
import { TitleSlide as TitleSlideType } from '@/lib/presentations/types';
import { getText } from '@/lib/presentations/bilingualHelpers';
import { motion } from 'framer-motion';

interface TitleSlideProps {
  slide: TitleSlideType;
  language?: 'fr' | 'en';
}

export default function TitleSlide({ slide, language = 'fr' }: TitleSlideProps) {
  const { title, subtitle, date } = slide.content;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.3 }}
      className="h-full flex flex-col items-center justify-center text-center p-12"
    >
      <h1 className="font-cooper text-7xl md:text-8xl lg:text-9xl text-gray-800 mb-6">
        {getText(title, language)}
      </h1>
      
      {subtitle && (
        <h2 className="font-neue-haas text-3xl md:text-4xl font-light text-gray-600 mb-8">
          {getText(subtitle, language)}
        </h2>
      )}
      
      {date && (
        <p className="font-neue-haas text-xl text-gray-500">
          {getText(date, language)}
        </p>
      )}
    </motion.div>
  );
}