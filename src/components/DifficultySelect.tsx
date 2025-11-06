import { FormControl, InputLabel, MenuItem, Select } from "@mui/material";
import { useGameStore } from "../store/gameStore";
import type { Difficulty } from "../engine/types";

export default function DifficultySelect() {
  const difficulty = useGameStore((state) => state.difficulty);
  const newGame = useGameStore((state) => state.newGame);

  const handleChange = (newDifficulty: Difficulty) => {
    newGame(newDifficulty);
  };

  return (
    <FormControl size="small" className="min-w-32">
      <InputLabel id="difficulty-label">Difficulty</InputLabel>
      <Select
        labelId="difficulty-label"
        label="Difficulty"
        value={difficulty}
        onChange={(e) => handleChange(e.target.value as Difficulty)}
      >
        <MenuItem value="easy">Easy</MenuItem>
        <MenuItem value="medium">Medium</MenuItem>
        <MenuItem value="hard">Hard</MenuItem>
        <MenuItem value="expert">Expert</MenuItem>
      </Select>
    </FormControl>
  );
}
