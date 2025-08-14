import React from 'react';
import { BulletSlide as BulletSlideType } from '@/lib/presentations/types';
import { motion } from 'framer-motion';

interface BulletSlideProps {
  slide: BulletSlideType;
}

export default function BulletSlide({ slide }: BulletSlideProps) {
  const { title, bullets, numbered = false } = slide.content;

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const item = {
    hidden: { opacity: 0, x: -20 },
    show: { opacity: 1, x: 0 }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="h-full flex flex-col justify-center p-12 md:p-16 lg:p-20"
    >
      <h2 className="font-cooper text-4xl md:text-5xl lg:text-6xl text-gray-800 mb-8 md:mb-12">
        {title}
      </h2>
      
      <motion.ul
        variants={container}
        initial="hidden"
        animate="show"
        className={`space-y-4 md:space-y-6 ${numbered ? 'list-decimal' : 'list-disc'} list-inside`}
      >
        {bullets.map((bullet, index) => (
          <motion.li
            key={index}
            variants={item}
            className="font-neue-haas text-xl md:text-2xl lg:text-3xl font-light text-gray-700"
          >
            <span className="ml-2">{bullet}</span>
          </motion.li>
        ))}
      </motion.ul>
    </motion.div>
  );
}