import { getUserCampaigns, createNewCampaign, getUserCredits } from '@/app/actions/rpg'
import { createClient } from '@/lib/supabase/server'
import Navbar from '@/components/navbar'
import AboutSection from '@/components/landing/about-section'
import HowToPlaySection from '@/components/landing/how-to-play-section'
import FeaturesSection from '@/components/landing/features-section'
import Footer from '@/components/footer'
import CustomSelect from '@/components/ui/custom-select'
import Link from 'next/link'
import { revalidatePath } from 'next/cache'
import { Plus, Play, Sword, Sparkles } from 'lucide-react'

export default async function HomePage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const campaigns = user ? await getUserCampaigns() : []
  const credits = user ? await getUserCredits() : null

  async function handleCreate(formData: FormData) {
    'use server'
    const title = formData.get('title') as string
    const characterClass = formData.get('characterClass') as string
    const worldTheme = formData.get('worldTheme') as string

    const result = await createNewCampaign(title, characterClass, worldTheme)
    if (result.error) {
      console.error(result.error)
    } else {
      revalidatePath('/')
    }
  }

  const classOptions = [
    { value: 'Warrior', label: 'Warrior (Heavy Armor and Sword)' },
    { value: 'Mage', label: 'Mage (Elemental Spells and Magic)' },
    { value: 'Rogue', label: 'Rogue (Stealth and Daggers)' },
    { value: 'Paladin', label: 'Paladin (Holy Magic and Shield)' },
    { value: 'Ranger', label: 'Ranger (Archery and Survival)' },
  ]

  const themeOptions = [
    { value: 'High Fantasy Realm', label: 'High Fantasy Realm' },
    { value: 'Dark Gothic Mystery', label: 'Dark Gothic Mystery' },
    { value: 'Post-Apocalyptic Wasteland', label: 'Post-Apocalyptic Wasteland' },
    { value: 'Ancient Mythological World', label: 'Ancient Mythological World' },
  ]

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      <Navbar user={user} credits={credits} />

      {/* Hero Section */}
      <div className="w-full max-w-6xl mx-auto px-4 py-16 text-center">
        <span className="px-3.5 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold tracking-wider uppercase inline-flex items-center gap-1.5 mb-4">
          <Sparkles className="w-3.5 h-3.5" /> AI Dungeon Master Engine
        </span>
        <h1 className="text-4xl sm:text-6xl font-black tracking-tight mb-6 leading-tight">
          Craft Your Adventure with <br className="hidden sm:inline" />
          <span className="text-primary">Groq AI and Dice Physics</span>
        </h1>
        <p className="text-muted-foreground text-sm sm:text-base max-w-2xl mx-auto mb-8">
          An interactive text RPG where every decision matters. Choose your class, roll D20 dice, gather loot, and embark on endless quests.
        </p>

        {!user && (
          <div className="flex justify-center gap-4">
            <Link
              href="/auth/sign-up"
              className="bg-foreground text-background font-bold px-8 py-3.5 rounded-full hover:opacity-90 transition-opacity text-sm shadow-lg"
            >
              Start Playing (10 Free Credits)
            </Link>
          </div>
        )}
      </div>

      {/* Campaign Form with Bespoke Selects */}
      {user && (
        <section className="w-full max-w-6xl mx-auto px-4 mb-20">
          <div className="bg-card border border-border rounded-3xl p-6 sm:p-8 shadow-xl space-y-8">
            <div className="flex justify-between items-center border-b border-border pb-4">
              <div>
                <h2 className="text-2xl font-bold flex items-center gap-2">
                  <Sword className="w-6 h-6 text-primary" /> Start New Campaign
                </h2>
                <p className="text-xs text-muted-foreground mt-1">1 Campaign Creation = 1 Credit</p>
              </div>
            </div>

            <form action={handleCreate} className="grid grid-cols-1 sm:grid-cols-4 gap-4 items-center">
              <input
                type="text"
                name="title"
                placeholder="Campaign Name (e.g. Siege of Eldoria)"
                required
                className="bg-muted/50 border border-border rounded-xl px-4 py-2.5 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-primary h-[42px]"
              />

              {/* Bespoke Dark Select 1 */}
              <CustomSelect name="characterClass" options={classOptions} />

              {/* Bespoke Dark Select 2 */}
              <CustomSelect name="worldTheme" options={themeOptions} />

              <button
                type="submit"
                className="bg-primary text-primary-foreground font-bold rounded-xl px-4 py-2.5 text-xs flex items-center justify-center gap-2 hover:opacity-90 transition-opacity cursor-pointer shadow-md h-[42px]"
              >
                <Plus className="w-4 h-4" /> Begin Adventure
              </button>
            </form>

            <div className="pt-6">
              <h3 className="text-lg font-bold mb-4">Your Saved Campaigns</h3>

              {campaigns.length === 0 ? (
                <p className="text-xs text-muted-foreground">No saved campaigns yet. Fill out the form above to launch your first quest!</p>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                  {campaigns.map((c) => (
                    <div
                      key={c.id}
                      className="bg-muted/30 border border-border rounded-2xl p-5 shadow-sm flex flex-col justify-between hover:border-primary transition-colors group"
                    >
                      <div>
                        <div className="flex justify-between items-start mb-3">
                          <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-primary/10 text-primary">
                            {c.character_class}
                          </span>
                          <span className="text-[10px] text-muted-foreground">
                            {new Date(c.updated_at).toLocaleDateString()}
                          </span>
                        </div>

                        <h4 className="font-bold text-base text-foreground group-hover:text-primary transition-colors">
                          {c.title}
                        </h4>
                        <p className="text-xs text-muted-foreground mt-1">{c.world_theme}</p>

                        <div className="flex items-center gap-4 text-xs font-bold mt-4">
                          <span className="text-red-500">{c.hp} HP</span>
                          <span className="text-yellow-500">{c.gold} Gold</span>
                        </div>
                      </div>

                      <Link
                        href={`/rpg/${c.id}`}
                        className="mt-6 w-full bg-foreground text-background font-semibold text-xs py-2.5 rounded-xl flex items-center justify-center gap-2 hover:opacity-90 transition-opacity"
                      >
                        <Play className="w-3.5 h-3.5" /> Continue Quest
                      </Link>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </section>
      )}

      <AboutSection />
      <HowToPlaySection />
      <FeaturesSection />
      <Footer />
    </div>
  )
}