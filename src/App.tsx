import { useEffect } from "react";
import "./App.css";
import { Box } from "@mui/material";
import AppShell from "./components/AppShell";
import Board from "./components/Board";
import Keypad from "./components/Keypad";
import Toolbar from "./components/Toolbar";
import HintBar from "./components/HintBar";
import SettingsModal from "./components/SettingsModal";
import DevFps from "./components/DevFps";
import { useKeyboard } from "./hooks/useKeyboard";
import { useGameStore } from "./store/gameStore";

function App() {
  const newGame = useGameStore((state) => state.newGame);
  const load = useGameStore((state) => state.load);

  // Initialize keyboard support
  useKeyboard();

  // Load saved game on mount, otherwise start new game
  useEffect(() => {
    load();
    // If no saved game, start a new one
    const hasSavedGame = localStorage.getItem("sudoku:v1");
    if (!hasSavedGame) {
      newGame("easy");
    }
  }, [load, newGame]);

  return (
    <AppShell>
      <Box>
        <Toolbar />
        <SettingsModal />

        <HintBar />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          <div className="flex justify-center">
            <Board />
          </div>

          <div className="flex justify-center">
            <Keypad />
          </div>
        </div>
      </Box>
      {!import.meta.env.PROD && <DevFps />}
    </AppShell>
  );
}

export default App;
