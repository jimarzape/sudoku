import type { Board } from "./types";
import { isValid } from "./solver";

export interface Hint {
  position: { r: number; c: number };
  value: number;
  technique: "single-candidate" | "single-position";
}

export function computeCandidates(board: Board): Set<number>[][] {
  const cands: Set<number>[][] = Array.from({ length: 9 }, () =>
    Array.from({ length: 9 }, () => new Set<number>())
  );
  for (let r = 0; r < 9; r++) {
    for (let c = 0; c < 9; c++) {
      if (board[r][c] !== 0) continue;
      for (let n = 1; n <= 9; n++)
        if (isValid(board, r, c, n)) cands[r][c].add(n);
    }
  }
  return cands;
}

export function getHint(board: Board): Hint | null {
  const cands = computeCandidates(board);
  // Technique 1: single-candidate (only one candidate in a cell)
  for (let r = 0; r < 9; r++) {
    for (let c = 0; c < 9; c++) {
      if (board[r][c] === 0 && cands[r][c].size === 1) {
        const value = [...cands[r][c]][0];
        return { position: { r, c }, value, technique: "single-candidate" };
      }
    }
  }
  // Technique 2: single-position in a unit (row/col/box)
  // Rows
  for (let r = 0; r < 9; r++) {
    for (let n = 1; n <= 9; n++) {
      let spot: number | null = null;
      for (let c = 0; c < 9; c++)
        if (board[r][c] === 0 && cands[r][c].has(n))
          spot = spot === null ? c : -1;
      if (spot !== null && spot !== -1)
        return {
          position: { r, c: spot },
          value: n,
          technique: "single-position",
        };
    }
  }
  // Cols
  for (let c = 0; c < 9; c++) {
    for (let n = 1; n <= 9; n++) {
      let spot: number | null = null;
      for (let r = 0; r < 9; r++)
        if (board[r][c] === 0 && cands[r][c].has(n))
          spot = spot === null ? r : -1;
      if (spot !== null && spot !== -1)
        return {
          position: { r: spot, c },
          value: n,
          technique: "single-position",
        };
    }
  }
  // Boxes
  for (let br = 0; br < 3; br++) {
    for (let bc = 0; bc < 3; bc++) {
      for (let n = 1; n <= 9; n++) {
        let pos: { r: number; c: number } | null = null;
        for (let i = 0; i < 3; i++) {
          for (let j = 0; j < 3; j++) {
            const r = br * 3 + i;
            const c = bc * 3 + j;
            if (board[r][c] === 0 && cands[r][c].has(n))
              pos = pos === null ? { r, c } : ({ r: -1, c: -1 } as any);
          }
        }
        if (pos && pos.r !== -1)
          return { position: pos, value: n, technique: "single-position" };
      }
    }
  }
  return null;
}
