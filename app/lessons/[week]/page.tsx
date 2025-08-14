"use client";

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { useParams } from 'next/navigation';
import PresentationList from '@/components/PresentationList';
import { week1Presentations } from '@/lib/presentations/week1';
import { Presentation } from '@/lib/presentations/types';

export default function WeekLesson() {
  const params = useParams();
  const weekNumber = params.week?.toString() || '1';

  // Get presentations for the current week
  const getPresentationsForWeek = (week: string): Presentation[] => {
    switch (week) {
      case '1':
        return week1Presentations;
      // Add more weeks as they are created
      // case '2':
      //   return week2Presentations;
      default:
        return [];
    }
  };

  const presentations = getPresentationsForWeek(weekNumber);

  return (
    <main className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <Link href="/lessons" className="inline-block mb-6">
            <button className="font-neue-haas font-medium text-gray-600 hover:text-gray-800 transition-colors">
              ← Retour aux leçons
            </button>
          </Link>
          <h1 className="text-5xl font-neue-haas font-bold text-gray-800 mb-2">
            Semaine {weekNumber}
          </h1>
          <p className="font-neue-haas text-lg text-gray-600">
            Présentations et matériel de cours
          </p>
        </motion.div>

        {/* Presentations List */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <PresentationList presentations={presentations} weekNumber={weekNumber} />
        </motion.div>

        {/* Navigation */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="flex justify-between mt-12"
        >
          {parseInt(weekNumber) > 1 && (
            <Link href={`/lessons/${parseInt(weekNumber) - 1}`}>
              <button className="font-neue-haas font-medium text-gray-600 hover:text-gray-800 transition-colors">
                ← Semaine précédente
              </button>
            </Link>
          )}
          <div className="flex-1" />
          {parseInt(weekNumber) < 36 && (
            <Link href={`/lessons/${parseInt(weekNumber) + 1}`}>
              <button className="font-neue-haas font-medium text-gray-600 hover:text-gray-800 transition-colors">
                Semaine suivante →
              </button>
            </Link>
          )}
        </motion.div>
      </div>
    </main>
  );
}