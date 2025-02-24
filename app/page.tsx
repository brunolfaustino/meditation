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
    <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-blue-100 to-blue-200 p-4">
      <div className="w-full max-w-md rounded-xl bg-white p-8 shadow-lg relative">
        <h1 className="mb-6 text-center text-3xl font-semibold text-blue-600 tracking-tight">Welcome</h1>
        <Link href="/meditation" passHref>
          <Button className="mb-6 w-full">Start Meditation</Button>
        </Link>
        {sessions.length > 0 ? (
          <div>
            <h2 className="mb-4 text-xl font-semibold text-gray-700">Previous Sessions</h2>
            <ul className="space-y-2">
              {sessions.map((session) => (
                <li 
                  key={session.id} 
                  onClick={() => setSelectedSession(session)}
                  className="flex justify-between text-sm text-gray-600 p-2 hover:bg-gray-50 rounded-lg cursor-pointer"
                >
                  <span>{formatTime(session.duration)}</span>
                  <span>{formatDistanceToNow(new Date(session.date), { addSuffix: true })}</span>
                </li>
              ))}
            </ul>
          </div>
        ) : (
          <p className="text-center text-gray-600">No previous sessions</p>
        )}
        <span className="absolute bottom-2 left-1/2 transform -translate-x-1/2 text-xs text-gray-400 font-light italic">
          stay curious
        </span>
      </div>

      <Dialog open={!!selectedSession} onOpenChange={() => setSelectedSession(null)}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Session Options</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <Button
              onClick={() => selectedSession && handleRepeat(selectedSession.duration)}
              className="flex items-center gap-2"
              variant="outline"
            >
              <Timer className="h-4 w-4" />
              Repeat Session ({selectedSession && formatTime(selectedSession.duration)})
            </Button>
            <Button
              onClick={() => selectedSession && handleDelete(selectedSession.id)}
              className="flex items-center gap-2"
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

