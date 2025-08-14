import React from 'react';
import { motion } from 'framer-motion';
import { BilingualText } from '@/lib/presentations/types';
import { getText } from '@/lib/presentations/bilingualHelpers';

interface ColumnItem {
  emoji: string;
  text: BilingualText;
}

interface ThreeColumnSlideProps {
  title?: BilingualText;
  columns: [ColumnItem, ColumnItem, ColumnItem];
  language?: 'fr' | 'en';
}

export default function ThreeColumnSlide({ title, columns, language = 'fr' }: ThreeColumnSlideProps) {
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <div className="h-full w-full flex flex-col justify-center p-12">
      {title && (
        <motion.h1 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="font-cooper text-4xl md:text-5xl lg:text-6xl text-center text-gray-800 mb-12"
        >
          {getText(title, language)}
        </motion.h1>
      )}
      
      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="grid grid-cols-3 gap-8 md:gap-12 lg:gap-16"
      >
        {columns.map((column, index) => (
          <motion.div
            key={index}
            variants={item}
            className="flex flex-col items-center text-center"
          >
            <span className="text-5xl md:text-6xl lg:text-7xl mb-4">
              {column.emoji}
            </span>
            <p className="font-neue-haas text-lg md:text-xl lg:text-2xl text-gray-700">
              {getText(column.text, language)}
            </p>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
}