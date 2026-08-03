"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { createClient } from "@/lib/supabase/client";
import { Referral } from "@/types/supabase";

export function useReferrals() {
  const supabase = createClient();
  const queryClient = useQueryClient();

  const referralsQuery = useQuery<Referral[]>({
    queryKey: ["referrals"],
    queryFn: async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.user) return [];

      const { data, error } = await supabase
        .from("referrals")
        .select("*")
        .eq("referrer_id", session.user.id)
        .order("created_at", { ascending: false });

      if (error) throw error;
      return (data || []) as Referral[];
    },
  });

  const inviteFriend = useMutation({
    mutationFn: async (referred_email: string) => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.user) throw new Error("Not authenticated");

      const { data, error } = await supabase
        .from("referrals")
        .insert([{
          referrer_id: session.user.id,
          referred_email,
          status: "pending",
          bonus_amount: 10.00,
        }])
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["referrals"] });
    },
  });

  return {
    referrals: referralsQuery.data || [],
    isLoading: referralsQuery.isLoading,
    inviteFriend,
  };
}
