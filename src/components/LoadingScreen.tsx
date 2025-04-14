'use client';

import { useState, useEffect } from 'react';

export default function LoadingScreen() {
  // Array of loading messages to cycle through
  const loadingMessages = [
    'Analyzing your Workbrand...',
    'Compiling competitor data...',
    'Calculating category scores...',
    'Preparing detailed analysis...',
    'Generating comparison report...',
    'Almost ready...',
  ];

  // State to track the current message index
  const [messageIndex, setMessageIndex] = useState(0);
  const [progress, setProgress] = useState(0);

  // Effect to cycle through messages every 2.5 seconds
  useEffect(() => {
    const messageIntervalId = setInterval(() => {
      setMessageIndex(prevIndex => (prevIndex + 1) % loadingMessages.length);
    }, 2500);

    // Simulate progress
    const progressIntervalId = setInterval(() => {
      setProgress(prevProgress => {
        // Gradually increase progress but slow down as it approaches 100%
        const increment = Math.max(1, 10 * (1 - prevProgress / 100));
        const newProgress = Math.min(99, prevProgress + increment);
        return newProgress;
      });
    }, 800);

    // Cleanup on unmount
    return () => {
      clearInterval(messageIntervalId);
      clearInterval(progressIntervalId);
    };
  }, []);

  return (
    <div className="fixed inset-0 bg-gradient-to-b from-[#242857]/95 to-[#2F3295]/95 backdrop-blur-md flex flex-col items-center justify-center z-50">
      {/* Background tech pattern */}
      <div className="absolute inset-0 tech-pattern opacity-30"></div>
      
      {/* Floating particles */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(12)].map((_, i) => (
          <div 
            key={i} 
            className="absolute rounded-full animate-pulse-slow" 
            style={{
              width: `${Math.random() * 8 + 2}px`,
              height: `${Math.random() * 8 + 2}px`,
              backgroundColor: Math.random() > 0.5 ? 'rgba(254, 97, 158, 0.5)' : 'rgba(255, 255, 255, 0.5)',
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${Math.random() * 3 + 2}s`
            }}
          ></div>
        ))}
      </div>
      
      <div className="text-center px-6 relative z-10">
        {/* Spinner */}
        <div className="mb-6 relative">
          <div className="w-20 h-20 border-4 border-[#FE619E]/20 rounded-full"></div>
          <div className="absolute top-0 left-0 w-20 h-20 border-4 border-t-[#FE619E] border-r-transparent border-b-transparent border-l-transparent rounded-full animate-spin"></div>
        </div>
        
        {/* Message */}
        <h2 className="text-xl font-semibold text-white mb-3 animate-pulse-slow">{loadingMessages[messageIndex]}</h2>
        <p className="text-white/70 mb-5">Please wait while we prepare your results.</p>
        
        {/* Progress bar */}
        <div className="relative w-64 h-1.5 bg-white/10 rounded-full overflow-hidden">
          <div 
            className="absolute top-0 left-0 h-full bg-gradient-to-r from-[#2F3295] to-[#FE619E] rounded-full transition-all duration-700 ease-out"
            style={{ width: `${progress}%` }}
          ></div>
        </div>
        <p className="text-white/50 text-xs mt-2">{Math.round(progress)}%</p>
      </div>
    </div>
  );
}
