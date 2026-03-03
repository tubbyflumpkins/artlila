"use client";

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Presentation, getWeekDate } from '@/lib/presentations/types';
import { week1Presentations } from '@/lib/presentations/week1';
import { week27Presentations } from '@/lib/presentations/week27';

// Aggregate all presentations from all weeks
const allPresentations: Presentation[] = [
  ...week1Presentations,
  ...week27Presentations,
];

// Sort newest first (highest week number first)
const sortedPresentations = [...allPresentations].sort((a, b) => b.week - a.week);

function formatWeekDate(week: number): string {
  const date = getWeekDate(week);
  return date.toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });
}

export default function Lessons() {
  return (
    <main className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12"
        >
          <Link href="/" className="inline-block mb-6">
            <button className="font-neue-haas font-medium text-gray-600 hover:text-gray-800 transition-colors">
              ← Back
            </button>
          </Link>
          <h1 className="text-5xl font-neue-haas font-bold text-gray-800">Lessons</h1>
        </motion.div>

        {/* Presentations List */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="flex flex-col gap-3"
        >
          {sortedPresentations.map((presentation) => (
            <Link
              key={presentation.id}
              href={`/lessons/${presentation.week}/${presentation.id}`}
            >
              <div className="bg-white border-2 border-gray-200 rounded-lg px-6 py-4 hover:border-gray-400 hover:shadow-lg transition-all duration-200 flex items-center justify-between">
                <span className="text-lg font-neue-haas font-bold text-gray-700">
                  {presentation.title}
                </span>
                <span className="text-sm font-neue-haas font-normal text-gray-500 ml-4 whitespace-nowrap">
                  {formatWeekDate(presentation.week)}
                </span>
              </div>
            </Link>
          ))}
        </motion.div>
      </div>
    </main>
  );
}
