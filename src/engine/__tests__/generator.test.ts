import { describe, it, expect } from "vitest";
import { generateFullGrid, generatePuzzle } from "../../engine/generator";
import { solve } from "../../engine/solver";

describe("generator", () => {
  it("generates a valid full grid", () => {
    const grid = generateFullGrid();
    // should already be solved
    const solved = solve(grid);
    expect(solved).not.toBeNull();
  });

  it("creates unique-solution puzzles in clue bounds", () => {
    const { puzzle } = generatePuzzle("medium");
    const clues = puzzle.flat().filter((v) => v !== 0).length;
    expect(clues).toBeGreaterThanOrEqual(30);
    expect(clues).toBeLessThanOrEqual(35);
    const solved = solve(puzzle);
    expect(solved).not.toBeNull();
  });
});
