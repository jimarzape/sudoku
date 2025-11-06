import { create } from "zustand";
import type { Board, Difficulty } from "../engine/types";
import { createEmptyBoard, cloneBoard } from "../engine/types";
import { generatePuzzle } from "../engine/generator";
import { getHint } from "../engine/hints";
import { isValid } from "../engine/solver";

type Mode = "value" | "note";

export interface Settings {
  autoCheck: boolean;
  highlightConflicts: boolean;
  showCandidates: boolean;
  smartHints: boolean;
  theme: "light" | "dark";
  keymap: "classic" | "vim" | "numpad";
}

type Notes = Array<Array<Set<number>>>;

interface HistoryEntry {
  board: Board;
  notes: Notes;
  selectedCell: { r: number; c: number } | null;
}

export interface GameState {
  puzzle: Board;
  solution: Board;
  board: Board;
  notes: Notes;
  selectedCell: { r: number; c: number } | null;
  mode: Mode;
  history: HistoryEntry[];
  redoStack: HistoryEntry[];
  difficulty: Difficulty;
  timer: number;
  settings: Settings;
  precomputedCandidates?: Set<number>[][] | null;
  hintsRemaining: number;

  // actions
  newGame: (difficulty?: Difficulty) => void;
  selectCell: (r: number, c: number) => void;
  inputDigit: (n: number) => void;
  toggleNote: (n: number) => void;
  clearCell: () => void;
  undo: () => void;
  redo: () => void;
  hint: () => void;
  reset: () => void;
  load: () => void;
  save: () => void;
}

const LS_KEY = "sudoku:v1";

function createEmptyNotes(): Notes {
  return Array.from({ length: 9 }, () =>
    Array.from({ length: 9 }, () => new Set<number>())
  );
}

function pushHistory(state: GameState): HistoryEntry[] {
  const entry: HistoryEntry = {
    board: state.board.map((r) => r.slice()),
    notes: state.notes.map((row) => row.map((s) => new Set(s))),
    selectedCell: state.selectedCell ? { ...state.selectedCell } : null,
  };
  return [...state.history, entry];
}

function applyEntry(entry: HistoryEntry): {
  board: Board;
  notes: Notes;
  selectedCell: GameState["selectedCell"];
} {
  return {
    board: entry.board.map((r) => r.slice()),
    notes: entry.notes.map((row) => row.map((s) => new Set(s))),
    selectedCell: entry.selectedCell ? { ...entry.selectedCell } : null,
  };
}

