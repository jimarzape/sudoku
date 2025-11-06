import { describe, it, expect } from "vitest";
import { useGameStore } from "../../store/gameStore";

describe("game store", () => {
  // simple localStorage polyfill for Node test env
  if (!(globalThis as any).localStorage) {
    const mem = new Map<string, string>();
    (globalThis as any).localStorage = {
      getItem: (k: string) => (mem.has(k) ? mem.get(k)! : null),
      setItem: (k: string, v: string) => void mem.set(k, v),
      removeItem: (k: string) => void mem.delete(k),
      clear: () => void mem.clear(),
      key: (i: number) => Array.from(mem.keys())[i] ?? null,
      get length() {
        return mem.size;
      },
    };
  }
  it("can create a new game and input digits, undo/redo", () => {
    const s = useGameStore.getState();
    s.newGame("easy");
    const { puzzle } = useGameStore.getState();
    // find an empty cell
    let r = 0,
      c = 0;
    outer: for (let i = 0; i < 9; i++) {
      for (let j = 0; j < 9; j++) {
        if (puzzle[i][j] === 0) {
          r = i;
          c = j;
          break outer;
        }
      }
    }
    useGameStore.getState().selectCell(r, c);
    useGameStore.getState().inputDigit(5);
    expect(useGameStore.getState().board[r][c]).toBe(5);
    useGameStore.getState().undo();
    expect(useGameStore.getState().board[r][c]).toBe(0);
    useGameStore.getState().redo();
    expect(useGameStore.getState().board[r][c]).toBe(5);
  });

  it("persists partial state to localStorage", () => {
    // jsdom localStorage is available via Vitest environment
    useGameStore.getState().save();
    const raw = localStorage.getItem("sudoku:v1");
    expect(raw).toBeTruthy();
    useGameStore.getState().load();
    expect(useGameStore.getState().board.length).toBe(9);
  });
});
