import type { Board } from "./types";
import { cloneBoard } from "./types";

export function isValid(
  board: Board,
  r: number,
  c: number,
  n: number
): boolean {
  if (n === 0) return true;
  for (let i = 0; i < 9; i++) if (board[r][i] === n) return false;
  for (let i = 0; i < 9; i++) if (board[i][c] === n) return false;
  const br = Math.floor(r / 3) * 3;
  const bc = Math.floor(c / 3) * 3;
  for (let i = 0; i < 3; i++)
    for (let j = 0; j < 3; j++) if (board[br + i][bc + j] === n) return false;
  return true;
}

export function findEmpty(board: Board): [number, number] | null {
  for (let r = 0; r < 9; r++)
    for (let c = 0; c < 9; c++) if (board[r][c] === 0) return [r, c];
  return null;
}

export function solve(board: Board): Board | null {
  const grid = cloneBoard(board);
  function backtrack(): boolean {
    const empty = findEmpty(grid);
    if (!empty) return true;
    const [r, c] = empty;
    for (let n = 1; n <= 9; n++) {
      if (isValid(grid, r, c, n)) {
        grid[r][c] = n;
        if (backtrack()) return true;
        grid[r][c] = 0;
      }
    }
    return false;
  }
  return backtrack() ? grid : null;
}

export function countSolutions(board: Board, limit = 2): number {
  const grid = cloneBoard(board);
  let count = 0;
  function backtrack(): boolean {
    if (count >= limit) return true;
    const empty = findEmpty(grid);
    if (!empty) {
      count++;
      return false;
    }
    const [r, c] = empty;
    for (let n = 1; n <= 9; n++) {
      if (isValid(grid, r, c, n)) {
        grid[r][c] = n;
        if (backtrack()) return true;
        grid[r][c] = 0;
      }
    }
    return false;
  }
  backtrack();
  return count;
}
