import React from 'react';
import { ImageSlide as ImageSlideType } from '@/lib/presentations/types';
import { motion } from 'framer-motion';
import { getText } from '@/lib/presentations/bilingualHelpers';

interface ImageSlideProps {
  slide: ImageSlideType;
  language?: 'fr' | 'en';
}

export default function ImageSlide({ slide, language = 'fr' }: ImageSlideProps) {
  const { title, imageUrl, caption, size = 'large' } = slide.content;

  const sizeClasses = {
    full: 'max-w-full max-h-full',
    large: 'max-w-2xl max-h-[35vh]',
    medium: 'max-w-xl max-h-[30vh]',
    small: 'max-w-sm max-h-[25vh]'
  }[size];

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.3 }}
      className="h-full flex flex-col items-center justify-center p-12"
    >
      {title && (
        <h2 className="font-cooper text-2xl md:text-3xl lg:text-3xl text-gray-800 mb-4">
          {getText(title, language)}
        </h2>
      )}
      
      <div className={`relative ${sizeClasses} flex items-center justify-center`}>
        <img
          src={imageUrl}
          alt={getText(caption || title || 'Slide image', language)}
          className="w-full h-full object-contain rounded-lg shadow-lg"
        />
      </div>
      
      {caption && (
        <p className="font-neue-haas text-sm md:text-base text-gray-600 mt-3 text-center">
          {getText(caption, language)}
        </p>
      )}
    </motion.div>
  );
}