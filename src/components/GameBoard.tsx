import { Board } from '../utils/gameLogic';
import Cell from './Cell';

interface GameBoardProps {
  board: Board;
  onCellClick: (index: number) => void;
  winningLine: number[] | null;
  disabled: boolean;
}

export default function GameBoard({ board, onCellClick, winningLine, disabled }: GameBoardProps) {
  return (
    <div className="relative w-full max-w-md mx-auto">
      <div className="grid grid-cols-3 gap-3 p-4 bg-gradient-to-br from-gray-100 to-gray-200 rounded-2xl shadow-2xl">
        {board.map((cell, index) => (
          <Cell
            key={index}
            value={cell}
            onClick={() => onCellClick(index)}
            isWinning={winningLine?.includes(index) ?? false}
            disabled={disabled}
            index={index}
          />
        ))}
      </div>
      {winningLine && (
        <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
          <div className="w-full h-1 bg-yellow-400 animate-drawLine shadow-lg" />
        </div>
      )}
    </div>
  );
}
