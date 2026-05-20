"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { AlertCircle, RotateCcw, Home } from "lucide-react";
import Link from "next/link";

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function Error({ error, reset }: ErrorProps) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error("Runtime exception captured:", error);
  }, [error]);

  return (
    <div className="min-h-screen bg-background text-foreground flex items-center justify-center p-6 relative overflow-hidden">
      {/* Background glow orbs */}
      <div className="absolute top-1/4 left-1/4 w-[400px] h-[400px] bg-red-500/5 rounded-full blur-[100px] -z-10" />
      <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-gold/5 rounded-full blur-[100px] -z-10" />

      <div className="max-w-md w-full text-center space-y-8">
        <div className="flex justify-center">
          <div className="w-16 h-16 rounded-full bg-red-500/10 flex items-center justify-center text-red-500 border border-red-500/20">
            <AlertCircle className="w-8 h-8" />
          </div>
        </div>

        <div className="space-y-2">
          <div className="text-sm font-bold tracking-widest text-red-400 uppercase">System Alert</div>
          <h1 className="text-4xl font-serif font-bold text-foreground">Something went wrong</h1>
        </div>

        <p className="text-muted-foreground leading-relaxed">
          An unexpected error occurred. Our systems have logged this issue, and our engineering team is investigating.
        </p>

        {error.digest && (
          <div className="bg-card/30 border border-border/20 rounded-xl p-3 text-xs text-muted-foreground font-mono truncate">
            Digest ID: {error.digest}
          </div>
        )}

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button
            onClick={() => reset()}
            className="w-full sm:w-auto bg-gold hover:bg-gold-hover text-navy font-bold px-6 py-4 rounded-xl flex items-center justify-center gap-2"
          >
            <RotateCcw className="w-4 h-4" /> Retry Connection
          </Button>
          <Link href="/">
            <Button
              variant="outline"
              className="w-full sm:w-auto border-border hover:bg-accent text-foreground px-6 py-4 rounded-xl flex items-center justify-center gap-2"
            >
              <Home className="w-4 h-4" /> Return Home
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
