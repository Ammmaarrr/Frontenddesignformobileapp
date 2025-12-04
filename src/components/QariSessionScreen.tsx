import { useState, useEffect } from 'react';
import { ArrowLeft, Mic, Volume2, RotateCcw, CheckCircle2, XCircle, Sparkles } from 'lucide-react';
import { QariTeachingScreen } from './QariTeachingScreen';

interface QariSessionScreenProps {
  onBack: () => void;
  onComplete: () => void;
}

type SessionPhase = 
  | 'welcome'
  | 'instruction'
  | 'listening'
  | 'feedback'
  | 'correction'
  | 'letter-by-letter'
  | 'praise'
  | 'retry'
  | 'full-ayah'
  | 'session-feedback'
  | 'completion';

interface SessionStep {
  phase: SessionPhase;
  qariMessage: string;
  animationState: 'idle' | 'listening' | 'processing' | 'feedback';
  action?: 'play-audio' | 'record' | 'highlight-letter' | 'wait' | 'auto-advance';
  highlightedText?: string;
  audioFile?: string;
  duration?: number; // in ms
}

const surahText = {
  name: 'Al-Fatihah',
  ayahs: [
    { id: 1, arabic: 'بِسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ', transliteration: 'Bismillāhi r-raḥmāni r-raḥīm' },
    { id: 2, arabic: 'ٱلْحَمْدُ لِلَّهِ رَبِّ ٱلْعَٰلَمِينَ', transliteration: 'Al-ḥamdu lillāhi rabbi l-ʿālamīn' },
    { id: 3, arabic: 'ٱلرَّحْمَٰنِ ٱلرَّحِيمِ', transliteration: 'Ar-raḥmāni r-raḥīm' },
    { id: 4, arabic: 'مَٰلِكِ يَوْمِ ٱلدِّينِ', transliteration: 'Māliki yawmi d-dīn' },
    { id: 5, arabic: 'إِيَّاكَ نَعْبُدُ وَإِيَّاكَ نَسْتَعِينُ', transliteration: 'Iyyāka naʿbudu wa-iyyāka nastaʿīn' },
  ]
};

