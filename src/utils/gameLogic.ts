export type Player = 'X' | 'O';
export type Cell = Player | null;
export type Board = Cell[];
export type Difficulty = 'easy' | 'medium' | 'hard';

export interface WinningCombination {
  line: number[];
  winner: Player;
}

const WINNING_LINES = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6],
];

export function checkWinner(board: Board): WinningCombination | null {
  for (const line of WINNING_LINES) {
    const [a, b, c] = line;
    if (board[a] && board[a] === board[b] && board[a] === board[c]) {
      return { line, winner: board[a] as Player };
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
  alpha: number = -Infinity,
  beta: number = Infinity
): number {
  const winner = checkWinner(board);

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
      const score = minimax(board, depth + 1, false, aiPlayer, humanPlayer, alpha, beta);
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
      const score = minimax(board, depth + 1, true, aiPlayer, humanPlayer, alpha, beta);
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
  difficulty: Difficulty
): number {
  const availableMoves = getAvailableMoves(board);

  if (availableMoves.length === 0) return -1;

  if (difficulty === 'easy') {
    if (Math.random() < 0.7) {
      return availableMoves[Math.floor(Math.random() * availableMoves.length)];
    }
    const blockingMove = findBlockingMove(board, humanPlayer);
    if (blockingMove !== -1) return blockingMove;
    return availableMoves[Math.floor(Math.random() * availableMoves.length)];
  }

  if (difficulty === 'medium') {
    const winningMove = findWinningMove(board, aiPlayer);
    if (winningMove !== -1) return winningMove;

    const blockingMove = findBlockingMove(board, humanPlayer);
    if (blockingMove !== -1) return blockingMove;

    if (board[4] === null) return 4;

    if (Math.random() < 0.3) {
      return availableMoves[Math.floor(Math.random() * availableMoves.length)];
    }

    const corners = [0, 2, 6, 8].filter(pos => board[pos] === null);
    if (corners.length > 0) {
      return corners[Math.floor(Math.random() * corners.length)];
    }

    return availableMoves[Math.floor(Math.random() * availableMoves.length)];
  }

  let bestScore = -Infinity;
  let bestMove = availableMoves[0];

  for (const move of availableMoves) {
    board[move] = aiPlayer;
    const score = minimax(board, 0, false, aiPlayer, humanPlayer);
    board[move] = null;

    if (score > bestScore) {
      bestScore = score;
      bestMove = move;
    }
  }

  return bestMove;
}

function findWinningMove(board: Board, player: Player): number {
  for (const line of WINNING_LINES) {
    const values = line.map(i => board[i]);
    const playerCount = values.filter(v => v === player).length;
    const emptyCount = values.filter(v => v === null).length;

    if (playerCount === 2 && emptyCount === 1) {
      return line[values.indexOf(null)];
    }
  }
  return -1;
}

function findBlockingMove(board: Board, opponent: Player): number {
  return findWinningMove(board, opponent);
}

export function createEmptyBoard(): Board {
  return Array(9).fill(null);
}
