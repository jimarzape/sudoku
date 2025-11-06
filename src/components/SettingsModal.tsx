import { useState } from "react";
import {
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControlLabel,
  Switch,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Stack,
} from "@mui/material";
import { useGameStore } from "../store/gameStore";
import type { Settings } from "../store/gameStore";
import type { SelectChangeEvent } from "@mui/material/Select";

export default function SettingsModal() {
  const [open, setOpen] = useState(false);
  const settings = useGameStore((state) => state.settings);

  const updateSettings = (updates: Partial<typeof settings>) => {
    useGameStore.setState((state) => ({
      settings: { ...state.settings, ...updates },
    }));
  };

  return (
    <>
      <Button onClick={() => setOpen(true)}>Settings</Button>

      <Dialog
        open={open}
        onClose={() => setOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Settings</DialogTitle>
        <DialogContent>
          <Stack spacing={3} className="pt-4">
            <FormControlLabel
              control={
                <Switch
                  checked={settings.autoCheck}
                  onChange={(e) =>
                    updateSettings({ autoCheck: e.target.checked })
                  }
                />
              }
              label="Auto-check conflicts"
            />

            <FormControlLabel
              control={
                <Switch
                  checked={settings.highlightConflicts}
                  onChange={(e) =>
                    updateSettings({ highlightConflicts: e.target.checked })
                  }
                />
              }
              label="Highlight conflicts"
            />

            <FormControlLabel
              control={
                <Switch
                  checked={settings.showCandidates}
                  onChange={(e) =>
                    updateSettings({ showCandidates: e.target.checked })
                  }
                />
              }
              label="Show candidates"
            />

            <FormControlLabel
              control={
                <Switch
                  checked={settings.smartHints}
                  onChange={(e) =>
                    updateSettings({ smartHints: e.target.checked })
                  }
                />
              }
              label="Smart hints (experimental)"
            />

            <FormControl>
              <InputLabel>Keymap</InputLabel>
              <Select
                value={settings.keymap}
                label="Keymap"
                onChange={(e: SelectChangeEvent) =>
                  updateSettings({
                    keymap: e.target.value as Settings["keymap"],
                  })
                }
              >
                <MenuItem value="classic">Classic</MenuItem>
                <MenuItem value="vim">Vim</MenuItem>
                <MenuItem value="numpad">Numpad</MenuItem>
              </Select>
            </FormControl>

            <FormControl>
              <InputLabel>Theme</InputLabel>
              <Select
                value={settings.theme}
                label="Theme"
                onChange={(e: SelectChangeEvent) =>
                  updateSettings({ theme: e.target.value as Settings["theme"] })
                }
              >
                <MenuItem value="light">Light</MenuItem>
                <MenuItem value="dark">Dark</MenuItem>
              </Select>
            </FormControl>
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)}>Close</Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
