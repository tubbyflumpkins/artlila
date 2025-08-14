import React from 'react';
import Link from 'next/link';
import { Presentation } from '@/lib/presentations/types';
import { motion } from 'framer-motion';

interface PresentationListProps {
  presentations: Presentation[];
  weekNumber: string;
}

export default function PresentationList({ presentations, weekNumber }: PresentationListProps) {
  if (presentations.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="font-neue-haas text-gray-500">
          Aucune présentation disponible pour cette semaine.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {presentations.map((presentation, index) => (
        <motion.div
          key={presentation.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
        >
          <Link href={`/lessons/${weekNumber}/${presentation.id}`}>
            <div className="group bg-white border-2 border-gray-200 rounded-lg p-6 hover:border-gray-400 hover:shadow-lg transition-all duration-200 cursor-pointer">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h3 className="font-neue-haas font-bold text-2xl text-gray-800 group-hover:text-gray-900 mb-2">
                    {presentation.title}
                  </h3>
                  <p className="font-neue-haas text-gray-600">
                    {presentation.description}
                  </p>
                  <div className="mt-3 flex items-center gap-4">
                    <span className="font-neue-haas text-sm text-gray-500">
                      {presentation.slides.length} diapositives
                    </span>
                  </div>
                </div>
                <div className="ml-4 flex-shrink-0">
                  <svg 
                    className="w-6 h-6 text-gray-400 group-hover:text-gray-600 transition-colors" 
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path 
                      strokeLinecap="round" 
                      strokeLinejoin="round" 
                      strokeWidth={2} 
                      d="M9 5l7 7-7 7" 
                    />
                  </svg>
                </div>
              </div>
            </div>
          </Link>
        </motion.div>
      ))}
    </div>
  );
}