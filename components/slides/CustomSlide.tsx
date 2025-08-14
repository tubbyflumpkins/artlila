import React from 'react';
import { CustomSlide as CustomSlideType } from '@/lib/presentations/types';
import { motion } from 'framer-motion';

interface CustomSlideProps {
  slide: CustomSlideType;
  language?: 'fr' | 'en';
}

export default function CustomSlide({ slide, language = 'fr' }: CustomSlideProps) {
  const Component = slide.content.component;
  const props = slide.content.props || {};

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="h-full"
    >
      <Component {...props} language={language} />
    </motion.div>
  );
}