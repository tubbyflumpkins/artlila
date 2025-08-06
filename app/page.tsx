"use client";

import React, { useState, useEffect } from 'react';
import SpinningWheel from '@/components/SpinningWheel';
import EditButton from '@/components/EditButton';
import { wheelColors } from '@/lib/wheelData';
import { initializeSounds, playCelebration } from '@/lib/sounds';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';

interface WheelSegment {
  id: number;
  text: string;
  emoji: string;
}

interface HomeProps {
  topics: WheelSegment[];
  constraints: WheelSegment[];
}

export default function Home({ topics, constraints }: HomeProps) {
  const [selectedTopic, setSelectedTopic] = useState<WheelSegment | null>(null);
  const [selectedConstraint, setSelectedConstraint] = useState<WheelSegment | null>(null);
  const [isSpinningTopic, setIsSpinningTopic] = useState(false);
  const [isSpinningConstraint, setIsSpinningConstraint] = useState(false);
  const [wheelData, setWheelData] = useState<{ topics: WheelSegment[], constraints: WheelSegment[] }>({ topics: [], constraints: [] });
  const [currentDateTime, setCurrentDateTime] = useState(new Date());

  useEffect(() => {
    // Load wheel data from API
    fetch('/api/wheel-data')
      .then(res => res.json())
      .then(data => setWheelData(data))
      .catch(err => console.error('\u00c9chec du chargement des donn\u00e9es des roues:', err));
      
    initializeSounds();
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentDateTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (selectedTopic && selectedConstraint && !isSpinningTopic && !isSpinningConstraint) {
      playCelebration();
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FECA57', '#FF9FF3']
      });
    }
  }, [selectedTopic, selectedConstraint, isSpinningTopic, isSpinningConstraint]);

  const handleTopicComplete = (result: WheelSegment) => {
    setSelectedTopic(result);
  };

  const handleConstraintComplete = (result: WheelSegment) => {
    setSelectedConstraint(result);
  };

  const handleReset = () => {
    setSelectedTopic(null);
    setSelectedConstraint(null);
  };

  if (wheelData.topics.length === 0 || wheelData.constraints.length === 0) {
    return (
      <main className="min-h-screen bg-gradient-to-br from-purple-400 via-pink-300 to-blue-400 flex items-center justify-center">
        <div className="text-white text-2xl">Chargement des données...</div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-purple-400 via-pink-300 to-blue-400 flex flex-col items-center justify-center p-8">
      <motion.div
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="text-center mb-12"
      >
        <h1 className="text-6xl font-bold text-white mb-4 drop-shadow-lg">
          Moment Dessin
        </h1>
        <p className="text-2xl text-white/90 drop-shadow">
          On est <span className="font-bold">{currentDateTime.toLocaleDateString('fr-FR', { 
            weekday: 'long', 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
          })}</span>, il est <span className="font-bold">{currentDateTime.toLocaleTimeString('fr-FR', { 
            hour: 'numeric', 
            minute: '2-digit', 
            second: '2-digit',
            hour12: true 
          })}</span>.
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
            Quoi dessiner? 🤔
          </h2>
          <div className="bg-white/20 backdrop-blur-md rounded-3xl p-8 shadow-2xl">
            <SpinningWheel
              segments={wheelData.topics}
              colors={wheelColors}
              onSpinComplete={handleTopicComplete}
              isSpinning={isSpinningTopic}
              setIsSpinning={setIsSpinningTopic}
            />
          </div>
          
          <AnimatePresence mode="wait">
            {selectedTopic && (
              <motion.div
                key={selectedTopic.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="mt-6 bg-white/90 rounded-2xl p-4 shadow-lg"
              >
                <p className="text-2xl font-bold text-gray-800">
                  {selectedTopic.emoji} {selectedTopic.text}
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        <motion.div
          initial={{ x: 100, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="flex flex-col items-center"
        >
          <h2 className="text-3xl font-bold text-white mb-6 drop-shadow-lg">
            Comment dessiner? 🎯
          </h2>
          <div className="bg-white/20 backdrop-blur-md rounded-3xl p-8 shadow-2xl">
            <SpinningWheel
              segments={wheelData.constraints}
              colors={wheelColors.slice().reverse()}
              onSpinComplete={handleConstraintComplete}
              isSpinning={isSpinningConstraint}
              setIsSpinning={setIsSpinningConstraint}
            />
          </div>
          
          <AnimatePresence mode="wait">
            {selectedConstraint && (
              <motion.div
                key={selectedConstraint.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="mt-6 bg-white/90 rounded-2xl p-4 shadow-lg"
              >
                <p className="text-2xl font-bold text-gray-800">
                  {selectedConstraint.emoji} {selectedConstraint.text}
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>

      {selectedTopic && selectedConstraint && (
        <motion.button
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleReset}
          className="mt-12 bg-gradient-to-r from-yellow-400 to-orange-500 text-white font-bold text-xl px-8 py-4 rounded-full shadow-lg hover:shadow-xl transition-shadow"
        >
          Tourner encore! 🎨
        </motion.button>
      )}

      <EditButton />
    </main>
  );
}