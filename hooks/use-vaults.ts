"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { createClient } from "@/services/supabase";
import { Vault } from "@/types/supabase";

export function useVaults() {
  const supabase = createClient();
  const queryClient = useQueryClient();

  // Fetch all vaults for the current user (via signers or ownership)
  const { data: vaults, isLoading, error } = useQuery<Vault[]>({
    queryKey: ["vaults"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("vaults")
        .select(`
          *,
          vault_signers (
            user_id,
            role
          )
        `);
      
      if (error) throw error;
      return data;
    },
  });

  // Create a new vault
  const createVault = useMutation({
    mutationFn: async (newVault: { name: string; type: string; threshold_n: number; threshold_m: number }) => {
      const { data, error } = await supabase
        .from("vaults")
        .insert([newVault])
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["vaults"] });
    },
  });

  return {
    vaults,
    isLoading,
    error,
    createVault,
  };
}
