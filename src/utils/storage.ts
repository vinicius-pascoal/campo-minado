import { GameScore } from '@/types';

const STORAGE_KEY = 'minesweeper_scores';

export const saveScore = (score: GameScore): void => {
  if (typeof window === 'undefined') return;

  const scores = getScores();
  scores.push(score);

  // Ordena por tempo (menor é melhor) e mantém apenas os 10 melhores
  const sortedScores = scores
    .sort((a, b) => a.time - b.time)
    .slice(0, 10);

  localStorage.setItem(STORAGE_KEY, JSON.stringify(sortedScores));
};

export const getScores = (): GameScore[] => {
  if (typeof window === 'undefined') return [];

  const stored = localStorage.getItem(STORAGE_KEY);
  return stored ? JSON.parse(stored) : [];
};

export const clearScores = (): void => {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(STORAGE_KEY);
};
