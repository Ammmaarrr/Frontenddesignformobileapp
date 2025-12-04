import { ArrowLeft, TrendingUp, Calendar, Target, Award } from 'lucide-react';

interface ProgressScreenProps {
  onBack: () => void;
}

const recentSessions = [
  { surah: 1, ayah: 1, score: 0.92, date: '2025-12-04', errors: 1 },
  { surah: 1, ayah: 2, score: 0.85, date: '2025-12-03', errors: 3 },
  { surah: 36, ayah: 1, score: 0.78, date: '2025-12-02', errors: 4 },
  { surah: 67, ayah: 1, score: 0.88, date: '2025-12-01', errors: 2 },
  { surah: 1, ayah: 3, score: 0.95, date: '2025-11-30', errors: 1 },
];

const errorBreakdown = [
  { type: 'Madd Duration', count: 12, improvement: '+15%' },
  { type: 'Substituted Letters', count: 8, improvement: '+22%' },
  { type: 'Ghunnah', count: 6, improvement: '+8%' },
  { type: 'Qalqalah', count: 4, improvement: '+30%' },
];

const achievements = [
  { icon: '🔥', title: '12 Day Streak', description: 'Keep it up!' },
  { icon: '⭐', title: '100 Sessions', description: 'Dedication master' },
  { icon: '📈', title: '20% Improvement', description: 'This month' },
  { icon: '🎯', title: 'Perfect Score', description: '5 times' },
];

export function ProgressScreen({ onBack }: ProgressScreenProps) {
  return (
    <div className="min-h-screen p-6 pb-24">
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <button 
          onClick={onBack}
          className="p-3 bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow"
        >
          <ArrowLeft className="w-5 h-5 text-emerald-600" />
        </button>
        <h1 className="text-emerald-900">Your Progress</h1>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-2 gap-3 mb-6">
        <div className="bg-gradient-to-br from-emerald-500 to-teal-600 p-5 rounded-xl shadow-lg text-white">
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp className="w-5 h-5" />
            <span className="text-emerald-100">Avg Score</span>
          </div>
          <div className="text-3xl mb-1">84%</div>
          <div className="text-emerald-100">+5% this week</div>
        </div>

        <div className="bg-gradient-to-br from-blue-500 to-indigo-600 p-5 rounded-xl shadow-lg text-white">
          <div className="flex items-center gap-2 mb-2">
            <Calendar className="w-5 h-5" />
            <span className="text-blue-100">Sessions</span>
          </div>
          <div className="text-3xl mb-1">127</div>
          <div className="text-blue-100">Total completed</div>
        </div>

        <div className="bg-gradient-to-br from-purple-500 to-pink-600 p-5 rounded-xl shadow-lg text-white">
          <div className="flex items-center gap-2 mb-2">
            <Target className="w-5 h-5" />
            <span className="text-purple-100">Weekly Goal</span>
          </div>
          <div className="text-3xl mb-1">5/7</div>
          <div className="text-purple-100">Sessions done</div>
        </div>

        <div className="bg-gradient-to-br from-orange-500 to-red-600 p-5 rounded-xl shadow-lg text-white">
          <div className="flex items-center gap-2 mb-2">
            <Award className="w-5 h-5" />
            <span className="text-orange-100">Streak</span>
          </div>
          <div className="text-3xl mb-1">12</div>
          <div className="text-orange-100">Days in a row</div>
        </div>
      </div>

      {/* Achievements */}
      <div className="mb-6">
        <h2 className="text-emerald-900 mb-4">Achievements</h2>
        <div className="grid grid-cols-2 gap-3">
          {achievements.map((achievement, i) => (
            <div key={i} className="bg-white p-4 rounded-xl shadow-sm border-2 border-emerald-100">
              <div className="text-3xl mb-2">{achievement.icon}</div>
              <div className="text-emerald-900 mb-1">{achievement.title}</div>
              <div className="text-emerald-600">{achievement.description}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Error Breakdown */}
      <div className="mb-6">
        <h2 className="text-emerald-900 mb-4">Common Mistakes</h2>
        <div className="bg-white rounded-xl shadow-sm p-4">
          {errorBreakdown.map((error, i) => (
            <div key={i} className="flex items-center justify-between py-3 border-b border-emerald-100 last:border-b-0">
              <div>
                <div className="text-emerald-900">{error.type}</div>
                <div className="text-emerald-600">{error.count} occurrences</div>
              </div>
              <div className="text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full">
                {error.improvement}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Sessions */}
      <div className="mb-6">
        <h2 className="text-emerald-900 mb-4">Recent Sessions</h2>
        <div className="space-y-3">
          {recentSessions.map((session, i) => (
            <div key={i} className="bg-white p-4 rounded-xl shadow-sm">
              <div className="flex items-center justify-between mb-2">
                <div className="text-emerald-900">
                  Surah {session.surah}, Ayah {session.ayah}
                </div>
                <div className={`text-xl ${
                  session.score >= 0.9 ? 'text-emerald-600' :
                  session.score >= 0.75 ? 'text-yellow-600' : 'text-orange-600'
                }`}>
                  {Math.round(session.score * 100)}%
                </div>
              </div>
              <div className="flex items-center justify-between text-emerald-600">
                <span>{session.date}</span>
                <span>{session.errors} error{session.errors !== 1 ? 's' : ''}</span>
              </div>
              <div className="mt-2 h-1.5 bg-emerald-100 rounded-full overflow-hidden">
                <div 
                  className={`h-full ${
                    session.score >= 0.9 ? 'bg-emerald-600' :
                    session.score >= 0.75 ? 'bg-yellow-500' : 'bg-orange-500'
                  }`}
                  style={{ width: `${session.score * 100}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Progress Chart Placeholder */}
      <div className="mb-6">
        <h2 className="text-emerald-900 mb-4">Score Trend</h2>
        <div className="bg-white p-6 rounded-xl shadow-sm">
          <div className="h-48 flex items-end justify-between gap-2">
            {[65, 72, 68, 78, 82, 85, 84].map((height, i) => (
              <div key={i} className="flex-1 flex flex-col items-center gap-2">
                <div className="w-full bg-emerald-100 rounded-t-lg relative overflow-hidden" style={{ height: `${height}%` }}>
                  <div className="absolute inset-0 bg-gradient-to-t from-emerald-600 to-emerald-400" />
                </div>
                <div className="text-emerald-600">
                  {['M', 'T', 'W', 'T', 'F', 'S', 'S'][i]}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
