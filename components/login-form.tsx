import Link from 'next/link'
import { signInAction } from '@/app/actions/auth'
import { Sparkles, ArrowLeft, LogIn } from 'lucide-react'

export default function LoginForm({ searchParams }: { searchParams?: { error?: string; message?: string } }) {
  return (
    <div className="w-full max-w-md bg-card border border-border rounded-3xl p-8 shadow-2xl space-y-6">
      {/* Back Button */}
      <Link
        href="/"
        className="inline-flex items-center gap-2 text-xs font-bold text-muted-foreground hover:text-foreground transition-colors"
      >
        <ArrowLeft className="w-4 h-4" /> Back to Home
      </Link>

      <div className="text-center space-y-2">
        <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-primary/10 text-primary mb-2">
          <Sparkles className="w-6 h-6" />
        </div>
        <h1 className="text-2xl font-black">Welcome Back Hero</h1>
        <p className="text-xs text-muted-foreground">
          Sign in to access your saved campaigns and daily credits
        </p>
      </div>

      {searchParams?.error && (
        <div className="p-3 rounded-xl text-xs font-medium text-center bg-red-500/10 text-red-500 border border-red-500/20">
          {searchParams.error}
        </div>
      )}

      {searchParams?.message && (
        <div className="p-3 rounded-xl text-xs font-medium text-center bg-green-500/10 text-green-500 border border-green-500/20">
          {searchParams.message}
        </div>
      )}

      <form action={signInAction} className="space-y-4">
        <div>
          <label className="text-xs font-bold text-muted-foreground mb-1 block">Email Address</label>
          <input
            type="email"
            name="email"
            required
            className="w-full bg-muted/50 border border-border rounded-xl px-4 py-2.5 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
            placeholder="hero@realm.com"
          />
        </div>

        <div>
          <div className="flex justify-between items-center mb-1">
            <label className="text-xs font-bold text-muted-foreground">Password</label>
            <Link
              href="/auth/forgot-password"
              className="text-xs text-primary font-semibold hover:underline"
            >
              Forgot password?
            </Link>
          </div>
          <input
            type="password"
            name="password"
            required
            className="w-full bg-muted/50 border border-border rounded-xl px-4 py-2.5 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
            placeholder="••••••••"
          />
        </div>

        <button
          type="submit"
          className="w-full bg-foreground text-background font-bold py-3 rounded-xl text-xs flex items-center justify-center gap-2 hover:opacity-90 transition-opacity cursor-pointer"
        >
          <LogIn className="w-4 h-4" /> Sign In
        </button>
      </form>

      <div className="text-center pt-2">
        <span className="text-xs text-muted-foreground">Don't have a hero account? </span>
        <Link href="/auth/sign-up" className="text-xs text-primary font-bold hover:underline">
          Sign up here
        </Link>
      </div>
    </div>
  )
}