export const useGameStore = create<GameState>((set, get) => ({
  puzzle: createEmptyBoard(),
  solution: createEmptyBoard(),
  board: createEmptyBoard(),
  notes: createEmptyNotes(),
  selectedCell: null,
  mode: "value",
  history: [],
  redoStack: [],
  difficulty: "easy",
  timer: 0,
  settings: {
    autoCheck: true,
    highlightConflicts: true,
    showCandidates: true,
    smartHints: false,
    theme: "light",
    keymap: "classic",
  },
  precomputedCandidates: null,
  hintsRemaining: 3,

  newGame: (difficulty) => {
    const d = difficulty ?? get().difficulty;
    const { puzzle, solution } = generatePuzzle(d);
    set({
      puzzle: cloneBoard(puzzle),
      solution: cloneBoard(solution),
      board: cloneBoard(puzzle),
      notes: createEmptyNotes(),
      selectedCell: null,
      history: [],
      redoStack: [],
      difficulty: d,
      timer: 0,
      precomputedCandidates: null,
      hintsRemaining: 3,
    });
  },

  selectCell: (r, c) => set({ selectedCell: { r, c } }),

  inputDigit: (n) => {
    const state = get();
    if (!state.selectedCell) return;
    const { r, c } = state.selectedCell;
    if (state.puzzle[r][c] !== 0) return; // fixed cell
    const history = pushHistory(state);
    const board = state.board.map((row) => row.slice());
    board[r][c] = n;
    const notes = state.notes.map((row) => row.map((s) => new Set(s)));
    notes[r][c].clear();
    set({ board, notes, history, redoStack: [], precomputedCandidates: null });
    if (typeof window !== 'undefined' && 'requestIdleCallback' in window) {
      (window as any).requestIdleCallback(async () => {
        try {
          const mod = await import('../engine/hints');
          const c = mod.computeCandidates(get().board);
          set({ precomputedCandidates: c });
        } catch {}
      });
    }
  },

  toggleNote: (n) => {
    const state = get();
    if (!state.selectedCell) return;
    const { r, c } = state.selectedCell;
    if (state.puzzle[r][c] !== 0) return;
    const history = pushHistory(state);
    const notes = state.notes.map((row) => row.map((s) => new Set(s)));
    if (notes[r][c].has(n)) notes[r][c].delete(n);
    else notes[r][c].add(n);
    set({ notes, history, redoStack: [] });
  },

  clearCell: () => {
    const state = get();
    if (!state.selectedCell) return;
    const { r, c } = state.selectedCell;
    if (state.puzzle[r][c] !== 0) return;
    const history = pushHistory(state);
    const board = state.board.map((row) => row.slice());
    const notes = state.notes.map((row) => row.map((s) => new Set(s)));
    board[r][c] = 0;
    notes[r][c].clear();
    set({ board, notes, history, redoStack: [], precomputedCandidates: null });
  },

  undo: () => {
    const state = get();
    if (state.history.length === 0) return;
    const history = state.history.slice();
    const last = history.pop()!;
    const redoStack = [
      ...state.redoStack,
      {
        board: state.board.map((r) => r.slice()),
        notes: state.notes.map((row) => row.map((s) => new Set(s))),
        selectedCell: state.selectedCell ? { ...state.selectedCell } : null,
      },
    ];
    const next = applyEntry(last);
    set({ ...next, history, redoStack });
  },

  redo: () => {
    const state = get();
    if (state.redoStack.length === 0) return;
    const redoStack = state.redoStack.slice();
    const entry = redoStack.pop()!;
    const history = pushHistory(state);
    const next = applyEntry(entry);
    set({ ...next, history, redoStack });
  },

  hint: () => {
    const state = get();
    if (state.hintsRemaining <= 0) return;
    // Require a selected editable cell
    const sel = state.selectedCell;
    if (!sel) return;
    if (state.puzzle[sel.r][sel.c] !== 0) return;
    if (state.board[sel.r][sel.c] !== 0) return;
    performance.mark?.('hint:start');
    // First try to compute a hint specifically for the selected cell
    const { r, c } = sel;
    let value: number | null = null;
    // Technique 1: single-candidate for selected cell
    const candidates: number[] = [];
    for (let n = 1; n <= 9; n++) if (isValid(state.board, r, c, n)) candidates.push(n);
    if (candidates.length === 1) {
      value = candidates[0];
    } else {
      // Technique 2: single-position in row/col/box for selected cell
      // Row
      for (let n = 1; n <= 9 && value === null; n++) {
        if (!isValid(state.board, r, c, n)) continue;
        let onlyHere = true;
        for (let cc = 0; cc < 9; cc++) {
          if (cc === c) continue;
          if (state.board[r][cc] === 0 && isValid(state.board, r, cc, n)) {
            onlyHere = false;
            break;
          }
        }
        if (onlyHere) value = n;
      }
      // Col
      for (let n = 1; n <= 9 && value === null; n++) {
        if (!isValid(state.board, r, c, n)) continue;
        let onlyHere = true;
        for (let rr = 0; rr < 9; rr++) {
          if (rr === r) continue;
          if (state.board[rr][c] === 0 && isValid(state.board, rr, c, n)) {
            onlyHere = false;
            break;
          }
        }
        if (onlyHere) value = n;
      }
      // Box
      const br = Math.floor(r / 3) * 3;
      const bc = Math.floor(c / 3) * 3;
      for (let n = 1; n <= 9 && value === null; n++) {
        if (!isValid(state.board, r, c, n)) continue;
        let onlyHere = true;
        for (let i = 0; i < 3; i++) {
          for (let j = 0; j < 3; j++) {
            const rr = br + i;
            const cc = bc + j;
            if (rr === r && cc === c) continue;
            if (state.board[rr][cc] === 0 && isValid(state.board, rr, cc, n)) {
              onlyHere = false;
              break;
            }
          }
          if (!onlyHere) break;
        }
        if (onlyHere) value = n;
      }
    }
    // Fallback: use generic hint only if it targets selected cell
    if (value === null) {
      const h = getHint(state.board);
      if (!h) return;
      if (h.position.r !== r || h.position.c !== c) return;
      value = h.value;
    }
    if (value === null) return;
    const history = pushHistory(state);
    const board = state.board.map((row) => row.slice());
    board[r][c] = value;
    set({ board, history, redoStack: [], precomputedCandidates: null, hintsRemaining: state.hintsRemaining - 1 });
    performance.mark?.('hint:end');
    performance.measure?.('hint', 'hint:start', 'hint:end');
  },

  reset: () => {
    const state = get();
    const history = pushHistory(state);
    set({
      board: cloneBoard(state.puzzle),
      notes: createEmptyNotes(),
      history,
      redoStack: [],
      timer: 0,
      precomputedCandidates: null,
      hintsRemaining: 3,
    });
  },

  save: () => {
    const state = get();
    const payload = {
      puzzle: state.puzzle,
      solution: state.solution,
      board: state.board,
      notes: state.notes.map((row) => row.map((s) => Array.from(s))),
      difficulty: state.difficulty,
      timer: state.timer,
      settings: state.settings,
      hintsRemaining: state.hintsRemaining,
    };
    try {
      localStorage.setItem(LS_KEY, JSON.stringify(payload));
    } catch {}
  },

  load: () => {
    try {
      const raw = localStorage.getItem(LS_KEY);
      if (!raw) return;
      const data = JSON.parse(raw);
      const notes: Notes =
        (data.notes as number[][][] | undefined)?.map((row) =>
          row.map((arr) => new Set(arr))
        ) ?? createEmptyNotes();
      set({
        puzzle: data.puzzle ?? createEmptyBoard(),
        solution: data.solution ?? createEmptyBoard(),
        board: data.board ?? createEmptyBoard(),
        notes,
        difficulty: data.difficulty ?? "easy",
        timer: data.timer ?? 0,
        settings: { ...get().settings, ...(data.settings ?? {}) },
        hintsRemaining: data.hintsRemaining ?? 3,
      });
    } catch {}
  },
}));

// Auto-persist selected fields whenever they change
if (typeof window !== "undefined") {
  useGameStore.subscribe((state) => {
    const payload = {
      puzzle: state.puzzle,
      solution: state.solution,
      board: state.board,
      notes: state.notes.map((row) => row.map((s) => Array.from(s))),
      difficulty: state.difficulty,
      timer: state.timer,
      settings: state.settings,
      hintsRemaining: state.hintsRemaining,
    };
    try {
      localStorage.setItem(LS_KEY, JSON.stringify(payload));
    } catch {}
  });
}
