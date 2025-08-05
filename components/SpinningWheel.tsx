"use client";

import React, { useState, useRef, useEffect } from 'react';
import { motion, animate } from 'framer-motion';
import { playTick, startDrumroll, stopDrumroll } from '@/lib/sounds';

interface WheelSegment {
  id: number;
  text: string;
  emoji: string;
}

interface SpinningWheelProps {
  segments: WheelSegment[];
  colors: string[];
  onSpinComplete: (result: WheelSegment) => void;
  isSpinning: boolean;
  setIsSpinning: (spinning: boolean) => void;
}

const SpinningWheel: React.FC<SpinningWheelProps> = ({
  segments,
  colors,
  onSpinComplete,
  isSpinning,
  setIsSpinning
}) => {
  const [rotation, setRotation] = useState(0);
  const [currentSegment, setCurrentSegment] = useState(0);
  const wheelRef = useRef<HTMLDivElement>(null);
  const lastTickRef = useRef(0);

  const segmentAngle = 360 / segments.length;
  const numberOfPegs = segments.length;

  useEffect(() => {
    const angle = (360 - (rotation % 360) + 90) % 360;
    const segmentIndex = Math.floor(angle / segmentAngle);
    setCurrentSegment(segments.length - 1 - segmentIndex);
  }, [rotation, segmentAngle, segments.length]);

  const handleSpin = () => {
    if (isSpinning) return;

    setIsSpinning(true);
    startDrumroll();

    const spins = 5 + Math.random() * 3;
    const finalRotation = rotation + spins * 360 + Math.random() * 360;
    const duration = 4000 + Math.random() * 2000;

    animate(rotation, finalRotation, {
      duration: duration / 1000,
      ease: [0.17, 0.67, 0.12, 0.99],
      onUpdate: (latest) => {
        setRotation(latest);
        
        const currentRotationDegrees = latest % 360;
        const currentPegHit = Math.floor(currentRotationDegrees / (360 / numberOfPegs));
        
        if (currentPegHit !== lastTickRef.current && isSpinning) {
          const progress = (latest - rotation) / (finalRotation - rotation);
          const rate = Math.max(0.5, 2 - progress * 1.5);
          playTick(rate);
          lastTickRef.current = currentPegHit;
        }
      },
      onComplete: () => {
        stopDrumroll();
        // Calculate which segment is at the top (270 degrees in our coordinate system) where the triangle points
        const normalizedRotation = finalRotation % 360;
        const topAngle = (270 - normalizedRotation + 360) % 360;
        const winningIndex = Math.floor(topAngle / segmentAngle) % segments.length;
        const winner = segments[winningIndex];
        
        setTimeout(() => {
          onSpinComplete(winner);
          setIsSpinning(false);
        }, 500);
      }
    });
  };

  return (
    <div className="relative w-96 h-96">
      <div className="absolute inset-0 flex items-center justify-center">
        <motion.div
          ref={wheelRef}
          className="relative w-full h-full cursor-pointer"
          style={{ rotate: rotation }}
          onClick={handleSpin}
          whileHover={{ scale: isSpinning ? 1 : 1.02 }}
          whileTap={{ scale: isSpinning ? 1 : 0.98 }}
        >
          <svg viewBox="0 0 400 400" className="w-full h-full">
            {segments.map((segment, index) => {
              const startAngle = index * segmentAngle;
              const endAngle = (index + 1) * segmentAngle;
              const color = colors[index % colors.length];
              
              const startAngleRad = (startAngle * Math.PI) / 180;
              const endAngleRad = (endAngle * Math.PI) / 180;
              
              const x1 = Math.round((200 + 180 * Math.cos(startAngleRad)) * 100) / 100;
              const y1 = Math.round((200 + 180 * Math.sin(startAngleRad)) * 100) / 100;
              const x2 = Math.round((200 + 180 * Math.cos(endAngleRad)) * 100) / 100;
              const y2 = Math.round((200 + 180 * Math.sin(endAngleRad)) * 100) / 100;
              
              const largeArc = segmentAngle > 180 ? 1 : 0;
              
              return (
                <g key={segment.id}>
                  <path
                    d={`M 200 200 L ${x1} ${y1} A 180 180 0 ${largeArc} 1 ${x2} ${y2} Z`}
                    fill={color}
                    stroke="#fff"
                    strokeWidth="2"
                  />
                  
                  <circle
                    cx={Math.round((200 + 170 * Math.cos((startAngleRad + endAngleRad) / 2)) * 100) / 100}
                    cy={Math.round((200 + 170 * Math.sin((startAngleRad + endAngleRad) / 2)) * 100) / 100}
                    r="4"
                    fill="#fff"
                    opacity="0.7"
                  />
                  
                  <text
                    x={Math.round((200 + 150 * Math.cos((startAngleRad + endAngleRad) / 2)) * 100) / 100}
                    y={Math.round((200 + 150 * Math.sin((startAngleRad + endAngleRad) / 2)) * 100) / 100}
                    textAnchor="middle"
                    dominantBaseline="middle"
                    className="text-2xl select-none"
                    style={{ fontSize: '28px' }}
                    transform={`rotate(${(startAngle + endAngle) / 2 + 90} ${Math.round((200 + 150 * Math.cos((startAngleRad + endAngleRad) / 2)) * 100) / 100} ${Math.round((200 + 150 * Math.sin((startAngleRad + endAngleRad) / 2)) * 100) / 100})`}
                  >
                    {segment.emoji}
                  </text>
                </g>
              );
            })}
            
            <circle cx="200" cy="200" r="30" fill="#fff" stroke="#333" strokeWidth="3" />
            <text
              x="200"
              y="200"
              textAnchor="middle"
              dominantBaseline="middle"
              className="fill-gray-700 font-bold text-lg select-none"
            >
              SPIN
            </text>
          </svg>
        </motion.div>
      </div>
      
      <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1 z-10">
        <svg width="24" height="20" viewBox="0 0 24 20" className="filter drop-shadow-lg">
          <path
            d="M6 0 L18 0 L12 20 Z"
            fill="#E74C3C"
            stroke="#C0392B"
            strokeWidth="2"
          />
        </svg>
      </div>
    </div>
  );
};

export default SpinningWheel;