"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { createClient } from "@/lib/supabase/client";
import { BankAccount, AccountType } from "@/types/supabase";

export function useAccounts() {
  const supabase = createClient();
  const queryClient = useQueryClient();

  const accountsQuery = useQuery<BankAccount[]>({
    queryKey: ["bank-accounts"],
    queryFn: async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.user) return [];

      const { data, error } = await supabase
        .from("bank_accounts")
        .select("*")
        .eq("user_id", session.user.id)
        .order("created_at", { ascending: false });

      if (error) throw error;
      return (data || []) as BankAccount[];
    },
  });

  const createAccount = useMutation({
    mutationFn: async ({ account_name, account_type, currency = "USD" }: { account_name: string; account_type: AccountType; currency?: string }) => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.user) throw new Error("Not authenticated");

      const accNum = "IBB" + Math.floor(1000000000 + Math.random() * 9000000000);

      const { data, error } = await supabase
        .from("bank_accounts")
        .insert([{
          user_id: session.user.id,
          account_name,
          account_number: accNum,
          account_type,
          currency,
          balance: 0,
          status: "active",
        }])
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["bank-accounts"] });
    },
  });

  return {
    accounts: accountsQuery.data || [],
    isLoading: accountsQuery.isLoading,
    error: accountsQuery.error,
    createAccount,
  };
}