export function QariSessionScreen({ onBack, onComplete }: QariSessionScreenProps) {
  const [currentPhase, setCurrentPhase] = useState<SessionPhase>('welcome');
  const [currentAyahIndex, setCurrentAyahIndex] = useState(0);
  const [qariMessage, setQariMessage] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [showFeedback, setShowFeedback] = useState(false);
  const [attemptCount, setAttemptCount] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);
  const [highlightedLetter, setHighlightedLetter] = useState<number | null>(null);
  const [sessionScore, setSessionScore] = useState(0);
  const [userProgress, setUserProgress] = useState(0);
  const [mistakeType, setMistakeType] = useState<string | null>(null);

  // Session flow
  useEffect(() => {
    startSession();
  }, []);

  const startSession = () => {
    setCurrentPhase('welcome');
    setQariMessage('Assalamu Alaikum, beta. Today we will practice Surah Al-Fatihah together. Sit comfortably, take a deep breath, and let\'s begin slowly.');
    
    setTimeout(() => {
      setCurrentPhase('instruction');
      setQariMessage('When you start reciting, I will listen carefully. Don\'t rush, recite slowly, and focus on each letter.');
    }, 5000);
  };

  const startListening = () => {
    setCurrentPhase('listening');
    setQariMessage('I am listening... recite clearly and slowly.');
    setIsRecording(true);
    setAttemptCount(prev => prev + 1);

    // Simulate recording for 5 seconds
    setTimeout(() => {
      setIsRecording(false);
      processRecitation();
    }, 5000);
  };

  const processRecitation = () => {
    setCurrentPhase('listening');
    setIsProcessing(true);
    setQariMessage('Analyzing your recitation...');

    setTimeout(() => {
      setIsProcessing(false);
      
      // Simulate random mistake detection (70% chance of mistake on first attempt)
      const hasMistake = attemptCount === 1 ? Math.random() > 0.3 : Math.random() > 0.7;
      
      if (hasMistake) {
        provideFeedback();
      } else {
        provideCorrectFeedback();
      }
    }, 2000);
  };

  const provideFeedback = () => {
    setCurrentPhase('feedback');
    setShowFeedback(true);
    
    const mistakes = [
      { type: 'qaaf', message: 'MashAllah, you are doing well. But notice this letter: Qaaf (ق). It comes from the back of your throat. You pronounced it as Kaaf. Let me show you slowly.' },
      { type: 'madd', message: 'Listen, beta. This is called Madd. You should extend it for two beats, not one. Let me demonstrate carefully.' },
      { type: 'ghunnah', message: 'Good effort! But the Ghunnah needs a nasal sound here. Let me show you the proper pronunciation.' },
      { type: 'qalqalah', message: 'Notice this letter requires Qalqalah - a slight bounce. Try to make it more distinct.' },
    ];
    
    const mistake = mistakes[Math.floor(Math.random() * mistakes.length)];
    setMistakeType(mistake.type);
    setQariMessage(mistake.message);

    setTimeout(() => {
      setShowFeedback(false);
      offerCorrection();
    }, 4000);
  };

  const provideCorrectFeedback = () => {
    setCurrentPhase('praise');
    setShowFeedback(true);
    setCorrectCount(prev => prev + 1);
    setUserProgress(prev => Math.min(prev + 20, 100));
    
    const praises = [
      'Excellent! MashAllah, much better. Now let\'s move to the next part.',
      'MashAllah! You are doing beautifully. Keep your voice soft and calm. Very good, beta.',
      'Perfect! Your pronunciation is improving. Allah bless your efforts.',
      'Wonderful! That was exactly right. You\'re learning quickly, beta.',
    ];
    
    setQariMessage(praises[Math.floor(Math.random() * praises.length)]);

    setTimeout(() => {
      setShowFeedback(false);
      if (currentAyahIndex < surahText.ayahs.length - 1) {
        moveToNextAyah();
      } else {
        showSessionFeedback();
      }
    }, 3000);
  };

  const offerCorrection = () => {
    setCurrentPhase('correction');
    setQariMessage('Good. Now you try again. Listen carefully to the correct pronunciation.');
    
    setTimeout(() => {
      playCorrectAudio();
    }, 2000);
  };

  const playCorrectAudio = () => {
    setQariMessage('Listen to the correct way... [Playing correct pronunciation]');
    
    setTimeout(() => {
      setCurrentPhase('retry');
      setQariMessage('Now you try. Take your time and repeat after me.');
    }, 3000);
  };

  const startLetterByLetter = () => {
    setCurrentPhase('letter-by-letter');
    setQariMessage('Let\'s go letter by letter for this ayah. Focus on each sound.');
    setHighlightedLetter(0);

    setTimeout(() => {
      guideNextLetter();
    }, 2000);
  };

  const guideNextLetter = () => {
    const currentAyah = surahText.ayahs[currentAyahIndex];
    const letters = currentAyah.arabic.split('');
    
    if (highlightedLetter !== null && highlightedLetter < letters.length) {
      setQariMessage(`Pronounce this letter: ${letters[highlightedLetter]}. Now you try.`);
      
      setTimeout(() => {
        setHighlightedLetter(prev => prev !== null ? prev + 1 : 0);
        if (highlightedLetter + 1 < letters.length) {
          guideNextLetter();
        } else {
          setHighlightedLetter(null);
          setCurrentPhase('full-ayah');
          setQariMessage('Excellent! Now let\'s recite the full ayah together.');
        }
      }, 2500);
    }
  };

  const moveToNextAyah = () => {
    setCurrentAyahIndex(prev => prev + 1);
    setAttemptCount(0);
    setCurrentPhase('instruction');
    setQariMessage(`Well done! Now let's practice the next ayah. Listen carefully.`);
    
    setTimeout(() => {
      setCurrentPhase('instruction');
      setQariMessage('Ready to recite? Take a deep breath and begin when you\'re comfortable.');
    }, 3000);
  };

  const showSessionFeedback = () => {
    setCurrentPhase('session-feedback');
    setShowFeedback(true);
    
    const score = Math.round((correctCount / (attemptCount || 1)) * 100);
    setSessionScore(score);
    
    setQariMessage(`MashAllah, beta. You improved a lot today. Your accuracy is ${score}%. You made some small mistakes, but we corrected them together. Keep practicing daily, and InshaAllah, you will perfect your recitation.`);

    setTimeout(() => {
      setShowFeedback(false);
      completeSession();
    }, 6000);
  };

  const completeSession = () => {
    setCurrentPhase('completion');
    setShowFeedback(true);
    setQariMessage('Well done! Make a note of what we practiced today. Tomorrow, we will revise and move forward. Remember: slow, steady, and listen carefully. May Allah bless your recitation.');

    setTimeout(() => {
      onComplete();
    }, 5000);
  };

  const getAnimationState = (): 'idle' | 'listening' | 'processing' | 'feedback' => {
    if (isProcessing) return 'processing';
    if (isRecording) return 'listening';
    if (showFeedback) return 'feedback';
    return 'idle';
  };

  const currentAyah = surahText.ayahs[currentAyahIndex];

  return (
    <div className="min-h-screen bg-gradient-to-b from-emerald-50 to-teal-50 flex flex-col">
      {/* Header */}
      <div className="p-6 flex items-center justify-between bg-white/50 backdrop-blur-sm border-b border-emerald-100">
        <button 
          onClick={onBack}
          className="p-3 bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow"
        >
          <ArrowLeft className="w-5 h-5 text-emerald-600" />
        </button>
        <div className="text-center">
          <div className="text-emerald-900">Surah {surahText.name}</div>
          <div className="text-emerald-600 text-sm">Ayah {currentAyahIndex + 1} of {surahText.ayahs.length}</div>
        </div>
        <div className="w-12" />
      </div>

      {/* Progress Bar */}
      <div className="px-6 pt-4">
        <div className="bg-white rounded-full h-2 overflow-hidden shadow-inner">
          <div 
            className="h-full bg-gradient-to-r from-emerald-500 to-teal-500 transition-all duration-500"
            style={{ width: `${userProgress}%` }}
          />
        </div>
        <div className="text-emerald-700 text-sm mt-1 text-center">Progress: {userProgress}%</div>
      </div>

      {/* Qari Animation */}
      <div className="flex-1 relative min-h-[400px]">
        <QariTeachingScreen
          isRecording={isRecording}
          isProcessing={isProcessing}
          showFeedback={showFeedback}
        />
      </div>

      {/* Current Ayah Display */}
      <div className="px-6 mb-4">
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <div className="text-center mb-4">
            <div className="text-emerald-700 text-sm mb-2">Current Ayah:</div>
            <div 
              className="text-3xl leading-loose mb-2"
              dir="rtl"
              style={{ fontFamily: 'serif' }}
            >
              {currentAyah.arabic.split('').map((letter, idx) => (
                <span 
                  key={idx}
                  className={`transition-all duration-300 ${
                    highlightedLetter === idx 
                      ? 'bg-amber-200 text-amber-900 px-1 rounded scale-125 inline-block' 
                      : ''
                  }`}
                >
                  {letter}
                </span>
              ))}
            </div>
            <div className="text-emerald-600 text-sm italic">{currentAyah.transliteration}</div>
          </div>

          {/* Mistake indicator */}
          {mistakeType && currentPhase === 'feedback' && (
            <div className="mt-4 bg-amber-50 border-2 border-amber-300 rounded-xl p-3 flex items-start gap-3 animate-slide-up-fade">
              <XCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-1" />
              <div>
                <div className="text-amber-900 mb-1">Correction Needed</div>
                <div className="text-amber-800 text-sm">
                  {mistakeType === 'qaaf' && 'Pronunciation: Qaaf (ق) should be from throat'}
                  {mistakeType === 'madd' && 'Elongation: Madd should be held for 2 beats'}
                  {mistakeType === 'ghunnah' && 'Nasal sound: Ghunnah requires nasal tone'}
                  {mistakeType === 'qalqalah' && 'Bounce: Qalqalah needs distinct echo'}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Qari Message Box */}
      <div className="px-6 mb-4">
        <div className="bg-gradient-to-r from-emerald-600 to-teal-600 rounded-2xl shadow-lg p-6 text-white">
          <div className="flex items-start gap-3">
            <Sparkles className="w-6 h-6 flex-shrink-0 mt-1" />
            <div>
              <div className="mb-1">Qari Saab says:</div>
              <p className="text-emerald-50 leading-relaxed">{qariMessage}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="px-6 pb-6 space-y-3">
        {(currentPhase === 'instruction' || currentPhase === 'retry') && (
          <>
            <button
              onClick={startListening}
              disabled={isRecording || isProcessing}
              className="w-full bg-gradient-to-r from-emerald-500 to-teal-500 text-white p-5 rounded-2xl shadow-lg hover:shadow-xl transition-all disabled:opacity-50 flex items-center justify-center gap-3"
            >
              <Mic className="w-6 h-6" />
              <span>{isRecording ? 'Recording...' : 'Start Reciting'}</span>
            </button>

            {attemptCount > 0 && currentPhase === 'retry' && (
              <button
                onClick={playCorrectAudio}
                className="w-full bg-amber-500 text-white p-4 rounded-xl shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-3"
              >
                <Volume2 className="w-5 h-5" />
                <span>Play Correct Pronunciation Again</span>
              </button>
            )}
          </>
        )}

        {currentPhase === 'correction' && (
          <button
            onClick={startLetterByLetter}
            className="w-full bg-blue-500 text-white p-5 rounded-2xl shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-3"
          >
            <RotateCcw className="w-5 h-5" />
            <span>Practice Letter by Letter</span>
          </button>
        )}

        {currentPhase === 'full-ayah' && (
          <button
            onClick={startListening}
            className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white p-5 rounded-2xl shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-3"
          >
            <Volume2 className="w-5 h-5" />
            <span>Recite Full Ayah</span>
          </button>
        )}

        {/* Stats */}
        <div className="grid grid-cols-3 gap-3">
          <div className="bg-white rounded-xl p-3 text-center shadow-sm">
            <div className="text-emerald-600 text-sm">Attempts</div>
            <div className="text-emerald-900">{attemptCount}</div>
          </div>
          <div className="bg-white rounded-xl p-3 text-center shadow-sm">
            <div className="text-emerald-600 text-sm">Correct</div>
            <div className="text-emerald-900 flex items-center justify-center gap-1">
              {correctCount} <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div className="bg-white rounded-xl p-3 text-center shadow-sm">
            <div className="text-emerald-600 text-sm">Ayah</div>
            <div className="text-emerald-900">{currentAyahIndex + 1}/{surahText.ayahs.length}</div>
          </div>
        </div>
      </div>
    </div>
  );
}
