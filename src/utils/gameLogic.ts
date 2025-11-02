export type Player = 'X' | 'O';
export type Cell = Player | null;
export type Board = Cell[];
export type Difficulty = 'easy' | 'medium' | 'hard';
export type BoardSize = 3 | 4 | 5;

export interface WinningCombination {
  line: number[];
  winner: Player;
  direction: 'horizontal' | 'vertical' | 'diagonal-down' | 'diagonal-up';
}

function generateWinningLines(size: BoardSize): { lines: number[][], directions: ('horizontal' | 'vertical' | 'diagonal-down' | 'diagonal-up')[] } {
  const lines: number[][] = [];
  const directions: ('horizontal' | 'vertical' | 'diagonal-down' | 'diagonal-up')[] = [];

  for (let i = 0; i < size; i++) {
    const row: number[] = [];
    const col: number[] = [];
    for (let j = 0; j < size; j++) {
      row.push(i * size + j);
      col.push(j * size + i);
    }
    lines.push(row);
    directions.push('horizontal');
    lines.push(col);
    directions.push('vertical');
  }

  const diag1: number[] = [];
  const diag2: number[] = [];
  for (let i = 0; i < size; i++) {
    diag1.push(i * size + i);
    diag2.push(i * size + (size - 1 - i));
  }
  lines.push(diag1);
  directions.push('diagonal-down');
  lines.push(diag2);
  directions.push('diagonal-up');

  return { lines, directions };
}

export function checkWinner(board: Board, size: BoardSize): WinningCombination | null {
  const { lines, directions } = generateWinningLines(size);

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const firstCell = board[line[0]];

    if (firstCell && line.every(index => board[index] === firstCell)) {
      return { line, winner: firstCell as Player, direction: directions[i] };
    }
  }
  return null;
}

export function isBoardFull(board: Board): boolean {
  return board.every(cell => cell !== null);
}

export function getAvailableMoves(board: Board): number[] {
  return board.reduce((moves: number[], cell, index) => {
    if (cell === null) moves.push(index);
    return moves;
  }, []);
}

export function minimax(
  board: Board,
  depth: number,
  isMaximizing: boolean,
  aiPlayer: Player,
  humanPlayer: Player,
  size: BoardSize,
  alpha: number = -Infinity,
  beta: number = Infinity
): number {
  const winner = checkWinner(board, size);

  if (winner) {
    return winner.winner === aiPlayer ? 10 - depth : -10 + depth;
  }

  if (isBoardFull(board)) {
    return 0;
  }

  if (isMaximizing) {
    let bestScore = -Infinity;
    for (const move of getAvailableMoves(board)) {
      board[move] = aiPlayer;
      const score = minimax(board, depth + 1, false, aiPlayer, humanPlayer, size, alpha, beta);
      board[move] = null;
      bestScore = Math.max(score, bestScore);
      alpha = Math.max(alpha, bestScore);
      if (beta <= alpha) break;
    }
    return bestScore;
  } else {
    let bestScore = Infinity;
    for (const move of getAvailableMoves(board)) {
      board[move] = humanPlayer;
      const score = minimax(board, depth + 1, true, aiPlayer, humanPlayer, size, alpha, beta);
      board[move] = null;
      bestScore = Math.min(score, bestScore);
      beta = Math.min(beta, bestScore);
      if (beta <= alpha) break;
    }
    return bestScore;
  }
}

export function findBestMove(
  board: Board,
  aiPlayer: Player,
  humanPlayer: Player,
  difficulty: Difficulty,
  size: BoardSize
): number {
  const availableMoves = getAvailableMoves(board);

  if (availableMoves.length === 0) return -1;

  if (difficulty === 'easy') {
    if (Math.random() < 0.7) {
      return availableMoves[Math.floor(Math.random() * availableMoves.length)];
    }
    const blockingMove = findBlockingMove(board, humanPlayer, size);
    if (blockingMove !== -1) return blockingMove;
    return availableMoves[Math.floor(Math.random() * availableMoves.length)];
  }

  if (difficulty === 'medium') {
    const winningMove = findWinningMove(board, aiPlayer, size);
    if (winningMove !== -1) return winningMove;

    const blockingMove = findBlockingMove(board, humanPlayer, size);
    if (blockingMove !== -1) return blockingMove;

    const centerIndex = Math.floor(size * size / 2);
    if (board[centerIndex] === null && size % 2 === 1) return centerIndex;

    if (Math.random() < 0.3) {
      return availableMoves[Math.floor(Math.random() * availableMoves.length)];
    }

    const corners = [
      0,
      size - 1,
      size * (size - 1),
      size * size - 1
    ].filter(pos => board[pos] === null);
    if (corners.length > 0) {
      return corners[Math.floor(Math.random() * corners.length)];
    }

    return availableMoves[Math.floor(Math.random() * availableMoves.length)];
  }

  if (size >= 4 && availableMoves.length > 12) {
    const winningMove = findWinningMove(board, aiPlayer, size);
    if (winningMove !== -1) return winningMove;

    const blockingMove = findBlockingMove(board, humanPlayer, size);
    if (blockingMove !== -1) return blockingMove;

    const centerIndex = Math.floor(size * size / 2);
    if (board[centerIndex] === null && size % 2 === 1) return centerIndex;

    const corners = [
      0,
      size - 1,
      size * (size - 1),
      size * size - 1
    ].filter(pos => board[pos] === null);
    if (corners.length > 0) {
      return corners[Math.floor(Math.random() * corners.length)];
    }

    return availableMoves[Math.floor(Math.random() * availableMoves.length)];
  }

  let bestScore = -Infinity;
  let bestMove = availableMoves[0];

  for (const move of availableMoves) {
    board[move] = aiPlayer;
    const score = minimax(board, 0, false, aiPlayer, humanPlayer, size);
    board[move] = null;

    if (score > bestScore) {
      bestScore = score;
      bestMove = move;
    }
  }

  return bestMove;
}

function findWinningMove(board: Board, player: Player, size: BoardSize): number {
  const { lines } = generateWinningLines(size);

  for (const line of lines) {
    const values = line.map(i => board[i]);
    const playerCount = values.filter(v => v === player).length;
    const emptyCount = values.filter(v => v === null).length;

    if (playerCount === size - 1 && emptyCount === 1) {
      return line[values.indexOf(null)];
    }
  }
  return -1;
}

function findBlockingMove(board: Board, opponent: Player, size: BoardSize): number {
  return findWinningMove(board, opponent, size);
}

export function createEmptyBoard(size: BoardSize = 3): Board {
  return Array(size * size).fill(null);
}
