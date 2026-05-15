"use client";

import { useActionState } from "react"
import { signup } from "@/features/auth/actions"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import Link from "next/link"

export default function SignupPage() {
  const [state, formAction, isPending] = useActionState(signup, null)

  return (
    <div className="space-y-6">
      <div className="space-y-2 text-center">
        <h1 className="text-3xl font-bold">Create an account</h1>
        <p className="text-muted-foreground">Start your institutional investment journey</p>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <Button variant="outline" className="w-full">
          <svg className="w-4 h-4 mr-2 fill-current" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path d="M12.48 10.92v3.28h7.84c-.24 1.84-.908 3.152-1.896 4.14-1.236 1.236-3.144 2.68-6.6 2.68-5.792 0-10.304-4.68-10.304-10.472s4.512-10.472 10.304-10.472c3.132 0 5.424 1.236 7.116 2.856l2.316-2.316C18.84 1.104 15.984 0 12.48 0 5.868 0 .432 5.436.432 12s5.436 12 12.048 12c3.516 0 6.168-1.152 8.22-3.3 2.124-2.124 2.796-5.112 2.796-7.584 0-.732-.06-1.416-.18-2.04H12.48z"/>
          </svg>
          Google
        </Button>
        <Button variant="outline" className="w-full">
          <svg className="w-4 h-4 mr-2 fill-current" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"/>
          </svg>
          GitHub
        </Button>
      </div>

      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-background px-2 text-muted-foreground">Or continue with</span>
        </div>
      </div>

      <form action={formAction} className="space-y-4">
        {state?.error && (
          <div className="p-3 text-sm bg-destructive/10 border border-destructive/20 text-destructive rounded-xl">
            {state.error}
          </div>
        )}
        {state?.success && (
          <div className="p-3 text-sm bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 rounded-xl">
            {state.success}
          </div>
        )}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <label htmlFor="firstName">First Name</label>
            <Input id="firstName" name="firstName" placeholder="John" required />
          </div>
          <div className="space-y-2">
            <label htmlFor="lastName">Last Name</label>
            <Input id="lastName" name="lastName" placeholder="Doe" required />
          </div>
        </div>
        <div className="space-y-2">
          <label htmlFor="email">Email</label>
          <Input id="email" name="email" type="email" placeholder="name@company.com" required />
        </div>
        <div className="space-y-2">
          <label htmlFor="password">Password</label>
          <Input id="password" name="password" type="password" required />
        </div>
        <Button type="submit" className="w-full" variant="premium" disabled={isPending}>
          {isPending ? "Creating Account..." : "Create Account"}
        </Button>
      </form>

      <div className="text-center text-sm text-muted-foreground">
        Already have an account?{" "}
        <Link href="/login" className="text-primary hover:underline">
          Sign in
        </Link>
      </div>
      
      <p className="text-xs text-center text-muted-foreground px-8">
        By clicking continue, you agree to our{" "}
        <Link href="/terms" className="underline underline-offset-4 hover:text-primary">
          Terms of Service
        </Link>{" "}
        and{" "}
        <Link href="/privacy" className="underline underline-offset-4 hover:text-primary">
          Privacy Policy
        </Link>.
      </p>
    </div>
  )
}
