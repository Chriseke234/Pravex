import { useState, useEffect } from "react";
import { createClient } from "@/services/supabase";

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

        const { data: profileData, error: profileError } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", session.user.id)
          .single();

        if (profileError && profileError.code !== 'PGRST116') {
          throw profileError;
        }

        if (isMounted) setProfile(profileData || null);
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
        .update(updates)
        .eq("id", session.user.id)
        .select()
        .single();

      if (error) throw error;
      setProfile(data);
      return { data, error: null };
    } catch (e: any) {
      return { data: null, error: e };
    }
  };

  return { profile, isLoading, error, updateProfile };
}
