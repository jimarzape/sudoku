import { Button, ButtonGroup } from "@mui/material";
import { useGameStore } from "../store/gameStore";

export default function Keypad() {
  const mode = useGameStore((state) => state.mode);
  const inputDigit = useGameStore((state) => state.inputDigit);
  const toggleNote = useGameStore((state) => state.toggleNote);
  const clearCell = useGameStore((state) => state.clearCell);

  const handleNumber = (n: number, note: boolean) => {
    if (note) toggleNote(n); else inputDigit(n)
  }

  // long-press support for notes on touch
  let longPressTimer: number | undefined
  const startPress = (n: number) => {
    clearPress()
    longPressTimer = window.setTimeout(() => handleNumber(n, true), 450)
  }
  const endPress = (n: number) => {
    if (longPressTimer) {
      window.clearTimeout(longPressTimer)
      longPressTimer = undefined
      handleNumber(n, false)
    }
  }
  const clearPress = () => {
    if (longPressTimer) {
      window.clearTimeout(longPressTimer)
      longPressTimer = undefined
    }
  }

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="text-sm text-gray-600 mb-2">
        Mode:{" "}
        <span className="font-semibold">
          {mode === "value" ? "Value" : "Note"}
        </span>
      </div>

      <div className="grid grid-cols-3 gap-2">
        {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((n) => (
          <Button
            key={n}
            aria-label={`Digit ${n}${mode === 'note' ? ' (note)' : ''}`}
            variant="outlined"
            size="large"
            className="w-16 h-16 text-xl font-semibold"
            onClick={() => handleNumber(n, mode === 'note')}
            onPointerDown={(e) => { if (e.pointerType !== 'mouse') startPress(n) }}
            onPointerUp={() => endPress(n)}
            onPointerCancel={clearPress}
          >
            {n}
          </Button>
        ))}
      </div>

      <ButtonGroup variant="outlined" size="small">
        <Button onClick={clearCell}>Clear</Button>
        <Button
          onClick={() =>
            useGameStore.setState({ mode: mode === "value" ? "note" : "value" })
          }
          color={mode === "note" ? "primary" : "inherit"}
        >
          Notes
        </Button>
      </ButtonGroup>
    </div>
  );
}
