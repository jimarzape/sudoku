import type { Board, Difficulty } from "./types";
import { cloneBoard, createEmptyBoard } from "./types";
import { countSolutions, findEmpty, isValid } from "./solver";

function shuffled<T>(arr: T[]): T[] {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export function generateFullGrid(): Board {
  const grid = createEmptyBoard();
  const digits = [1, 2, 3, 4, 5, 6, 7, 8, 9];

  function backtrack(): boolean {
    const empty = findEmpty(grid);
    if (!empty) return true;
    const [r, c] = empty;
    for (const n of shuffled(digits)) {
      if (isValid(grid, r, c, n)) {
        grid[r][c] = n;
        if (backtrack()) return true;
        grid[r][c] = 0;
      }
    }
    return false;
  }

  backtrack();
  return grid;
}

const PRESETS: Record<Difficulty, { minClues: number; maxClues: number }> = {
  easy: { minClues: 36, maxClues: 45 },
  medium: { minClues: 30, maxClues: 35 },
  hard: { minClues: 26, maxClues: 29 },
  expert: { minClues: 22, maxClues: 25 },
};

export function removeCells(full: Board, difficulty: Difficulty): Board {
  const { minClues } = PRESETS[difficulty];
  const puzzle = cloneBoard(full);
  const cells = shuffled(Array.from({ length: 81 }, (_, i) => i));
  let clues = 81;
  for (const idx of cells) {
    if (clues <= minClues) break;
    const r = Math.floor(idx / 9);
    const c = idx % 9;
    const backup = puzzle[r][c];
    puzzle[r][c] = 0;
    const solutions = countSolutions(puzzle, 2);
    if (solutions !== 1) {
      puzzle[r][c] = backup;
    } else {
      clues--;
    }
  }
  return puzzle;
}

export function generatePuzzle(difficulty: Difficulty): {
  puzzle: Board;
  solution: Board;
} {
  const solution = generateFullGrid();
  const puzzle = removeCells(solution, difficulty);
  return { puzzle, solution };
}
