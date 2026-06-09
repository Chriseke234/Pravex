"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { createClient } from "@/services/supabase";
import { Transaction } from "@/types/supabase";

// Extended type to include the joined vault name
export type TransactionWithVault = Transaction & {
  vault?: { name: string };
};

export function useTransactions(vaultId?: string) {
  const supabase = createClient();
  const queryClient = useQueryClient();

  const transactionsQuery = useQuery<TransactionWithVault[]>({
    queryKey: ["transactions", vaultId],
    queryFn: async () => {
      let query = supabase
        .from("transactions")
        .select(`
          *,
          vault:vaults ( name )
        `)
        .order("created_at", { ascending: false });
      
      if (vaultId) {
        query = query.eq("vault_id", vaultId);
      }

      const { data, error } = await query;
      
      if (error) throw error;
      return data as TransactionWithVault[];
    },
  });

  const updateTransactionStatus = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: "Completed" | "Failed" | "Cancelled" }) => {
      const { data, error } = await supabase
        .from("transactions")
        .update({ status })
        .eq("id", id)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["transactions"] });
    },
  });

  const createTransaction = useMutation({
    mutationFn: async (newTx: Partial<Transaction>) => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) throw new Error("Not logged in");

      const { data, error } = await supabase
        .from("transactions")
        .insert([{
          ...newTx,
          user_id: session.user.id,
          status: newTx.status || "Pending",
        }])
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["transactions"] });
      // Also invalidate portfolio and vaults since they might be affected
      queryClient.invalidateQueries({ queryKey: ["portfolio"] });
      queryClient.invalidateQueries({ queryKey: ["vaults"] });
    },
  });

  return {
    transactions: transactionsQuery.data,
    isLoading: transactionsQuery.isLoading,
    error: transactionsQuery.error,
    updateTransactionStatus,
    createTransaction
  };
}
