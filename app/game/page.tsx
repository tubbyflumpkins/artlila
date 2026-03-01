"use client";

import React, { useState, useEffect, useCallback } from 'react';
import PlinkoBoard from '@/components/PlinkoBoard';
import EditButton from '@/components/EditButton';
import { wheelColors } from '@/lib/wheelData';
import { playCelebrationJingle } from '@/lib/plinkoSounds';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';

interface WheelSegment {
  id: number;
  text: string;
  emoji: string;
}

type Phase = 'ready' | 'dropping-left' | 'left-done' | 'dropping-right' | 'both-done';

function selectRandomSubset(items: WheelSegment[], count: number): WheelSegment[] {
  const shuffled = [...items].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, Math.min(count, items.length));
}

export default function Game() {
  const [wheelData, setWheelData] = useState<{ topics: WheelSegment[], constraints: WheelSegment[] }>({ topics: [], constraints: [] });
  const [topicSubset, setTopicSubset] = useState<WheelSegment[]>([]);
  const [constraintSubset, setConstraintSubset] = useState<WheelSegment[]>([]);
  const [selectedTopic, setSelectedTopic] = useState<WheelSegment | null>(null);
  const [selectedConstraint, setSelectedConstraint] = useState<WheelSegment | null>(null);
  const [phase, setPhase] = useState<Phase>('ready');
  const [timerStarted, setTimerStarted] = useState(false);
  const [timerPaused, setTimerPaused] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(360);
  const [timerComplete, setTimerComplete] = useState(false);
  const [language, setLanguage] = useState<'fr' | 'en'>('fr');

  // Load wheel data
  useEffect(() => {
    fetch(`/api/wheel-data?language=${language}`)
      .then(res => res.json())
      .then(data => {
        setWheelData(data);
        setTopicSubset(selectRandomSubset(data.topics, 10));
        setConstraintSubset(selectRandomSubset(data.constraints, 10));
      })
      .catch(err => console.error('Failed to load wheel data:', err));
  }, [language]);

  // Celebration when both boards complete
  useEffect(() => {
    if (phase === 'both-done' && selectedTopic && selectedConstraint) {
      playCelebrationJingle();
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FECA57', '#FF9FF3'],
      });
    }
  }, [phase, selectedTopic, selectedConstraint]);

  const handleTopicResult = useCallback((item: WheelSegment) => {
    setSelectedTopic(item);
    setPhase('left-done');
  }, []);

  const handleConstraintResult = useCallback((item: WheelSegment) => {
    setSelectedConstraint(item);
    setPhase('both-done');
  }, []);

  const handleLeftBallDropped = useCallback(() => {
    // Ball has been created and added to the world
  }, []);

  const handleRightBallDropped = useCallback(() => {
    // Ball has been created and added to the world
  }, []);

  const handleDrop = useCallback(() => {
    if (phase === 'ready') {
      setPhase('dropping-left');
    } else if (phase === 'left-done') {
      setPhase('dropping-right');
    }
  }, [phase]);

  const handleReset = () => {
    setSelectedTopic(null);
    setSelectedConstraint(null);
    setPhase('ready');
    setTimerStarted(false);
    setTimerPaused(false);
    setTimeRemaining(360);
    setTimerComplete(false);
    setTopicSubset(selectRandomSubset(wheelData.topics, 10));
    setConstraintSubset(selectRandomSubset(wheelData.constraints, 10));
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

  const toggleLanguage = useCallback(() => {
    setLanguage(prev => prev === 'fr' ? 'en' : 'fr');
    setSelectedTopic(null);
    setSelectedConstraint(null);
    setPhase('ready');
  }, []);

  // Keyboard handler
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.target as HTMLElement).tagName === 'INPUT' ||
          (e.target as HTMLElement).tagName === 'TEXTAREA') {
        return;
      }

      if (e.key === ' ' || e.code === 'Space') {
        e.preventDefault();
        handleDrop();
      } else if (e.key === 'l' || e.key === 'L') {
        e.preventDefault();
        toggleLanguage();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleDrop, toggleLanguage]);

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

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const progressPercentage = ((360 - timeRemaining) / 360) * 100;

  if (topicSubset.length === 0 || constraintSubset.length === 0) {
    return (
      <main className="min-h-screen bg-gradient-to-br from-blue-200 via-blue-300 to-cyan-300 flex items-center justify-center">
        <div className="text-white text-2xl">
          {language === 'fr' ? 'Chargement des données...' : 'Loading data...'}
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-200 via-blue-300 to-cyan-300 flex flex-col items-center justify-center p-4 relative">
      {/* Language Toggle */}
      <motion.button
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        onClick={toggleLanguage}
        className="absolute top-6 right-6 px-4 py-2 bg-white/90 backdrop-blur-sm rounded-full shadow-lg hover:shadow-xl transition-all duration-200 font-semibold text-gray-800 flex items-center gap-2 z-10"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <span className={`${language === 'fr' ? 'font-bold' : ''}`}>FR</span>
        <span className="text-gray-400">|</span>
        <span className={`${language === 'en' ? 'font-bold' : ''}`}>EN</span>
      </motion.button>

      {/* Title */}
      <AnimatePresence mode="wait">
        {!timerStarted && (
          <motion.div
            initial={{ y: -50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -50, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="text-center mb-4"
          >
            <h1 className="text-5xl font-bold text-white drop-shadow-lg">
              {language === 'fr' ? 'Moment Dessin' : 'Sketch Time'}
            </h1>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Plinko Boards */}
      <motion.div
        animate={{
          y: timerStarted ? -20 : 0,
          scale: timerStarted ? 0.9 : 1,
        }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
        className="flex flex-col lg:flex-row gap-8 items-center justify-center"
      >
        <motion.div
          initial={{ x: -100, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="flex flex-col items-center"
        >
          <h2 className="text-2xl font-bold text-white mb-3 drop-shadow-lg">
            {language === 'fr' ? 'Quoi dessiner?' : 'What to draw?'} 🤔
          </h2>
          <PlinkoBoard
            items={topicSubset}
            colors={wheelColors}
            label={language === 'fr' ? 'SUJET' : 'TOPIC'}
            onResult={handleTopicResult}
            dropBall={phase === 'dropping-left' || phase === 'left-done' || phase === 'dropping-right' || phase === 'both-done'}
            onBallDropped={handleLeftBallDropped}
          />
        </motion.div>

        <motion.div
          initial={{ x: 100, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="flex flex-col items-center"
        >
          <h2 className="text-2xl font-bold text-white mb-3 drop-shadow-lg">
            {language === 'fr' ? 'Comment dessiner?' : 'How to draw?'} 🎯
          </h2>
          <PlinkoBoard
            items={constraintSubset}
            colors={wheelColors.slice().reverse()}
            label={language === 'fr' ? 'CONTRAINTE' : 'CONSTRAINT'}
            onResult={handleConstraintResult}
            dropBall={phase === 'dropping-right' || phase === 'both-done'}
            onBallDropped={handleRightBallDropped}
          />
        </motion.div>
      </motion.div>

      {/* Timer Display */}
      <AnimatePresence mode="wait">
        {timerStarted && selectedTopic && selectedConstraint && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3, ease: "easeOut", delay: 0.1 }}
            className="mt-4 mb-2 text-center"
          >
            <div
              className="bg-white/90 backdrop-blur-md rounded-3xl p-6 shadow-2xl cursor-pointer"
              onClick={togglePause}
            >
              <h2 className="text-5xl font-bold text-gray-800 mb-4">
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
              <div className="w-80 h-5 bg-gray-200 rounded-full overflow-hidden">
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
                  className="mt-3 text-lg font-medium text-gray-700"
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

      {/* Start / Reset Button */}
      {phase === 'both-done' && selectedTopic && selectedConstraint && (
        <motion.button
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.2, ease: "easeOut" }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={timerStarted ? handleReset : handleStartTimer}
          className="mt-6 bg-gradient-to-r from-yellow-400 to-orange-500 text-white font-bold text-xl px-8 py-4 rounded-full shadow-lg hover:shadow-xl transition-shadow"
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
