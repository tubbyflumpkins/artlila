"use client";

import React, { useState, useEffect, useRef } from 'react';
import SpinningWheel, { SpinningWheelHandle } from '@/components/SpinningWheel';
import EditButton from '@/components/EditButton';
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
  const leftRainRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const rightRainRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    fetch('/api/wheel-data')
      .then(res => res.json())
      .then(data => setWheelData(data))
      .catch(err => console.error('Échec du chargement des données des roues:', err));

    initializeAudio();

    // Invert logo for dark background
    document.body.classList.add('game-page');
    return () => document.body.classList.remove('game-page');
  }, []);

  // Emoji rain - gentle falling emoji behind the wheel
  const startEmojiRain = (emoji: string, side: 'left' | 'right') => {
    const ref = side === 'left' ? leftRainRef : rightRainRef;
    if (ref.current) clearInterval(ref.current);

    const scalar = 2.5;
    const shape = confetti.shapeFromText({ text: emoji, scalar });
    const baseX = side === 'left' ? 0.25 : 0.75;

    let count = 0;
    ref.current = setInterval(() => {
      confetti({
        particleCount: 3,
        angle: 90,
        spread: 35,
        origin: { x: baseX + (Math.random() - 0.5) * 0.2, y: -0.05 },
        shapes: [shape],
        scalar,
        flat: true,
        gravity: 1,
        startVelocity: 8,
        ticks: 200,
        drift: (Math.random() - 0.5) * 0.3,
      });
      count++;
      if (count >= 25) {
        clearInterval(ref.current!);
        ref.current = null;
      }
    }, 200);
  };

  const handleTopicComplete = (result: WheelSegment) => {
    setSelectedTopic(result);
    playCelebration();
    startEmojiRain(result.emoji, 'left');
  };

  const handleConstraintComplete = (result: WheelSegment) => {
    setSelectedConstraint(result);
    playCelebration();
    startEmojiRain(result.emoji, 'right');
  };

  const handleReset = () => {
    setSelectedTopic(null);
    setSelectedConstraint(null);
    setTimerStarted(false);
    setTimerPaused(false);
    setTimeRemaining(300);
    setTimerComplete(false);
    if (leftRainRef.current) { clearInterval(leftRainRef.current); leftRainRef.current = null; }
    if (rightRainRef.current) { clearInterval(rightRainRef.current); rightRainRef.current = null; }
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
      <main className="min-h-screen bg-[#1a1040] flex items-center justify-center">
        <div className="text-amber-100 text-2xl">Chargement des données...</div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#1a1040] flex flex-col items-center justify-center p-4 relative overflow-hidden">
      {/* Dynamic floating color blobs */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div
          className="absolute w-[600px] h-[600px] rounded-full"
          style={{
            background: 'radial-gradient(circle, #a855f7, transparent 60%)',
            filter: 'blur(80px)',
            opacity: 0.35,
            animation: 'floatBlob1 20s ease-in-out infinite',
          }}
        />
        <div
          className="absolute w-[500px] h-[500px] rounded-full"
          style={{
            background: 'radial-gradient(circle, #3b82f6, transparent 60%)',
            filter: 'blur(70px)',
            opacity: 0.3,
            animation: 'floatBlob2 25s ease-in-out infinite',
          }}
        />
        <div
          className="absolute w-[550px] h-[550px] rounded-full"
          style={{
            background: 'radial-gradient(circle, #ec4899, transparent 60%)',
            filter: 'blur(75px)',
            opacity: 0.3,
            animation: 'floatBlob3 22s ease-in-out infinite',
          }}
        />
        <div
          className="absolute w-[450px] h-[450px] rounded-full"
          style={{
            background: 'radial-gradient(circle, #f59e0b, transparent 60%)',
            filter: 'blur(65px)',
            opacity: 0.25,
            animation: 'floatBlob4 18s ease-in-out infinite',
          }}
        />
        <div
          className="absolute w-[400px] h-[400px] rounded-full"
          style={{
            background: 'radial-gradient(circle, #10b981, transparent 60%)',
            filter: 'blur(60px)',
            opacity: 0.25,
            animation: 'floatBlob5 24s ease-in-out infinite',
          }}
        />
      </div>
      <style jsx global>{`
        body.game-page header img {
          filter: invert(1) brightness(2);
        }
      `}</style>
      <style jsx>{`
        @keyframes floatBlob1 {
          0%, 100% { top: 10%; left: 15%; }
          25% { top: 60%; left: 70%; }
          50% { top: 30%; left: 80%; }
          75% { top: 70%; left: 20%; }
        }
        @keyframes floatBlob2 {
          0%, 100% { top: 70%; left: 60%; }
          25% { top: 20%; left: 10%; }
          50% { top: 50%; left: 40%; }
          75% { top: 10%; left: 75%; }
        }
        @keyframes floatBlob3 {
          0%, 100% { top: 40%; left: 80%; }
          25% { top: 70%; left: 30%; }
          50% { top: 10%; left: 50%; }
          75% { top: 55%; left: 65%; }
        }
        @keyframes floatBlob4 {
          0%, 100% { top: 80%; left: 20%; }
          25% { top: 30%; left: 50%; }
          50% { top: 60%; left: 70%; }
          75% { top: 15%; left: 35%; }
        }
        @keyframes floatBlob5 {
          0%, 100% { top: 20%; left: 45%; }
          25% { top: 65%; left: 80%; }
          50% { top: 75%; left: 15%; }
          75% { top: 35%; left: 60%; }
        }
      `}</style>

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
