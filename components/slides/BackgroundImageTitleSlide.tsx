import React from 'react';
import { motion } from 'framer-motion';
import { BilingualText } from '@/lib/presentations/types';
import { getText } from '@/lib/presentations/bilingualHelpers';

interface BackgroundImageTitleSlideProps {
  title: BilingualText;
  subtitle?: BilingualText;
  date?: BilingualText;
  backgroundImage: string;
  language?: 'fr' | 'en';
}

export default function BackgroundImageTitleSlide({ 
  title, 
  subtitle, 
  date, 
  backgroundImage,
  language = 'fr'
}: BackgroundImageTitleSlideProps) {
  return (
    <div className="relative h-full w-full">
      {/* Background Image */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ 
          backgroundImage: `url('${backgroundImage}')`,
        }}
      />
      
      {/* Content */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        transition={{ duration: 0.3 }}
        className="relative h-full flex flex-col items-center justify-center text-center p-12"
      >
        <h1 className="font-cooper text-6xl md:text-7xl lg:text-8xl text-white mb-6 drop-shadow-2xl">
          {getText(title, language)}
        </h1>
        
        {subtitle && (
          <h2 className="font-neue-haas text-2xl md:text-3xl lg:text-4xl font-light text-white mb-8 drop-shadow-xl">
            {getText(subtitle, language)}
          </h2>
        )}
        
        {date && (
          <p className="font-neue-haas text-lg md:text-xl text-white drop-shadow-lg">
            {getText(date, language)}
          </p>
        )}
      </motion.div>
    </div>
  );
}