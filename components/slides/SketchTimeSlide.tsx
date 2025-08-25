import React from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { BilingualText } from '@/lib/presentations/types';
import { getText } from '@/lib/presentations/bilingualHelpers';

interface SketchTimeSlideProps {
  subtitle?: BilingualText;
  title?: BilingualText;
  language?: 'fr' | 'en';
}

export default function SketchTimeSlide({ subtitle, title, language = 'fr' }: SketchTimeSlideProps) {
  const router = useRouter();
  
  const segments = [
    { text: 'Un chat', emoji: '🐱' },
    { text: 'Un robot', emoji: '🤖' },
    { text: 'Un arbre', emoji: '🌳' },
    { text: 'Une maison', emoji: '🏠' },
    { text: 'Un monstre', emoji: '👹' },
    { text: 'Une fusée', emoji: '🚀' },
    { text: 'Un gâteau', emoji: '🎂' },
    { text: 'Un dragon', emoji: '🐉' }
  ];

  const instructions = language === 'fr' ? [
    {
      emoji: '🎡',
      title: 'Fais tourner les roues',
      subtitle: '(Un élève appuie sur les boutons au tableau ou à l\'ordi)'
    },
    {
      emoji: '✏️',
      title: 'Dessine pendant 6 minutes',
      subtitle: '(Comme tu veux — il n\'y a pas de mauvaises réponses)'
    },
    {
      emoji: '📚',
      title: 'Range ton carnet de croquis sur l\'étagère',
      subtitle: '(Toujours au même endroit)'
    }
  ] : [
    {
      emoji: '🎡',
      title: 'Spin the wheels',
      subtitle: '(One student presses the buttons on the board or computer)'
    },
    {
      emoji: '✏️',
      title: 'Draw for 6 minutes',
      subtitle: '(However you want — there are no wrong answers)'
    },
    {
      emoji: '📚',
      title: 'Put your sketchbook back on the shelf',
      subtitle: '(Always in the same place)'
    }
  ];

  const colors = [
    '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4',
    '#FFEAA7', '#DDA0DD', '#98D8C8', '#F7DC6F'
  ];

  const segmentAngle = 360 / segments.length;

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15
      }
    }
  };

  const item = {
    hidden: { opacity: 0, x: -20 },
    show: { opacity: 1, x: 0 }
  };

  return (
    <div className="h-full w-full bg-gradient-to-br from-purple-50 to-pink-50 p-8">
      {/* Header */}
      <div className="text-center mb-6">
        {subtitle && (
          <p className="font-neue-haas text-lg md:text-xl text-gray-600 mb-2">
            {getText(subtitle, language)}
          </p>
        )}
        {title && (
          <motion.h1
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="font-cooper text-3xl md:text-4xl lg:text-5xl text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600 text-center"
          >
            {getText(title, language)}
          </motion.h1>
        )}
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-2 gap-8 h-[calc(100%-8rem)]">
        {/* Left Side - Instructions */}
        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          className="flex flex-col justify-center space-y-6"
        >
          {instructions.map((instruction, index) => (
            <motion.div key={index} variants={item} className="flex items-start space-x-4">
              <span className="text-3xl mt-1">{instruction.emoji}</span>
              <div>
                <h3 className="font-neue-haas font-bold text-xl md:text-2xl text-gray-800">
                  {index + 1}. {instruction.title}
                </h3>
                <p className="font-neue-haas text-base md:text-lg text-gray-600 italic mt-1">
                  {instruction.subtitle}
                </p>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Right Side - Wheel Visual and Button */}
        <div className="flex flex-col items-center justify-center space-y-8">
          {/* Spinning Wheel Visual */}
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: "spring" as const, duration: 1 }}
            className="relative w-64 h-64 md:w-72 md:h-72"
          >
            {/* Wheel */}
            <svg
              viewBox="0 0 300 300"
              className="w-full h-full drop-shadow-xl"
            >
              {segments.map((segment, index) => {
                const startAngle = index * segmentAngle - 90;
                const endAngle = startAngle + segmentAngle;
                const startAngleRad = (startAngle * Math.PI) / 180;
                const endAngleRad = (endAngle * Math.PI) / 180;
                const largeArcFlag = segmentAngle > 180 ? 1 : 0;
                
                const x1 = 150 + 140 * Math.cos(startAngleRad);
                const y1 = 150 + 140 * Math.sin(startAngleRad);
                const x2 = 150 + 140 * Math.cos(endAngleRad);
                const y2 = 150 + 140 * Math.sin(endAngleRad);
                
                const pathData = [
                  `M 150 150`,
                  `L ${x1} ${y1}`,
                  `A 140 140 0 ${largeArcFlag} 1 ${x2} ${y2}`,
                  'Z'
                ].join(' ');

                return (
                  <g key={index}>
                    <path
                      d={pathData}
                      fill={colors[index % colors.length]}
                      stroke="white"
                      strokeWidth="2"
                    />
                    <text
                      x={150 + 90 * Math.cos((startAngleRad + endAngleRad) / 2)}
                      y={150 + 90 * Math.sin((startAngleRad + endAngleRad) / 2)}
                      fill="white"
                      fontSize="14"
                      fontWeight="bold"
                      textAnchor="middle"
                      dominantBaseline="middle"
                      transform={`rotate(${(startAngle + endAngle) / 2}, ${150 + 90 * Math.cos((startAngleRad + endAngleRad) / 2)}, ${150 + 90 * Math.sin((startAngleRad + endAngleRad) / 2)})`}
                    >
                      {segment.emoji}
                    </text>
                  </g>
                );
              })}
              
              {/* Center circle */}
              <circle cx="150" cy="150" r="30" fill="white" stroke="#333" strokeWidth="3" />
              <text x="150" y="150" fill="#333" fontSize="20" textAnchor="middle" dominantBaseline="middle">
                🎯
              </text>
            </svg>

            {/* Arrow pointing down */}
            <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-2">
              <div className="w-0 h-0 border-l-[20px] border-l-transparent border-t-[30px] border-t-red-500 border-r-[20px] border-r-transparent drop-shadow-lg"></div>
            </div>
          </motion.div>

          {/* Exciting Button */}
          <motion.button
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.5, type: "spring" as const }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => router.push('/game')}
            className="relative group"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-yellow-400 via-red-500 to-pink-500 rounded-full blur-lg group-hover:blur-xl transition-all animate-pulse"></div>
            <div className="relative bg-gradient-to-r from-yellow-400 via-red-500 to-pink-500 text-white font-cooper text-2xl md:text-3xl px-8 py-4 rounded-full shadow-2xl border-4 border-white">
              {language === 'fr' ? 'C\'EST PARTI!' : 'LET\'S GO!'} 🚀
            </div>
          </motion.button>
        </div>
      </div>
    </div>
  );
}