import { useState } from 'react';
import { BookOpen, TrendingUp, Mic, Sparkles, GraduationCap } from 'lucide-react';

interface HomeProps {
  onStartRecording: (surah: number, ayah: number) => void;
  onViewProgress: () => void;
  onViewQariDemo?: () => void;
  onStartSession?: () => void;
}

const popularSurahs = [
  { number: 1, name: 'Al-Fatihah', nameArabic: 'الفاتحة', ayahs: 7 },
  { number: 2, name: 'Al-Baqarah', nameArabic: 'البقرة', ayahs: 286 },
  { number: 18, name: 'Al-Kahf', nameArabic: 'الكهف', ayahs: 110 },
  { number: 36, name: 'Ya-Sin', nameArabic: 'يس', ayahs: 83 },
  { number: 55, name: 'Ar-Rahman', nameArabic: 'الرحمن', ayahs: 78 },
  { number: 67, name: 'Al-Mulk', nameArabic: 'الملك', ayahs: 30 },
];

export function Home({ onStartRecording, onViewProgress, onViewQariDemo, onStartSession }: HomeProps) {
  const [selectedSurah, setSelectedSurah] = useState<number | null>(null);
  const [selectedAyah, setSelectedAyah] = useState<string>('1');

  const handleStart = () => {
    if (selectedSurah) {
      onStartRecording(selectedSurah, parseInt(selectedAyah));
    }
  };

  return (
    <div className="min-h-screen p-6 pb-24">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-2">
          <h1 className="text-emerald-900">Qari</h1>
          <button 
            onClick={onViewProgress}
            className="p-3 bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow"
          >
            <TrendingUp className="w-5 h-5 text-emerald-600" />
          </button>
        </div>
        <p className="text-emerald-700">Perfect your Quran recitation with AI-powered tajweed guidance</p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-3 gap-3 mb-8">
        <div className="bg-white p-4 rounded-xl shadow-sm">
          <div className="text-emerald-600 mb-1">Sessions</div>
          <div className="text-emerald-900">127</div>
        </div>
        <div className="bg-white p-4 rounded-xl shadow-sm">
          <div className="text-emerald-600 mb-1">Accuracy</div>
          <div className="text-emerald-900">84%</div>
        </div>
        <div className="bg-white p-4 rounded-xl shadow-sm">
          <div className="text-emerald-600 mb-1">Streak</div>
          <div className="text-emerald-900">12d</div>
        </div>
      </div>

      {/* Qari Animation Demo Button */}
      {onViewQariDemo && (
        <button
          onClick={onViewQariDemo}
          className="w-full bg-gradient-to-r from-amber-500 to-orange-500 text-white p-4 rounded-xl shadow-lg hover:shadow-xl transition-all mb-3 flex items-center justify-center gap-3"
        >
          <Sparkles className="w-5 h-5" />
          <span>Meet Your Qari Teacher</span>
        </button>
      )}

      {/* Start Teaching Session Button */}
      {onStartSession && (
        <button
          onClick={onStartSession}
          className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white p-4 rounded-xl shadow-lg hover:shadow-xl transition-all mb-6 flex items-center justify-center gap-3"
        >
          <GraduationCap className="w-5 h-5" />
          <span>Start Teaching Session</span>
        </button>
      )}

      {/* Surah Selection */}
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-4">
          <BookOpen className="w-5 h-5 text-emerald-600" />
          <h2 className="text-emerald-900">Select Surah</h2>
        </div>
        
        <div className="space-y-2">
          {popularSurahs.map((surah) => (
            <button
              key={surah.number}
              onClick={() => setSelectedSurah(surah.number)}
              className={`w-full p-4 rounded-xl text-left transition-all ${
                selectedSurah === surah.number
                  ? 'bg-emerald-600 text-white shadow-lg scale-[1.02]'
                  : 'bg-white text-emerald-900 shadow-sm hover:shadow-md'
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                    selectedSurah === surah.number ? 'bg-emerald-500' : 'bg-emerald-100'
                  }`}>
                    <span className={selectedSurah === surah.number ? 'text-white' : 'text-emerald-700'}>
                      {surah.number}
                    </span>
                  </div>
                  <div>
                    <div className={selectedSurah === surah.number ? 'text-white' : 'text-emerald-900'}>
                      {surah.name}
                    </div>
                    <div className={`text-sm ${
                      selectedSurah === surah.number ? 'text-emerald-100' : 'text-emerald-600'
                    }`}>
                      {surah.ayahs} ayahs
                    </div>
                  </div>
                </div>
                <div className={`text-2xl ${
                  selectedSurah === surah.number ? 'text-white' : 'text-emerald-600'
                }`}>
                  {surah.nameArabic}
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Ayah Selection */}
      {selectedSurah && (
        <div className="mb-6 animate-in fade-in slide-in-from-bottom-4 duration-300">
          <label className="block mb-2 text-emerald-900">Ayah Number</label>
          <input
            type="number"
            min="1"
            max={popularSurahs.find(s => s.number === selectedSurah)?.ayahs || 1}
            value={selectedAyah}
            onChange={(e) => setSelectedAyah(e.target.value)}
            className="w-full p-4 rounded-xl border-2 border-emerald-200 focus:border-emerald-500 focus:outline-none bg-white text-emerald-900"
            placeholder="Enter ayah number"
          />
        </div>
      )}

      {/* Start Button */}
      {selectedSurah && (
        <button
          onClick={handleStart}
          className="fixed bottom-6 left-6 right-6 bg-emerald-600 text-white p-5 rounded-2xl shadow-lg hover:bg-emerald-700 transition-all flex items-center justify-center gap-3 animate-in fade-in slide-in-from-bottom-4 duration-300"
        >
          <Mic className="w-6 h-6" />
          <span>Start Recording</span>
        </button>
      )}
    </div>
  );
}