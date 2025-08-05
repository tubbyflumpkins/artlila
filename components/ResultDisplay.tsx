"use client";

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';

interface ResultDisplayProps {
  topic: { text: string; emoji: string } | null;
  constraint: { text: string; emoji: string } | null;
  onReset: () => void;
}

const ResultDisplay: React.FC<ResultDisplayProps> = ({ topic, constraint, onReset }) => {
  const showResult = topic && constraint;

  React.useEffect(() => {
    if (showResult) {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FECA57', '#FF9FF3']
      });
    }
  }, [showResult]);

  return (
    <AnimatePresence>
      {showResult && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8, y: 50 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.8, y: 50 }}
          className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-8"
          onClick={onReset}
        >
          <motion.div
            initial={{ rotate: -5 }}
            animate={{ rotate: 0 }}
            className="bg-white rounded-3xl p-12 shadow-2xl max-w-2xl w-full text-center"
            onClick={(e) => e.stopPropagation()}
          >
            <motion.h2
              initial={{ y: -20 }}
              animate={{ y: 0 }}
              className="text-4xl font-bold mb-8 text-gray-800"
            >
              Time to Draw!
            </motion.h2>
            
            <div className="space-y-6 mb-10">
              <motion.div
                initial={{ x: -50, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="bg-gradient-to-r from-purple-100 to-pink-100 rounded-2xl p-6"
              >
                <h3 className="text-2xl font-semibold text-gray-700 mb-2">Draw This:</h3>
                <div className="text-5xl mb-2">{topic.emoji}</div>
                <p className="text-3xl font-bold text-purple-600">{topic.text}</p>
              </motion.div>
              
              <motion.div
                initial={{ x: 50, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="bg-gradient-to-r from-blue-100 to-green-100 rounded-2xl p-6"
              >
                <h3 className="text-2xl font-semibold text-gray-700 mb-2">But Make It:</h3>
                <div className="text-5xl mb-2">{constraint.emoji}</div>
                <p className="text-3xl font-bold text-blue-600">{constraint.text}</p>
              </motion.div>
            </div>
            
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={onReset}
              className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white font-bold text-2xl px-12 py-6 rounded-full shadow-lg hover:shadow-xl transition-shadow"
            >
              Spin Again! 🎨
            </motion.button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ResultDisplay;