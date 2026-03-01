"use client";

import React, { useRef, useEffect, useCallback, useState } from 'react';
import Matter from 'matter-js';
import { BOARD_CONFIG, generateQuincunxPegs, getSlotIndex } from '@/lib/plinkoLayout';
import { playBounceSound, playLandingSound } from '@/lib/plinkoSounds';
import { motion, AnimatePresence } from 'framer-motion';

interface WheelSegment {
  id: number;
  text: string;
  emoji: string;
}

interface PlinkoBoardProps {
  items: WheelSegment[];
  colors: string[];
  label: string;
  onResult: (item: WheelSegment) => void;
  dropBall: boolean;
  onBallDropped: () => void;
}

const PlinkoBoard: React.FC<PlinkoBoardProps> = ({
  items,
  colors,
  label,
  onResult,
  dropBall,
  onBallDropped,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const engineRef = useRef<Matter.Engine | null>(null);
  const ballRef = useRef<Matter.Body | null>(null);
  const animFrameRef = useRef<number>(0);
  const hasDroppedRef = useRef(false);
  const hasSettledRef = useRef(false);
  const dropTimeRef = useRef<number>(0);
  const lastBounceTimeRef = useRef<number>(0);
  const [result, setResult] = useState<WheelSegment | null>(null);

  const { width, height, pegRadius, ballRadius, slotHeight, paddingX, paddingTop, numSlots, wallThickness, dividerWidth, dividerHeight } = BOARD_CONFIG;

  const pegs = useRef(generateQuincunxPegs(numSlots, width, height)).current;

  // Initialize physics engine
  useEffect(() => {
    const engine = Matter.Engine.create({
      gravity: { x: 0, y: 1.2, scale: 0.001 },
    });
    engineRef.current = engine;

    const playableWidth = width - paddingX * 2;
    const slotWidth = playableWidth / numSlots;

    // Walls
    const walls = [
      // Left wall
      Matter.Bodies.rectangle(paddingX - wallThickness / 2, height / 2, wallThickness, height, { isStatic: true, render: { visible: false } }),
      // Right wall
      Matter.Bodies.rectangle(width - paddingX + wallThickness / 2, height / 2, wallThickness, height, { isStatic: true, render: { visible: false } }),
      // Floor
      Matter.Bodies.rectangle(width / 2, height - 5, width, 10, { isStatic: true, render: { visible: false } }),
    ];

    // Pegs
    const pegBodies = pegs.map(peg =>
      Matter.Bodies.circle(peg.x, peg.y, pegRadius, {
        isStatic: true,
        restitution: 0.5,
        label: 'peg',
      })
    );

    // Slot dividers
    const dividers: Matter.Body[] = [];
    for (let i = 0; i <= numSlots; i++) {
      const x = paddingX + i * slotWidth;
      dividers.push(
        Matter.Bodies.rectangle(x, height - slotHeight / 2 - 5, dividerWidth, dividerHeight, {
          isStatic: true,
          label: 'divider',
        })
      );
    }

    Matter.Composite.add(engine.world, [...walls, ...pegBodies, ...dividers]);

    // Collision events for bounce sounds
    Matter.Events.on(engine, 'collisionStart', (event) => {
      for (const pair of event.pairs) {
        const isPeg =
          (pair.bodyA.label === 'peg' || pair.bodyB.label === 'peg');
        if (isPeg) {
          const now = Date.now();
          if (now - lastBounceTimeRef.current > 30) {
            const ball = pair.bodyA.label === 'peg' ? pair.bodyB : pair.bodyA;
            playBounceSound(ball.position.y, height);
            lastBounceTimeRef.current = now;
          }
        }
      }
    });

    return () => {
      Matter.Engine.clear(engine);
      if (animFrameRef.current) {
        cancelAnimationFrame(animFrameRef.current);
      }
    };
  }, [pegs, height, width, paddingX, pegRadius, numSlots, slotHeight, wallThickness, dividerWidth, dividerHeight]);

  // Render loop
  useEffect(() => {
    const canvas = canvasRef.current;
    const engine = engineRef.current;
    if (!canvas || !engine) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    canvas.width = width * dpr;
    canvas.height = height * dpr;
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;
    ctx.scale(dpr, dpr);

    const playableWidth = width - paddingX * 2;
    const slotWidth = playableWidth / numSlots;

    const render = () => {
      Matter.Engine.update(engine, 1000 / 60);

      // Check ball settlement
      if (ballRef.current && !hasSettledRef.current) {
        const ball = ballRef.current;
        const vel = ball.velocity;
        const elapsed = Date.now() - dropTimeRef.current;

        const isInSlotZone = ball.position.y > height - slotHeight - 20;
        const isSlowEnough = Math.abs(vel.x) < 0.3 && Math.abs(vel.y) < 0.3;

        if ((isInSlotZone && isSlowEnough) || elapsed > 15000) {
          hasSettledRef.current = true;
          const slotIdx = getSlotIndex(ball.position.x, numSlots, width);
          playLandingSound();
          setTimeout(() => {
            setResult(items[slotIdx]);
            onResult(items[slotIdx]);
          }, 400);
        }
      }

      // Clear canvas
      ctx.clearRect(0, 0, width, height);

      // Background gradient
      const bgGrad = ctx.createLinearGradient(0, 0, 0, height);
      bgGrad.addColorStop(0, '#1a1a2e');
      bgGrad.addColorStop(1, '#16213e');
      ctx.fillStyle = bgGrad;
      ctx.fillRect(0, 0, width, height);

      // Slot backgrounds
      for (let i = 0; i < numSlots; i++) {
        const x = paddingX + i * slotWidth;
        const color = colors[i % colors.length];
        ctx.fillStyle = color;
        ctx.fillRect(x, height - slotHeight - 5, slotWidth, slotHeight + 5);

        // Slot emoji label
        ctx.font = '24px serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillStyle = '#ffffff';
        ctx.fillText(
          items[i]?.emoji || '',
          x + slotWidth / 2,
          height - slotHeight / 2
        );
      }

      // Slot dividers
      for (let i = 0; i <= numSlots; i++) {
        const x = paddingX + i * slotWidth;
        ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
        ctx.fillRect(x - dividerWidth / 2, height - slotHeight - 5, dividerWidth, dividerHeight);
      }

      // Pegs
      pegs.forEach((peg, i) => {
        const color = colors[i % colors.length];
        ctx.beginPath();
        ctx.arc(peg.x, peg.y, pegRadius, 0, Math.PI * 2);

        // Glow effect
        ctx.shadowColor = color;
        ctx.shadowBlur = 8;
        ctx.fillStyle = color;
        ctx.fill();

        // White highlight dot
        ctx.shadowBlur = 0;
        ctx.beginPath();
        ctx.arc(peg.x - 2, peg.y - 2, 2, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';
        ctx.fill();
      });

      // Ball
      if (ballRef.current) {
        const ball = ballRef.current;
        const bx = ball.position.x;
        const by = ball.position.y;

        ctx.shadowColor = 'rgba(255, 165, 0, 0.5)';
        ctx.shadowBlur = 12;

        const ballGrad = ctx.createRadialGradient(
          bx - 3, by - 3, 2,
          bx, by, ballRadius
        );
        ballGrad.addColorStop(0, '#ffffff');
        ballGrad.addColorStop(0.3, '#FFD700');
        ballGrad.addColorStop(1, '#FF8C00');

        ctx.beginPath();
        ctx.arc(bx, by, ballRadius, 0, Math.PI * 2);
        ctx.fillStyle = ballGrad;
        ctx.fill();

        ctx.shadowBlur = 0;
      }

      // Label at top
      ctx.font = 'bold 16px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
      ctx.fillText(label, width / 2, 30);

      animFrameRef.current = requestAnimationFrame(render);
    };

    animFrameRef.current = requestAnimationFrame(render);

    return () => {
      if (animFrameRef.current) {
        cancelAnimationFrame(animFrameRef.current);
      }
    };
  }, [items, colors, label, pegs, width, height, paddingX, numSlots, slotHeight, pegRadius, ballRadius, dividerWidth, dividerHeight, onResult]);

  // Drop ball when triggered
  const doDrop = useCallback(() => {
    if (!engineRef.current || hasDroppedRef.current) return;
    hasDroppedRef.current = true;
    hasSettledRef.current = false;
    dropTimeRef.current = Date.now();

    const playableWidth = width - paddingX * 2;
    const offsetRange = playableWidth * 0.15;
    const xOffset = (Math.random() - 0.5) * 2 * offsetRange;

    const ball = Matter.Bodies.circle(width / 2 + xOffset, paddingTop - 30, ballRadius, {
      restitution: 0.6,
      friction: 0.05,
      density: 0.002,
      label: 'ball',
    });

    Matter.Composite.add(engineRef.current.world, ball);
    ballRef.current = ball;

    onBallDropped();
  }, [width, paddingX, paddingTop, ballRadius, onBallDropped]);

  useEffect(() => {
    if (dropBall && !hasDroppedRef.current) {
      doDrop();
    }
  }, [dropBall, doDrop]);

  // Reset when items change (new round)
  useEffect(() => {
    hasDroppedRef.current = false;
    hasSettledRef.current = false;
    setResult(null);
    if (ballRef.current && engineRef.current) {
      Matter.Composite.remove(engineRef.current.world, ballRef.current);
      ballRef.current = null;
    }
  }, [items]);

  return (
    <div className="flex flex-col items-center">
      <canvas
        ref={canvasRef}
        style={{ width: `${width}px`, height: `${height}px` }}
        className="rounded-2xl shadow-2xl"
      />
      <AnimatePresence mode="wait">
        {result && (
          <motion.div
            key={result.id}
            initial={{ opacity: 0, y: 20, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20 }}
            className="mt-4 bg-white/90 rounded-2xl px-6 py-3 shadow-lg"
          >
            <p className="text-2xl font-bold text-gray-800">
              {result.emoji} {result.text}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default PlinkoBoard;
