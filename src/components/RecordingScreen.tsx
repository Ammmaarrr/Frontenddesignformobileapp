import { useState, useEffect } from 'react';
import { ArrowLeft, Mic, Square, Play, AlertCircle } from 'lucide-react';
import { RecitationResult } from '../App';
import { useAudioRecorder } from '../hooks/useAudioRecorder';
import { apiService } from '../services/api';

interface RecordingScreenProps {
  surah: number;
  ayah: number;
  onAnalysisComplete: (result: RecitationResult) => void;
  onBack: () => void;
}

type RecordingState = 'idle' | 'recording' | 'recorded' | 'analyzing';

export function RecordingScreen({ surah, ayah, onAnalysisComplete, onBack }: RecordingScreenProps) {
  const [recordingState, setRecordingState] = useState<RecordingState>('idle');
  const [waveformBars, setWaveformBars] = useState<number[]>(Array(40).fill(0.1));
  const [apiError, setApiError] = useState<string | null>(null);

  const {
    isRecording,
    recordedBlob,
    recordingTime,
    startRecording: startAudioRecording,
    stopRecording: stopAudioRecording,
    resetRecording,
    playRecording,
    isPlaying,
    error: recorderError,
    audioLevel,
  } = useAudioRecorder({
    maxDuration: 12,
    onRecordingComplete: () => {
      setRecordingState('recorded');
    },
  });

  // Update waveform based on audio level
  useEffect(() => {
    if (isRecording) {
      const interval = setInterval(() => {
        setWaveformBars(prev =>
          prev.map(() => Math.random() * audioLevel * 1.5 + 0.1)
        );
      }, 100);
      return () => clearInterval(interval);
    } else if (recordingState === 'idle') {
      setWaveformBars(Array(40).fill(0.1));
    }
  }, [isRecording, audioLevel, recordingState]);

  const handleStartRecording = async () => {
    setApiError(null);
    setRecordingState('recording');
    await startAudioRecording();
  };

  const handleStopRecording = () => {
    stopAudioRecording();
    setRecordingState('recorded');
    setWaveformBars(prev => prev.map(v => v * 0.5));
  };

  const handleAnalyze = async () => {
    if (!recordedBlob) {
      setApiError('No recording available');
      return;
    }

    setRecordingState('analyzing');
    setApiError(null);

    try {
      const result = await apiService.analyzeRecitation(recordedBlob, surah, ayah);
      onAnalysisComplete(result);
    } catch (error) {
      console.error('Analysis error:', error);
      setApiError(error instanceof Error ? error.message : 'Failed to analyze recitation');
      setRecordingState('recorded');
    }
  };

  const handlePlayback = () => {
    playRecording();
  };

  const handleRecordAgain = () => {
    resetRecording();
    setRecordingState('idle');
    setApiError(null);
  };

  const displayError = apiError || recorderError;

  return (
    <div className="min-h-screen p-6 flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <button 
          onClick={onBack}
          className="p-3 bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow"
          disabled={recordingState === 'analyzing'}
        >
          <ArrowLeft className="w-5 h-5 text-emerald-600" />
        </button>
        <div className="text-center">
          <div className="text-emerald-700">Surah {surah}, Ayah {ayah}</div>
        </div>
        <div className="w-12" /> {/* Spacer */}
      </div>

      {/* Teacher Avatar */}
      <div className="flex justify-center mb-8">
        <div className="w-24 h-24 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-full shadow-lg flex items-center justify-center">
          <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center">
            <BookOpen className="w-10 h-10 text-emerald-600" />
          </div>
        </div>
      </div>

      {/* Instructions or Status */}
      <div className="text-center mb-8">
        {recordingState === 'idle' && (
          <div>
            <h2 className="text-emerald-900 mb-2">Ready to Record</h2>
            <p className="text-emerald-700">Tap the microphone to begin your recitation</p>
            <p className="text-emerald-600 mt-2">Maximum duration: 12 seconds</p>
          </div>
        )}
        {recordingState === 'recording' && (
          <div>
            <h2 className="text-emerald-900 mb-2">Recording...</h2>
            <p className="text-emerald-700 text-3xl tabular-nums">
              {recordingTime.toFixed(1)}s
            </p>
            <div className="w-24 h-1 bg-emerald-200 rounded-full mx-auto mt-3 overflow-hidden">
              <div 
                className="h-full bg-emerald-600 transition-all duration-100"
                style={{ width: `${(recordingTime / 12) * 100}%` }}
              />
            </div>
          </div>
        )}
        {recordingState === 'recorded' && (
          <div>
            <h2 className="text-emerald-900 mb-2">Recording Complete</h2>
            <p className="text-emerald-700">Duration: {recordingTime.toFixed(1)}s</p>
            <p className="text-emerald-600 mt-2">Review or analyze your recitation</p>
          </div>
        )}
        {recordingState === 'analyzing' && (
          <div>
            <h2 className="text-emerald-900 mb-2">Analyzing...</h2>
            <p className="text-emerald-700">Checking pronunciation and tajweed rules</p>
            <div className="flex justify-center gap-2 mt-4">
              <div className="w-2 h-2 bg-emerald-600 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
              <div className="w-2 h-2 bg-emerald-600 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
              <div className="w-2 h-2 bg-emerald-600 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
            </div>
          </div>
        )}
      </div>

      {/* Waveform Visualization */}
      <div className="flex-1 flex items-center justify-center mb-8">
        <div className="flex items-end gap-1 h-48">
          {waveformBars.map((height, i) => (
            <div
              key={i}
              className={`w-1.5 rounded-full transition-all duration-100 ${
                recordingState === 'recording' ? 'bg-emerald-500' : 'bg-emerald-300'
              }`}
              style={{ 
                height: `${height * 100}%`,
                opacity: recordingState === 'idle' ? 0.3 : 1
              }}
            />
          ))}
        </div>
      </div>

      {/* Control Buttons */}
      <div className="space-y-3">
        {recordingState === 'idle' && (
          <button
            onClick={handleStartRecording}
            className="w-full bg-emerald-600 text-white p-6 rounded-2xl shadow-lg hover:bg-emerald-700 transition-all flex items-center justify-center gap-3"
          >
            <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center">
              <Mic className="w-8 h-8 text-emerald-600" />
            </div>
            <span className="text-xl">Start Recording</span>
          </button>
        )}

        {recordingState === 'recording' && (
          <button
            onClick={handleStopRecording}
            className="w-full bg-red-600 text-white p-6 rounded-2xl shadow-lg hover:bg-red-700 transition-all flex items-center justify-center gap-3 animate-pulse"
          >
            <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center">
              <Square className="w-8 h-8 text-red-600 fill-current" />
            </div>
            <span className="text-xl">Stop Recording</span>
          </button>
        )}

        {recordingState === 'recorded' && (
          <>
            <button
              onClick={handlePlayback}
              disabled={isPlaying}
              className="w-full bg-white text-emerald-900 p-4 rounded-xl shadow-sm hover:shadow-md transition-all flex items-center justify-center gap-3 border-2 border-emerald-200 disabled:opacity-50"
            >
              <Play className="w-5 h-5 text-emerald-600" />
              <span>{isPlaying ? 'Playing...' : 'Play Recording'}</span>
            </button>
            <button
              onClick={handleAnalyze}
              className="w-full bg-emerald-600 text-white p-6 rounded-2xl shadow-lg hover:bg-emerald-700 transition-all"
            >
              Analyze Recitation
            </button>
            <button
              onClick={handleRecordAgain}
              className="w-full bg-white text-emerald-900 p-4 rounded-xl shadow-sm hover:shadow-md transition-all border-2 border-emerald-200"
            >
              Record Again
            </button>
          </>
        )}

        {/* Error Display */}
        {displayError && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-red-700 font-medium">Error</p>
              <p className="text-red-600 text-sm">{displayError}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function BookOpen({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
    </svg>
  );
}
