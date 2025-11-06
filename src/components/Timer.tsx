import { useEffect, useRef } from "react";
import { useGameStore } from "../store/gameStore";
import { Typography } from "@mui/material";

export default function Timer() {
  const timer = useGameStore((state) => state.timer);
  const intervalRef = useRef<number | null>(null);

  useEffect(() => {
    const start = () => {
      if (intervalRef.current != null) return;
      intervalRef.current = window.setInterval(() => {
        useGameStore.setState((state) => ({ timer: state.timer + 1 }));
      }, 1000);
    };
    const stop = () => {
      if (intervalRef.current != null) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
    // initial start
    start();
    // pause on background, resume on foreground
    const onVis = () => (document.hidden ? stop() : start());
    document.addEventListener("visibilitychange", onVis);
    return () => {
      document.removeEventListener("visibilitychange", onVis);
      stop();
    };
  }, []);

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs
      .toString()
      .padStart(2, "0")}`;
  };

  return (
    <Typography variant="h6" className="font-mono">
      {formatTime(timer)}
    </Typography>
  );
}
