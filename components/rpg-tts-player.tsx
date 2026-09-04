'use client'

import { useState, useRef } from 'react'
import { Volume2, VolumeX, Loader2 } from 'lucide-react'

export default function RpgTtsPlayer({ text }: { text: string }) {
  const [isPlaying, setIsPlaying] = useState(false)
  const [loading, setLoading] = useState(false)
  const audioRef = useRef<HTMLAudioElement | null>(null)

  const handleToggleAudio = () => {
    if (isPlaying && audioRef.current) {
      audioRef.current.pause()
      audioRef.current.currentTime = 0
      setIsPlaying(false)
      return
    }

    if (!text.trim()) return

    setLoading(true)

    if (audioRef.current) {
      audioRef.current.pause()
    }

    const ttsUrl = `/api/tts?text=${encodeURIComponent(text)}`
    const audio = new Audio(ttsUrl)
    audioRef.current = audio

    audio.oncanplaythrough = () => {
      setLoading(false)
      setIsPlaying(true)
      audio.play().catch(() => setIsPlaying(false))
    }

    audio.onended = () => setIsPlaying(false)
    audio.onerror = () => {
      setLoading(false)
      setIsPlaying(false)
      alert('Failed to load narrator voice.')
    }
  }

  return (
    <button
      onClick={handleToggleAudio}
      type="button"
      disabled={loading}
      className="inline-flex items-center gap-1.5 text-xs text-primary font-semibold bg-primary/10 hover:bg-primary/20 px-3 py-1 rounded-full transition-all cursor-pointer disabled:opacity-50"
    >
      {loading ? (
        <Loader2 className="w-3.5 h-3.5 animate-spin text-primary" />
      ) : isPlaying ? (
        <VolumeX className="w-3.5 h-3.5 text-red-500 animate-pulse" />
      ) : (
        <Volume2 className="w-3.5 h-3.5" />
      )}
      <span>{loading ? 'Generating Voice...' : isPlaying ? 'Stop Narration' : 'Listen Narration'}</span>
    </button>
  )
}