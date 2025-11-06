export type CellValue = number | 0;

export type Board = CellValue[][];

export interface Position {
  row: number;
  col: number;
}

export interface Puzzle {
  /** Initial puzzle with 0 for empty cells */
  puzzle: Board;
  /** Complete solved board */
  solution: Board;
}

export type Difficulty = "easy" | "medium" | "hard";

export function createEmptyBoard(): Board {
  return Array.from({ length: 9 }, () => Array<CellValue>(9).fill(0));
}

export function cloneBoard(board: Board): Board {
  return board.map((row) => row.slice());
}

export function boardsEqual(a: Board, b: Board): boolean {
  for (let r = 0; r < 9; r++) {
    for (let c = 0; c < 9; c++) {
      if (a[r][c] !== b[r][c]) return false;
    }
  }
  return true;
}
