'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { BilingualText } from '@/lib/presentations/types';
import { getText } from '@/lib/presentations/bilingualHelpers';

interface ThreeRespectSlideProps {
  respects: BilingualText[];
  language?: 'fr' | 'en';
}

export default function ThreeRespectSlide({ respects, language = 'fr' }: ThreeRespectSlideProps) {
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
    <div className="h-full w-full flex items-center justify-center p-12">
      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="flex flex-col justify-center items-center space-y-8 max-w-5xl w-full"
      >
        {respects.map((respect, index) => (
          <motion.div
            key={index}
            variants={item}
            className="text-left w-full"
          >
            <h2 className="font-cooper text-4xl md:text-5xl lg:text-6xl text-gray-800">
              {index + 1}. {getText(respect, language)}
            </h2>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
}