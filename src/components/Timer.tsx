import { useEffect } from "react";
import { useGameStore } from "../store/gameStore";
import { Typography } from "@mui/material";

export default function Timer() {
  const timer = useGameStore((state) => state.timer);

  useEffect(() => {
    const interval = setInterval(() => {
      useGameStore.setState((state) => ({ timer: state.timer + 1 }));
    }, 1000);

    const handleVisibility = () => {
      if (document.hidden) {
        clearInterval(interval);
      }
    };
    document.addEventListener("visibilitychange", handleVisibility);

    return () => clearInterval(interval);
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
