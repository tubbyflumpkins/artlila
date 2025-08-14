import React from 'react';
import { motion } from 'framer-motion';

interface ComicPanel {
  text?: string;
  emoji?: string;
  background: string;
  speechBubble?: boolean;
}

interface ComicSlideProps {
  panels: ComicPanel[];
  title?: string;
}

export default function ComicSlide({ panels, title }: ComicSlideProps) {
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  const panel = {
    hidden: { scale: 0.8, opacity: 0, rotate: -5 },
    show: { 
      scale: 1, 
      opacity: 1,
      rotate: 0,
      transition: {
        type: "spring",
        stiffness: 200,
        damping: 15
      }
    }
  };

  return (
    <div className="h-full w-full bg-yellow-50 p-8">
      {title && (
        <motion.h1 
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="text-5xl font-cooper text-center mb-6 text-red-600"
          style={{ textShadow: '3px 3px 0 #000' }}
        >
          {title}
        </motion.h1>
      )}
      
      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className={`grid ${panels.length <= 2 ? 'grid-cols-1 md:grid-cols-2' : 'grid-cols-2 md:grid-cols-3'} gap-4 h-5/6`}
      >
        {panels.map((item, index) => (
          <motion.div
            key={index}
            variants={panel}
            className={`${item.background} border-4 border-black rounded-lg p-6 relative overflow-hidden shadow-[5px_5px_0_0_rgba(0,0,0,1)]`}
            whileHover={{ scale: 1.05 }}
          >
            {/* Comic effect lines */}
            <div className="absolute inset-0 opacity-10">
              <div className="absolute top-0 left-0 w-full h-full"
                style={{
                  backgroundImage: `repeating-linear-gradient(45deg, transparent, transparent 10px, black 10px, black 11px)`
                }}
              />
            </div>
            
            <div className="relative z-10 h-full flex flex-col items-center justify-center">
              {item.emoji && (
                <motion.span 
                  className="text-7xl mb-4"
                  animate={{ 
                    rotate: [0, -10, 10, -10, 0],
                  }}
                  transition={{ 
                    duration: 2,
                    repeat: Infinity,
                    repeatDelay: 3
                  }}
                >
                  {item.emoji}
                </motion.span>
              )}
              
              {item.text && (
                <div className={item.speechBubble ? 
                  "bg-white border-3 border-black rounded-2xl p-4 relative shadow-lg" : 
                  "text-center"
                }>
                  <p className="font-neue-haas font-bold text-lg text-black">
                    {item.text}
                  </p>
                  {item.speechBubble && (
                    <div className="absolute -bottom-4 left-1/2 transform -translate-x-1/2 w-0 h-0 
                      border-l-[15px] border-l-transparent
                      border-t-[20px] border-t-white
                      border-r-[15px] border-r-transparent">
                      <div className="absolute -top-[22px] -left-[17px] w-0 h-0 
                        border-l-[17px] border-l-transparent
                        border-t-[22px] border-t-black
                        border-r-[17px] border-r-transparent">
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
}