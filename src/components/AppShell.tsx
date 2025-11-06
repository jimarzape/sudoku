import type { ReactNode } from "react";
import {
  AppBar,
  Box,
  Container,
  Toolbar as MuiToolbar,
  Typography,
} from "@mui/material";

interface AppShellProps {
  children: ReactNode;
}

export default function AppShell({ children }: AppShellProps) {
  return (
    <Box className="min-h-screen flex flex-col">
      <AppBar position="static" color="primary">
        <MuiToolbar>
          <Typography variant="h6" component="h1" className="flex-1">
            Sudoku
          </Typography>
        </MuiToolbar>
      </AppBar>

      <Container maxWidth="lg" className="flex-1 py-6" style={{ paddingLeft: 'env(safe-area-inset-left)', paddingRight: 'env(safe-area-inset-right)', paddingBottom: 'env(safe-area-inset-bottom)' }}>
        {children}
      </Container>

      <Box
        component="footer"
        className="py-4 text-center text-gray-500 text-sm"
        style={{ paddingLeft: 'env(safe-area-inset-left)', paddingRight: 'env(safe-area-inset-right)', paddingBottom: 'env(safe-area-inset-bottom)' }}
      >
        <Typography variant="body2">
          Use arrow keys to navigate, digits 1-9 to enter, N for notes, U/Z for
          undo, Y/Shift+Z for redo, H for hint
        </Typography>
      </Box>
    </Box>
  );
}
