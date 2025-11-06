export type CellValue = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9;

export interface Cell {
  r: number;
  c: number;
  value: CellValue;
  fixed: boolean;
  cands?: Set<number>;
}

export type Board = number[][];

export type Difficulty = "easy" | "medium" | "hard" | "expert";

export function createEmptyBoard(): Board {
  return Array.from({ length: 9 }, () => Array<number>(9).fill(0));
}

export function cloneBoard(board: Board): Board {
  return board.map((row) => row.slice());
}

export function boxIndex(r: number, c: number): number {
  return Math.floor(r / 3) * 3 + Math.floor(c / 3);
}

export function inBounds(r: number, c: number): boolean {
  return r >= 0 && r < 9 && c >= 0 && c < 9;
}
