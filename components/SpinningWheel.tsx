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

    let lastPegHit = -1;

    animate(rotation, finalRotation, {
      duration: duration / 1000,
      ease: [0.17, 0.67, 0.12, 0.99],
      onUpdate: (latest) => {
        setRotation(latest);
        
        const currentRotationDegrees = latest % 360;
        const pegHit = Math.floor(currentRotationDegrees / (360 / numberOfPegs));
        
        if (pegHit !== lastPegHit) {
          const progress = (latest - rotation) / (finalRotation - rotation);
          const rate = Math.max(0.5, 2 - progress * 1.5);
          playTick(rate);
          lastPegHit = pegHit;
        }
      },
      onComplete: () => {
        stopDrumroll();
        const finalAngle = (360 - (finalRotation % 360) + 90) % 360;
        const winningIndex = Math.floor(finalAngle / segmentAngle);
        const winner = segments[segments.length - 1 - winningIndex];
        
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
              
              const x1 = 200 + 180 * Math.cos(startAngleRad);
              const y1 = 200 + 180 * Math.sin(startAngleRad);
              const x2 = 200 + 180 * Math.cos(endAngleRad);
              const y2 = 200 + 180 * Math.sin(endAngleRad);
              
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
                    cx={200 + 170 * Math.cos((startAngleRad + endAngleRad) / 2)}
                    cy={200 + 170 * Math.sin((startAngleRad + endAngleRad) / 2)}
                    r="4"
                    fill="#fff"
                    opacity="0.7"
                  />
                  
                  <text
                    x={200 + 120 * Math.cos((startAngleRad + endAngleRad) / 2)}
                    y={200 + 120 * Math.sin((startAngleRad + endAngleRad) / 2)}
                    textAnchor="middle"
                    dominantBaseline="middle"
                    className="fill-white font-bold text-sm select-none"
                    transform={`rotate(${startAngle + segmentAngle / 2} ${200 + 120 * Math.cos((startAngleRad + endAngleRad) / 2)} ${200 + 120 * Math.sin((startAngleRad + endAngleRad) / 2)})`}
                  >
                    <tspan x={200 + 120 * Math.cos((startAngleRad + endAngleRad) / 2)} dy="-0.3em">
                      {segment.emoji}
                    </tspan>
                    <tspan x={200 + 120 * Math.cos((startAngleRad + endAngleRad) / 2)} dy="1.2em" className="text-xs">
                      {segment.text}
                    </tspan>
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
      
      <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-2 z-10">
        <motion.div
          animate={{ 
            rotate: isSpinning ? [0, -5, 5, -5, 5, 0] : 0,
            scale: currentSegment !== lastTickRef.current ? [1, 1.1, 1] : 1
          }}
          transition={{ duration: 0.1 }}
          onAnimationComplete={() => {
            lastTickRef.current = currentSegment;
          }}
        >
          <svg width="60" height="80" viewBox="0 0 60 80" className="filter drop-shadow-lg">
            <path
              d="M30 0 L50 40 L30 80 L10 40 Z"
              fill="#E74C3C"
              stroke="#C0392B"
              strokeWidth="2"
            />
            <circle cx="30" cy="40" r="8" fill="#C0392B" />
          </svg>
        </motion.div>
      </div>
    </div>
  );
};

export default SpinningWheel;