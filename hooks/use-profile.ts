import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";

export type Profile = {
  id: string;
  full_name: string | null;
  email: string;
  avatar_url: string | null;
  role: string;
  tier: string;
  risk_score: string;
  mfa_enabled: boolean;
};

export function useProfile() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const supabase = createClient();

  useEffect(() => {
    let isMounted = true;

    async function fetchProfile() {
      try {
        setIsLoading(true);
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        
        if (sessionError) throw sessionError;
        
        if (!session?.user) {
          if (isMounted) setProfile(null);
          return;
        }

        const userMeta = session.user.user_metadata || {};
        const metaName = userMeta.first_name
          ? `${userMeta.first_name} ${userMeta.last_name || ""}`.trim()
          : userMeta.full_name || userMeta.name || null;

        const { data: profileData, error: profileError } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", session.user.id)
          .single();

        if (profileError && profileError.code !== 'PGRST116') {
          console.warn("Profile fetch warning:", profileError.message);
        }

        const resolvedFullName = profileData?.full_name || metaName;

        if (!profileData) {
          const fallbackProfile: Profile = {
            id: session.user.id,
            full_name: resolvedFullName,
            email: session.user.email || "",
            avatar_url: null,
            role: userMeta.role || "user",
            tier: "Enterprise",
            risk_score: "Low",
            mfa_enabled: false,
          };
          try {
            await supabase.from("profiles").upsert([fallbackProfile]);
          } catch (_) {}
          if (isMounted) setProfile(fallbackProfile);
        } else {
          if (isMounted) {
            setProfile({
              ...profileData,
              full_name: resolvedFullName,
            });
          }
        }
      } catch (e: any) {
        if (isMounted) setError(e);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    }

    fetchProfile();

    return () => {
      isMounted = false;
    };
  }, []);

  const updateProfile = async (updates: Partial<Profile>) => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.user) throw new Error("No user logged in");

      const { data, error } = await supabase
        .from("profiles")
        .upsert({
          id: session.user.id,
          email: session.user.email || "",
          ...updates,
          updated_at: new Date().toISOString(),
        })
        .select()
        .single();

      if (error) throw error;

      if (updates.full_name) {
        try {
          await supabase.auth.updateUser({
            data: {
              full_name: updates.full_name,
              name: updates.full_name,
            },
          });
        } catch (_) {}
      }

      setProfile(data);
      return { data, error: null };
    } catch (e: any) {
      return { data: null, error: e };
    }
  };

  return { profile, isLoading, error, updateProfile };
}
