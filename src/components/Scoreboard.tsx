'use client';

import { useEffect, useState } from 'react';
import { GameScore } from '@/types';
import { getScores, clearScores } from '@/utils/storage';

export default function Scoreboard() {
  const [scores, setScores] = useState<GameScore[]>([]);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    setScores(getScores());
  }, []);

  const handleClearScores = () => {
    if (confirm('Tem certeza que deseja limpar todo o placar?')) {
      clearScores();
      setScores([]);
    }
  };

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getDifficultyLabel = (difficulty: string): string => {
    const labels: Record<string, string> = {
      easy: 'Fácil',
      medium: 'Médio',
      hard: 'Difícil'
    };
    return labels[difficulty] || difficulty;
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed top-1 right-1 sm:top-4 sm:right-4 bg-blue-500 hover:bg-blue-600 text-white font-bold py-1 px-2 sm:py-2 sm:px-4 rounded sm:rounded-lg transition-colors duration-200 text-xs sm:text-base z-40"
      >
        🏆
        <span className="hidden sm:inline"> Placar</span>
      </button>

      {isOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-1 sm:p-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-3 sm:p-8 max-w-2xl w-full mx-1 sm:mx-4 shadow-2xl max-h-[95vh] sm:max-h-[80vh] overflow-auto">
            <div className="flex justify-between items-center mb-3 sm:mb-6">
              <h2 className="text-base sm:text-2xl font-bold text-gray-800 dark:text-white">
                🏆 Melhores Tempos
              </h2>
              <button
                onClick={() => setIsOpen(false)}
                className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 text-3xl sm:text-2xl leading-none"
              >
                ×
              </button>
            </div>

            {scores.length === 0 ? (
              <p className="text-center text-gray-500 dark:text-gray-400 py-6 sm:py-8 text-sm sm:text-base">
                Nenhum jogo completado ainda. Jogue e complete para aparecer no placar!
              </p>
            ) : (
              <>
                <div className="overflow-x-auto -mx-2 sm:mx-0">
                  <table className="w-full min-w-[300px]">
                    <thead>
                      <tr className="border-b border-gray-300 dark:border-gray-600">
                        <th className="text-left py-2 px-2 sm:px-4 text-gray-700 dark:text-gray-300 text-xs sm:text-base">#</th>
                        <th className="text-left py-2 px-2 sm:px-4 text-gray-700 dark:text-gray-300 text-xs sm:text-base">Dificuldade</th>
                        <th className="text-left py-2 px-2 sm:px-4 text-gray-700 dark:text-gray-300 text-xs sm:text-base">Tempo</th>
                        <th className="text-left py-2 px-2 sm:px-4 text-gray-700 dark:text-gray-300 text-xs sm:text-base hidden sm:table-cell">Data</th>
                      </tr>
                    </thead>
                    <tbody>
                      {scores.map((score, index) => (
                        <tr
                          key={index}
                          className="border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700"
                        >
                          <td className="py-2 px-2 sm:px-4 text-gray-800 dark:text-gray-200 text-sm sm:text-base">
                            {index === 0 && '🥇'}
                            {index === 1 && '🥈'}
                            {index === 2 && '🥉'}
                            {index > 2 && index + 1}
                          </td>
                          <td className="py-2 px-2 sm:px-4">
                            <span className={`px-1.5 sm:px-2 py-0.5 sm:py-1 rounded text-xs sm:text-sm font-medium ${score.difficulty === 'easy'
                              ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                              : score.difficulty === 'medium'
                                ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                                : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                              }`}>
                              {getDifficultyLabel(score.difficulty)}
                            </span>
                          </td>
                          <td className="py-2 px-2 sm:px-4 font-mono text-gray-800 dark:text-gray-200 text-sm sm:text-base">
                            {formatTime(score.time)}
                          </td>
                          <td className="py-2 px-2 sm:px-4 text-gray-600 dark:text-gray-400 text-xs sm:text-sm hidden sm:table-cell">
                            {new Date(score.date).toLocaleDateString('pt-BR')}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <button
                  onClick={handleClearScores}
                  className="mt-4 sm:mt-6 w-full bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded-lg transition-colors duration-200 text-sm sm:text-base"
                >
                  Limpar Placar
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
}
