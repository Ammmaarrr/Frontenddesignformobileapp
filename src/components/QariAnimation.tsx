import { useEffect, useState } from 'react';

type AnimationState = 'idle' | 'listening' | 'processing' | 'feedback';

interface QariAnimationProps {
  state: AnimationState;
  audioVolume?: number; // 0 to 1
  onComplete?: () => void;
}

export function QariAnimation({ state, audioVolume = 0, onComplete }: QariAnimationProps) {
  const [showText, setShowText] = useState(false);

  useEffect(() => {
    if (state === 'feedback') {
      const timer = setTimeout(() => {
        setShowText(true);
        onComplete?.();
      }, 800);
      return () => clearTimeout(timer);
    } else {
      setShowText(false);
    }
  }, [state, onComplete]);

  // Calculate halo radius based on audio volume
  const haloRadius = 80 + (audioVolume * 40);
  
  // Get animation classes based on state
  const getBreathingClass = () => {
    if (state === 'listening') return 'animate-breathing-fast';
    if (state === 'processing') return '';
    return 'animate-breathing';
  };

  return (
    <div className="relative w-full h-full flex items-center justify-center">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#0f1f18] to-[#1f3a29] rounded-full" />
      
      {/* Processing Phase - Rotating Islamic Pattern */}
      {state === 'processing' && (
        <div className="absolute inset-0 animate-rotate-slow opacity-10">
          <IslamicPattern />
        </div>
      )}

      {/* Audio-Reactive Halo (Listening Phase) */}
      {state === 'listening' && (
        <div
          className="absolute transition-all duration-100 animate-fade-in"
          style={{
            width: haloRadius * 2,
            height: haloRadius * 2,
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(77, 189, 116, 0.3) 0%, rgba(77, 189, 116, 0) 70%)',
            boxShadow: '0 0 60px rgba(77, 189, 116, 0.4)',
          }}
        />
      )}

      {/* Qari Silhouette with Breathing Animation */}
      <div className={`relative z-10 ${getBreathingClass()}`}>
        <QariSilhouette state={state} />
      </div>

      {/* Processing Text */}
      {state === 'processing' && (
        <div className="absolute bottom-8 text-center animate-pulse-text">
          <div className="text-emerald-400 tracking-wider">Analyzing...</div>
        </div>
      )}

      {/* Feedback Text */}
      {state === 'feedback' && showText && (
        <div className="absolute bottom-8 text-center animate-slide-up-fade">
          <div className="bg-gradient-to-r from-amber-400 via-yellow-500 to-amber-400 bg-clip-text text-transparent">
            Let's correct this together.
          </div>
        </div>
      )}
    </div>
  );
}

function QariSilhouette({ state }: { state: AnimationState }) {
  // Get glow animation class based on state
  const getGlowClass = () => {
    if (state === 'listening') return 'animate-glow-fast';
    return 'animate-glow';
  };

  // Hand position for feedback state
  const handY = state === 'feedback' ? -12 : 0;

  return (
    <svg
      width="200"
      height="280"
      viewBox="0 0 200 280"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        {/* Glowing outline filter */}
        <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="4" result="coloredBlur" />
          <feMerge>
            <feMergeNode in="coloredBlur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
        
        {/* Gold gradient for outline */}
        <linearGradient id="goldGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#fbbf24" />
          <stop offset="50%" stopColor="#f59e0b" />
          <stop offset="100%" stopColor="#d97706" />
        </linearGradient>
      </defs>

      {/* Animated glow layer */}
      <g className={getGlowClass()} filter="url(#glow)">
        {/* Turban/Kufi */}
        <path
          d="M 70 40 Q 70 20, 100 20 Q 130 20, 130 40 Q 135 45, 135 55 L 65 55 Q 65 45, 70 40 Z"
          stroke="url(#goldGradient)"
          strokeWidth="3"
          fill="rgba(16, 185, 129, 0.3)"
        />
        
        {/* Head/Neck (no face) */}
        <ellipse
          cx="100"
          cy="80"
          rx="35"
          ry="40"
          stroke="url(#goldGradient)"
          strokeWidth="3"
          fill="rgba(16, 185, 129, 0.3)"
        />
        
        {/* Shoulders */}
        <path
          d="M 65 110 Q 50 120, 40 150 L 40 200 Q 40 210, 50 210 L 70 210 L 70 130 Z"
          stroke="url(#goldGradient)"
          strokeWidth="3"
          fill="rgba(16, 185, 129, 0.3)"
        />
        <path
          d="M 135 110 Q 150 120, 160 150 L 160 200 Q 160 210, 150 210 L 130 210 L 130 130 Z"
          stroke="url(#goldGradient)"
          strokeWidth="3"
          fill="rgba(16, 185, 129, 0.3)"
        />
        
        {/* Robe/Torso */}
        <path
          d="M 70 120 L 70 250 Q 70 260, 80 260 L 120 260 Q 130 260, 130 250 L 130 120 Q 125 115, 100 115 Q 75 115, 70 120 Z"
          stroke="url(#goldGradient)"
          strokeWidth="3"
          fill="rgba(16, 185, 129, 0.3)"
        />
        
        {/* Right Hand (animated in feedback state) */}
        <g 
          className={state === 'feedback' ? 'animate-hand-raise' : ''}
          style={{ transformOrigin: '168px 180px' }}
        >
          {/* Arm */}
          <path
            d="M 130 140 Q 145 145, 155 155 L 165 175"
            stroke="url(#goldGradient)"
            strokeWidth="3"
            fill="none"
          />
          
          {/* Hand */}
          <circle
            cx="168"
            cy="180"
            r="8"
            stroke="url(#goldGradient)"
            strokeWidth="3"
            fill="rgba(16, 185, 129, 0.3)"
          />
          
          {/* Feedback state glow on hand */}
          {state === 'feedback' && (
            <circle
              cx="168"
              cy="180"
              r="12"
              fill="none"
              stroke="#fbbf24"
              strokeWidth="2"
              className="animate-hand-glow"
            />
          )}
        </g>
      </g>
    </svg>
  );
}

function IslamicPattern() {
  return (
    <svg
      width="100%"
      height="100%"
      viewBox="0 0 400 400"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="opacity-100"
    >
      {/* 8-point star pattern */}
      <g transform="translate(200, 200)">
        {/* Outer star points */}
        {[0, 45, 90, 135, 180, 225, 270, 315].map((angle, i) => (
          <g key={i} transform={`rotate(${angle})`}>
            <path
              d="M 0 -80 L 15 -40 L 0 -35 L -15 -40 Z"
              fill="rgba(251, 191, 36, 0.15)"
              stroke="rgba(251, 191, 36, 0.3)"
              strokeWidth="1"
            />
          </g>
        ))}
        
        {/* Inner octagon */}
        <path
          d="M 30 -30 L 30 30 L -30 30 L -30 -30 Z"
          fill="none"
          stroke="rgba(251, 191, 36, 0.2)"
          strokeWidth="2"
          transform="rotate(22.5)"
        />
        
        {/* Center circle */}
        <circle
          cx="0"
          cy="0"
          r="20"
          fill="none"
          stroke="rgba(251, 191, 36, 0.25)"
          strokeWidth="2"
        />
        
        {/* Decorative lines */}
        {[0, 90, 180, 270].map((angle, i) => (
          <line
            key={i}
            x1="0"
            y1="0"
            x2="0"
            y2="-70"
            stroke="rgba(251, 191, 36, 0.15)"
            strokeWidth="1"
            transform={`rotate(${angle})`}
          />
        ))}
      </g>
    </svg>
  );
}
