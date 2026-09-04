import { Bot, Zap, ShieldCheck } from 'lucide-react'

export default function AboutSection() {
  return (
    <section id="about" className="py-20 border-t border-border">
      <div className="max-w-6xl mx-auto px-4">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="text-xs font-bold uppercase tracking-wider text-primary mb-2">About QuestCraft</h2>
          <h3 className="text-3xl sm:text-4xl font-black tracking-tight mb-4">
            Next-Gen Text RPG Powered by Real-Time AI
          </h3>
          <p className="text-sm sm:text-base text-muted-foreground">
            QuestCraft combines the classic thrill of tabletop roleplaying games with cutting-edge AI. Every adventure is generated live in response to your decisions.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-card border border-border rounded-2xl p-6 shadow-sm">
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary mb-4">
              <Bot className="w-5 h-5" />
            </div>
            <h4 className="font-bold text-lg mb-2">AI Dungeon Master</h4>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Powered by Groq LLMs, the DM generates adaptive plot twists, dialogue, and consequences based on your choices.
            </p>
          </div>

          <div className="bg-card border border-border rounded-2xl p-6 shadow-sm">
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary mb-4">
              <Zap className="w-5 h-5" />
            </div>
            <h4 className="font-bold text-lg mb-2">Instant Response Time</h4>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Experience lightning-fast narration without waiting. Turns and dice rolls resolve in sub-seconds.
            </p>
          </div>

          <div className="bg-card border border-border rounded-2xl p-6 shadow-sm">
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary mb-4">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h4 className="font-bold text-lg mb-2">Persistent Progress</h4>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Your HP, inventory, gold, and story history are saved securely in Supabase across all your devices.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}