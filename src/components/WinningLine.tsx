import { WinningCombination } from '../utils/gameLogic';
import { BoardSize } from '../utils/gameLogic';

interface WinningLineProps {
  winningCombination: WinningCombination;
  boardSize: BoardSize;
}

export default function WinningLine({ winningCombination, boardSize }: WinningLineProps) {
  const { line, direction } = winningCombination;

  const getLineStyle = () => {
    const firstIndex = line[0];
    const row = Math.floor(firstIndex / boardSize);
    const col = firstIndex % boardSize;

    const cellSize = 100 / boardSize;

    switch (direction) {
      case 'horizontal':
        return {
          top: `${row * cellSize + cellSize / 2}%`,
          left: '0',
          width: '100%',
          height: '4px',
          transform: 'translateY(-50%)',
        };

      case 'vertical':
        return {
          left: `${col * cellSize + cellSize / 2}%`,
          top: '0',
          height: '100%',
          width: '4px',
          transform: 'translateX(-50%)',
        };

      case 'diagonal-down':
        return {
          top: '50%',
          left: '50%',
          width: `${Math.sqrt(2) * 100}%`,
          height: '4px',
          transform: 'translate(-50%, -50%) rotate(45deg)',
          transformOrigin: 'center',
        };

      case 'diagonal-up':
        return {
          top: '50%',
          left: '50%',
          width: `${Math.sqrt(2) * 100}%`,
          height: '4px',
          transform: 'translate(-50%, -50%) rotate(-45deg)',
          transformOrigin: 'center',
        };

      default:
        return {};
    }
  };

  return (
    <div
      className="absolute bg-yellow-400 shadow-lg animate-drawLine"
      style={getLineStyle()}
    />
  );
}
