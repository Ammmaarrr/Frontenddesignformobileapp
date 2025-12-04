import { useState } from 'react';
import { ArrowLeft, Play, RotateCcw, CheckCircle2, AlertCircle, Home, Volume2 } from 'lucide-react';
import { RecitationResult } from '../App';

interface ResultsScreenProps {
  result: RecitationResult;
  onRetry: () => void;
  onBackToHome: () => void;
}

const errorTypeConfig = {
  substituted_letter: {
    color: 'bg-orange-500',
    borderColor: 'border-orange-200',
    textColor: 'text-orange-900',
    bgLight: 'bg-orange-50',
    label: 'Wrong Letter',
    icon: '🔤'
  },
  madd_short: {
    color: 'bg-blue-500',
    borderColor: 'border-blue-200',
    textColor: 'text-blue-900',
    bgLight: 'bg-blue-50',
    label: 'Madd Too Short',
    icon: '⏱️'
  },
  madd_long: {
    color: 'bg-blue-500',
    borderColor: 'border-blue-200',
    textColor: 'text-blue-900',
    bgLight: 'bg-blue-50',
    label: 'Madd Too Long',
    icon: '⏱️'
  },
  ghunnah_missing: {
    color: 'bg-purple-500',
    borderColor: 'border-purple-200',
    textColor: 'text-purple-900',
    bgLight: 'bg-purple-50',
    label: 'Missing Ghunnah',
    icon: '👃'
  },
  qalqalah_missed: {
    color: 'bg-pink-500',
    borderColor: 'border-pink-200',
    textColor: 'text-pink-900',
    bgLight: 'bg-pink-50',
    label: 'Missing Qalqalah',
    icon: '💥'
  },
  missing_word: {
    color: 'bg-red-500',
    borderColor: 'border-red-200',
    textColor: 'text-red-900',
    bgLight: 'bg-red-50',
    label: 'Missing Word',
    icon: '❌'
  }
};

