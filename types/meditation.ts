export interface MeditationSession {
  id: string
  duration: number // in seconds
  date: string
  completed: boolean
}

export interface MeditationSettings {
  bellSound: boolean
  darkMode: boolean
  notifications: boolean
  defaultDuration: number
}

export interface Theme {
  mainColor: string
  bgImage: string
} 