"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { createClient } from "@/lib/supabase/client";
import { Transfer, TransferType } from "@/types/supabase";

export function useTransfers() {
  const supabase = createClient();
  const queryClient = useQueryClient();

  const transfersQuery = useQuery<Transfer[]>({
    queryKey: ["transfers"],
    queryFn: async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.user) return [];

      const { data, error } = await supabase
        .from("transfers")
        .select("*")
        .eq("sender_id", session.user.id)
        .order("created_at", { ascending: false });

      if (error) throw error;
      return (data || []) as Transfer[];
    },
  });

  const createTransfer = useMutation({
    mutationFn: async (payload: {
      recipient_name: string;
      recipient_account: string;
      bank_name?: string;
      amount: number;
      currency?: string;
      type?: TransferType;
      description?: string;
    }) => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.user) throw new Error("Not authenticated");

      const ref = "TRF-" + Math.random().toString(36).substring(2, 9).toUpperCase();

      const { data, error } = await supabase
        .from("transfers")
        .insert([{
          sender_id: session.user.id,
          recipient_name: payload.recipient_name,
          recipient_account: payload.recipient_account,
          bank_name: payload.bank_name || "External Bank",
          amount: payload.amount,
          currency: payload.currency || "USD",
          type: payload.type || "domestic",
          description: payload.description || "Bank Transfer",
          reference: ref,
          status: "pending",
        }])
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["transfers"] });
    },
  });

  return {
    transfers: transfersQuery.data || [],
    isLoading: transfersQuery.isLoading,
    error: transfersQuery.error,
    createTransfer,
  };
}