export function ResultsScreen({ result, onRetry, onBackToHome }: ResultsScreenProps) {
  const [expandedError, setExpandedError] = useState<number | null>(null);
  const [fixedErrors, setFixedErrors] = useState<Set<number>>(new Set());

  const handleMarkFixed = (index: number) => {
    setFixedErrors(prev => new Set([...prev, index]));
  };

  const getScoreColor = (score: number) => {
    if (score >= 0.9) return 'text-emerald-600';
    if (score >= 0.75) return 'text-yellow-600';
    return 'text-orange-600';
  };

  const getScoreLabel = (score: number) => {
    if (score >= 0.9) return 'Excellent';
    if (score >= 0.75) return 'Good';
    return 'Needs Practice';
  };

  return (
    <div className="min-h-screen p-6 pb-24">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <button 
          onClick={onBackToHome}
          className="p-3 bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow"
        >
          <ArrowLeft className="w-5 h-5 text-emerald-600" />
        </button>
        <h2 className="text-emerald-900">Analysis Results</h2>
        <button 
          onClick={onBackToHome}
          className="p-3 bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow"
        >
          <Home className="w-5 h-5 text-emerald-600" />
        </button>
      </div>

      {/* Overall Score Card */}
      <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <div className="text-emerald-700 mb-1">Overall Score</div>
            <div className={`text-4xl ${getScoreColor(result.overall_score)}`}>
              {Math.round(result.overall_score * 100)}%
            </div>
            <div className="text-emerald-600 mt-1">{getScoreLabel(result.overall_score)}</div>
          </div>
          <div className="w-24 h-24 rounded-full bg-gradient-to-br from-emerald-100 to-teal-100 flex items-center justify-center">
            {result.overall_score >= 0.9 ? (
              <CheckCircle2 className="w-12 h-12 text-emerald-600" />
            ) : (
              <AlertCircle className="w-12 h-12 text-yellow-600" />
            )}
          </div>
        </div>
        
        <div className="h-2 bg-emerald-100 rounded-full overflow-hidden">
          <div 
            className={`h-full transition-all duration-1000 ${
              result.overall_score >= 0.9 ? 'bg-emerald-600' :
              result.overall_score >= 0.75 ? 'bg-yellow-500' : 'bg-orange-500'
            }`}
            style={{ width: `${result.overall_score * 100}%` }}
          />
        </div>

        <div className="mt-4 p-3 bg-emerald-50 rounded-xl">
          <div className="text-emerald-700 mb-1">Matched Ayah</div>
          <div className="text-emerald-900">
            Surah {result.matched_ayah.surah}, Ayah {result.matched_ayah.ayah}
          </div>
          <div className="text-emerald-600">
            Confidence: {Math.round(result.matched_ayah.confidence * 100)}%
          </div>
        </div>
      </div>

      {/* Recommendation */}
      {result.recommendation && (
        <div className="bg-blue-50 border-2 border-blue-200 rounded-xl p-4 mb-6">
          <div className="flex gap-3">
            <div className="text-2xl">💡</div>
            <div>
              <div className="text-blue-900 mb-1">Recommendation</div>
              <p className="text-blue-800">{result.recommendation}</p>
            </div>
          </div>
        </div>
      )}

      {/* Errors Section */}
      {result.errors.length > 0 ? (
        <div className="mb-6">
          <h3 className="text-emerald-900 mb-4">
            Areas to Improve ({result.errors.length})
          </h3>
          
          <div className="space-y-3">
            {result.errors.map((error, index) => {
              const config = errorTypeConfig[error.type as keyof typeof errorTypeConfig] || errorTypeConfig.substituted_letter;
              const isExpanded = expandedError === index;
              const isFixed = fixedErrors.has(index);

              return (
                <div 
                  key={index}
                  className={`bg-white rounded-xl shadow-sm border-2 ${config.borderColor} overflow-hidden transition-all ${
                    isFixed ? 'opacity-60' : ''
                  }`}
                >
                  <button
                    onClick={() => setExpandedError(isExpanded ? null : index)}
                    className="w-full p-4 text-left"
                  >
                    <div className="flex items-start gap-3">
                      <div className="text-2xl">{config.icon}</div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-2">
                          <span className={config.textColor}>{config.label}</span>
                          {isFixed && (
                            <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                          )}
                        </div>
                        <div className="text-emerald-700">
                          {error.letter && (
                            <span className="text-2xl ml-2">{error.letter}</span>
                          )}
                          {error.expected && error.detected && (
                            <span className="text-sm"> Expected: {error.expected}, Detected: {error.detected}</span>
                          )}
                        </div>
                        <div className="text-emerald-600 mt-1">
                          At {error.start_time.toFixed(2)}s · Confidence: {Math.round(error.confidence * 100)}%
                        </div>
                      </div>
                    </div>
                  </button>

                  {isExpanded && (
                    <div className={`${config.bgLight} p-4 border-t-2 ${config.borderColor} animate-in slide-in-from-top-2 duration-200`}>
                      <div className="mb-4">
                        <div className={`${config.textColor} mb-2`}>Suggestion</div>
                        <p className="text-emerald-800">{error.suggestion}</p>
                      </div>

                      <div className="space-y-2">
                        {error.correction_audio_url && (
                          <button className="w-full bg-white p-3 rounded-lg shadow-sm hover:shadow-md transition-all flex items-center justify-center gap-2 border-2 border-emerald-200">
                            <Volume2 className="w-5 h-5 text-emerald-600" />
                            <span className="text-emerald-900">Play Correct Pronunciation</span>
                          </button>
                        )}
                        
                        {!isFixed && (
                          <button 
                            onClick={() => handleMarkFixed(index)}
                            className={`w-full ${config.color} text-white p-3 rounded-lg shadow-sm hover:shadow-md transition-all flex items-center justify-center gap-2`}
                          >
                            <RotateCcw className="w-5 h-5" />
                            <span>Practice This Error</span>
                          </button>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        <div className="bg-emerald-50 border-2 border-emerald-200 rounded-xl p-6 mb-6 text-center">
          <CheckCircle2 className="w-16 h-16 text-emerald-600 mx-auto mb-3" />
          <h3 className="text-emerald-900 mb-2">Perfect Recitation!</h3>
          <p className="text-emerald-700">No errors detected. Excellent work!</p>
        </div>
      )}

      {/* Action Buttons */}
      <div className="fixed bottom-6 left-6 right-6 space-y-3">
        <button
          onClick={onRetry}
          className="w-full bg-emerald-600 text-white p-5 rounded-2xl shadow-lg hover:bg-emerald-700 transition-all flex items-center justify-center gap-3"
        >
          <RotateCcw className="w-6 h-6" />
          <span>Try Again</span>
        </button>
        
        <button
          onClick={onBackToHome}
          className="w-full bg-white text-emerald-900 p-4 rounded-xl shadow-sm hover:shadow-md transition-all border-2 border-emerald-200"
        >
          Choose Another Ayah
        </button>
      </div>
    </div>
  );
}
