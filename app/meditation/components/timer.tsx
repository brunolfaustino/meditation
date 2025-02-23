import { NumericKeypad } from "@/components/shared/numeric-keypad"
import { useMeditationTimer } from "../hooks/use-meditation-timer"
// ... rest of the imports

export const MeditationTimer = () => {
  const {
    duration,
    timeLeft,
    isActive,
    progress,
    setDuration,
    startTimer,
    pauseTimer,
    resetTimer
  } = useMeditationTimer(5 * 60)

  // ... rest of the component logic
} 