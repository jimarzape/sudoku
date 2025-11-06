import { memo } from "react";
import { useGameStore } from "../store/gameStore";

interface CellProps {
  value: number;
  isFixed: boolean;
  isSelected: boolean;
  row: number;
  col: number;
  onClick: () => void;
}

function CellBase({
  value,
  isFixed,
  isSelected,
  row,
  col,
  onClick,
}: CellProps) {
  const board = useGameStore((state) => state.board);
  const selectedCell = useGameStore((state) => state.selectedCell);

  // Check if this cell should be highlighted
  const isHighlighted =
    selectedCell &&
    (selectedCell.r === row ||
      selectedCell.c === col ||
      (Math.floor(selectedCell.r / 3) === Math.floor(row / 3) &&
        Math.floor(selectedCell.c / 3) === Math.floor(col / 3)));

  // Check if this cell has the same value as selected cell
  const hasSameValue =
    selectedCell &&
    board[selectedCell.r][selectedCell.c] !== 0 &&
    board[selectedCell.r][selectedCell.c] === value &&
    value !== 0;

  const getCellClasses = () => {
    let classes =
      "flex items-center justify-center select-none cursor-pointer ";

    // square size responsive
    classes += " text-xl sm:text-2xl md:text-3xl ";

    // Base background
    classes += isFixed ? " bg-gray-50 font-bold " : " bg-white ";

    // Grid lines: thin cell borders, thick 3x3 borders
    classes += " border border-gray-300 ";
    if (col % 3 === 0) classes += " border-l-2 ";
    if (row % 3 === 0) classes += " border-t-2 ";
    if (col === 8) classes += " border-r-2 ";
    if (row === 8) classes += " border-b-2 ";
    if ((col + 1) % 3 === 0) classes += " border-r-2 ";
    if ((row + 1) % 3 === 0) classes += " border-b-2 ";

    // Highlights
    if (isHighlighted && !isSelected) classes += " bg-blue-50 ";
    if (hasSameValue) classes += " bg-yellow-100 ";
    if (isSelected)
      classes +=
        " outline outline-4 outline-blue-600 outline-offset-[-4px] bg-blue-100 z-[1] ";

    return classes;
  };

  const labelParts = [
    `Row ${row + 1}`,
    `Col ${col + 1}`,
    `value ${value === 0 ? "empty" : value}`,
    isFixed ? "fixed" : "editable",
  ];

  return (
    <div
      role="button"
      aria-label={labelParts.join(", ")}
      aria-selected={!!isSelected}
      aria-disabled={isFixed}
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onClick();
        }
      }}
      className={
        getCellClasses() +
        " focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-600"
      }
      onMouseDown={() => onClick()}
      onClick={onClick}
      style={{ aspectRatio: "1 / 1" }}
    >
      {value !== 0 ? value : ""}
    </div>
  );
}

function propsEqual(a: CellProps, b: CellProps) {
  return (
    a.value === b.value &&
    a.isFixed === b.isFixed &&
    a.isSelected === b.isSelected &&
    a.row === b.row &&
    a.col === b.col &&
    a.onClick === b.onClick
  );
}

const Cell = memo(CellBase, propsEqual);
export default Cell;
