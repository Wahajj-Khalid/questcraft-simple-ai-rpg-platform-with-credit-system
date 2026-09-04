'use client'

import { useState } from 'react'
import { Campaign, ChoiceOption, takeTurn } from '@/app/actions/rpg'
import RpgTtsPlayer from '@/components/rpg-tts-player'
import { Dices, Heart, Coins, Backpack, Shield, Sparkles, Send, ArrowLeft, Loader2 } from 'lucide-react'
import Link from 'next/link'

export default function RpgGameView({ initialCampaign }: { initialCampaign: Campaign }) {
  const [campaign, setCampaign] = useState<Campaign>(initialCampaign)
  const [customAction, setCustomAction] = useState('')
  const [rolling, setRolling] = useState(false)
  const [lastDice, setLastDice] = useState<number | null>(null)
  const [loading, setLoading] = useState(false)

  const handleChoice = async (choiceObj: ChoiceOption | string) => {
    if (loading) return
    setLoading(true)

    const actionText = typeof choiceObj === 'string' ? choiceObj : choiceObj.text
    const dcTarget = typeof choiceObj === 'string' ? 10 : choiceObj.dc

    setRolling(true)
    const roll = Math.floor(Math.random() * 20) + 1
    setLastDice(roll)

    setTimeout(async () => {
      setRolling(false)
      const res = await takeTurn(campaign.id, actionText, roll, dcTarget)

      if (res.error) {
        alert(res.error)
      } else if (res.dmTurn) {
        setCampaign((prev) => ({
          ...prev,
          hp: res.hp!,
          gold: res.gold!,
          inventory: res.inventory!,
          story_log: [...prev.story_log, { role: 'player', text: actionText, diceRoll: roll }, res.dmTurn!],
        }))
      }

      setCustomAction('')
      setLoading(false)
    }, 1000)
  }

  const latestDmTurn = [...campaign.story_log].reverse().find((t) => t.role === 'dm')

  return (
    <div className="w-full max-w-6xl mx-auto px-4 py-6 flex flex-col md:flex-row gap-6 min-h-[85vh]">
      {/* Sidebar */}
      <div className="w-full md:w-80 shrink-0 space-y-4">
        <Link href="/" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-2">
          <ArrowLeft className="w-4 h-4" /> Back to Home
        </Link>

        <div className="bg-card border border-border rounded-2xl p-5 shadow-lg space-y-4">
          <div>
            <h2 className="font-bold text-lg text-foreground">{campaign.title}</h2>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-primary/10 text-primary font-semibold mt-1 inline-block">
              {campaign.character_class} • {campaign.world_theme}
            </span>
          </div>

          <div>
            <div className="flex justify-between text-xs font-semibold mb-1">
              <span className="flex items-center gap-1 text-red-500">
                <Heart className="w-3.5 h-3.5 fill-red-500" /> HP
              </span>
              <span>{campaign.hp} / 100</span>
            </div>
            <div className="w-full bg-muted rounded-full h-3 overflow-hidden border border-border">
              <div className="bg-red-500 h-full transition-all duration-500" style={{ width: `${Math.min(100, Math.max(0, campaign.hp))}%` }} />
            </div>
          </div>

          <div className="flex items-center justify-between p-3 bg-muted/40 rounded-xl border border-border">
            <span className="flex items-center gap-2 text-sm font-medium">
              <Coins className="w-4 h-4 text-yellow-500" /> Gold
            </span>
            <span className="font-bold text-yellow-500">{campaign.gold} g</span>
          </div>

          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-2 flex items-center gap-1.5">
              <Backpack className="w-4 h-4 text-foreground" /> Inventory
            </h3>
            <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
              {campaign.inventory.map((item, idx) => (
                <div key={idx} className="text-xs bg-muted/60 px-3 py-1.5 rounded-lg border border-border flex items-center gap-2">
                  <Shield className="w-3 h-3 text-primary shrink-0" />
                  <span className="truncate">{item}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Main Narrative Area */}
      <div className="flex-1 flex flex-col bg-card border border-border rounded-2xl shadow-xl overflow-hidden min-h-[600px]">
        <div className="flex-1 p-6 overflow-y-auto space-y-6">
          {campaign.story_log.map((turn, index) => (
            <div key={index} className={`flex flex-col ${turn.role === 'player' ? 'items-end' : 'items-start'}`}>
              <div className="flex items-center gap-2 text-xs text-muted-foreground mb-1">
                {turn.role === 'dm' ? (
                  <>
                    <Sparkles className="w-3.5 h-3.5 text-primary" />
                    <span className="font-semibold text-primary">Dungeon Master</span>
                    <RpgTtsPlayer text={turn.text} />
                  </>
                ) : (
                  <>
                    <span className="font-semibold">Your Action</span>
                    {turn.diceRoll && (
                      <span className="bg-primary/20 text-primary px-2 py-0.5 rounded-full text-[10px] font-bold">
                        🎲 Rolled {turn.diceRoll}/20
                      </span>
                    )}
                  </>
                )}
              </div>

              <div className={`max-w-[90%] rounded-2xl p-4 text-sm leading-relaxed whitespace-pre-wrap ${turn.role === 'player' ? 'bg-foreground text-background font-medium' : 'bg-muted/50 border border-border text-foreground'}`}>
                {turn.text}
              </div>
            </div>
          ))}

          {loading && (
            <div className="flex items-center gap-2 text-xs text-muted-foreground p-4 bg-muted/20 rounded-xl">
              <Loader2 className="w-4 h-4 animate-spin text-primary" />
              <span>Dungeon Master is calculating your fate...</span>
            </div>
          )}
        </div>

        {/* Dynamic DC Choice Controls */}
        <div className="p-4 border-t border-border bg-muted/20 space-y-3">
          <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider block">
            Choose Action (1 Credit per Turn)
          </span>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
            {latestDmTurn?.choices?.map((choice, i) => (
              <button
                key={i}
                disabled={loading || rolling}
                onClick={() => handleChoice(choice)}
                className="text-xs text-left p-3 rounded-xl bg-card border border-border hover:border-primary hover:bg-primary/5 transition-all flex flex-col justify-between group disabled:opacity-50"
              >
                <span className="font-semibold text-foreground group-hover:text-primary transition-colors">
                  {typeof choice === 'string' ? choice : choice.text}
                </span>
                <span className="text-[10px] text-muted-foreground mt-2 flex items-center justify-between">
                  <span className="flex items-center gap-1">
                    <Dices className="w-3 h-3 text-primary" /> Roll D20
                  </span>
                  {typeof choice !== 'string' && (
                    <span className="font-bold text-primary">DC {choice.dc} ({choice.difficulty})</span>
                  )}
                </span>
              </button>
            ))}
          </div>

          <form
            onSubmit={(e) => {
              e.preventDefault()
              if (customAction.trim()) handleChoice(customAction)
            }}
            className="flex gap-2"
          >
            <input
              type="text"
              value={customAction}
              onChange={(e) => setCustomAction(e.target.value)}
              placeholder="Or type a custom action..."
              disabled={loading || rolling}
              className="flex-1 bg-background border border-border rounded-xl px-4 py-2.5 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
            />
            <button
              type="submit"
              disabled={loading || rolling || !customAction.trim()}
              className="bg-primary text-primary-foreground font-semibold px-4 py-2.5 rounded-xl text-xs flex items-center gap-1.5 hover:opacity-90 disabled:opacity-50"
            >
              <Send className="w-3.5 h-3.5" /> Act
            </button>
          </form>

          {rolling && (
            <div className="text-center py-2 text-xs font-bold text-primary animate-pulse flex items-center justify-center gap-2">
              <Dices className="w-4 h-4 animate-spin" /> Rolling D20...
              {lastDice && <span className="bg-primary text-primary-foreground px-2 py-0.5 rounded-full">{lastDice}</span>}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}