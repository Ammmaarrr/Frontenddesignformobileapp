import { useState } from 'react';
import { Home } from './components/Home';
import { RecordingScreen } from './components/RecordingScreen';
import { ResultsScreen } from './components/ResultsScreen';
import { ProgressScreen } from './components/ProgressScreen';
import { QariTeachingScreen } from './components/QariTeachingScreen';
import { QariDemoScreen } from './components/QariDemoScreen';
import { QariSessionScreen } from './components/QariSessionScreen';

export type Screen = 'home' | 'recording' | 'results' | 'progress' | 'qari-demo' | 'qari-session';

export interface RecitationResult {
  matched_ayah: {
    surah: number;
    ayah: number;
    confidence: number;
  };
  errors: Array<{
    type: string;
    letter?: string;
    expected?: string;
    detected?: string;
    start_time: number;
    end_time: number;
    confidence: number;
    suggestion: string;
    correction_audio_url?: string;
  }>;
  overall_score: number;
  recommendation: string;
}

function App() {
  const [currentScreen, setCurrentScreen] = useState<Screen>('home');
  const [selectedSurah, setSelectedSurah] = useState<number | null>(null);
  const [selectedAyah, setSelectedAyah] = useState<number | null>(null);
  const [result, setResult] = useState<RecitationResult | null>(null);

  const handleStartRecording = (surah: number, ayah: number) => {
    setSelectedSurah(surah);
    setSelectedAyah(ayah);
    setCurrentScreen('recording');
  };

  const handleAnalysisComplete = (analysisResult: RecitationResult) => {
    setResult(analysisResult);
    setCurrentScreen('results');
  };

  const handleRetry = () => {
    setCurrentScreen('recording');
  };

  const handleBackToHome = () => {
    setCurrentScreen('home');
    setResult(null);
    setSelectedSurah(null);
    setSelectedAyah(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-emerald-50 to-teal-50">
      {currentScreen === 'home' && (
        <Home 
          onStartRecording={handleStartRecording}
          onViewProgress={() => setCurrentScreen('progress')}
          onViewQariDemo={() => setCurrentScreen('qari-demo')}
          onStartSession={() => setCurrentScreen('qari-session')}
        />
      )}
      
      {currentScreen === 'recording' && (
        <RecordingScreen
          surah={selectedSurah!}
          ayah={selectedAyah!}
          onAnalysisComplete={handleAnalysisComplete}
          onBack={handleBackToHome}
        />
      )}
      
      {currentScreen === 'results' && result && (
        <ResultsScreen
          result={result}
          onRetry={handleRetry}
          onBackToHome={handleBackToHome}
        />
      )}
      
      {currentScreen === 'progress' && (
        <ProgressScreen onBack={handleBackToHome} />
      )}
      
      {currentScreen === 'qari-demo' && (
        <QariDemoScreen 
          onBack={() => setCurrentScreen('home')}
        />
      )}
      
      {currentScreen === 'qari-session' && (
        <QariSessionScreen 
          onBack={() => setCurrentScreen('home')}
          onComplete={() => setCurrentScreen('home')}
        />
      )}
    </div>
  );
}

export default App;