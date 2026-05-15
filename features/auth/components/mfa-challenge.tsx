"use client";

import { useState } from "react";
import { GlassCard } from "@/components/shared/glass-card";
import { Button } from "@/components/ui/button";
import { ShieldAlert, Smartphone, ArrowRight, Lock } from "lucide-react";

export function MFAChallenge() {
  const [otp, setOtp] = useState("");

  return (
    <div className="max-w-md mx-auto space-y-8 py-12">
      <div className="text-center space-y-4">
        <div className="p-4 bg-primary/10 rounded-3xl w-fit mx-auto relative">
          <Smartphone className="w-12 h-12 text-primary" />
          <div className="absolute -top-1 -right-1 bg-black rounded-full p-1 border border-primary/30">
            <Lock className="w-4 h-4 text-primary" />
          </div>
        </div>
        <div className="space-y-2">
          <h2 className="text-3xl font-bold tracking-tight">Security Challenge</h2>
          <p className="text-muted-foreground">
            A Multi-Factor Authentication code is required to access this institutional account.
          </p>
        </div>
      </div>

      <GlassCard className="p-8 space-y-8">
        <div className="space-y-4">
          <label className="text-sm font-bold uppercase tracking-widest text-muted-foreground block text-center">
            Verification Code
          </label>
          <div className="flex justify-center gap-2">
            {[...Array(6)].map((_, i) => (
              <input
                key={i}
                type="text"
                maxLength={1}
                className="w-11 h-14 bg-white/5 border border-white/10 rounded-xl text-center text-2xl font-bold focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                autoFocus={i === 0}
                onChange={(e) => {
                  if (e.target.value && i < 5) {
                    (e.target.nextSibling as HTMLInputElement)?.focus();
                  }
                }}
              />
            ))}
          </div>
        </div>

        <div className="space-y-4">
          <Button className="w-full h-12 text-lg" variant="premium">
            Verify & Continue
          </Button>
          <Button className="w-full text-muted-foreground hover:text-white" variant="ghost">
            Lost access to device?
          </Button>
        </div>
      </GlassCard>

      <div className="flex items-center gap-3 p-4 bg-amber-500/10 rounded-2xl border border-amber-500/20 text-amber-500">
        <ShieldAlert className="w-5 h-5 shrink-0" />
        <p className="text-xs leading-relaxed font-medium">
          If you didn't attempt to sign in, please secure your account immediately by contacting our compliance desk.
        </p>
      </div>
    </div>
  );
}
