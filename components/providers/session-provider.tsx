"use client";

import { useSessionTracker } from "@/hooks/use-session-tracker";

export function SessionProvider({ children }: { children: React.ReactNode }) {
  useSessionTracker();
  return <>{children}</>;
}
