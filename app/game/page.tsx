"use client";

import React, { useState, useEffect, useRef } from 'react';
import SpinningWheel, { SpinningWheelHandle } from '@/components/SpinningWheel';
import EditButton from '@/components/EditButton';
import { wheelColors } from '@/lib/wheelData';
import { initializeAudio, playCelebration, playTimerEnd } from '@/lib/sounds';
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
  const [timeRemaining, setTimeRemaining] = useState(300); // 5 minutes
  const [timerComplete, setTimerComplete] = useState(false);

  const topicWheelRef = useRef<SpinningWheelHandle>(null);
  const constraintWheelRef = useRef<SpinningWheelHandle>(null);

  useEffect(() => {
    fetch('/api/wheel-data')
      .then(res => res.json())
      .then(data => setWheelData(data))
      .catch(err => console.error('Échec du chargement des données des roues:', err));

    initializeAudio();
  }, []);

  // Emoji confetti helper
  const fireEmojiConfetti = (emoji: string, originX: number) => {
    const scalar = 2;
    const shape = confetti.shapeFromText({ text: emoji, scalar });

    // First burst
    confetti({
      particleCount: 40,
      spread: 80,
      origin: { x: originX, y: 0.5 },
      shapes: [shape],
      scalar,
      ticks: 60,
      gravity: 0.8,
      startVelocity: 30,
    });

    // Staggered second burst
    setTimeout(() => {
      confetti({
        particleCount: 30,
        spread: 60,
        origin: { x: originX, y: 0.45 },
        shapes: [shape],
        scalar,
        ticks: 60,
        gravity: 0.8,
        startVelocity: 25,
      });
    }, 150);
  };

  const handleTopicComplete = (result: WheelSegment) => {
    setSelectedTopic(result);
    playCelebration();
    fireEmojiConfetti(result.emoji, 0.3);
  };

  const handleConstraintComplete = (result: WheelSegment) => {
    setSelectedConstraint(result);
    playCelebration();
    fireEmojiConfetti(result.emoji, 0.7);
  };

  const handleReset = () => {
    setSelectedTopic(null);
    setSelectedConstraint(null);
    setTimerStarted(false);
    setTimerPaused(false);
    setTimeRemaining(300);
    setTimerComplete(false);
  };

  const handleStartTimer = () => {
    setTimerStarted(true);
    setTimerPaused(false);
    setTimeRemaining(300);
    setTimerComplete(false);
  };

  const togglePause = () => {
    if (timerStarted && !timerComplete) {
      setTimerPaused(!timerPaused);
    }
  };

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.target as HTMLElement).tagName === 'INPUT' ||
          (e.target as HTMLElement).tagName === 'TEXTAREA') {
        return;
      }

      if (e.key === '1') {
        e.preventDefault();
        topicWheelRef.current?.spin();
      } else if (e.key === '2') {
        e.preventDefault();
        constraintWheelRef.current?.spin();
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
            playTimerEnd();
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

  const progressPercentage = ((300 - timeRemaining) / 300) * 100;

  // Progress bar color: green -> yellow -> red
  const getProgressColor = () => {
    if (timerComplete) return 'from-green-400 to-green-500';
    if (timerPaused) return 'from-yellow-400 to-orange-500';
    if (progressPercentage < 50) return 'from-green-400 to-emerald-500';
    if (progressPercentage < 80) return 'from-yellow-400 to-amber-500';
    return 'from-orange-500 to-red-500';
  };

  if (wheelData.topics.length === 0 || wheelData.constraints.length === 0) {
    return (
      <main className="min-h-screen bg-[radial-gradient(ellipse_at_center,#1a0a3e,#0a0a2e)] flex items-center justify-center">
        <div className="text-amber-100 text-2xl">Chargement des données...</div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[radial-gradient(ellipse_at_center,#1a0a3e,#0a0a2e)] flex flex-col items-center justify-center p-4 relative overflow-hidden">
      {/* Subtle ambient glow */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl" />
      </div>

      <AnimatePresence mode="wait">
        {!timerStarted && (
          <motion.div
            initial={{ y: -50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -50, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="text-center mb-6 relative z-10"
          >
            <h1
              className="text-6xl font-bold mb-2"
              style={{
                color: '#FFECD2',
                textShadow: '0 0 40px rgba(255, 215, 0, 0.3), 0 2px 8px rgba(0,0,0,0.5)'
              }}
            >
              Moment Dessin
            </h1>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div
        animate={{
          y: timerStarted ? -20 : 0,
          scale: timerStarted ? 0.95 : 1
        }}
        transition={{
          duration: 0.3,
          ease: "easeInOut",
          scale: { duration: 0.2 }
        }}
        className="flex flex-col lg:flex-row gap-8 items-center justify-center relative z-10"
      >
        {/* Topic Wheel */}
        <motion.div
          initial={{ x: -100, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="flex flex-col items-center"
        >
          <h2
            className="text-2xl font-bold mb-4"
            style={{ color: '#FFECD2', textShadow: '0 2px 4px rgba(0,0,0,0.5)' }}
          >
            Quoi dessiner? 🤔
          </h2>
          <SpinningWheel
            ref={topicWheelRef}
            segments={wheelData.topics}
            colors={wheelColors}
            onSpinComplete={handleTopicComplete}
            isSpinning={isSpinningTopic}
            setIsSpinning={setIsSpinningTopic}
          />

          <AnimatePresence mode="wait">
            {selectedTopic && (
              <motion.div
                key={selectedTopic.id}
                initial={{ opacity: 0, scale: 0.3, y: 30 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.3, y: -20 }}
                transition={{ type: "spring", stiffness: 500, damping: 25 }}
                className="mt-4 bg-gray-900/80 border-2 border-yellow-400/50 rounded-2xl px-6 py-3"
                style={{ boxShadow: '0 0 20px rgba(255, 215, 0, 0.15)' }}
              >
                <p className="text-2xl font-bold text-white">
                  <span className="text-3xl mr-2">{selectedTopic.emoji}</span>
                  {selectedTopic.text}
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Constraint Wheel */}
        <motion.div
          initial={{ x: 100, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="flex flex-col items-center"
        >
          <h2
            className="text-2xl font-bold mb-4"
            style={{ color: '#FFECD2', textShadow: '0 2px 4px rgba(0,0,0,0.5)' }}
          >
            Comment dessiner? 🎯
          </h2>
          <SpinningWheel
            ref={constraintWheelRef}
            segments={wheelData.constraints}
            colors={wheelColors.slice().reverse()}
            onSpinComplete={handleConstraintComplete}
            isSpinning={isSpinningConstraint}
            setIsSpinning={setIsSpinningConstraint}
          />

          <AnimatePresence mode="wait">
            {selectedConstraint && (
              <motion.div
                key={selectedConstraint.id}
                initial={{ opacity: 0, scale: 0.3, y: 30 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.3, y: -20 }}
                transition={{ type: "spring", stiffness: 500, damping: 25 }}
                className="mt-4 bg-gray-900/80 border-2 border-yellow-400/50 rounded-2xl px-6 py-3"
                style={{ boxShadow: '0 0 20px rgba(255, 215, 0, 0.15)' }}
              >
                <p className="text-2xl font-bold text-white">
                  <span className="text-3xl mr-2">{selectedConstraint.emoji}</span>
                  {selectedConstraint.text}
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
            transition={{ duration: 0.3, ease: "easeOut", delay: 0.1 }}
            className="mt-4 mb-2 text-center relative z-10"
          >
            <div
              className="bg-gray-900/80 border-2 border-yellow-400/30 rounded-3xl p-8 cursor-pointer"
              style={{ boxShadow: '0 0 30px rgba(255, 215, 0, 0.1)' }}
              onClick={togglePause}
            >
              <h2
                className="text-6xl font-bold mb-6"
                style={{
                  color: timerComplete ? '#4ADE80' : '#FFECD2',
                  textShadow: timerComplete
                    ? '0 0 20px rgba(74, 222, 128, 0.5)'
                    : '0 0 20px rgba(255, 215, 0, 0.3)'
                }}
              >
                {timerComplete ?
                  "Temps écoulé! 🎉" :
                  (
                    <>
                      {formatTime(timeRemaining)}
                      {timerPaused && <span className="text-3xl ml-4">⏸️</span>}
                    </>
                  )
                }
              </h2>
              {/* Progress Bar */}
              <div className="w-96 h-6 bg-gray-800 rounded-full overflow-hidden border border-yellow-400/30">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${progressPercentage}%` }}
                  transition={{ duration: 0.5, ease: "linear" }}
                  className={`h-full bg-gradient-to-r ${getProgressColor()}`}
                />
              </div>
              {timerComplete && (
                <motion.p
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-4 text-xl font-medium text-amber-100/80"
                >
                  Excellent travail! Ton dessin est terminé!
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
          className="mt-8 bg-gradient-to-r from-yellow-400 to-orange-500 text-gray-900 font-bold text-xl px-8 py-4 rounded-full shadow-lg hover:shadow-xl transition-shadow relative z-10"
        >
          {timerStarted ? 'Réinitialiser' : 'Commencer'} 🎨
        </motion.button>
      )}

      <EditButton />
    </main>
  );
}
