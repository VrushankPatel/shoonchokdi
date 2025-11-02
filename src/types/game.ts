import { Player, Board, Difficulty } from '../utils/gameLogic';

export interface GameStats {
  gamesPlayed: number;
  wins: number;
  losses: number;
  draws: number;
  currentStreak: number;
  bestStreak: number;
}

export interface GameHistoryEntry {
  id: string;
  outcome: 'win' | 'loss' | 'draw';
  timestamp: Date;
  difficulty?: Difficulty;
  moves: number;
}

export interface GameState {
  board: Board;
  currentPlayer: Player;
  gameStatus: 'playing' | 'won' | 'draw';
  winner: Player | null;
  winningLine: number[] | null;
  isAiThinking: boolean;
  moveCount: number;
}

export type GameMode = 'ai' | 'two-player';
