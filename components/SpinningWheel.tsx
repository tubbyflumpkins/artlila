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
  animationTick: number;
  patternIndex: number;
}

// Flapper spring physics constants
const SPRING_STIFFNESS = 0.3;
const DAMPING = 0.85;
const MAX_DEFLECTION = 35; // degrees

const SpinningWheel = forwardRef<SpinningWheelHandle, SpinningWheelProps>(({
  segments,
  onSpinComplete,
  isSpinning,
  setIsSpinning,
  animationTick,
  patternIndex
}, ref) => {
  const [rotation, setRotation] = useState(0);
  const [winnerIndex, setWinnerIndex] = useState<number | null>(null);
  const lastTickRef = useRef(0);
  const lastSoundTimeRef = useRef(0);
  const rotationRef = useRef(0);
  const startRotationRef = useRef(0);
  const endRotationRef = useRef(0);

  // Alternate cream shades so adjacent white wedges are distinguishable
  const cream = (index: number) => index % 2 === 0 ? '#FEF3E2' : '#E8DDD0';

  const getSegmentColor = (index: number) => {
    const n = segments.length;

    // Post-spin: winner red, neighbors pink, rest alternating cream
    if (winnerIndex !== null) {
      if (index === winnerIndex) return '#DC2626';
      const prev = (winnerIndex - 1 + n) % n;
      const next = (winnerIndex + 1) % n;
      if (index === prev || index === next) return '#FCA5A5';
      return cream(index);
    }

    // Festive patterns (driven by parent tick + patternIndex)
    const tick = animationTick;
    const pattern = patternIndex % 2;

    if (pattern === 0) {
      // Red/cream chase
      const slot = (index + tick) % 3;
      return slot === 0 ? '#DC2626' : cream(index);
    } else {
      // Dual sweep — two red highlights chase in opposite directions
      const pos1 = tick % n;
      const pos2 = (n - 1 - (tick % n)) % n;
      if (index === pos1 || index === pos2) return '#DC2626';
      // Trailing glow
      const prev1 = (pos1 - 1 + n) % n;
      const prev2 = (pos2 - 1 + n) % n;
      if (index === prev1 || index === prev2) return '#FCA5A5';
      return cream(index);
    }
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
        const winIdx = Math.floor(topAngle / segmentAngle) % segments.length;

        setWinnerIndex(winIdx);
        setTimeout(() => {
          onSpinComplete(segments[winIdx]);
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
    <div className="relative" style={{ width: 'min(65vh, 45vw)', height: 'min(65vh, 45vw)' }}>
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
          <svg viewBox="0 0 400 400" className="w-full h-full" style={{ filter: 'drop-shadow(0 0 12px rgba(255, 215, 0, 0.4)) drop-shadow(0 0 30px rgba(255, 215, 0, 0.15))' }}>
            <defs>
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

              return (
                <g key={segment.id}>
                  <path
                    d={`M 200 200 L ${x1} ${y1} A 180 180 0 ${largeArc} 1 ${x2} ${y2} Z`}
                    fill={color}
                    stroke="#fff"
                    strokeWidth="1.5"
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
          </svg>
        </motion.div>
      </div>
    </div>
  );
});

SpinningWheel.displayName = 'SpinningWheel';

export default SpinningWheel;
