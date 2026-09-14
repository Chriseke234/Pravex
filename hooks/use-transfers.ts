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

      // 1. Create completed transfer record
      const { data: transferData, error: transferError } = await supabase
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
          status: "completed",
        }])
        .select()
        .single();

      if (transferError) throw transferError;

      // 2. Fetch or initialize wallet to reflect transaction immediately on dashboard
      const { data: walletData } = await supabase
        .from("wallets")
        .select("*")
        .eq("user_id", session.user.id)
        .maybeSingle();

      if (walletData) {
        // Record wallet transaction
        await supabase.from("wallet_transactions").insert([{
          wallet_id: walletData.id,
          amount: payload.amount,
          type: "debit",
          status: "completed",
          reference: ref,
          description: `Wire to ${payload.recipient_name} (${payload.bank_name || "Commercial Transfer"})`,
        }]);

        // Deduct wallet balance
        const newBalance = Math.max(0, (walletData.balance || 0) - payload.amount);
        await supabase
          .from("wallets")
          .update({ balance: newBalance, updated_at: new Date().toISOString() })
          .eq("id", walletData.id);
      }

      return transferData;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["transfers"] });
      queryClient.invalidateQueries({ queryKey: ["wallet"] });
      queryClient.invalidateQueries({ queryKey: ["wallet-transactions"] });
      queryClient.invalidateQueries({ queryKey: ["bank-accounts"] });
    },
  });

  return {
    transfers: transfersQuery.data || [],
    isLoading: transfersQuery.isLoading,
    error: transfersQuery.error,
    createTransfer,
  };
}
