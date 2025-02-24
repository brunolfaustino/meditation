"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { formatDistanceToNow } from "date-fns"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Trash2, Timer } from "lucide-react"
import { useRouter } from "next/navigation"

interface Session {
  id: string
  duration: number
  date: string
}

const formatTime = (seconds: number) => {
  const mins = Math.floor(seconds / 60)
  const secs = seconds % 60
  return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`
}

export default function WelcomePage() {
  const [sessions, setSessions] = useState<Session[]>([])
  const [selectedSession, setSelectedSession] = useState<Session | null>(null)
  const router = useRouter()

  useEffect(() => {
    const storedSessions = localStorage.getItem("meditationSessions")
    if (storedSessions) {
      try {
        const sessions = JSON.parse(storedSessions)
        // Take only the first 10 sessions, they're already in chronological order
        setSessions(sessions.slice(0, 10))
      } catch (error) {
        console.error("Error parsing sessions:", error)
        setSessions([])
      }
    }
  }, [])

  const handleDelete = (sessionId: string) => {
    const updatedSessions = sessions.filter(s => s.id !== sessionId)
    setSessions(updatedSessions)
    localStorage.setItem("meditationSessions", JSON.stringify(updatedSessions))
    setSelectedSession(null)
  }

  const handleRepeat = (duration: number) => {
    sessionStorage.setItem("repeatDuration", duration.toString())
    router.push("/meditation")
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
        <h1 className="mb-6 text-center text-3xl font-semibold text-blue-900 tracking-tight">Welcome</h1>
        <Link href="/meditation" passHref>
          <Button className="mb-6 w-full bg-blue-900 hover:bg-blue-800 text-lg h-12 rounded-xl">
            Start Meditation
          </Button>
        </Link>
        {sessions.length > 0 ? (
          <div>
            <h2 className="mb-4 text-xl font-semibold text-blue-900">Previous Sessions</h2>
            <ul className="space-y-2">
              {sessions.slice(0, 5).map((session) => (
                <li 
                  key={session.id} 
                  onClick={() => setSelectedSession(session)}
                  className="flex justify-between text-sm text-blue-900 p-3 hover:bg-blue-50 rounded-xl cursor-pointer border border-blue-100 transition-colors"
                >
                  <span className="font-medium">{formatTime(session.duration)}</span>
                  <span className="text-blue-700">{formatDistanceToNow(new Date(session.date), { addSuffix: true })}</span>
                </li>
              ))}
            </ul>
          </div>
        ) : (
          <p className="text-center text-blue-900/60">No previous sessions</p>
        )}
        <span className="absolute bottom-4 left-1/2 transform -translate-x-1/2 text-xs text-blue-900/60 font-light italic">
          stay curious
        </span>
      </div>

      <Dialog open={!!selectedSession} onOpenChange={() => setSelectedSession(null)}>
        <DialogContent className="sm:max-w-[425px] rounded-2xl">
          <DialogHeader>
            <DialogTitle className="text-blue-900">Session Options</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <Button
              onClick={() => selectedSession && handleRepeat(selectedSession.duration)}
              className="flex items-center gap-2 bg-blue-900 hover:bg-blue-800 h-12 rounded-xl"
            >
              <Timer className="h-4 w-4" />
              Repeat Session ({selectedSession && formatTime(selectedSession.duration)})
            </Button>
            <Button
              onClick={() => selectedSession && handleDelete(selectedSession.id)}
              className="flex items-center gap-2 h-12 rounded-xl"
              variant="destructive"
            >
              <Trash2 className="h-4 w-4" />
              Delete Session
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </main>
  )
}

