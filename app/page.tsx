"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';

export default function Home() {
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <main className="min-h-screen bg-gray-50 flex flex-col p-8 relative">
      {/* Clock in top right */}
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5 }}
        className="fixed top-6 right-6 text-right"
      >
        <p className="text-xl font-neue-haas font-bold text-gray-800 mb-1">
          {currentTime.toLocaleDateString('fr-FR', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
          })}
        </p>
        <p className="text-4xl font-neue-haas font-bold text-gray-800 tabular-nums">
          {currentTime.toLocaleTimeString('fr-FR', {
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            hour12: false
          })}
        </p>
      </motion.div>

      <div className="max-w-4xl w-full mx-auto">
        {/* Title */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mt-24 mb-16"
        >
          <h1 className="text-7xl lg:text-8xl font-cooper text-gray-800">
            Arts plastiques avec Dylan
          </h1>
        </motion.div>

        <div className="flex flex-col items-center justify-center flex-1">
          {/* Navigation Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="flex flex-col sm:flex-row gap-6 justify-center"
        >
          <Link href="/game">
            <button className="group relative px-12 py-6 bg-white border-2 border-gray-300 rounded-lg hover:border-gray-400 transition-all duration-300 hover:shadow-lg">
              <span className="text-2xl font-neue-haas font-bold text-gray-700 group-hover:text-gray-900">
                Moment Dessin
              </span>
              <span className="block text-sm font-neue-haas font-normal text-gray-500 mt-1">
                Jeu de dessin interactif
              </span>
            </button>
          </Link>

          <Link href="/lessons">
            <button className="group relative px-12 py-6 bg-white border-2 border-gray-300 rounded-lg hover:border-gray-400 transition-all duration-300 hover:shadow-lg">
              <span className="text-2xl font-neue-haas font-bold text-gray-700 group-hover:text-gray-900">
                Leçons
              </span>
              <span className="block text-sm font-neue-haas font-normal text-gray-500 mt-1">
                Organisé par semaine
              </span>
            </button>
          </Link>
        </motion.div>
        </div>
      </div>
    </main>
  );
}