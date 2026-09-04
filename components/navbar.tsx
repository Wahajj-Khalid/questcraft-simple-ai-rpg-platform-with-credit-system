'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Sparkles, Coins, Menu, X, LogOut } from 'lucide-react'
import { ThemeSwitcher } from '@/components/theme-switcher'
import { signOutAction } from '@/app/actions/auth'

type NavbarProps = {
  user: any
  credits: number | null
}

export default function Navbar({ user, credits }: NavbarProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <nav className="w-full border-b border-border bg-card/60 backdrop-blur-md sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 font-black text-xl tracking-tight">
          <Sparkles className="w-6 h-6 text-primary" />
          <span>QuestCraft<span className="text-primary">RPG</span></span>
        </Link>

        {/* Desktop Quick Links */}
        <div className="hidden md:flex items-center gap-8 text-sm font-medium text-muted-foreground">
          <a href="#about" className="hover:text-foreground transition-colors">About</a>
          <a href="#how-to-play" className="hover:text-foreground transition-colors">How to Play</a>
          <a href="#features" className="hover:text-foreground transition-colors">Features</a>
        </div>

        {/* Auth / Profile & Theme Switcher */}
        <div className="hidden md:flex items-center gap-3">
          <ThemeSwitcher />

          {user ? (
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1.5 text-xs bg-muted px-3 py-1.5 rounded-full border border-border">
                <Coins className="w-4 h-4 text-yellow-500" />
                <span className="font-bold">{credits ?? 0} Credits</span>
              </div>
              <form action={signOutAction}>
                <button
                  type="submit"
                  className="p-2 text-muted-foreground hover:text-foreground rounded-full hover:bg-muted transition-colors"
                  title="Sign Out"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </form>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link
                href="/auth/login"
                className="text-xs font-semibold px-4 py-2 rounded-full hover:bg-muted transition-colors"
              >
                Sign In
              </Link>
              <Link
                href="/auth/sign-up"
                className="text-xs font-bold bg-foreground text-background px-4 py-2 rounded-full hover:opacity-90 transition-opacity"
              >
                Sign Up
              </Link>
            </div>
          )}
        </div>

        {/* Mobile Hamburger Button */}
        <div className="flex items-center gap-2 md:hidden">
          <ThemeSwitcher />
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 text-muted-foreground hover:text-foreground"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-border bg-card p-4 space-y-3">
          <a
            href="#about"
            onClick={() => setMobileMenuOpen(false)}
            className="block text-sm font-medium hover:text-primary"
          >
            About
          </a>
          <a
            href="#how-to-play"
            onClick={() => setMobileMenuOpen(false)}
            className="block text-sm font-medium hover:text-primary"
          >
            How to Play
          </a>
          <a
            href="#features"
            onClick={() => setMobileMenuOpen(false)}
            className="block text-sm font-medium hover:text-primary"
          >
            Features
          </a>
          <div className="pt-2 border-t border-border flex flex-col gap-2">
            {user ? (
              <span className="text-xs font-bold text-yellow-500 flex items-center gap-1">
                <Coins className="w-4 h-4" /> {credits ?? 0} Credits
              </span>
            ) : (
              <div className="flex gap-2 w-full">
                <Link
                  href="/auth/login"
                  className="flex-1 text-center text-xs font-bold bg-muted text-foreground py-2 rounded-full border border-border"
                >
                  Sign In
                </Link>
                <Link
                  href="/auth/sign-up"
                  className="flex-1 text-center text-xs font-bold bg-foreground text-background py-2 rounded-full"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  )
}