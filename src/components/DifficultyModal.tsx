'use client';

import { Difficulty } from '@/types';

interface DifficultyModalProps {
  isOpen: boolean;
  onSelectDifficulty: (difficulty: Difficulty) => void;
}

export default function DifficultyModal({ isOpen, onSelectDifficulty }: DifficultyModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg p-8 max-w-md w-full mx-4 shadow-2xl">
        <h2 className="text-3xl font-bold text-center mb-6 text-gray-800 dark:text-white">
          Campo Minado
        </h2>
        <p className="text-center mb-8 text-gray-600 dark:text-gray-300">
          Escolha a dificuldade:
        </p>

        <div className="space-y-4">
          <button
            onClick={() => onSelectDifficulty('easy')}
            className="w-full bg-green-500 hover:bg-green-600 text-white font-bold py-4 px-6 rounded-lg transition-colors duration-200 text-lg"
          >
            Fácil
            <span className="block text-sm font-normal mt-1">8x8 - 10 minas</span>
          </button>

          <button
            onClick={() => onSelectDifficulty('medium')}
            className="w-full bg-yellow-500 hover:bg-yellow-600 text-white font-bold py-4 px-6 rounded-lg transition-colors duration-200 text-lg"
          >
            Médio
            <span className="block text-sm font-normal mt-1">12x12 - 25 minas</span>
          </button>

          <button
            onClick={() => onSelectDifficulty('hard')}
            className="w-full bg-red-500 hover:bg-red-600 text-white font-bold py-4 px-6 rounded-lg transition-colors duration-200 text-lg"
          >
            Difícil
            <span className="block text-sm font-normal mt-1">16x16 - 50 minas</span>
          </button>
        </div>
      </div>
    </div>
  );
}
