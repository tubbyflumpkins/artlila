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

export default function Game() {
  const [selectedTopic, setSelectedTopic] = useState<WheelSegment | null>(null);
  const [selectedConstraint, setSelectedConstraint] = useState<WheelSegment | null>(null);
  const [isSpinningTopic, setIsSpinningTopic] = useState(false);
  const [isSpinningConstraint, setIsSpinningConstraint] = useState(false);
  const [wheelData, setWheelData] = useState<{ topics: WheelSegment[], constraints: WheelSegment[] }>({ topics: [], constraints: [] });
  const [timerStarted, setTimerStarted] = useState(false);
  const [timerPaused, setTimerPaused] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(360); // 6 minutes in seconds
  const [timerComplete, setTimerComplete] = useState(false);
  const [language, setLanguage] = useState<'fr' | 'en'>('fr');

  useEffect(() => {
    // Load wheel data from API
    fetch(`/api/wheel-data?language=${language}`)
      .then(res => res.json())
      .then(data => setWheelData(data))
      .catch(err => console.error('Échec du chargement des données des roues:', err));
      
    initializeSounds();
  }, [language]);


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
    setTimerStarted(false);
    setTimerPaused(false);
    setTimeRemaining(360);
    setTimerComplete(false);
  };

  const handleStartTimer = () => {
    setTimerStarted(true);
    setTimerPaused(false);
    setTimeRemaining(360);
    setTimerComplete(false);
  };

  const togglePause = () => {
    if (timerStarted && !timerComplete) {
      setTimerPaused(!timerPaused);
    }
  };

  const toggleLanguage = () => {
    setLanguage(prev => prev === 'fr' ? 'en' : 'fr');
    // Reset selections when changing language
    setSelectedTopic(null);
    setSelectedConstraint(null);
  };


  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't handle keyboard events if user is typing in an input
      if ((e.target as HTMLElement).tagName === 'INPUT' || 
          (e.target as HTMLElement).tagName === 'TEXTAREA') {
        return;
      }

      if (e.key === 'l' || e.key === 'L') {
        e.preventDefault();
        toggleLanguage();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Timer effect
  useEffect(() => {
    if (timerStarted && !timerPaused) {
      const interval = setInterval(() => {
        setTimeRemaining(prev => {
          if (prev <= 1) {
            setTimerComplete(true);
            setTimerStarted(false);
            setTimerPaused(false);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [timerStarted, timerPaused]);

  // Format time for display
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  // Calculate progress percentage
  const progressPercentage = ((360 - timeRemaining) / 360) * 100;

  if (wheelData.topics.length === 0 || wheelData.constraints.length === 0) {
    return (
      <main className="min-h-screen bg-gradient-to-br from-blue-200 via-blue-300 to-cyan-300 flex items-center justify-center">
        <div className="text-white text-2xl">
          {language === 'fr' ? 'Chargement des données...' : 'Loading data...'}
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-200 via-blue-300 to-cyan-300 flex flex-col items-center justify-center p-8 relative">
      {/* Language Toggle Button */}
      <motion.button
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        onClick={toggleLanguage}
        className="absolute top-6 right-6 px-4 py-2 bg-white/90 backdrop-blur-sm rounded-full shadow-lg hover:shadow-xl transition-all duration-200 font-semibold text-gray-800 flex items-center gap-2"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <span className={`${language === 'fr' ? 'font-bold' : ''}`}>FR</span>
        <span className="text-gray-400">|</span>
        <span className={`${language === 'en' ? 'font-bold' : ''}`}>EN</span>
      </motion.button>
      <AnimatePresence mode="wait">
        {!timerStarted && (
          <motion.div
            initial={{ y: -50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -50, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="text-center mb-12"
          >
            <h1 className="text-6xl font-bold text-white mb-4 drop-shadow-lg">
              {language === 'fr' ? 'Moment Dessin' : 'Sketch Time'}
            </h1>
          </motion.div>
        )}
      </AnimatePresence>


      <motion.div 
        animate={{ 
          y: timerStarted ? -30 : 0,
          scale: timerStarted ? 0.95 : 1
        }}
        transition={{ 
          duration: 0.3, 
          ease: "easeInOut",
          scale: { duration: 0.2 }
        }}
        className="flex flex-col lg:flex-row gap-12 items-center justify-center"
      >
        <motion.div
          initial={{ x: -100, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="flex flex-col items-center"
        >
          <h2 className="text-3xl font-bold text-white mb-6 drop-shadow-lg">
            {language === 'fr' ? 'Quoi dessiner?' : 'What to draw?'} 🤔
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
            {language === 'fr' ? 'Comment dessiner?' : 'How to draw?'} 🎯
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
      </motion.div>

      {/* Timer Display */}
      <AnimatePresence mode="wait">
        {timerStarted && selectedTopic && selectedConstraint && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ 
              duration: 0.3, 
              ease: "easeOut",
              delay: 0.1
            }}
            className="mt-2 mb-4 text-center"
          >
            <div 
              className="bg-white/90 backdrop-blur-md rounded-3xl p-8 shadow-2xl cursor-pointer"
              onClick={togglePause}
            >
              <h2 className="text-6xl font-bold text-gray-800 mb-6">
                {timerComplete ? 
                  (language === 'fr' ? "Temps écoulé! 🎉" : "Time's Up! 🎉") : 
                  (
                    <>
                      {formatTime(timeRemaining)}
                      {timerPaused && <span className="text-3xl ml-4">⏸️</span>}
                    </>
                  )
                }
              </h2>
              {/* Progress Bar */}
              <div 
                className="w-96 h-6 bg-gray-200 rounded-full overflow-hidden"
              >
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${progressPercentage}%` }}
                  transition={{ duration: 0.5, ease: "linear" }}
                  className={`h-full ${
                    timerComplete 
                      ? 'bg-gradient-to-r from-green-400 to-green-500' 
                      : timerPaused
                      ? 'bg-gradient-to-r from-yellow-400 to-orange-500'
                      : 'bg-gradient-to-r from-blue-400 to-purple-500'
                  }`}
                />
              </div>
              {timerComplete && (
                <motion.p
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-4 text-xl font-medium text-gray-700"
                >
                  {language === 'fr' ? 
                    'Excellent travail! Ton dessin est terminé!' : 
                    'Great job! Your sketch is complete!'}
                </motion.p>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {selectedTopic && selectedConstraint && (
        <motion.button
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.2, ease: "easeOut" }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={timerStarted ? handleReset : handleStartTimer}
          className="mt-12 bg-gradient-to-r from-yellow-400 to-orange-500 text-white font-bold text-xl px-8 py-4 rounded-full shadow-lg hover:shadow-xl transition-shadow"
        >
          {timerStarted ? 
            (language === 'fr' ? 'Réinitialiser' : 'Reset') : 
            (language === 'fr' ? 'Commencer' : 'Start')
          } 🎨
        </motion.button>
      )}

      <EditButton />
    </main>
  );
}