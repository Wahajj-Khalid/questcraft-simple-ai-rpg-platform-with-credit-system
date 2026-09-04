import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'QuestCraft RPG',
  description: 'An interactive text RPG powered by Groq AI and Supabase.',
  icons: {
    icon: '/icon.svg',
    shortcut: '/icon.svg',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="bg-background text-foreground min-h-screen flex flex-col">
        {children}
      </body>
    </html>
  )
}