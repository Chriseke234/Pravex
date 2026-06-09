"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { createClient } from "@/services/supabase";
import { Wallet, WalletTransaction } from "@/types/supabase";

export function useWallet() {
  const supabase = createClient();
  const queryClient = useQueryClient();

  const walletQuery = useQuery<Wallet | null>({
    queryKey: ["wallet"],
    queryFn: async () => {
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();
      if (sessionError) throw sessionError;
      if (!session?.user) return null;

      // Try fetching the wallet
      const { data, error } = await supabase
        .from("wallets")
        .select("*")
        .eq("user_id", session.user.id)
        .maybeSingle();

      if (error) throw error;
      return data;
    },
  });

  const walletTransactionsQuery = useQuery<WalletTransaction[]>({
    queryKey: ["wallet-transactions", walletQuery.data?.id],
    enabled: !!walletQuery.data?.id,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("wallet_transactions")
        .select("*")
        .eq("wallet_id", walletQuery.data!.id)
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data as WalletTransaction[];
    },
  });

  const requestDeposit = useMutation({
    mutationFn: async ({ amount, provider, reference }: { amount: number; provider: string; reference: string }) => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.user) throw new Error("Not logged in");

      const { data, error } = await supabase
        .from("deposits")
        .insert([{
          user_id: session.user.id,
          amount,
          provider,
          reference,
          status: "pending",
        }])
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["deposits"] });
    },
  });

  const requestWithdrawal = useMutation({
    mutationFn: async ({ amount, bankName, accountName, accountNumber }: { amount: number; bankName: string; accountName: string; accountNumber: string }) => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.user) throw new Error("Not logged in");

      const { data, error } = await supabase
        .from("withdrawals")
        .insert([{
          user_id: session.user.id,
          amount,
          bank_name: bankName,
          account_name: accountName,
          account_number: accountNumber,
          status: "pending",
        }])
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["withdrawals"] });
    },
  });

  return {
    wallet: walletQuery.data,
    transactions: walletTransactionsQuery.data || [],
    isLoading: walletQuery.isLoading || walletTransactionsQuery.isLoading,
    error: walletQuery.error || walletTransactionsQuery.error,
    requestDeposit,
    requestWithdrawal,
  };
}
