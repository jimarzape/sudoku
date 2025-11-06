import type { Board } from "./types";

export interface Conflicts {
  rows: boolean[][];
  cols: boolean[][];
  boxes: boolean[][];
}

export function validateBoard(board: Board): Conflicts {
  const rows = Array.from({ length: 9 }, () => Array<boolean>(9).fill(false));
  const cols = Array.from({ length: 9 }, () => Array<boolean>(9).fill(false));
  const boxes = Array.from({ length: 9 }, () => Array<boolean>(9).fill(false));

  function markConflict(r: number, c: number) {
    rows[r][c] = true;
    cols[r][c] = true;
    const b = Math.floor(r / 3) * 3 + Math.floor(c / 3);
    boxes[b][(r % 3) * 3 + (c % 3)] = true;
  }

  // Check rows and cols
  for (let i = 0; i < 9; i++) {
    const rowSeen = new Map<number, number>();
    const colSeen = new Map<number, number>();
    for (let j = 0; j < 9; j++) {
      const rv = board[i][j];
      const cv = board[j][i];
      if (rv !== 0) {
        if (rowSeen.has(rv)) {
          markConflict(i, j);
          markConflict(i, rowSeen.get(rv)!);
        } else {
          rowSeen.set(rv, j);
        }
      }
      if (cv !== 0) {
        if (colSeen.has(cv)) {
          markConflict(j, i);
          markConflict(colSeen.get(cv)!, i);
        } else {
          colSeen.set(cv, j);
        }
      }
    }
  }

  // Check boxes
  for (let br = 0; br < 3; br++) {
    for (let bc = 0; bc < 3; bc++) {
      const seen = new Map<number, [number, number]>();
      for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 3; j++) {
          const r = br * 3 + i;
          const c = bc * 3 + j;
          const v = board[r][c];
          if (v !== 0) {
            if (seen.has(v)) {
              const [pr, pc] = seen.get(v)!;
              markConflict(r, c);
              markConflict(pr, pc);
            } else {
              seen.set(v, [r, c]);
            }
          }
        }
      }
    }
  }

  return { rows, cols, boxes };
}

export function isComplete(board: Board): boolean {
  for (let r = 0; r < 9; r++) {
    for (let c = 0; c < 9; c++) {
      if (board[r][c] === 0) return false;
    }
  }
  const { rows, cols, boxes } = validateBoard(board);
  // No conflicts anywhere
  return (
    !rows.flat().some(Boolean) &&
    !cols.flat().some(Boolean) &&
    !boxes.flat().some(Boolean)
  );
}
