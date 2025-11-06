import { describe, it, expect } from "vitest";
import { validateBoard, isComplete } from "../../engine/validators";
import { getHint, computeCandidates } from "../../engine/hints";
import { boxIndex, inBounds, createEmptyBoard, cloneBoard } from "../../engine/types";

describe("validators and hints", () => {
  it("detects conflicts", () => {
    const board = [
      [1, 1, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0],
    ];
    const { rows } = validateBoard(board);
    expect(rows[0].some(Boolean)).toBe(true);
  });

  it("isComplete works", () => {
    const complete = [
      [5, 3, 4, 6, 7, 8, 9, 1, 2],
      [6, 7, 2, 1, 9, 5, 3, 4, 8],
      [1, 9, 8, 3, 4, 2, 5, 6, 7],
      [8, 5, 9, 7, 6, 1, 4, 2, 3],
      [4, 2, 6, 8, 5, 3, 7, 9, 1],
      [7, 1, 3, 9, 2, 4, 8, 5, 6],
      [9, 6, 1, 5, 3, 7, 2, 8, 4],
      [2, 8, 7, 4, 1, 9, 6, 3, 5],
      [3, 4, 5, 2, 8, 6, 1, 7, 9],
    ];
    expect(isComplete(complete)).toBe(true);
  });

  it("hints produce single-candidate where applicable", () => {
    const board = [
      [0, 2, 3, 4, 5, 6, 7, 8, 9],
      [0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0],
    ];
    const hint = getHint(board);
    expect(hint).not.toBeNull();
  });

  it("hints find single-position in a row", () => {
    const board = [
      [0, 2, 3, 4, 5, 6, 7, 8, 9],
      [0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0],
    ];
    const cands = computeCandidates(board);
    expect(cands[0][0].size).toBe(1);
    const hint = getHint(board);
    expect(hint).not.toBeNull();
  });

  it("types helpers work as expected", () => {
    const empty = createEmptyBoard();
    expect(empty).toHaveLength(9);
    expect(empty[0]).toHaveLength(9);
    const copy = cloneBoard(empty);
    expect(copy).not.toBe(empty);
    expect(copy[0]).not.toBe(empty[0]);
    expect(boxIndex(0, 0)).toBe(0);
    expect(boxIndex(4, 4)).toBe(4);
    expect(boxIndex(8, 8)).toBe(8);
    expect(inBounds(0, 0)).toBe(true);
    expect(inBounds(9, 0)).toBe(false);
  });
});
