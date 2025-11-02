import { Difficulty, Player } from '../utils/gameLogic';
import { GameMode } from '../types/game';
import { RotateCcw, Volume2, VolumeX, Users, Bot } from 'lucide-react';

interface ControlsProps {
  difficulty: Difficulty;
  onDifficultyChange: (difficulty: Difficulty) => void;
  onNewGame: () => void;
  onModeChange: (mode: GameMode) => void;
  gameMode: GameMode;
  isMuted: boolean;
  onToggleMute: () => void;
  firstPlayer: Player;
  onFirstPlayerChange: (player: Player) => void;
}

export default function Controls({
  difficulty,
  onDifficultyChange,
  onNewGame,
  onModeChange,
  gameMode,
  isMuted,
  onToggleMute,
  firstPlayer,
  onFirstPlayerChange,
}: ControlsProps) {
  return (
    <div className="w-full max-w-md mx-auto space-y-4">
      <div className="flex gap-2 justify-center">
        <button
          onClick={() => onModeChange('ai')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg font-semibold transition-all ${
            gameMode === 'ai'
              ? 'bg-cyan-500 text-white shadow-lg scale-105'
              : 'bg-white text-gray-700 hover:bg-gray-50'
          }`}
        >
          <Bot size={20} />
          vs AI
        </button>
        <button
          onClick={() => onModeChange('two-player')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg font-semibold transition-all ${
            gameMode === 'two-player'
              ? 'bg-cyan-500 text-white shadow-lg scale-105'
              : 'bg-white text-gray-700 hover:bg-gray-50'
          }`}
        >
          <Users size={20} />
          2 Players
        </button>
      </div>

      {gameMode === 'ai' && (
        <div className="bg-white rounded-xl p-4 shadow-lg">
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            AI Difficulty
          </label>
          <div className="flex gap-2">
            {(['easy', 'medium', 'hard'] as Difficulty[]).map((diff) => (
              <button
                key={diff}
                onClick={() => onDifficultyChange(diff)}
                className={`flex-1 px-3 py-2 rounded-lg font-medium capitalize transition-all ${
                  difficulty === diff
                    ? 'bg-gradient-to-r from-cyan-500 to-blue-500 text-white shadow-md scale-105'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {diff}
              </button>
            ))}
          </div>
        </div>
      )}

      {gameMode === 'ai' && (
        <div className="bg-white rounded-xl p-4 shadow-lg">
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Who Goes First?
          </label>
          <div className="flex gap-2">
            <button
              onClick={() => onFirstPlayerChange('X')}
              className={`flex-1 px-3 py-2 rounded-lg font-medium transition-all ${
                firstPlayer === 'X'
                  ? 'bg-cyan-500 text-white shadow-md scale-105'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              You (X)
            </button>
            <button
              onClick={() => onFirstPlayerChange('O')}
              className={`flex-1 px-3 py-2 rounded-lg font-medium transition-all ${
                firstPlayer === 'O'
                  ? 'bg-orange-500 text-white shadow-md scale-105'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              AI (O)
            </button>
          </div>
        </div>
      )}

      <div className="flex gap-2">
        <button
          onClick={onNewGame}
          className="flex-1 flex items-center justify-center gap-2 bg-gradient-to-r from-green-500 to-emerald-500 text-white px-6 py-3 rounded-xl font-bold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all"
        >
          <RotateCcw size={20} />
          New Game
        </button>
        <button
          onClick={onToggleMute}
          className="bg-white text-gray-700 px-4 py-3 rounded-xl font-bold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all"
          aria-label={isMuted ? 'Unmute' : 'Mute'}
        >
          {isMuted ? <VolumeX size={20} /> : <Volume2 size={20} />}
        </button>
      </div>
    </div>
  );
}
