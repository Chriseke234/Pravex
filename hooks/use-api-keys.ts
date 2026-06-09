"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { createClient } from "@/services/supabase";

export type ApiKey = {
  id: string;
  user_id: string;
  name: string;
  key_prefix: string;
  key_hash: string;
  scopes: string[];
  ip_whitelist: string[];
  last_used_at: string | null;
  expires_at: string | null;
  created_at: string;
};

export function useApiKeys() {
  const supabase = createClient();
  const queryClient = useQueryClient();

  const { data: apiKeys, isLoading, error } = useQuery<ApiKey[]>({
    queryKey: ["api_keys"],
    queryFn: async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return [];
      
      const { data, error } = await supabase
        .from("api_keys")
        .select("*")
        .eq("user_id", session.user.id)
        .order("created_at", { ascending: false });
      
      if (error) throw error;
      return data;
    },
  });

  const createApiKey = useMutation({
    mutationFn: async (newKey: { name: string; scopes: string[] }) => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) throw new Error("Not logged in");

      // Generate a mock key for frontend display (in real world, handled by backend)
      const rawKey = "ibm_" + Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
      const prefix = rawKey.substring(0, 8);
      const hash = "hashed_" + rawKey; // Mock hash
      
      const { data, error } = await supabase
        .from("api_keys")
        .insert([{
          user_id: session.user.id,
          name: newKey.name,
          key_prefix: prefix,
          key_hash: hash,
          scopes: newKey.scopes,
        }])
        .select()
        .single();
      
      if (error) throw error;
      return { data, rawKey };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["api_keys"] });
    },
  });

  const deleteApiKey = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("api_keys").delete().eq("id", id);
      if (error) throw error;
      return id;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["api_keys"] });
    },
  });

  return { apiKeys, isLoading, error, createApiKey, deleteApiKey };
}
