'use server'

import { createClient } from '@/lib/supabase/server'
import Groq from 'groq-sdk'

export type ChoiceOption = {
  text: string
  dc: number
  difficulty: 'Easy' | 'Medium' | 'Hard' | 'Very Hard'
}

export type StoryTurn = {
  role: 'dm' | 'player'
  text: string
  choices?: ChoiceOption[]
  diceRoll?: number
  hpChange?: number
  goldChange?: number
  itemsGained?: string[]
}

export type Campaign = {
  id: string
  user_id: string
  title: string
  character_class: string
  world_theme: string
  hp: number
  gold: number
  inventory: string[]
  story_log: StoryTurn[]
  updated_at: string
}

export async function getUserCredits() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) return null

  const { data, error } = await supabase
    .from('Credits')
    .select('credits_count')
    .eq('user_id', user.id)
    .maybeSingle()

  if (error) {
    console.error('Error fetching credits:', error)
    return 0
  }

  return data ? data.credits_count : 0
}

export async function getUserCampaigns(): Promise<Campaign[]> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return []

  const { data } = await supabase
    .from('GameSessions')
    .select('*')
    .eq('user_id', user.id)
    .order('updated_at', { ascending: false })

  return (data as Campaign[]) || []
}

export async function getCampaignById(id: string): Promise<Campaign | null> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return null

  const { data } = await supabase
    .from('GameSessions')
    .select('*')
    .eq('id', id)
    .eq('user_id', user.id)
    .single()

  return (data as Campaign) || null
}

export async function createNewCampaign(title: string, characterClass: string, worldTheme: string) {
  const apiKey = process.env.GROQ_API_KEY?.trim()
  if (!apiKey || !apiKey.startsWith('gsk_')) {
    return { error: 'Invalid GROQ_API_KEY in .env file.' }
  }

  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'You must be logged in to start a quest.' }

  try {
    const { data: remainingCredits, error: rpcError } = await supabase
      .rpc('deduct_user_credit', { p_user_id: user.id })

    if (rpcError) {
      return { error: 'Out of credits! Credits refresh automatically every 24 hours.' }
    }

    const groq = new Groq({ apiKey })
    const prompt = `You are a fantasy RPG Dungeon Master. Start a campaign.
Hero Class: ${characterClass}
World Theme: ${worldTheme}

Return JSON with narrative and 3 choices. Each choice must have a Difficulty Class (dc) from 5 to 18:
{
  "narrative": "Opening scene text...",
  "choices": [
    { "text": "Choice 1", "dc": 6, "difficulty": "Easy" },
    { "text": "Choice 2", "dc": 12, "difficulty": "Medium" },
    { "text": "Choice 3", "dc": 16, "difficulty": "Hard" }
  ]
}`

    const completion = await groq.chat.completions.create({
      messages: [{ role: 'user', content: prompt }],
      model: 'openai/gpt-oss-20b',
      response_format: { type: 'json_object' },
    })

    const result = JSON.parse(completion.choices[0]?.message?.content || '{}')

    const initialLog: StoryTurn[] = [
      {
        role: 'dm',
        text: result.narrative || 'Your quest begins in a mysterious realm...',
        choices: result.choices || [
          { text: 'Inspect equipment', dc: 5, difficulty: 'Easy' },
          { text: 'Scout ahead carefully', dc: 10, difficulty: 'Medium' },
          { text: 'Charge into the shadows', dc: 15, difficulty: 'Hard' },
        ],
      },
    ]

    const { data: campaign, error: insertError } = await supabase
      .from('GameSessions')
      .insert({
        user_id: user.id,
        title: title || `${characterClass} Quest in ${worldTheme}`,
        character_class: characterClass,
        world_theme: worldTheme,
        hp: 100,
        gold: 50,
        inventory: ['Iron Longsword', 'Health Potion'],
        story_log: initialLog,
      })
      .select('*')
      .single()

    if (insertError) throw insertError

    return { campaign, remainingCredits }
  } catch (error: any) {
    return { error: error.message || 'Failed to create campaign.' }
  }
}

