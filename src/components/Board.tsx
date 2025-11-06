import { useGameStore } from "../store/gameStore";
import Row from "./BoardRow";
import { useEffect, useRef } from "react";

export default function Board() {
  const board = useGameStore((state) => state.board);
  const boardRef = useRef<HTMLDivElement | null>(null);

  // Deselect cell when clicking outside of the board
  useEffect(() => {
    const handlePointerDown = (e: PointerEvent) => {
      const el = boardRef.current;
      if (!el) return;
      if (!el.contains(e.target as Node)) {
        useGameStore.setState({ selectedCell: null });
      }
    };
    document.addEventListener("pointerdown", handlePointerDown, true);
    return () => document.removeEventListener("pointerdown", handlePointerDown, true);
  }, []);

  return (
    <div
      role="grid"
      aria-label="Sudoku board"
      aria-rowcount={9}
      aria-colcount={9}
      ref={boardRef}
      className="grid grid-cols-9 bg-gray-300 p-1 mx-auto w-full max-w-[540px] aspect-square"
    >
      {board.map((_, r) => (
        <Row key={r} r={r} />
      ))}
    </div>
  );
}
