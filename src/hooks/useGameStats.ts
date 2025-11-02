import { useState, useEffect } from 'react';
import { GameStats } from '../types/game';

const STATS_KEY = 'Shoonchokdi_stats';

const initialStats: GameStats = {
  gamesPlayed: 0,
  wins: 0,
  losses: 0,
  draws: 0,
  currentStreak: 0,
  bestStreak: 0,
};

export function useGameStats() {
  const [stats, setStats] = useState<GameStats>(() => {
    const saved = localStorage.getItem(STATS_KEY);
    return saved ? JSON.parse(saved) : initialStats;
  });

  useEffect(() => {
    localStorage.setItem(STATS_KEY, JSON.stringify(stats));
  }, [stats]);

  const updateStats = (result: 'win' | 'loss' | 'draw') => {
    setStats((prev) => {
      const newStats = { ...prev };
      newStats.gamesPlayed++;

      if (result === 'win') {
        newStats.wins++;
        newStats.currentStreak++;
        newStats.bestStreak = Math.max(newStats.bestStreak, newStats.currentStreak);
      } else if (result === 'loss') {
        newStats.losses++;
        newStats.currentStreak = 0;
      } else {
        newStats.draws++;
      }

      return newStats;
    });
  };

  const resetStats = () => {
    setStats(initialStats);
  };

  return { stats, updateStats, resetStats };
}
