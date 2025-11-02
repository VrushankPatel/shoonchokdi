import { Board, BoardSize, WinningCombination } from '../utils/gameLogic';
import Cell from './Cell';
import WinningLine from './WinningLine';

interface GameBoardProps {
  board: Board;
  onCellClick: (index: number) => void;
  winningCombination: WinningCombination | null;
  disabled: boolean;
  boardSize: BoardSize;
}

export default function GameBoard({ board, onCellClick, winningCombination, disabled, boardSize }: GameBoardProps) {
  const maxWidth = boardSize === 3 ? 'max-w-md' : boardSize === 4 ? 'max-w-lg' : 'max-w-xl';
  const gap = boardSize === 3 ? 'gap-3' : boardSize === 4 ? 'gap-2' : 'gap-1.5';

  return (
    <div className={`relative w-full ${maxWidth} mx-auto`}>
      <div className={`grid grid-cols-${boardSize} ${gap} p-4 bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-900 rounded-2xl shadow-2xl`} style={{ gridTemplateColumns: `repeat(${boardSize}, minmax(0, 1fr))` }}>
        {board.map((cell, index) => (
          <Cell
            key={index}
            value={cell}
            onClick={() => onCellClick(index)}
            isWinning={winningCombination?.line.includes(index) ?? false}
            disabled={disabled}
            index={index}
          />
        ))}
      </div>
      {winningCombination && (
        <div className="absolute inset-0 pointer-events-none p-4">
          <WinningLine winningCombination={winningCombination} boardSize={boardSize} />
        </div>
      )}
    </div>
  );
}
