"use client";

import { useActionState } from "react";
import { login, signInWithGoogle } from "@/features/auth/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { AlertCircle, Loader2, Mail, Lock } from "lucide-react";

/** Void-typed wrapper — form action prop must return void */
async function googleSignInAction(): Promise<void> {
  await signInWithGoogle();
}

export default function LoginPage() {
  const [state, formAction, isPending] = useActionState(login, null);

  return (
    <div className="space-y-7">
      {/* Heading */}
      <div className="space-y-1.5">
        <h1 className="text-3xl font-bold text-white tracking-tight">
          Welcome back
        </h1>
        <p className="text-slate-400">
          Sign in to your Iron Bridge Finance institutional portal.
        </p>
      </div>

      {/* Google SSO */}
      <form action={googleSignInAction}>
        <Button
          type="submit"
          variant="outline"
          className="w-full gap-3 h-11"
        >
          <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
          </svg>
          Continue with Google
        </Button>
      </form>

      {/* Divider */}
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t border-slate-800" />
        </div>
        <div className="relative flex justify-center text-xs">
          <span className="bg-slate-950 px-3 text-slate-500 uppercase tracking-wider">
            or sign in with email
          </span>
        </div>
      </div>

      {/* Email / Password Form */}
      <form action={formAction} className="space-y-4">
        {state?.error && (
          <div className="flex items-start gap-2.5 p-3 bg-rose-500/10 border border-rose-500/20 rounded-xl text-rose-400 text-sm">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
            <span>{state.error}</span>
          </div>
        )}

        <div className="space-y-1.5">
          <label htmlFor="email" className="block text-xs font-semibold text-slate-400 uppercase tracking-wide">
            Corporate Email
          </label>
          <Input
            id="email"
            name="email"
            type="email"
            placeholder="you@company.com"
            autoComplete="email"
            required
            leftIcon={<Mail className="w-4 h-4" />}
          />
        </div>

        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <label htmlFor="password" className="block text-xs font-semibold text-slate-400 uppercase tracking-wide">
              Password
            </label>
            <Link href="/forgot-password" className="text-xs text-amber-400 hover:text-amber-300 transition-colors">
              Forgot password?
            </Link>
          </div>
          <Input
            id="password"
            name="password"
            type="password"
            autoComplete="current-password"
            required
            leftIcon={<Lock className="w-4 h-4" />}
          />
        </div>

        <Button
          type="submit"
          className="w-full h-11 text-base font-semibold"
          disabled={isPending}
        >
          {isPending ? (
            <span className="flex items-center gap-2">
              <Loader2 className="w-4 h-4 animate-spin" />
              Signing in…
            </span>
          ) : (
            "Sign In to Portal"
          )}
        </Button>
      </form>

      {/* Register link */}
      <p className="text-center text-sm text-slate-500">
        New to Iron Bridge Finance?{" "}
        <Link href="/signup" className="text-amber-400 hover:text-amber-300 font-semibold transition-colors">
          Open an Institutional Account
        </Link>
      </p>

      {/* Regulatory footnote */}
      <p className="text-center text-[10px] text-slate-600 leading-relaxed">
        By signing in, you agree to our{" "}
        <Link href="/terms" className="underline hover:text-slate-400">Terms of Service</Link>
        {" "}and{" "}
        <Link href="/privacy" className="underline hover:text-slate-400">Privacy Policy</Link>.
      </p>
    </div>
  );
}
