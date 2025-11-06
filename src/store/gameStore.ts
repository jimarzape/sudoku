import { create } from "zustand";
import type { Board, Difficulty } from "../engine/types";
import { createEmptyBoard, cloneBoard } from "../engine/types";
import { generatePuzzle } from "../engine/generator";
import { getHint } from "../engine/hints";

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
    performance.mark?.('hint:start');
    const h = getHint(state.board);
    if (!h) return;
    const history = pushHistory(state);
    const board = state.board.map((row) => row.slice());
    board[h.position.r][h.position.c] = h.value;
    set({ board, history, redoStack: [], precomputedCandidates: null });
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
      precomputedCandidates: null,
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
    };
    try {
      localStorage.setItem(LS_KEY, JSON.stringify(payload));
    } catch {}
  });
}
