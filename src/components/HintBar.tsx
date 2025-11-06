import { Alert, AlertTitle } from "@mui/material";
import { useGameStore } from "../store/gameStore";
import { getHint } from "../engine/hints";

export default function HintBar() {
  const board = useGameStore((state) => state.board);
  const selectedCell = useGameStore((state) => state.selectedCell);

  const hint = getHint(board);

  if (!hint) return null;

  const isSelectedCellHint =
    selectedCell &&
    selectedCell.r === hint.position.r &&
    selectedCell.c === hint.position.c;

  return (
    <Alert
      severity="info"
      className={`mb-4 ${isSelectedCellHint ? "ring-2 ring-blue-500" : ""}`}
      aria-live="polite"
    >
      <AlertTitle>Hint Available</AlertTitle>
      <div>
        <strong>Technique:</strong>{" "}
        {hint.technique === "single-candidate"
          ? "Single Candidate"
          : "Single Position"}
      </div>
      <div>
        <strong>Position:</strong> Row {hint.position.r + 1}, Column{" "}
        {hint.position.c + 1}
      </div>
      <div>
        <strong>Value:</strong> {hint.value}
      </div>
    </Alert>
  );
}
