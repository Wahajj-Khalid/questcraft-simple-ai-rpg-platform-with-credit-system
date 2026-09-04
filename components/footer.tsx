import Link from 'next/link'
import { Sparkles } from 'lucide-react'

export default function Footer() {
  return (
    <footer className="w-full border-t border-border bg-card py-12 mt-auto">
      <div className="max-w-6xl mx-auto px-4 flex flex-col sm:flex-row justify-between items-center gap-6">
        <div className="flex items-center gap-2 font-black text-lg">
          <Sparkles className="w-5 h-5 text-primary" />
          <span>QuestCraft RPG</span>
        </div>

        <div className="flex items-center gap-6 text-xs text-muted-foreground">
          <a href="#about" className="hover:text-foreground transition-colors">About</a>
          <a href="#how-to-play" className="hover:text-foreground transition-colors">How to Play</a>
          <a href="#features" className="hover:text-foreground transition-colors">Features</a>
        </div>

        <p className="text-xs text-muted-foreground">
          © {new Date().getFullYear()} QuestCraft. Powered by Next.js, Supabase & Groq AI.
        </p>
      </div>
    </footer>
  )
}