"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { createClient } from "@/services/supabase";

export type Webhook = {
  id: string;
  user_id: string;
  url: string;
  secret: string;
  events: string[];
  is_active: boolean;
  created_at: string;
};

export function useWebhooks() {
  const supabase = createClient();
  const queryClient = useQueryClient();

  const { data: webhooks, isLoading, error } = useQuery<Webhook[]>({
    queryKey: ["webhooks"],
    queryFn: async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return [];
      
      const { data, error } = await supabase
        .from("webhooks")
        .select("*")
        .eq("user_id", session.user.id)
        .order("created_at", { ascending: false });
      
      if (error) throw error;
      return data;
    },
  });

  const createWebhook = useMutation({
    mutationFn: async (newWebhook: { url: string; events: string[] }) => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) throw new Error("Not logged in");

      const secret = "whsec_" + Math.random().toString(36).substring(2, 15);
      
      const { data, error } = await supabase
        .from("webhooks")
        .insert([{
          user_id: session.user.id,
          url: newWebhook.url,
          events: newWebhook.events,
          secret
        }])
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["webhooks"] });
    },
  });

  const deleteWebhook = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("webhooks").delete().eq("id", id);
      if (error) throw error;
      return id;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["webhooks"] });
    },
  });

  return { webhooks, isLoading, error, createWebhook, deleteWebhook };
}
