import { getCampaignById } from '@/app/actions/rpg'
import RpgGameView from '@/components/rpg-game-view'
import { redirect } from 'next/navigation'

export default async function CampaignPage({ params }: { params: { id: string } }) {
  const { id } = await params
  const campaign = await getCampaignById(id)

  if (!campaign) {
    redirect('/')
  }

  return <RpgGameView initialCampaign={campaign} />
}