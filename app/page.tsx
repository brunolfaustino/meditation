"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { formatDistanceToNow } from "date-fns"

interface Session {
  id: string
  duration: number
  date: string
}

export default function WelcomePage() {
  const [sessions, setSessions] = useState<Session[]>([])

  useEffect(() => {
    const storedSessions = localStorage.getItem("meditationSessions")
    if (storedSessions) {
      setSessions(JSON.parse(storedSessions).slice(0, 10))
    }
  }, [])

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-blue-100 to-blue-200 p-4">
      <div className="w-full max-w-md rounded-xl bg-white p-8 shadow-lg relative">
        <span className="absolute top-2 right-2 text-xs text-gray-400 font-light italic">stay curious</span>
        <h1 className="mb-6 text-center text-3xl font-semibold text-blue-600 tracking-tight">Welcome</h1>
        <Link href="/meditation" passHref>
          <Button className="mb-6 w-full">New Session</Button>
        </Link>
        {sessions.length > 0 ? (
          <div>
            <h2 className="mb-4 text-xl font-semibold text-gray-700">Previous Sessions</h2>
            <ul className="space-y-2">
              {sessions.map((session) => (
                <li key={session.id} className="flex justify-between text-sm text-gray-600">
                  <span>{session.duration} minutes</span>
                  <span>{formatDistanceToNow(new Date(session.date), { addSuffix: true })}</span>
                </li>
              ))}
            </ul>
          </div>
        ) : (
          <p className="text-center text-gray-600">No previous sessions</p>
        )}
      </div>
    </main>
  )
}

