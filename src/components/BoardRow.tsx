import { useGameStore } from '../store/gameStore'
import Cell from './Cell'

interface BoardRowProps { r: number }

export default function BoardRow({ r }: BoardRowProps) {
  const boardRow = useGameStore(state => state.board[r])
  const puzzleRow = useGameStore(state => state.puzzle[r])
  const selectedCell = useGameStore(state => state.selectedCell)
  const selectCell = useGameStore(state => state.selectCell)

  return (
    <>
      {boardRow.map((cell, c) => {
        const isFixed = puzzleRow[c] !== 0
        const isSelected = selectedCell?.r === r && selectedCell?.c === c
        return (
          <Cell
            key={`${r}-${c}`}
            value={cell}
            isFixed={isFixed}
            isSelected={isSelected}
            row={r}
            col={c}
            onClick={() => selectCell(r, c)}
          />
        )
      })}
    </>
  )
}


