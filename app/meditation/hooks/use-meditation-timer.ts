import { useState, useEffect, useRef } from "react"
import { useToast } from "@/hooks/use-toast"

export const useMeditationTimer = (initialDuration: number) => {
  const [duration, setDuration] = useState(initialDuration)
  const [timeLeft, setTimeLeft] = useState(duration)
  const [isActive, setIsActive] = useState(false)
  const [progress, setProgress] = useState(0)
  const timerRef = useRef<NodeJS.Timeout | null>(null)
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const { toast } = useToast()

  useEffect(() => {
    audioRef.current = new Audio("/meditation-bell.mp3")
    return () => {
      if (audioRef.current) {
        audioRef.current.pause()
        audioRef.current = null
      }
    }
  }, [])

  // ... rest of the timer logic

  return {
    duration,
    timeLeft,
    isActive,
    progress,
    setDuration,
    startTimer: () => setIsActive(true),
    pauseTimer: () => setIsActive(false),
    resetTimer: () => {
      setIsActive(false)
      setTimeLeft(duration)
      setProgress(0)
    }
  }
} 