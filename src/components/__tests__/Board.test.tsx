import { describe, it, expect } from 'vitest'
import { render, screen, within, fireEvent } from '@testing-library/react'
import Board from '../../components/Board'
import { useGameStore } from '../../store/gameStore'

function seedSimplePuzzle() {
  const puzzle = Array.from({ length: 9 }, () => Array(9).fill(0))
  puzzle[0][0] = 5 // fixed cell
  const board = puzzle.map(r => r.slice())
  useGameStore.setState({ puzzle, board, selectedCell: null })
}

describe('Board component', () => {
  it('renders a 9x9 grid and allows selecting a cell', () => {
    seedSimplePuzzle()
    render(<Board />)

    const [grid] = screen.getAllByRole('grid', { name: /sudoku board/i })
    const cells = within(grid).getAllByRole('button')
    expect(cells).toHaveLength(81)

    // click an editable cell
    const target = cells[1]
    fireEvent.click(target)
    expect(target.getAttribute('aria-selected')).toBe('true')
  })

  it('updates board via store inputDigit after selection', () => {
    seedSimplePuzzle()
    render(<Board />)
    const [grid] = screen.getAllByRole('grid', { name: /sudoku board/i })
    const cells = within(grid).getAllByRole('button')

    // select [0,1]
    fireEvent.click(cells[1])
    useGameStore.getState().inputDigit(7)
    expect(useGameStore.getState().board[0][1]).toBe(7)
  })
})


