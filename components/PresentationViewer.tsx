"use client";

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Presentation, Slide } from '@/lib/presentations/types';
import { AnimatePresence, motion } from 'framer-motion';
import {
  TitleSlide,
  TextSlide,
  BulletSlide,
  ImageSlide,
  SplitSlide,
  CustomSlide
} from './slides';

interface PresentationViewerProps {
  presentation: Presentation;
  onExit?: () => void;
}

export default function PresentationViewer({ presentation, onExit }: PresentationViewerProps) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [language, setLanguage] = useState<'fr' | 'en'>('fr');
  const [containerDimensions, setContainerDimensions] = useState({ width: 0, height: 0 });
  const viewerRef = useRef<HTMLDivElement>(null);
  const slideContentRef = useRef<HTMLDivElement>(null);
  const slideInnerRef = useRef<HTMLDivElement>(null);

  const totalSlides = presentation.slides.length;

  const goToNextSlide = useCallback(() => {
    if (currentSlide < totalSlides - 1) {
      setCurrentSlide(currentSlide + 1);
    }
  }, [currentSlide, totalSlides]);

  const goToPreviousSlide = useCallback(() => {
    if (currentSlide > 0) {
      setCurrentSlide(currentSlide - 1);
    }
  }, [currentSlide]);

  const toggleFullscreen = useCallback(async () => {
    try {
      if (!document.fullscreenElement) {
        // Try to make the slide content div fullscreen
        if (slideContentRef.current) {
          await slideContentRef.current.requestFullscreen();
          setIsFullscreen(true);
        }
      } else {
        await document.exitFullscreen();
        setIsFullscreen(false);
      }
    } catch (error) {
      console.error('Fullscreen error:', error);
    }
  }, []);

  const toggleLanguage = useCallback(() => {
    setLanguage(prev => prev === 'fr' ? 'en' : 'fr');
  }, []);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't handle keyboard events if user is typing in an input
      if ((e.target as HTMLElement).tagName === 'INPUT' || 
          (e.target as HTMLElement).tagName === 'TEXTAREA') {
        return;
      }

      switch (e.key) {
        case 'ArrowRight':
        case ' ':
          e.preventDefault();
          goToNextSlide();
          break;
        case 'ArrowLeft':
          e.preventDefault();
          goToPreviousSlide();
          break;
        case 'f':
        case 'F':
          e.preventDefault();
          toggleFullscreen();
          break;
        case 'l':
        case 'L':
          e.preventDefault();
          toggleLanguage();
          break;
        case 'Escape':
          if (isFullscreen) {
            // ESC in fullscreen is handled by browser
          } else if (onExit) {
            e.preventDefault();
            onExit();
          }
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [goToNextSlide, goToPreviousSlide, toggleFullscreen, toggleLanguage, isFullscreen, onExit]);

  // Handle fullscreen changes
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    document.addEventListener('webkitfullscreenchange', handleFullscreenChange);
    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
      document.removeEventListener('webkitfullscreenchange', handleFullscreenChange);
    };
  }, []);

  // Capture container dimensions when not in fullscreen
  useEffect(() => {
    const updateDimensions = () => {
      if (!isFullscreen && slideContentRef.current) {
        const rect = slideContentRef.current.getBoundingClientRect();
        setContainerDimensions({ width: rect.width, height: rect.height });
      }
    };

    // Initial capture with small delay to ensure DOM is ready
    const timer = setTimeout(updateDimensions, 100);
    
    // Update on window resize (only when not fullscreen)
    if (!isFullscreen) {
      window.addEventListener('resize', updateDimensions);
      return () => {
        clearTimeout(timer);
        window.removeEventListener('resize', updateDimensions);
      };
    }
    
    return () => clearTimeout(timer);
  }, [isFullscreen]);

  const renderSlide = (slide: Slide) => {
    switch (slide.type) {
      case 'title':
        return <TitleSlide slide={slide} language={language} />;
      case 'text':
        return <TextSlide slide={slide} language={language} />;
      case 'bullets':
        return <BulletSlide slide={slide} language={language} />;
      case 'image':
        return <ImageSlide slide={slide} language={language} />;
      case 'split':
        return <SplitSlide slide={slide} language={language} />;
      case 'custom':
        return <CustomSlide slide={slide} language={language} />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-8">
      {/* Centered Container */}
      <div className="w-full max-w-6xl mx-auto">
        {/* Presentation Title (when not in fullscreen) */}
        {!isFullscreen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-4"
          >
            <h1 className="font-cooper text-3xl text-gray-800 text-center">
              {presentation.title}
            </h1>
          </motion.div>
        )}

        {/* Presentation Window */}
        <motion.div
          ref={viewerRef}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="relative w-full"
          style={{ aspectRatio: '16/9' }}
        >
          {/* Slide Content Container */}
          <div 
            ref={slideContentRef}
            className={`relative bg-white rounded-lg shadow-2xl overflow-hidden ${
              isFullscreen ? 'h-screen w-screen rounded-none bg-gray-900' : 'h-full w-full'
            }`}
          >
          {/* Slide Content Container */}
          <div className={`absolute inset-0 overflow-hidden ${isFullscreen ? 'flex items-center justify-center' : ''}`}>
            {/* Inner content wrapper that maintains layout and scales in fullscreen */}
            <div 
              ref={slideInnerRef}
              className={`${isFullscreen ? 'relative bg-white rounded-lg shadow-2xl' : 'absolute inset-0'}`}
              style={isFullscreen && containerDimensions.width > 0 ? {
                width: `${containerDimensions.width}px`,
                height: `${containerDimensions.height}px`,
                transform: 'scale(1.5)',
                transformOrigin: 'center center'
              } : {}}
            >
              <AnimatePresence mode="wait">
                <div key={currentSlide} className="h-full w-full">
                  {renderSlide(presentation.slides[currentSlide])}
                </div>
              </AnimatePresence>
            </div>
          </div>

          {/* Controls Bar */}
          <div className={`${isFullscreen ? 'fixed' : 'absolute'} bottom-0 left-0 right-0 bg-gradient-to-t from-black/50 to-transparent p-4 z-50 ${
            isFullscreen ? 'opacity-0 hover:opacity-100' : ''
          } transition-opacity duration-300`}>
            <div className="flex items-center justify-between">
              {/* Progress */}
              <div className="flex items-center gap-4">
                <span className="font-neue-haas text-white text-sm font-medium drop-shadow-lg">
                  {currentSlide + 1} / {totalSlides}
                </span>
                
                {/* Progress Bar */}
                <div className="w-32 h-1.5 bg-white/30 rounded-full overflow-hidden backdrop-blur-sm">
                  <div
                    className="h-full bg-white transition-all duration-300"
                    style={{ width: `${((currentSlide + 1) / totalSlides) * 100}%` }}
                  />
                </div>
              </div>

              {/* Navigation Buttons */}
              <div className="flex items-center gap-2">
                <button
                  onClick={goToPreviousSlide}
                  disabled={currentSlide === 0}
                  className="p-2 rounded-lg bg-white/20 backdrop-blur-sm hover:bg-white/30 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                  aria-label="Previous slide"
                >
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </button>

                <button
                  onClick={goToNextSlide}
                  disabled={currentSlide === totalSlides - 1}
                  className="p-2 rounded-lg bg-white/20 backdrop-blur-sm hover:bg-white/30 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                  aria-label="Next slide"
                >
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>

                <div className="w-px h-6 bg-white/30 mx-1" />

                <button
                  onClick={toggleLanguage}
                  className="px-3 py-2 rounded-lg bg-white/20 backdrop-blur-sm hover:bg-white/30 transition-all flex items-center gap-2"
                  aria-label="Toggle language"
                >
                  <span className="text-lg">🇫🇷</span>
                  <div className="relative w-10 h-5 bg-white/20 rounded-full">
                    <div 
                      className={`absolute top-0.5 w-4 h-4 bg-white rounded-full transition-transform ${
                        language === 'en' ? 'translate-x-5' : 'translate-x-0.5'
                      }`}
                    />
                  </div>
                  <span className="text-lg">🇺🇸</span>
                </button>

                <div className="w-px h-6 bg-white/30 mx-1" />

                <button
                  onClick={toggleFullscreen}
                  className="p-2 rounded-lg bg-white/20 backdrop-blur-sm hover:bg-white/30 transition-all"
                  aria-label="Toggle fullscreen"
                >
                  {isFullscreen ? (
                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 9V4.5M9 9H4.5M9 9L3.75 3.75M9 15v4.5M9 15H4.5M9 15l-5.25 5.25M15 9h4.5M15 9V4.5M15 9l5.25-5.25M15 15h4.5M15 15v4.5m0-4.5l5.25 5.25" />
                    </svg>
                  ) : (
                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.75 3.75v4.5m0-4.5h4.5m-4.5 0L9 9M3.75 20.25v-4.5m0 4.5h4.5m-4.5 0L9 15M20.25 3.75h-4.5m4.5 0v4.5m0-4.5L15 9m5.25 11.25h-4.5m4.5 0v-4.5m0 4.5L15 15" />
                    </svg>
                  )}
                </button>
              </div>
            </div>
          </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}