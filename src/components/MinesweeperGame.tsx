'use client';

import { useState, useEffect, useCallback } from 'react';
import { Cell, Difficulty } from '@/types';
import {
  DIFFICULTY_CONFIGS,
  createEmptyBoard,
  placeMines,
  revealCell,
  checkWin,
} from '@/utils/gameLogic';
import { saveScore } from '@/utils/storage';
import DifficultyModal from './DifficultyModal';
import Scoreboard from './Scoreboard';

export default function MinesweeperGame() {
  const [difficulty, setDifficulty] = useState<Difficulty | null>(null);
  const [board, setBoard] = useState<Cell[][]>([]);
  const [gameOver, setGameOver] = useState(false);
  const [gameWon, setGameWon] = useState(false);
  const [firstClick, setFirstClick] = useState(true);
  const [flagsRemaining, setFlagsRemaining] = useState(0);
  const [time, setTime] = useState(0);
  const [isTimerRunning, setIsTimerRunning] = useState(false);

  // Timer
  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (isTimerRunning && !gameOver && !gameWon) {
      interval = setInterval(() => {
        setTime(prev => prev + 1);
      }, 1000);
    }

    return () => clearInterval(interval);
  }, [isTimerRunning, gameOver, gameWon]);

  const startNewGame = useCallback((selectedDifficulty: Difficulty) => {
    const config = DIFFICULTY_CONFIGS[selectedDifficulty];
    setDifficulty(selectedDifficulty);
    setBoard(createEmptyBoard(config.rows, config.cols));
    setGameOver(false);
    setGameWon(false);
    setFirstClick(true);
    setFlagsRemaining(config.mines);
    setTime(0);
    setIsTimerRunning(false);
  }, []);

  const handleCellClick = (row: number, col: number) => {
    if (gameOver || gameWon || board[row][col].isFlagged || board[row][col].isRevealed) {
      return;
    }

    if (firstClick) {
      const config = DIFFICULTY_CONFIGS[difficulty!];
      const boardWithMines = placeMines(board, config.mines, row, col);
      setBoard(boardWithMines);
      setFirstClick(false);
      setIsTimerRunning(true);

      // Revela a célula clicada
      setTimeout(() => {
        const revealed = revealCell(boardWithMines, row, col);
        setBoard(revealed);
      }, 0);
      return;
    }

    if (board[row][col].isMine) {
      // Game Over
      const revealedBoard = board.map(rowData =>
        rowData.map(cell => ({ ...cell, isRevealed: true }))
      );
      setBoard(revealedBoard);
      setGameOver(true);
      setIsTimerRunning(false);
    } else {
      const newBoard = revealCell(board, row, col);
      setBoard(newBoard);

      // Verifica vitória
      if (checkWin(newBoard, DIFFICULTY_CONFIGS[difficulty!].mines)) {
        setGameWon(true);
        setIsTimerRunning(false);

        // Salva o score
        saveScore({
          difficulty: difficulty!,
          time,
          date: new Date().toISOString(),
        });
      }
    }
  };

  const handleCellRightClick = (e: React.MouseEvent, row: number, col: number) => {
    e.preventDefault();

    if (gameOver || gameWon || board[row][col].isRevealed || firstClick) {
      return;
    }

    const newBoard = board.map((rowData, r) =>
      rowData.map((cell, c) => {
        if (r === row && c === col) {
          const newFlagged = !cell.isFlagged;
          setFlagsRemaining(prev => prev + (newFlagged ? -1 : 1));
          return { ...cell, isFlagged: newFlagged };
        }
        return cell;
      })
    );

    setBoard(newBoard);
  };

  const getCellContent = (cell: Cell) => {
    if (cell.isFlagged) {
      return '🚩';
    }

    if (!cell.isRevealed) {
      return '';
    }

    if (cell.isMine) {
      return '💣';
    }

    if (cell.adjacentMines === 0) {
      return '';
    }

    return cell.adjacentMines;
  };

  const getCellColor = (adjacentMines: number): string => {
    const colors: Record<number, string> = {
      1: 'text-blue-600 dark:text-blue-400',
      2: 'text-green-600 dark:text-green-400',
      3: 'text-red-600 dark:text-red-400',
      4: 'text-purple-600 dark:text-purple-400',
      5: 'text-orange-600 dark:text-orange-400',
      6: 'text-cyan-600 dark:text-cyan-400',
      7: 'text-gray-800 dark:text-gray-300',
      8: 'text-pink-600 dark:text-pink-400',
    };
    return colors[adjacentMines] || '';
  };

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getCellSize = () => {
    if (!difficulty) return 'w-10 h-10';

    const config = DIFFICULTY_CONFIGS[difficulty];
    if (config.rows <= 8) return 'w-12 h-12 text-lg';
    if (config.rows <= 12) return 'w-10 h-10 text-base';
    return 'w-8 h-8 text-sm';
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-gradient-to-br from-blue-50 to-blue-100 dark:from-gray-900 dark:to-gray-800">
      <DifficultyModal
        isOpen={difficulty === null}
        onSelectDifficulty={startNewGame}
      />

      <Scoreboard />

      {difficulty && (
        <>
          <div className="mb-6 flex flex-col items-center gap-4">
            <h1 className="text-4xl font-bold text-gray-800 dark:text-white">
              Campo Minado
            </h1>

            <div className="flex gap-4 items-center bg-white dark:bg-gray-800 px-6 py-3 rounded-lg shadow-md">
              <div className="flex items-center gap-2">
                <span className="text-2xl">🚩</span>
                <span className="font-bold text-xl text-gray-800 dark:text-white">
                  {flagsRemaining}
                </span>
              </div>

              <div className="w-px h-8 bg-gray-300 dark:bg-gray-600"></div>

              <div className="flex items-center gap-2">
                <span className="text-2xl">⏱️</span>
                <span className="font-mono font-bold text-xl text-gray-800 dark:text-white">
                  {formatTime(time)}
                </span>
              </div>
            </div>

            {(gameOver || gameWon) && (
              <div className="text-center">
                <div className={`text-3xl font-bold mb-2 ${gameWon ? 'text-green-600' : 'text-red-600'
                  }`}>
                  {gameWon ? '🎉 Você Venceu! 🎉' : '💥 Game Over! 💥'}
                </div>
                {gameWon && (
                  <div className="text-gray-700 dark:text-gray-300">
                    Tempo: {formatTime(time)}
                  </div>
                )}
              </div>
            )}

            <button
              onClick={() => setDifficulty(null)}
              className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-6 rounded-lg transition-colors duration-200"
            >
              {gameOver || gameWon ? 'Jogar Novamente' : 'Nova Partida'}
            </button>
          </div>

          <div className="bg-gray-400 dark:bg-gray-600 p-2 rounded-lg shadow-2xl">
            <div className="inline-block border-4 border-gray-500 dark:border-gray-700 rounded">
              {board.map((row, rowIndex) => (
                <div key={rowIndex} className="flex">
                  {row.map((cell, colIndex) => (
                    <button
                      key={`${rowIndex}-${colIndex}`}
                      onClick={() => handleCellClick(rowIndex, colIndex)}
                      onContextMenu={(e) => handleCellRightClick(e, rowIndex, colIndex)}
                      className={`
                        ${getCellSize()}
                        border-2 border-gray-400 dark:border-gray-700
                        font-bold
                        transition-all duration-150
                        ${cell.isRevealed
                          ? cell.isMine
                            ? 'bg-red-500 text-white shadow-inner'
                            : 'bg-gray-100 dark:bg-gray-800 shadow-inner'
                          : 'bg-gray-300 dark:bg-gray-600 hover:bg-gray-400 dark:hover:bg-gray-700 shadow-sm'
                        }
                        ${cell.isRevealed && cell.adjacentMines > 0 && getCellColor(cell.adjacentMines)}
                        disabled:cursor-default
                        active:shadow-inner
                      `}
                      disabled={gameOver || gameWon}
                    >
                      {getCellContent(cell)}
                    </button>
                  ))}
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
