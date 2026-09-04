import { Dices, Heart, Coins, Sparkles, AlertCircle } from 'lucide-react'

export default function HowToPlaySection() {
  return (
    <section id="how-to-play" className="py-20 border-t border-border bg-muted/20">
      <div className="max-w-6xl mx-auto px-4">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="text-xs font-bold uppercase tracking-wider text-primary mb-2">How to Play</h2>
          <h3 className="text-3xl sm:text-4xl font-black tracking-tight mb-4">
            Master the Rules and Destiny
          </h3>
          <p className="text-sm sm:text-base text-muted-foreground">
            Simple to start, infinite ways to play. Here is how your choices shape the narrative.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {/* Step 1 */}
          <div className="bg-card border border-border rounded-2xl p-5 relative">
            <div className="text-3xl font-black text-primary/20 mb-2">01</div>
            <h4 className="font-bold text-base mb-2">Choose Class and World</h4>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Select your hero class (Warrior, Mage, Rogue, Cyber Hacker) and theme (Fantasy, Cyberpunk, Sci-Fi).
            </p>
          </div>

          {/* Step 2 */}
          <div className="bg-card border border-border rounded-2xl p-5 relative">
            <div className="text-3xl font-black text-primary/20 mb-2">02</div>
            <h4 className="font-bold text-base mb-2">Roll the D20 Dice</h4>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Every action triggers a 20-sided dice roll:
              <br />
              <strong className="text-green-500">20 = Critical Success</strong>
              <br />
              <strong className="text-red-500">1 = Blunder / Heavy Damage</strong>
            </p>
          </div>

          {/* Step 3 */}
          <div className="bg-card border border-border rounded-2xl p-5 relative">
            <div className="text-3xl font-black text-primary/20 mb-2">03</div>
            <h4 className="font-bold text-base mb-2">Manage Stats and Items</h4>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Loot gold, acquire weapons, and drink potions. Watch your HP—if it drops to 0, your hero falls!
            </p>
          </div>

          {/* Step 4 */}
          <div className="bg-card border border-border rounded-2xl p-5 relative">
            <div className="text-3xl font-black text-primary/20 mb-2">04</div>
            <h4 className="font-bold text-base mb-2">Credit System</h4>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Each action or turn costs 1 credit. Every new player gets <strong>10 free credits</strong> automatically.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}