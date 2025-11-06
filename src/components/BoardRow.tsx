import { useGameStore } from '../store/gameStore'
import Cell from './Cell'

interface BoardRowProps { r: number }

export default function BoardRow({ r }: BoardRowProps) {
  const boardRow = useGameStore(state => state.board[r])
  const puzzleRow = useGameStore(state => state.puzzle[r])
  const selectCell = useGameStore(state => state.selectCell)

  return (
    <>
      {boardRow.map((cell, c) => {
        const isFixed = puzzleRow[c] !== 0
        return (
          <Cell
            key={`${r}-${c}`}
            value={cell}
            isFixed={isFixed}
            row={r}
            col={c}
            onClick={() => selectCell(r, c)}
          />
        )
      })}
    </>
  )
}


