import { useGameStore } from "../store/gameStore";
import Row from "./BoardRow";

export default function Board() {
  const board = useGameStore((state) => state.board);

  return (
    <div
      role="grid"
      aria-label="Sudoku board"
      aria-rowcount={9}
      aria-colcount={9}
      className="grid grid-cols-9 bg-gray-300 p-1 mx-auto w-full max-w-[540px] aspect-square"
    >
      {board.map((_, r) => (
        <Row key={r} r={r} />
      ))}
    </div>
  );
}
