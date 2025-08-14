"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';

const TOTAL_WEEKS = 36; // Academic year

export default function Lessons() {
  const [selectedWeek, setSelectedWeek] = useState<number | null>(null);

  const weeks = Array.from({ length: TOTAL_WEEKS }, (_, i) => i + 1);

  return (
    <main className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12"
        >
          <Link href="/" className="inline-block mb-6">
            <button className="font-neue-haas font-medium text-gray-600 hover:text-gray-800 transition-colors">
              ← Retour
            </button>
          </Link>
          <h1 className="text-5xl font-neue-haas font-bold text-gray-800">Leçons</h1>
          <p className="text-lg font-neue-haas font-normal text-gray-600 mt-2">Organisé par semaine</p>
        </motion.div>

        {/* Week Grid */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4"
        >
          {weeks.map((week) => (
            <Link key={week} href={`/lessons/${week}`}>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`
                  relative aspect-square bg-white border-2 border-gray-200 
                  rounded-lg hover:border-gray-400 hover:shadow-lg 
                  transition-all duration-200 flex flex-col items-center 
                  justify-center p-4
                `}
              >
                <span className="text-3xl font-neue-haas font-bold text-gray-700">
                  {week}
                </span>
                <span className="text-xs font-neue-haas font-medium text-gray-500 mt-1">
                  Semaine
                </span>
              </motion.button>
            </Link>
          ))}
        </motion.div>

        {/* Current Week Indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="mt-12 text-center text-gray-600"
        >
          <p className="text-sm font-neue-haas font-normal">
            Cliquez sur une semaine pour voir les leçons
          </p>
        </motion.div>
      </div>
    </main>
  );
}