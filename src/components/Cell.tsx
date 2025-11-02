import { Cell as CellType } from '../utils/gameLogic';

interface CellProps {
  value: CellType;
  onClick: () => void;
  isWinning: boolean;
  disabled: boolean;
  index: number;
}

export default function Cell({ value, onClick, isWinning, disabled, index }: CellProps) {
  return (
    <button
      className={`
        relative aspect-square w-full rounded-lg
        flex items-center justify-center text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold
        transition-all duration-300 transform
        ${!value && !disabled ? 'hover:scale-105 hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer' : ''}
        ${disabled && !value ? 'cursor-not-allowed' : ''}
        ${isWinning ? 'bg-yellow-200 dark:bg-yellow-400 animate-pulse' : 'bg-white dark:bg-gray-800'}
        border-4 border-gray-200 dark:border-gray-600
        ${value ? 'animate-scaleIn' : ''}
      `}
      onClick={onClick}
      disabled={disabled || value !== null}
      aria-label={`Cell ${index + 1}`}
    >
      {value === 'X' && (
        <span className="text-cyan-500 drop-shadow-lg animate-fadeIn">✕</span>
      )}
      {value === 'O' && (
        <span className="text-orange-500 drop-shadow-lg animate-fadeIn">◯</span>
      )}
    </button>
  );
}
