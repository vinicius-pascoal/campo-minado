import { Cell, DifficultyConfig } from '@/types';

export const DIFFICULTY_CONFIGS: Record<string, DifficultyConfig> = {
  easy: { rows: 8, cols: 8, mines: 10 },
  medium: { rows: 12, cols: 12, mines: 25 },
  hard: { rows: 16, cols: 16, mines: 50 },
};

export const createEmptyBoard = (rows: number, cols: number): Cell[][] => {
  return Array(rows).fill(null).map(() =>
    Array(cols).fill(null).map(() => ({
      isMine: false,
      isRevealed: false,
      isFlagged: false,
      adjacentMines: 0,
    }))
  );
};

export const placeMines = (
  board: Cell[][],
  totalMines: number,
  firstClickRow: number,
  firstClickCol: number
): Cell[][] => {
  const rows = board.length;
  const cols = board[0].length;
  const newBoard = board.map(row => row.map(cell => ({ ...cell })));

  let minesPlaced = 0;

  while (minesPlaced < totalMines) {
    const row = Math.floor(Math.random() * rows);
    const col = Math.floor(Math.random() * cols);

    // Não coloca mina na primeira célula clicada ou nas adjacentes
    const isFirstClick = row === firstClickRow && col === firstClickCol;
    const isAdjacentToFirstClick =
      Math.abs(row - firstClickRow) <= 1 &&
      Math.abs(col - firstClickCol) <= 1;

    if (!newBoard[row][col].isMine && !isFirstClick && !isAdjacentToFirstClick) {
      newBoard[row][col].isMine = true;
      minesPlaced++;
    }
  }

  return calculateAdjacentMines(newBoard);
};

export const calculateAdjacentMines = (board: Cell[][]): Cell[][] => {
  const rows = board.length;
  const cols = board[0].length;
  const newBoard = board.map(row => row.map(cell => ({ ...cell })));

  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      if (!newBoard[row][col].isMine) {
        let count = 0;

        for (let i = -1; i <= 1; i++) {
          for (let j = -1; j <= 1; j++) {
            const newRow = row + i;
            const newCol = col + j;

            if (
              newRow >= 0 &&
              newRow < rows &&
              newCol >= 0 &&
              newCol < cols &&
              newBoard[newRow][newCol].isMine
            ) {
              count++;
            }
          }
        }

        newBoard[row][col].adjacentMines = count;
      }
    }
  }

  return newBoard;
};

export const revealCell = (
  board: Cell[][],
  row: number,
  col: number
): Cell[][] => {
  const rows = board.length;
  const cols = board[0].length;
  const newBoard = board.map(row => row.map(cell => ({ ...cell })));

  if (
    row < 0 ||
    row >= rows ||
    col < 0 ||
    col >= cols ||
    newBoard[row][col].isRevealed ||
    newBoard[row][col].isFlagged
  ) {
    return newBoard;
  }

  newBoard[row][col].isRevealed = true;

  // Se não tem minas adjacentes, revela as células vizinhas
  if (newBoard[row][col].adjacentMines === 0 && !newBoard[row][col].isMine) {
    for (let i = -1; i <= 1; i++) {
      for (let j = -1; j <= 1; j++) {
        if (i !== 0 || j !== 0) {
          const result = revealCell(newBoard, row + i, col + j);
          result.forEach((rowData, r) => {
            rowData.forEach((cell, c) => {
              newBoard[r][c] = cell;
            });
          });
        }
      }
    }
  }

  return newBoard;
};

export const checkWin = (board: Cell[][], totalMines: number): boolean => {
  let revealedCount = 0;
  let totalCells = 0;

  board.forEach(row => {
    row.forEach(cell => {
      totalCells++;
      if (cell.isRevealed && !cell.isMine) {
        revealedCount++;
      }
    });
  });

  return revealedCount === totalCells - totalMines;
};
