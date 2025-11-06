import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { CssBaseline, ThemeProvider, createTheme } from "@mui/material";

const settings = (() => {
  try {
    const raw = localStorage.getItem("sudoku:v1");
    if (raw) return JSON.parse(raw).settings as { theme?: "light" | "dark" };
  } catch {}
  return {} as { theme?: "light" | "dark" };
})();

const theme = createTheme({
  palette: {
    mode: settings.theme === "dark" ? "dark" : "light",
  },
});

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <App />
    </ThemeProvider>
  </StrictMode>
);
