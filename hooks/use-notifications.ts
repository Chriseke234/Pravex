"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { createClient } from "@/services/supabase";
import { Notification } from "@/types/supabase";

export function useNotifications() {
  const supabase = createClient();
  const queryClient = useQueryClient();

  const notificationsQuery = useQuery<Notification[]>({
    queryKey: ["notifications"],
    queryFn: async () => {
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();
      if (sessionError) throw sessionError;
      if (!session?.user) return [];

      const { data, error } = await supabase
        .from("notifications")
        .select("*")
        .or(`recipient_id.eq.${session.user.id},recipient_id.is.null`)
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data as Notification[];
    },
  });

  const markAsRead = useMutation({
    mutationFn: async (id: string) => {
      const { data, error } = await supabase
        .from("notifications")
        .update({ read: true })
        .eq("id", id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
    },
  });

  return {
    notifications: notificationsQuery.data || [],
    isLoading: notificationsQuery.isLoading,
    error: notificationsQuery.error,
    markAsRead,
  };
}
