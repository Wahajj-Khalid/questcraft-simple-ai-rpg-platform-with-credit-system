import { Layers, Dices, Coins, Shield, Flame, Cpu } from 'lucide-react'

export default function FeaturesSection() {
  const features = [
    {
      icon: <Layers className="w-5 h-5 text-primary" />,
      title: 'Multiple Campaign Saves',
      desc: 'Create as many separate campaigns as you want and switch between them anytime.',
    },
    {
      icon: <Dices className="w-5 h-5 text-primary" />,
      title: 'Interactive D20 Physics',
      desc: 'Real skill checks determined by dice rolls that affect combat and dialogue results.',
    },
    {
      icon: <Coins className="w-5 h-5 text-yellow-500" />,
      title: 'Dynamic Economy and Loot',
      desc: 'AI dynamically awards gold and items based on enemy encounters and skill.',
    },
    {
      icon: <Cpu className="w-5 h-5 text-primary" />,
      title: 'Groq LLM Intelligence',
      desc: 'Leverages fast AI models for instant story responses without lag.',
    },
    {
      icon: <Shield className="w-5 h-5 text-primary" />,
      title: 'Supabase Row Security',
      desc: 'Your character data and credits are protected by strict PostgreSQL security policies.',
    },
    {
      icon: <Flame className="w-5 h-5 text-primary" />,
      title: 'Unlimited Custom Actions',
      desc: 'Type any custom action you can imagine—the AI DM will adapt the scenario.',
    },
  ]

  return (
    <section id="features" className="py-20 border-t border-border">
      <div className="max-w-6xl mx-auto px-4">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="text-xs font-bold uppercase tracking-wider text-primary mb-2">Features</h2>
          <h3 className="text-3xl sm:text-4xl font-black tracking-tight mb-4">
            Everything You Need for Endless Adventures
          </h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((f, i) => (
            <div key={i} className="bg-card border border-border rounded-2xl p-6 shadow-sm hover:border-primary/50 transition-colors">
              <div className="mb-4">{f.icon}</div>
              <h4 className="font-bold text-base mb-2">{f.title}</h4>
              <p className="text-xs text-muted-foreground leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}