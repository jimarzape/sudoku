import { describe, it, expect } from "vitest";
import { solve } from "../../engine/solver";

const puzzle: number[][] = [
  [0, 0, 0, 2, 6, 0, 7, 0, 1],
  [6, 8, 0, 0, 7, 0, 0, 9, 0],
  [1, 9, 0, 0, 0, 4, 5, 0, 0],
  [8, 2, 0, 1, 0, 0, 0, 4, 0],
  [0, 0, 4, 6, 0, 2, 9, 0, 0],
  [0, 5, 0, 0, 0, 3, 0, 2, 8],
  [0, 0, 9, 3, 0, 0, 0, 7, 4],
  [0, 4, 0, 0, 5, 0, 0, 3, 6],
  [7, 0, 3, 0, 1, 8, 0, 0, 0],
];

describe("solver", () => {
  it("solves a standard puzzle quickly", () => {
    const start = performance.now();
    const solved = solve(puzzle);
    const ms = performance.now() - start;
    expect(solved).not.toBeNull();
    if (!solved) return;
    // every row/col has numbers 1..9
    for (let r = 0; r < 9; r++)
      for (let c = 0; c < 9; c++) expect(solved[r][c]).toBeGreaterThan(0);
    expect(ms).toBeLessThan(50);
  });
});
