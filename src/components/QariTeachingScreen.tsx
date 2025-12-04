import { useEffect, useState, useRef } from 'react';
import { QariAnimation } from './QariAnimation';

type AnimationState = 'idle' | 'listening' | 'processing' | 'feedback';

interface QariTeachingScreenProps {
  initialState?: AnimationState;
  isRecording?: boolean;
  isProcessing?: boolean;
  showFeedback?: boolean;
  onComplete?: () => void;
}

export function QariTeachingScreen({ 
  initialState = 'idle',
  isRecording = false,
  isProcessing = false,
  showFeedback = false,
  onComplete 
}: QariTeachingScreenProps) {
  const [animationState, setAnimationState] = useState<AnimationState>(initialState);
  const [audioVolume, setAudioVolume] = useState(0);
  const [micPermission, setMicPermission] = useState<'granted' | 'denied' | 'prompt'>('prompt');
  const [useSimulatedAudio, setUseSimulatedAudio] = useState(false);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const animationFrameRef = useRef<number | null>(null);
  const simulationIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Update state based on props
  useEffect(() => {
    if (showFeedback) {
      setAnimationState('feedback');
      stopAudioAnalysis();
      stopSimulatedAudio();
    } else if (isProcessing) {
      setAnimationState('processing');
      stopAudioAnalysis();
      stopSimulatedAudio();
    } else if (isRecording) {
      setAnimationState('listening');
      if (micPermission === 'denied' || useSimulatedAudio) {
        startSimulatedAudio();
      } else {
        startAudioAnalysis();
      }
    } else {
      setAnimationState('idle');
      stopAudioAnalysis();
      stopSimulatedAudio();
    }
  }, [isRecording, isProcessing, showFeedback, micPermission, useSimulatedAudio]);

  const startSimulatedAudio = () => {
    // Simulate audio volume changes for demo purposes
    stopSimulatedAudio();
    
    let time = 0;
    simulationIntervalRef.current = setInterval(() => {
      time += 0.1;
      // Create a wave pattern that simulates voice
      const volume = Math.abs(Math.sin(time * 2)) * 0.7 + Math.random() * 0.3;
      setAudioVolume(Math.min(volume, 1));
    }, 100);
  };

  const stopSimulatedAudio = () => {
    if (simulationIntervalRef.current) {
      clearInterval(simulationIntervalRef.current);
      simulationIntervalRef.current = null;
    }
    setAudioVolume(0);
  };

  const startAudioAnalysis = async () => {
    try {
      // Request microphone access
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      
      setMicPermission('granted');
      
      // Create audio context and analyser
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      const analyser = audioContext.createAnalyser();
      const microphone = audioContext.createMediaStreamSource(stream);
      
      analyser.fftSize = 256;
      microphone.connect(analyser);
      
      audioContextRef.current = audioContext;
      analyserRef.current = analyser;
      
      // Start analyzing audio volume
      analyzeAudioVolume();
    } catch (error) {
      console.log('Microphone access not available, using simulated audio');
      setMicPermission('denied');
      setUseSimulatedAudio(true);
      startSimulatedAudio();
    }
  };

  const analyzeAudioVolume = () => {
    if (!analyserRef.current) return;
    
    const dataArray = new Uint8Array(analyserRef.current.frequencyBinCount);
    
    const updateVolume = () => {
      if (!analyserRef.current || animationState !== 'listening') {
        return;
      }
      
      analyserRef.current.getByteFrequencyData(dataArray);
      
      // Calculate average volume
      const sum = dataArray.reduce((a, b) => a + b, 0);
      const average = sum / dataArray.length;
      const normalizedVolume = Math.min(average / 128, 1); // Normalize to 0-1
      
      setAudioVolume(normalizedVolume);
      
      animationFrameRef.current = requestAnimationFrame(updateVolume);
    };
    
    updateVolume();
  };

  const stopAudioAnalysis = () => {
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
    }
    
    if (audioContextRef.current) {
      audioContextRef.current.close();
      audioContextRef.current = null;
    }
    
    analyserRef.current = null;
    setAudioVolume(0);
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stopAudioAnalysis();
      stopSimulatedAudio();
    };
  }, []);

  return (
    <div className="relative w-full h-full min-h-[500px] flex items-center justify-center">
      {/* Ambient background effects */}
      <div className="absolute inset-0 bg-gradient-to-b from-emerald-950 via-emerald-900 to-teal-900 opacity-95" />
      
      {/* Radial gradient overlay */}
      <div 
        className="absolute inset-0" 
        style={{
          background: 'radial-gradient(circle at center, rgba(16, 185, 129, 0.1) 0%, transparent 70%)'
        }}
      />
      
      {/* Main animation container */}
      <div className="relative w-80 h-80 animate-fade-in-scale">
        <QariAnimation 
          state={animationState} 
          audioVolume={audioVolume}
          onComplete={onComplete}
        />
      </div>

      {/* Decorative corner patterns */}
      <CornerPattern className="absolute top-6 left-6" rotation={0} />
      <CornerPattern className="absolute top-6 right-6" rotation={90} />
      <CornerPattern className="absolute bottom-6 left-6" rotation={270} />
      <CornerPattern className="absolute bottom-6 right-6" rotation={180} />

      {/* State indicators for demo purposes */}
      <div className="absolute top-6 left-1/2 -translate-x-1/2 bg-black/30 backdrop-blur-sm px-4 py-2 rounded-full">
        <div className="text-emerald-300 text-sm flex items-center gap-2">
          <div className={`w-2 h-2 rounded-full ${
            animationState === 'idle' ? 'bg-gray-400' :
            animationState === 'listening' ? 'bg-green-400 animate-pulse' :
            animationState === 'processing' ? 'bg-blue-400 animate-pulse' :
            'bg-amber-400 animate-pulse'
          }`} />
          <span className="capitalize">{animationState}</span>
          {useSimulatedAudio && animationState === 'listening' && (
            <span className="text-amber-300 text-xs ml-1">(simulated)</span>
          )}
        </div>
      </div>

      {/* Microphone permission notice */}
      {micPermission === 'denied' && (
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 max-w-sm bg-amber-900/80 backdrop-blur-sm px-4 py-3 rounded-xl text-amber-100 text-sm text-center animate-slide-up-fade">
          <div className="mb-1">🎤 Microphone access not available</div>
          <div className="text-xs text-amber-200">Using simulated audio for demonstration</div>
        </div>
      )}
    </div>
  );
}

function CornerPattern({ className, rotation }: { className?: string; rotation: number }) {
  return (
    <svg
      width="60"
      height="60"
      viewBox="0 0 60 60"
      className={className}
      style={{ transform: `rotate(${rotation}deg)` }}
    >
      <path
        d="M 5 5 L 5 25 M 5 5 L 25 5"
        stroke="rgba(251, 191, 36, 0.3)"
        strokeWidth="2"
        fill="none"
        strokeLinecap="round"
      />
      <path
        d="M 10 10 L 10 20 M 10 10 L 20 10"
        stroke="rgba(251, 191, 36, 0.2)"
        strokeWidth="1.5"
        fill="none"
        strokeLinecap="round"
      />
      <circle
        cx="5"
        cy="5"
        r="2"
        fill="rgba(251, 191, 36, 0.4)"
      />
    </svg>
  );
}