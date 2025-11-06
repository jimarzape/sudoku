# Sudoku (React + TypeScript + Vite)

A performant, accessible Sudoku game built with React, TypeScript, Vite, Tailwind CSS v4, and Material UI. Includes a pure engine, global state with Zustand, keyboard/touch controls, and tests.

## Prerequisites

- Node 18+ (LTS recommended)
- npm 10+

## Install

```bash
npm install
```

## Development

Run the dev server:

```bash
npm run dev -- --host
```

Open the printed URL (e.g., http://localhost:5173). The dev build shows an FPS badge in the corner.

## Build & Preview

```bash
npm run build
npm run preview -- --host
```

## Tests & Coverage

```bash
# Run tests
npm test

# Run tests with coverage (engine coverage ≥ 80%)
npm run test:coverage
```

## Project Structure (key parts)

```
src/
  engine/           # Pure functions (types, solver, generator, validators, hints)
  store/            # Zustand store (game state, persistence)
  components/       # UI (Board, Cell, Toolbar, Keypad, etc.)
  hooks/            # Keyboard shortcuts
  test/setup.ts     # RTL + jest-dom setup
```

## Features

- React + TS + Vite + Tailwind v4 + MUI
- Sudoku engine: solver, generator (unique-solution), validators, hints
- Zustand store: undo/redo, notes, hint, persistence to localStorage
- Accessibility: ARIA grid/cells, keyboard-only gameplay, reduced motion, safe-area insets
- Performance: memoized cells/rows, idle precompute, perf marks, FPS overlay (dev)

## How It Works

- Engine lives in `src/engine/*` and is framework-agnostic.
- UI renders a 9×9 grid; each cell is a focusable "button" with ARIA labels.
- Global state in `src/store/gameStore.ts` persists to `localStorage` under `sudoku:v1` and restores on load.
- Hints use simple strategies; candidates may be precomputed when idle.

## Keyboard Shortcuts

- Arrows: move selection
- 1–9: input value (or note when in note mode)
- 0 / Backspace / Delete: clear cell
- N: toggle note mode
- U / Z: undo
- Y / Shift+Z: redo
- H: hint

## Settings

Open the Settings button (top bar):

- Auto-check conflicts
- Highlight conflicts
- Show candidates
- Smart hints (experimental)
- Theme: light/dark
- Keymap: classic/vim/numpad

## Tailwind v4 Configuration (already set up)

- `src/index.css` imports Tailwind v4:

```css
@import "tailwindcss";
```

- `postcss.config.js` uses the v4 PostCSS plugin:

```js
import tailwind from "@tailwindcss/postcss";
import autoprefixer from "autoprefixer";
export default { plugins: [tailwind(), autoprefixer()] };
```

If you change PostCSS/Tailwind config, restart the dev server.

## Troubleshooting

- Missing styles? Ensure `@import "tailwindcss";` is at the top of `src/index.css` and restart dev server.
- Module resolution error for TSX imports? Use Vite defaults or import with extension (e.g., `./Cell.tsx`).
- Tests fail in Node for `localStorage`? A polyfill is included in store tests.

## License

MIT
