"use client";

import { useQuery } from "@tanstack/react-query";
import { createClient } from "@/services/supabase";
import { Transaction } from "@/types/supabase";

export function useTransactions(vaultId?: string) {
  const supabase = createClient();

  return useQuery<Transaction[]>({
    queryKey: ["transactions", vaultId],
    queryFn: async () => {
      let query = supabase
        .from("transactions")
        .select("*")
        .order("created_at", { ascending: false });
      
      if (vaultId) {
        query = query.eq("vault_id", vaultId);
      }

      const { data, error } = await query;
      
      if (error) throw error;
      return data;
    },
  });
}
