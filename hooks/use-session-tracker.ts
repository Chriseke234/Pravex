"use client";

import { useEffect } from "react";
import { createClient } from "@/services/supabase";

export function useSessionTracker() {
  const supabase = createClient();

  useEffect(() => {
    let sessionInterval: NodeJS.Timeout;
    let sessionId: string | null = null;

    async function trackSession() {
      try {
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        if (sessionError) throw sessionError;
        if (!session?.user) return;

        const device = window.navigator.userAgent.slice(0, 255);
        const ipAddress = "127.0.0.1"; // standard local fallback

        // Insert session record
        const { data, error } = await supabase
          .from("user_sessions")
          .insert([
            {
              user_id: session.user.id,
              status: "online",
              device,
              ip_address: ipAddress,
              login_time: new Date().toISOString(),
              last_activity: new Date().toISOString(),
            }
          ])
          .select()
          .single();

        if (error) throw error;
        if (data) {
          sessionId = data.id;
        }

        // Heartbeat every 30 seconds to update last_activity
        sessionInterval = setInterval(async () => {
          if (!sessionId) return;
          await supabase
            .from("user_sessions")
            .update({ last_activity: new Date().toISOString(), status: "online" })
            .eq("id", sessionId);
        }, 30000);
      } catch (err) {
        console.error("Session tracker error:", err);
      }
    }

    trackSession();

    // Mark offline on unmount
    return () => {
      if (sessionInterval) clearInterval(sessionInterval);
      if (sessionId) {
        supabase
          .from("user_sessions")
          .update({ status: "offline", last_activity: new Date().toISOString() })
          .eq("id", sessionId)
          .then();
      }
    };
  }, [supabase]);
}
