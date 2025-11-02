import { GameStats } from '../types/game';
import { Trophy, Target, TrendingUp } from 'lucide-react';

interface StatisticsProps {
  stats: GameStats;
}

export default function Statistics({ stats }: StatisticsProps) {
  const winRate =
    stats.gamesPlayed > 0 ? ((stats.wins / stats.gamesPlayed) * 100).toFixed(1) : '0.0';

  return (
    <div className="w-full max-w-md mx-auto mt-6">
      <h3 className="text-xl font-bold text-gray-800 dark:text-gray-200 mb-3 text-center">Statistics</h3>
      <div className="grid grid-cols-3 gap-3">
        <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-lg text-center">
          <div className="text-2xl font-bold text-gray-800 dark:text-gray-200">{stats.gamesPlayed}</div>
          <div className="text-xs text-gray-600 dark:text-gray-400 mt-1">Games</div>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-lg text-center">
          <div className="text-2xl font-bold text-green-500">{stats.wins}</div>
          <div className="text-xs text-gray-600 dark:text-gray-400 mt-1">Wins</div>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-lg text-center">
          <div className="text-2xl font-bold text-red-500">{stats.losses}</div>
          <div className="text-xs text-gray-600 dark:text-gray-400 mt-1">Losses</div>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-3 mt-3">
        <div className="bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl p-4 shadow-lg text-center text-white">
          <Target className="mx-auto mb-1" size={20} />
          <div className="text-xl font-bold">{winRate}%</div>
          <div className="text-xs mt-1">Win Rate</div>
        </div>
        <div className="bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl p-4 shadow-lg text-center text-white">
          <TrendingUp className="mx-auto mb-1" size={20} />
          <div className="text-xl font-bold">{stats.currentStreak}</div>
          <div className="text-xs mt-1">Streak</div>
        </div>
        <div className="bg-gradient-to-br from-yellow-500 to-orange-500 rounded-xl p-4 shadow-lg text-center text-white">
          <Trophy className="mx-auto mb-1" size={20} />
          <div className="text-xl font-bold">{stats.bestStreak}</div>
          <div className="text-xs mt-1">Best</div>
        </div>
      </div>
    </div>
  );
}
