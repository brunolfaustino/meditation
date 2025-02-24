"use client"

import { useState, useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import { Play, Pause, RefreshCw } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { toast } from "@/hooks/use-toast"

export default function MeditationTimer() {
  const [duration, setDuration] = useState(5 * 60) // Duration in seconds
  const [timeLeft, setTimeLeft] = useState(duration)
  const [isActive, setIsActive] = useState(false)
  const [progress, setProgress] = useState(0)
  const [isEditing, setIsEditing] = useState(false)
  const [editMinutes, setEditMinutes] = useState(5)
  const [editSeconds, setEditSeconds] = useState(0)
  const timerRef = useRef<NodeJS.Timeout | null>(null)
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const router = useRouter()

  useEffect(() => {
    audioRef.current = new Audio("/meditation-bell.mp3")
    return () => {
      if (audioRef.current) {
        audioRef.current.pause()
        audioRef.current = null
      }
    }
  }, [])

  useEffect(() => {
    setTimeLeft(duration)
  }, [duration])

  useEffect(() => {
    if (isActive && timeLeft > 0) {
      timerRef.current = setTimeout(() => {
        setTimeLeft(timeLeft - 1)
        setProgress(((duration - timeLeft + 1) / duration) * 100)
      }, 1000)
    } else if (timeLeft === 0) {
      setIsActive(false)
      if (audioRef.current) {
        audioRef.current.play()
      }
      saveSession()
      toast({
        title: "Session completed",
        description: "Great job! Your meditation session is complete.",
        duration: 3000,
      })
    }

    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current)
      }
    }
  }, [isActive, timeLeft, duration])

  useEffect(() => {
    // Check for repeated session duration
    const repeatDuration = sessionStorage.getItem("repeatDuration")
    if (repeatDuration) {
      const duration = parseInt(repeatDuration)
      setDuration(duration)
      setEditMinutes(Math.floor(duration / 60))
      setEditSeconds(duration % 60)
      // Clear the stored duration
      sessionStorage.removeItem("repeatDuration")
    }
  }, [])

  const handleTimerToggle = () => {
    setIsActive(!isActive)
  }

  const handleTimerReset = () => {
    setIsActive(false)
    setTimeLeft(duration)
    setProgress(0)
  }

  const handleEditDialogOpen = (isOpen: boolean) => {
    setIsEditing(isOpen)
  }

  const handleMinutesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEditMinutes(Number.parseInt(e.target.value) || 0)
  }

  const handleSecondsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEditSeconds(Number.parseInt(e.target.value) || 0)
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`
  }

  const saveSession = () => {
    // Only save if there was actual meditation time
    if (duration - timeLeft > 0) {
      const newSession = {
        id: Date.now().toString(),
        duration: duration - timeLeft,
        date: new Date().toISOString(),
      }
      
      try {
        // Get existing sessions
        const storedSessions = localStorage.getItem("meditationSessions")
        let sessions = []
        
        if (storedSessions) {
          sessions = JSON.parse(storedSessions)
          
          // Check if this exact session already exists (same duration and within last 2 seconds)
          const now = Date.now()
          const isDuplicate = sessions.some(session => {
            const sessionTime = new Date(session.date).getTime()
            return session.duration === newSession.duration && 
                   Math.abs(now - sessionTime) < 2000
          })
          
          if (isDuplicate) {
            return // Don't save duplicate session
          }
        }
        
        // Add new session at the beginning
        sessions.unshift(newSession)
        
        // Keep only the last 10 sessions
        const updatedSessions = sessions.slice(0, 10)
        
        // Save back to localStorage
        localStorage.setItem("meditationSessions", JSON.stringify(updatedSessions))
      } catch (error) {
        console.error("Error saving session:", error)
      }
    }
  }

  const handleEditSubmit = () => {
    const newDuration = editMinutes * 60 + editSeconds
    setDuration(newDuration)
    setTimeLeft(newDuration)
    setIsEditing(false)
  }

  return (
    <main 
      className="flex min-h-screen flex-col items-center justify-center p-4 bg-cover bg-center"
      style={{
        backgroundImage: "url('/forest-background.jpg?v=1')",
        backgroundColor: "rgba(0, 0, 0, 0.3)",
        backgroundBlend: "overlay"
      }}
    >
      <div className="w-full max-w-md rounded-[2rem] bg-white/90 backdrop-blur-sm p-8 shadow-2xl relative border border-blue-900/10">
        <div className="mb-8 flex items-center justify-center">
          <Dialog open={isEditing} onOpenChange={handleEditDialogOpen}>
            <DialogTrigger asChild>
              <div 
                className="relative h-48 w-48 cursor-pointer"
                role="button"
                tabIndex={0}
                aria-label="Edit meditation timer"
                onKeyDown={(e) => e.key === 'Enter' && handleEditDialogOpen(true)}
              >
                <svg className="h-full w-full" viewBox="0 0 100 100">
                  <circle
                    className="stroke-current text-blue-100"
                    strokeWidth="4"
                    cx="50"
                    cy="50"
                    r="48"
                    fill="transparent"
                  />
                  <circle
                    className="stroke-current text-blue-900"
                    strokeWidth="4"
                    strokeLinecap="round"
                    cx="50"
                    cy="50"
                    r="48"
                    fill="transparent"
                    strokeDasharray="301.59"
                    strokeDashoffset={301.59 - (progress / 100) * 301.59}
                    transform="rotate(-90 50 50)"
                  />
                </svg>
                <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 transform text-center">
                  <span className="text-4xl font-bold text-blue-900">{formatTime(timeLeft)}</span>
                </div>
              </div>
            </DialogTrigger>
            <DialogContent className="rounded-2xl">
              <DialogHeader>
                <DialogTitle className="text-blue-900">Edit Timer</DialogTitle>
              </DialogHeader>
              <div className="flex items-center space-x-2">
                <Input
                  type="number"
                  value={editMinutes}
                  onChange={handleMinutesChange}
                  min={0}
                  max={59}
                  className="w-20 rounded-xl border-blue-200 focus:border-blue-900 focus:ring-blue-900"
                  aria-label="Minutes"
                />
                <span className="text-blue-900">minutes</span>
                <Input
                  type="number"
                  value={editSeconds}
                  onChange={handleSecondsChange}
                  min={0}
                  max={59}
                  className="w-20 rounded-xl border-blue-200 focus:border-blue-900 focus:ring-blue-900"
                  aria-label="Seconds"
                />
                <span className="text-blue-900">seconds</span>
              </div>
              <Button 
                onClick={handleEditSubmit}
                className="bg-blue-900 hover:bg-blue-800 rounded-xl h-12"
                aria-label="Save timer settings"
              >
                Save
              </Button>
            </DialogContent>
          </Dialog>
        </div>
        <div className="flex justify-center space-x-4">
          <Button 
            onClick={handleTimerToggle} 
            className="w-24 h-12 bg-blue-900 hover:bg-blue-800 rounded-xl"
            aria-label={isActive ? "Pause meditation timer" : "Start meditation timer"}
          >
            {isActive ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5" />}
          </Button>
          <Button 
            onClick={handleTimerReset} 
            variant="outline" 
            className="w-24 h-12 border-blue-200 text-blue-900 hover:bg-blue-50 rounded-xl"
            aria-label="Reset meditation timer"
          >
            <RefreshCw className="h-5 w-5" />
          </Button>
        </div>
        <Button 
          onClick={() => router.push("/")} 
          variant="link" 
          className="mt-4 w-full text-blue-900 hover:text-blue-800"
          aria-label="Return to home page"
        >
          Back to Home
        </Button>
      </div>
    </main>
  )
}

