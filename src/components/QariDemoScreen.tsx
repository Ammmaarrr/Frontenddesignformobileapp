import { useState } from 'react';
import { ArrowLeft, Play, Mic, Loader, MessageCircle } from 'lucide-react';
import { QariTeachingScreen } from './QariTeachingScreen';

interface QariDemoScreenProps {
  onBack: () => void;
}

type DemoState = 'idle' | 'listening' | 'processing' | 'feedback';

export function QariDemoScreen({ onBack }: QariDemoScreenProps) {
  const [currentState, setCurrentState] = useState<DemoState>('idle');
  const [autoMode, setAutoMode] = useState(false);

  const runAutoDemo = async () => {
    setAutoMode(true);
    
    // Idle state (2 seconds)
    setCurrentState('idle');
    await delay(2000);
    
    // Listening state (4 seconds)
    setCurrentState('listening');
    await delay(4000);
    
    // Processing state (3 seconds)
    setCurrentState('processing');
    await delay(3000);
    
    // Feedback state (3 seconds)
    setCurrentState('feedback');
    await delay(3000);
    
    // Back to idle
    setCurrentState('idle');
    setAutoMode(false);
  };

  const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

  const stateDescriptions = {
    idle: {
      title: 'Idle State',
      description: 'Qari teacher is ready and waiting. Notice the gentle breathing animation and soft glow pulse.',
      icon: '🧘',
    },
    listening: {
      title: 'Listening State',
      description: 'Qari is actively listening to your recitation. The halo expands with your voice volume. Try speaking!',
      icon: '👂',
    },
    processing: {
      title: 'Processing State',
      description: 'Analyzing your recitation with tajweed rules. Notice the rotating Islamic geometric pattern.',
      icon: '⚙️',
    },
    feedback: {
      title: 'Feedback State',
      description: 'Qari raises hand to give guidance. Ready to teach and correct your recitation.',
      icon: '🤲',
    },
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-emerald-50 to-teal-50">
      {/* Header */}
      <div className="p-6 flex items-center justify-between bg-white/50 backdrop-blur-sm border-b border-emerald-100">
        <button 
          onClick={onBack}
          className="p-3 bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow"
        >
          <ArrowLeft className="w-5 h-5 text-emerald-600" />
        </button>
        <h2 className="text-emerald-900">Qari Teacher Animation</h2>
        <div className="w-12" /> {/* Spacer */}
      </div>

      {/* Animation Display */}
      <div className="relative h-[500px] overflow-hidden">
        <QariTeachingScreen
          isRecording={currentState === 'listening'}
          isProcessing={currentState === 'processing'}
          showFeedback={currentState === 'feedback'}
        />
      </div>

      {/* State Description */}
      <div
        key={currentState}
        className="mx-6 mt-6 bg-white rounded-2xl shadow-lg p-6 animate-slide-up-fade"
      >
        <div className="flex items-start gap-4">
          <div className="text-4xl">{stateDescriptions[currentState].icon}</div>
          <div className="flex-1">
            <h3 className="text-emerald-900 mb-2">{stateDescriptions[currentState].title}</h3>
            <p className="text-emerald-700">{stateDescriptions[currentState].description}</p>
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="p-6 space-y-3">
        <div className="bg-white rounded-xl shadow-sm p-4">
          <div className="text-emerald-700 mb-3">Manual Controls</div>
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => setCurrentState('idle')}
              disabled={autoMode}
              className={`p-3 rounded-lg transition-all ${
                currentState === 'idle' && !autoMode
                  ? 'bg-emerald-600 text-white shadow-md'
                  : 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
              } disabled:opacity-50`}
            >
              <div className="flex items-center justify-center gap-2">
                <div className="w-2 h-2 bg-current rounded-full" />
                <span>Idle</span>
              </div>
            </button>
            
            <button
              onClick={() => setCurrentState('listening')}
              disabled={autoMode}
              className={`p-3 rounded-lg transition-all ${
                currentState === 'listening' && !autoMode
                  ? 'bg-emerald-600 text-white shadow-md'
                  : 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
              } disabled:opacity-50`}
            >
              <div className="flex items-center justify-center gap-2">
                <Mic className="w-4 h-4" />
                <span>Listening</span>
              </div>
            </button>
            
            <button
              onClick={() => setCurrentState('processing')}
              disabled={autoMode}
              className={`p-3 rounded-lg transition-all ${
                currentState === 'processing' && !autoMode
                  ? 'bg-emerald-600 text-white shadow-md'
                  : 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
              } disabled:opacity-50`}
            >
              <div className="flex items-center justify-center gap-2">
                <Loader className="w-4 h-4" />
                <span>Processing</span>
              </div>
            </button>
            
            <button
              onClick={() => setCurrentState('feedback')}
              disabled={autoMode}
              className={`p-3 rounded-lg transition-all ${
                currentState === 'feedback' && !autoMode
                  ? 'bg-emerald-600 text-white shadow-md'
                  : 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
              } disabled:opacity-50`}
            >
              <div className="flex items-center justify-center gap-2">
                <MessageCircle className="w-4 h-4" />
                <span>Feedback</span>
              </div>
            </button>
          </div>
        </div>

        <button
          onClick={runAutoDemo}
          disabled={autoMode}
          className="w-full bg-gradient-to-r from-amber-500 to-orange-500 text-white p-5 rounded-2xl shadow-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3"
        >
          <Play className="w-5 h-5" />
          <span>{autoMode ? 'Running Demo...' : 'Run Full Demo Sequence'}</span>
        </button>

        {/* Info Box */}
        <div className="bg-blue-50 border-2 border-blue-200 rounded-xl p-4">
          <div className="flex gap-3">
            <div className="text-2xl">💡</div>
            <div>
              <div className="text-blue-900 mb-1">How It Works</div>
              <ul className="text-blue-800 text-sm space-y-1">
                <li>• <strong>Idle:</strong> Breathing effect (3% scale, 2.4s cycle)</li>
                <li>• <strong>Listening:</strong> Audio-reactive halo (expands with voice)</li>
                <li>• <strong>Processing:</strong> Rotating Islamic pattern (10°/s)</li>
                <li>• <strong>Feedback:</strong> Hand raise gesture + golden text</li>
              </ul>
              <div className="mt-2 text-xs text-blue-700 bg-blue-100 p-2 rounded">
                💡 If microphone access is blocked, the app automatically uses simulated audio to demonstrate the listening animation.
              </div>
            </div>
          </div>
        </div>

        {/* Technical Details */}
        <details className="bg-emerald-50 rounded-xl overflow-hidden">
          <summary className="p-4 cursor-pointer text-emerald-900 hover:bg-emerald-100 transition-colors">
            Technical Implementation Details
          </summary>
          <div className="p-4 pt-0 text-emerald-800 text-sm space-y-2">
            <p><strong>Animation Library:</strong> CSS Animations + Keyframes</p>
            <p><strong>Audio Analysis:</strong> Web Audio API (real-time FFT)</p>
            <p><strong>Graphics:</strong> SVG with animated paths and filters</p>
            <p><strong>Effects:</strong> Gaussian blur filters for glow, gradient strokes</p>
            <p><strong>State Management:</strong> React useState with prop-driven transitions</p>
          </div>
        </details>
      </div>
    </div>
  );
}