export async function takeTurn(sessionId: string, playerAction: string, diceRoll?: number, dcTarget?: number) {
  const apiKey = process.env.GROQ_API_KEY?.trim()
  if (!apiKey || !apiKey.startsWith('gsk_')) {
    return { error: 'Invalid GROQ_API_KEY in .env file.' }
  }

  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'You must be logged in.' }

  try {
    const { data: remainingCredits, error: rpcError } = await supabase
      .rpc('deduct_user_credit', { p_user_id: user.id })

    if (rpcError) {
      return { error: 'Out of credits! Credits refresh automatically every 24 hours.' }
    }

    const campaign = await getCampaignById(sessionId)
    if (!campaign) return { error: 'Campaign session not found.' }

    const playerTurn: StoryTurn = {
      role: 'player',
      text: playerAction,
      diceRoll,
    }

    const updatedLog = [...campaign.story_log, playerTurn]

    const isSuccess = diceRoll && dcTarget ? diceRoll >= dcTarget : true

    const systemPrompt = `You are a Dungeon Master running a ${campaign.world_theme} RPG for a ${campaign.character_class}.
Current HP: ${campaign.hp}, Gold: ${campaign.gold}, Inventory: ${campaign.inventory.join(', ')}.

The player attempted: "${playerAction}".
Target Difficulty Class (DC): ${dcTarget || 10}.
Player D20 Roll: ${diceRoll || 'N/A'}.
Roll Result: ${isSuccess ? 'SUCCESS' : 'FAILURE'}.

Respond in JSON:
{
  "narrative": "Detailed narrative of what happens based on success or failure...",
  "hpChange": number (negative for damage, positive for healing, 0 for neutral),
  "goldChange": number,
  "itemsGained": ["Item Name"] or [],
  "choices": [
    { "text": "Option A", "dc": 8, "difficulty": "Easy" },
    { "text": "Option B", "dc": 12, "difficulty": "Medium" },
    { "text": "Option C", "dc": 17, "difficulty": "Hard" }
  ]
}`

    const groq = new Groq({ apiKey })
    const completion = await groq.chat.completions.create({
      messages: [
        { role: 'system', content: systemPrompt },
        ...updatedLog.slice(-4).map((turn) => ({
          role: turn.role === 'dm' ? ('assistant' as const) : ('user' as const),
          content: turn.text,
        })),
      ],
      model: 'openai/gpt-oss-20b',
      response_format: { type: 'json_object' },
    })

    const parsed = JSON.parse(completion.choices[0]?.message?.content || '{}')

    const newHp = Math.max(0, campaign.hp + (parsed.hpChange || 0))
    const newGold = Math.max(0, campaign.gold + (parsed.goldChange || 0))
    const newInventory = [...campaign.inventory, ...(parsed.itemsGained || [])]

    const dmTurn: StoryTurn = {
      role: 'dm',
      text: parsed.narrative || 'The journey continues...',
      choices: parsed.choices || [
        { text: 'Advance forward', dc: 6, difficulty: 'Easy' },
        { text: 'Search the area', dc: 11, difficulty: 'Medium' },
        { text: 'Rest', dc: 5, difficulty: 'Easy' },
      ],
      hpChange: parsed.hpChange,
      goldChange: parsed.goldChange,
      itemsGained: parsed.itemsGained,
    }

    const finalLog = [...updatedLog, dmTurn]

    await supabase
      .from('GameSessions')
      .update({
        hp: newHp,
        gold: newGold,
        inventory: newInventory,
        story_log: finalLog,
        updated_at: new Date().toISOString(),
      })
      .eq('id', sessionId)

    return {
      dmTurn,
      hp: newHp,
      gold: newGold,
      inventory: newInventory,
      remainingCredits,
    }
  } catch (error: any) {
    return { error: error.message || 'Failed to process turn.' }
  }
}