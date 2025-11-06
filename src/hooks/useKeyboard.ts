import { useEffect } from "react";
import { useGameStore } from "../store/gameStore";

export function useKeyboard() {
  const selectedCell = useGameStore((state) => state.selectedCell);
  const selectCell = useGameStore((state) => state.selectCell);
  const inputDigit = useGameStore((state) => state.inputDigit);
  const toggleNote = useGameStore((state) => state.toggleNote);
  const clearCell = useGameStore((state) => state.clearCell);
  const undo = useGameStore((state) => state.undo);
  const redo = useGameStore((state) => state.redo);
  const hint = useGameStore((state) => state.hint);
  const mode = useGameStore((state) => state.mode);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Prevent default for our handled keys
      const handledKeys = [
        "ArrowUp",
        "ArrowDown",
        "ArrowLeft",
        "ArrowRight",
        "N",
        "U",
        "Z",
        "Y",
        "H",
        "Backspace",
        "Delete",
      ];
      if (
        handledKeys.includes(e.key) ||
        (e.key >= "1" && e.key <= "9") ||
        e.key === "0"
      ) {
        e.preventDefault();
      }

      // Arrow keys for navigation
      if (selectedCell) {
        const { r, c } = selectedCell;
        switch (e.key) {
          case "ArrowUp":
            if (r > 0) selectCell(r - 1, c);
            break;
          case "ArrowDown":
            if (r < 8) selectCell(r + 1, c);
            break;
          case "ArrowLeft":
            if (c > 0) selectCell(r, c - 1);
            break;
          case "ArrowRight":
            if (c < 8) selectCell(r, c + 1);
            break;
        }
      }

      // Number input
      if (e.key >= "1" && e.key <= "9") {
        const digit = parseInt(e.key);
        if (mode === "value") {
          inputDigit(digit);
        } else {
          toggleNote(digit);
        }
      }

      // Clear cell
      if (e.key === "0" || e.key === "Backspace" || e.key === "Delete") {
        clearCell();
      }

      // Toggle note mode
      if (e.key === "N" || e.key === "n") {
        useGameStore.setState((state) => ({
          mode: state.mode === "value" ? "note" : "value",
        }));
      }

      // Undo/Redo
      if (e.key === "U" || e.key === "u" || e.key === "Z" || e.key === "z") {
        if (e.shiftKey) {
          redo();
        } else {
          undo();
        }
      }

      // Redo with Y
      if (e.key === "Y" || e.key === "y") {
        redo();
      }

      // Hint
      if (e.key === "H" || e.key === "h") {
        hint();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [
    selectedCell,
    selectCell,
    inputDigit,
    toggleNote,
    clearCell,
    undo,
    redo,
    hint,
    mode,
  ]);
}
