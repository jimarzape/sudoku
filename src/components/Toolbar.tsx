import { Button, ButtonGroup, Stack } from "@mui/material";
import { useGameStore } from "../store/gameStore";
import DifficultySelect from "./DifficultySelect";
import Timer from "./Timer";

export default function Toolbar() {
  const newGame = useGameStore((state) => state.newGame);
  const undo = useGameStore((state) => state.undo);
  const redo = useGameStore((state) => state.redo);
  const hint = useGameStore((state) => state.hint);
  const reset = useGameStore((state) => state.reset);

  return (
    <Stack direction="row" spacing={2} alignItems="center" className="mb-6">
      <DifficultySelect />

      <ButtonGroup variant="contained" size="small">
        <Button onClick={() => newGame()}>New Game</Button>
        <Button onClick={reset} color="secondary">
          Reset
        </Button>
      </ButtonGroup>

      <ButtonGroup variant="outlined" size="small">
        <Button onClick={undo}>Undo</Button>
        <Button onClick={redo}>Redo</Button>
        <Button onClick={hint} color="primary">
          Hint
        </Button>
      </ButtonGroup>

      <div className="ml-auto">
        <Timer />
      </div>
    </Stack>
  );
}
