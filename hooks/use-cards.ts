"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { createClient } from "@/lib/supabase/client";
import { Card } from "@/types/supabase";

export function useCards() {
  const supabase = createClient();
  const queryClient = useQueryClient();

  const cardsQuery = useQuery<Card[]>({
    queryKey: ["cards"],
    queryFn: async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.user) return [];

      const { data, error } = await supabase
        .from("cards")
        .select("*")
        .eq("user_id", session.user.id)
        .order("created_at", { ascending: false });

      if (error) throw error;
      return (data || []) as Card[];
    },
  });

  const requestCard = useMutation({
    mutationFn: async ({ card_type = "virtual", bank_account_id }: { card_type?: "virtual" | "physical"; bank_account_id?: string }) => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.user) throw new Error("Not authenticated");

      const lastFour = Math.floor(1000 + Math.random() * 9000).toString();

      const { data, error } = await supabase
        .from("cards")
        .insert([{
          user_id: session.user.id,
          bank_account_id: bank_account_id || null,
          card_type,
          card_network: "Visa",
          last_four: lastFour,
          expiry_month: 12,
          expiry_year: 2029,
          spending_limit: 5000,
          status: "active",
        }])
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cards"] });
    },
  });

  const toggleFreeze = useMutation({
    mutationFn: async ({ cardId, currentStatus }: { cardId: string; currentStatus: string }) => {
      const newStatus = currentStatus === "active" ? "frozen" : "active";
      const { data, error } = await supabase
        .from("cards")
        .update({ status: newStatus })
        .eq("id", cardId)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cards"] });
    },
  });

  return {
    cards: cardsQuery.data || [],
    isLoading: cardsQuery.isLoading,
    requestCard,
    toggleFreeze,
  };
}
