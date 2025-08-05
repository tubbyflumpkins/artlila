"use client";

import React, { useState, useEffect } from 'react';
import SpinningWheel from '@/components/SpinningWheel';
import ResultDisplay from '@/components/ResultDisplay';
import { topics, constraints, wheelColors } from '@/lib/wheelData';
import { initializeSounds, playCelebration } from '@/lib/sounds';
import { motion } from 'framer-motion';

export default function Home() {
  const [selectedTopic, setSelectedTopic] = useState<typeof topics[0] | null>(null);
  const [selectedConstraint, setSelectedConstraint] = useState<typeof constraints[0] | null>(null);
  const [isSpinningTopic, setIsSpinningTopic] = useState(false);
  const [isSpinningConstraint, setIsSpinningConstraint] = useState(false);
  const [showResults, setShowResults] = useState(false);

  useEffect(() => {
    initializeSounds();
  }, []);

  useEffect(() => {
    if (selectedTopic && selectedConstraint && !isSpinningTopic && !isSpinningConstraint) {
      playCelebration();
      setTimeout(() => setShowResults(true), 500);
    }
  }, [selectedTopic, selectedConstraint, isSpinningTopic, isSpinningConstraint]);

  const handleTopicComplete = (result: typeof topics[0]) => {
    setSelectedTopic(result);
  };

  const handleConstraintComplete = (result: typeof constraints[0]) => {
    setSelectedConstraint(result);
  };

  const handleReset = () => {
    setSelectedTopic(null);
    setSelectedConstraint(null);
    setShowResults(false);
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-purple-400 via-pink-300 to-blue-400 flex flex-col items-center justify-center p-8">
      <motion.div
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="text-center mb-12"
      >
        <h1 className="text-6xl font-bold text-white mb-4 drop-shadow-lg">
          ArtLila Sketch Time! 🎨
        </h1>
        <p className="text-2xl text-white/90 drop-shadow">
          Spin the wheels to get your drawing challenge!
        </p>
      </motion.div>

      <div className="flex flex-col lg:flex-row gap-12 items-center justify-center">
        <motion.div
          initial={{ x: -100, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="flex flex-col items-center"
        >
          <h2 className="text-3xl font-bold text-white mb-6 drop-shadow-lg">
            What to Draw? 🤔
          </h2>
          <div className="bg-white/20 backdrop-blur-md rounded-3xl p-8 shadow-2xl">
            <SpinningWheel
              segments={topics}
              colors={wheelColors}
              onSpinComplete={handleTopicComplete}
              isSpinning={isSpinningTopic}
              setIsSpinning={setIsSpinningTopic}
            />
          </div>
        </motion.div>

        <motion.div
          initial={{ x: 100, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="flex flex-col items-center"
        >
          <h2 className="text-3xl font-bold text-white mb-6 drop-shadow-lg">
            How to Draw It? 🎯
          </h2>
          <div className="bg-white/20 backdrop-blur-md rounded-3xl p-8 shadow-2xl">
            <SpinningWheel
              segments={constraints}
              colors={wheelColors.reverse()}
              onSpinComplete={handleConstraintComplete}
              isSpinning={isSpinningConstraint}
              setIsSpinning={setIsSpinningConstraint}
            />
          </div>
        </motion.div>
      </div>

      <ResultDisplay
        topic={selectedTopic}
        constraint={selectedConstraint}
        onReset={handleReset}
      />

      <motion.div
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.6 }}
        className="mt-12 text-center"
      >
        <p className="text-white/80 text-lg">
          Click each wheel to spin! Get ready for a fun drawing challenge! 
        </p>
      </motion.div>
    </main>
  );
}