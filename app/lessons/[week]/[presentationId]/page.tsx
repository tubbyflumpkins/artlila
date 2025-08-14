"use client";

import React from 'react';
import { useParams, useRouter } from 'next/navigation';
import PresentationViewer from '@/components/PresentationViewer';
import { week1Presentations } from '@/lib/presentations/week1';
import { Presentation } from '@/lib/presentations/types';

export default function PresentationPage() {
  const params = useParams();
  const router = useRouter();
  const weekNumber = params.week?.toString() || '1';
  const presentationId = params.presentationId as string;

  // Get all presentations for the week
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
  const presentation = presentations.find(p => p.id === presentationId);

  if (!presentation) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="font-neue-haas font-bold text-3xl text-gray-800 mb-4">
            Présentation non trouvée
          </h1>
          <button
            onClick={() => router.back()}
            className="font-neue-haas font-medium text-gray-600 hover:text-gray-800 transition-colors"
          >
            ← Retour
          </button>
        </div>
      </div>
    );
  }

  return (
    <PresentationViewer
      presentation={presentation}
      onExit={() => router.push(`/lessons/${weekNumber}`)}
    />
  );
}