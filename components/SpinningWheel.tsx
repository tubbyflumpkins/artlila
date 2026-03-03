"use client";

import React, { useState, useRef, useEffect, useCallback, useImperativeHandle, forwardRef } from 'react';
import { motion, animate } from 'framer-motion';
import { playPegPop } from '@/lib/sounds';

interface WheelSegment {
  id: number;
  text: string;
  emoji: string;
}

export interface SpinningWheelHandle {
  spin: () => void;
}

interface SpinningWheelProps {
  segments: WheelSegment[];
  onSpinComplete: (result: WheelSegment) => void;
  isSpinning: boolean;
  setIsSpinning: (spinning: boolean) => void;
}

// Chasing color pattern: red, cream, cream - creates a rotating ring effect
const CHASE_COLORS = ['#DC2626', '#FEF3E2', '#FEF3E2'];

// Flapper spring physics constants
const SPRING_STIFFNESS = 0.3;
const DAMPING = 0.85;
const MAX_DEFLECTION = 35; // degrees

const SpinningWheel = forwardRef<SpinningWheelHandle, SpinningWheelProps>(({
  segments,
  onSpinComplete,
  isSpinning,
  setIsSpinning
}, ref) => {
  const [rotation, setRotation] = useState(0);
  const [colorOffset, setColorOffset] = useState(0);
  const colorIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const lastTickRef = useRef(0);
  const lastSoundTimeRef = useRef(0);
  const rotationRef = useRef(0);
  const startRotationRef = useRef(0);
  const endRotationRef = useRef(0);

  // Animated chasing colors: cycle offset while not spinning, freeze when spinning
  useEffect(() => {
    if (!isSpinning) {
      colorIntervalRef.current = setInterval(() => {
        setColorOffset(prev => prev + 1);
      }, 150);
    } else {
      if (colorIntervalRef.current) {
        clearInterval(colorIntervalRef.current);
        colorIntervalRef.current = null;
      }
    }
    return () => {
      if (colorIntervalRef.current) clearInterval(colorIntervalRef.current);
    };
  }, [isSpinning]);

  const getSegmentColor = (index: number) => {
    return CHASE_COLORS[(index + colorOffset) % CHASE_COLORS.length];
  };

  // Flapper physics refs
  const flapperRef = useRef<SVGGElement>(null);
  const flapperAngle = useRef(0);
  const flapperVelocity = useRef(0);
  const flapperRaf = useRef<number>(0);

  const segmentAngle = 360 / segments.length;
  const numberOfPegs = segments.length;

  // Keep rotation ref in sync
  useEffect(() => {
    rotationRef.current = rotation;
  }, [rotation]);

  // Flapper spring physics loop
  const updateFlapper = useCallback(() => {
    // Spring force toward rest (0)
    const springForce = -SPRING_STIFFNESS * flapperAngle.current;
    flapperVelocity.current += springForce;
    flapperVelocity.current *= DAMPING;
    flapperAngle.current += flapperVelocity.current;

    // Clamp
    flapperAngle.current = Math.max(-MAX_DEFLECTION, Math.min(MAX_DEFLECTION, flapperAngle.current));

    // Direct DOM update for performance
    if (flapperRef.current) {
      flapperRef.current.style.transform = `rotate(${flapperAngle.current}deg)`;
    }

    // Stop when settled
    if (Math.abs(flapperAngle.current) > 0.1 || Math.abs(flapperVelocity.current) > 0.1) {
      flapperRaf.current = requestAnimationFrame(updateFlapper);
    }
  }, []);

  // Start flapper animation loop when spinning
  useEffect(() => {
    if (isSpinning) {
      flapperRaf.current = requestAnimationFrame(updateFlapper);
    }
    return () => {
      if (flapperRaf.current) cancelAnimationFrame(flapperRaf.current);
    };
  }, [isSpinning, updateFlapper]);

  const handleSpin = useCallback(() => {
    if (isSpinning) return;

    setIsSpinning(true);

    const spins = 5 + Math.random() * 3;
    const currentRotation = rotationRef.current;
    const finalRotation = currentRotation + spins * 360 + Math.random() * 360;
    const duration = 4000 + Math.random() * 2000;

    startRotationRef.current = currentRotation;
    endRotationRef.current = finalRotation;

    animate(currentRotation, finalRotation, {
      duration: duration / 1000,
      ease: [0.17, 0.67, 0.12, 0.99],
      onUpdate: (latest) => {
        setRotation(latest);

        const currentRotationDegrees = latest % 360;
        const currentPegHit = Math.floor(currentRotationDegrees / (360 / numberOfPegs));

        if (currentPegHit !== lastTickRef.current) {
          const progress = (latest - startRotationRef.current) / (endRotationRef.current - startRotationRef.current);
          const speedFactor = Math.max(0, 1 - progress);

          // Rate-limit sounds: at high speed skip most pops, let them through as wheel slows
          // Min interval scales from 120ms (fast) down to 0ms (slow/stopped)
          const now = performance.now();
          const minInterval = Math.max(0, (1 - progress) * 120);
          if (now - lastSoundTimeRef.current >= minInterval) {
            playPegPop(speedFactor);
            lastSoundTimeRef.current = now;
          }

          // Flapper always bounces regardless of sound throttle
          flapperVelocity.current = speedFactor * 12;
          if (!flapperRaf.current || Math.abs(flapperAngle.current) < 0.1) {
            flapperRaf.current = requestAnimationFrame(updateFlapper);
          }

          lastTickRef.current = currentPegHit;
        }
      },
      onComplete: () => {
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
  }, [isSpinning, setIsSpinning, segments, segmentAngle, numberOfPegs, onSpinComplete, updateFlapper]);

  // Expose spin() to parent via ref
  useImperativeHandle(ref, () => ({
    spin: handleSpin
  }), [handleSpin]);

  return (
    <div className="relative" style={{ width: 'min(50vh, 45vw)', height: 'min(50vh, 45vw)' }}>
      {/* Flapper - positioned at top, outside rotating SVG */}
      <div
        className="absolute top-0 left-1/2 -translate-x-1/2 z-10"
        style={{ transformOrigin: 'center top' }}
      >
        <svg
          width="32"
          height="48"
          viewBox="0 0 32 48"
          className="filter drop-shadow-lg"
          style={{ transformOrigin: '16px 4px' }}
        >
          <g ref={flapperRef} style={{ transformOrigin: '16px 4px' }}>
            {/* Pivot circle */}
            <circle cx="16" cy="4" r="4" fill="#FFD700" stroke="#B8860B" strokeWidth="1.5" />
            {/* Paddle body */}
            <path
              d="M10 6 L22 6 L16 44 Z"
              fill="#E74C3C"
              stroke="#C0392B"
              strokeWidth="1.5"
              strokeLinejoin="round"
            />
          </g>
        </svg>
      </div>

      <div className="absolute inset-0 flex items-center justify-center">
        <motion.div
          className="relative w-full h-full cursor-pointer"
          style={{ rotate: rotation }}
          onClick={handleSpin}
          whileHover={{ scale: isSpinning ? 1 : 1.02 }}
          whileTap={{ scale: isSpinning ? 1 : 0.98 }}
        >
          <svg viewBox="0 0 400 400" className="w-full h-full">
            {/* Outer decorative gold ring */}
            <circle
              cx="200" cy="200" r="192"
              fill="none"
              stroke="#FFD700"
              strokeWidth="6"
              filter="url(#goldGlow)"
            />

            <defs>
              <filter id="goldGlow">
                <feGaussianBlur stdDeviation="2" result="blur" />
                <feMerge>
                  <feMergeNode in="blur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
              <radialGradient id="hubGradient" cx="50%" cy="40%" r="50%">
                <stop offset="0%" stopColor="#FFE066" />
                <stop offset="100%" stopColor="#FFD700" />
              </radialGradient>
            </defs>

            {/* Segments */}
            {segments.map((segment, index) => {
              const startAngle = index * segmentAngle;
              const endAngle = (index + 1) * segmentAngle;
              const color = getSegmentColor(index);

              const startAngleRad = (startAngle * Math.PI) / 180;
              const endAngleRad = (endAngle * Math.PI) / 180;

              const x1 = Math.round((200 + 180 * Math.cos(startAngleRad)) * 100) / 100;
              const y1 = Math.round((200 + 180 * Math.sin(startAngleRad)) * 100) / 100;
              const x2 = Math.round((200 + 180 * Math.cos(endAngleRad)) * 100) / 100;
              const y2 = Math.round((200 + 180 * Math.sin(endAngleRad)) * 100) / 100;

              const largeArc = segmentAngle > 180 ? 1 : 0;

              // Peg position at outer edge
              const pegAngleRad = (startAngle * Math.PI) / 180;
              const pegX = Math.round((200 + 185 * Math.cos(pegAngleRad)) * 100) / 100;
              const pegY = Math.round((200 + 185 * Math.sin(pegAngleRad)) * 100) / 100;

              return (
                <g key={segment.id}>
                  <path
                    d={`M 200 200 L ${x1} ${y1} A 180 180 0 ${largeArc} 1 ${x2} ${y2} Z`}
                    fill={color}
                    stroke="#fff"
                    strokeWidth="1.5"
                  />

                  {/* Gold peg at segment boundary */}
                  <circle
                    cx={pegX}
                    cy={pegY}
                    r="6"
                    fill="#FFD700"
                    stroke="#B8860B"
                    strokeWidth="1"
                  />

                  {/* Emoji */}
                  <text
                    x={Math.round((200 + 140 * Math.cos((startAngleRad + endAngleRad) / 2)) * 100) / 100}
                    y={Math.round((200 + 140 * Math.sin((startAngleRad + endAngleRad) / 2)) * 100) / 100}
                    textAnchor="middle"
                    dominantBaseline="middle"
                    className="select-none"
                    style={{ fontSize: '28px' }}
                    transform={`rotate(${(startAngle + endAngle) / 2 + 90} ${Math.round((200 + 140 * Math.cos((startAngleRad + endAngleRad) / 2)) * 100) / 100} ${Math.round((200 + 140 * Math.sin((startAngleRad + endAngleRad) / 2)) * 100) / 100})`}
                  >
                    {segment.emoji}
                  </text>
                </g>
              );
            })}

            {/* Center hub with gold gradient */}
            <circle cx="200" cy="200" r="32" fill="url(#hubGradient)" stroke="#B8860B" strokeWidth="3" />
            <text
              x="200"
              y="200"
              textAnchor="middle"
              dominantBaseline="middle"
              className="font-bold select-none"
              style={{ fontSize: '11px', fill: '#5D4E37' }}
            >
              TOURNE!
            </text>
          </svg>
        </motion.div>
      </div>
    </div>
  );
});

SpinningWheel.displayName = 'SpinningWheel';

export default SpinningWheel;
