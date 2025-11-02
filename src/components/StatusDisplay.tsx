import { Player } from '../utils/gameLogic';
import { Loader2 } from 'lucide-react';

interface StatusDisplayProps {
  currentPlayer: Player;
  gameStatus: 'playing' | 'won' | 'draw';
  winner: Player | null;
  isAiThinking: boolean;
  gameMode: 'ai' | 'two-player';
}

export default function StatusDisplay({
  currentPlayer,
  gameStatus,
  winner,
  isAiThinking,
  gameMode,
}: StatusDisplayProps) {
  const getStatusMessage = () => {
    if (gameStatus === 'won' && winner) {
      if (gameMode === 'ai') {
        return winner === 'X' ? (
          <span className="text-green-500">You Won! Congratulations!</span>
        ) : (
          <span className="text-red-500">AI Wins! Try Again?</span>
        );
      }
      return (
        <span className={winner === 'X' ? 'text-cyan-500' : 'text-orange-500'}>
          Player {winner} Wins!
        </span>
      );
    }

    if (gameStatus === 'draw') {
      return <span className="text-gray-600">It's a Draw! Well Played!</span>;
    }

    if (isAiThinking) {
      return (
        <span className="flex items-center gap-2 text-purple-600">
          <Loader2 className="animate-spin" size={20} />
          AI is thinking...
        </span>
      );
    }

    if (gameMode === 'ai') {
      return currentPlayer === 'X' ? (
        <span className="text-cyan-500">Your Turn (X)</span>
      ) : (
        <span className="text-orange-500">AI's Turn (O)</span>
      );
    }

    return (
      <span className={currentPlayer === 'X' ? 'text-cyan-500' : 'text-orange-500'}>
        Player {currentPlayer}'s Turn
      </span>
    );
  };

  return (
    <div className="text-center py-6">
      <h2 className="text-2xl md:text-3xl font-bold transition-all duration-300">
        {getStatusMessage()}
      </h2>
    </div>
  );
}
