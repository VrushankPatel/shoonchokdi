import { useState, useEffect, useCallback } from 'react';
import GameBoard from './components/GameBoard';
import Controls from './components/Controls';
import StatusDisplay from './components/StatusDisplay';
import Statistics from './components/Statistics';
import Confetti from './components/Confetti';
import DarkModeToggle from './components/DarkModeToggle';
import { useGameStats } from './hooks/useGameStats';
import {
  createEmptyBoard,
  checkWinner,
  isBoardFull,
  findBestMove,
  Player,
  Difficulty,
  BoardSize,
  WinningCombination,
} from './utils/gameLogic';
import { GameMode } from './types/game';
import { audioManager } from './utils/audioManager';

function App() {
  const [boardSize, setBoardSize] = useState<BoardSize>(3);
  const [board, setBoard] = useState(createEmptyBoard(boardSize));
  const [currentPlayer, setCurrentPlayer] = useState<Player>('X');
  const [gameStatus, setGameStatus] = useState<'playing' | 'won' | 'draw'>('playing');
  const [winner, setWinner] = useState<Player | null>(null);
  const [winningCombination, setWinningCombination] = useState<WinningCombination | null>(null);
  const [difficulty, setDifficulty] = useState<Difficulty>('medium');
  const [gameMode, setGameMode] = useState<GameMode>('ai');
  const [isAiThinking, setIsAiThinking] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [firstPlayer, setFirstPlayer] = useState<Player>('X');
  const [showConfetti, setShowConfetti] = useState(false);
  const { stats, updateStats } = useGameStats();

  const resetGame = useCallback(() => {
    setBoard(createEmptyBoard(boardSize));
    setCurrentPlayer(firstPlayer);
    setGameStatus('playing');
    setWinner(null);
    setWinningCombination(null);
    setIsAiThinking(false);
    setShowConfetti(false);
  }, [firstPlayer, boardSize]);

  const handleCellClick = (index: number) => {
    if (board[index] !== null || gameStatus !== 'playing' || isAiThinking) {
      return;
    }

    if (gameMode === 'ai' && currentPlayer === 'O') {
      return;
    }

    audioManager.playSound('move');
    const newBoard = [...board];
    newBoard[index] = currentPlayer;
    setBoard(newBoard);

    const winResult = checkWinner(newBoard, boardSize);
    if (winResult) {
      setGameStatus('won');
      setWinner(winResult.winner);
      setWinningCombination(winResult);
      setShowConfetti(true);

      if (gameMode === 'ai') {
        if (winResult.winner === 'X') {
          audioManager.playSound('win');
          updateStats('win');
        } else {
          audioManager.playSound('lose');
          updateStats('loss');
        }
      } else {
        audioManager.playSound('win');
      }
      return;
    }

    if (isBoardFull(newBoard)) {
      setGameStatus('draw');
      audioManager.playSound('draw');
      if (gameMode === 'ai') {
        updateStats('draw');
      }
      return;
    }

    setCurrentPlayer(currentPlayer === 'X' ? 'O' : 'X');
  };

  useEffect(() => {
    if (
      gameMode === 'ai' &&
      currentPlayer === 'O' &&
      gameStatus === 'playing' &&
      !isAiThinking
    ) {
      setIsAiThinking(true);

      const delay = difficulty === 'hard' ? 800 : difficulty === 'medium' ? 600 : 400;

      setTimeout(() => {
        const aiMove = findBestMove(board, 'O', 'X', difficulty, boardSize);
        if (aiMove !== -1) {
          audioManager.playSound('move');
          const newBoard = [...board];
          newBoard[aiMove] = 'O';
          setBoard(newBoard);

          const winResult = checkWinner(newBoard, boardSize);
          if (winResult) {
            setGameStatus('won');
            setWinner(winResult.winner);
            setWinningCombination(winResult);
            audioManager.playSound('lose');
            updateStats('loss');
          } else if (isBoardFull(newBoard)) {
            setGameStatus('draw');
            audioManager.playSound('draw');
            updateStats('draw');
          } else {
            setCurrentPlayer('X');
          }
        }
        setIsAiThinking(false);
      }, delay);
    }
  }, [currentPlayer, gameMode, gameStatus, board, difficulty, isAiThinking, updateStats, boardSize]);

  useEffect(() => {
    if (gameMode === 'ai' && firstPlayer === 'O') {
      resetGame();
    }
  }, [gameMode, firstPlayer, resetGame]);

  const handleDifficultyChange = (newDifficulty: Difficulty) => {
    setDifficulty(newDifficulty);
    resetGame();
  };

  const handleModeChange = (mode: GameMode) => {
    setGameMode(mode);
    resetGame();
  };

  const handleToggleMute = () => {
    audioManager.toggleMute();
    setIsMuted(!isMuted);
  };

  const handleFirstPlayerChange = (player: Player) => {
    setFirstPlayer(player);
    resetGame();
  };

  const handleBoardSizeChange = (size: BoardSize) => {
    setBoardSize(size);
    setBoard(createEmptyBoard(size));
    setCurrentPlayer(firstPlayer);
    setGameStatus('playing');
    setWinner(null);
    setWinningCombination(null);
    setIsAiThinking(false);
    setShowConfetti(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 py-8 px-4 transition-colors duration-300">
      <DarkModeToggle />

      {showConfetti && gameStatus === 'won' && winner === 'X' && gameMode === 'ai' && (
        <Confetti />
      )}

      <div className="max-w-4xl mx-auto">
        <header className="text-center mb-8">
          <h1 className="text-5xl md:text-7xl font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-600 mb-2 animate-fadeIn">
            Shoonchokdi
          </h1>
          <p className="text-lg md:text-xl text-gray-600 dark:text-gray-400 font-medium">
            Challenge yourself with AI or play with friends
          </p>
        </header>

        <StatusDisplay
          currentPlayer={currentPlayer}
          gameStatus={gameStatus}
          winner={winner}
          isAiThinking={isAiThinking}
          gameMode={gameMode}
        />

        <GameBoard
          board={board}
          onCellClick={handleCellClick}
          winningCombination={winningCombination}
          disabled={gameStatus !== 'playing' || isAiThinking}
          boardSize={boardSize}
        />

        <div className="mt-8">
          <Controls
            difficulty={difficulty}
            onDifficultyChange={handleDifficultyChange}
            onNewGame={resetGame}
            onModeChange={handleModeChange}
            gameMode={gameMode}
            isMuted={isMuted}
            onToggleMute={handleToggleMute}
            firstPlayer={firstPlayer}
            onFirstPlayerChange={handleFirstPlayerChange}
            boardSize={boardSize}
            onBoardSizeChange={handleBoardSizeChange}
          />
        </div>

        {gameMode === 'ai' && <Statistics stats={stats} />}

        <footer className="text-center mt-8 text-gray-500 dark:text-gray-400 text-sm">
          <p>Challenge yourself against unbeatable AI or play with friends!</p>
        </footer>
      </div>
    </div>
  );
}

export default App;
