"use client";

import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { createClient } from "@/services/supabase";
import { Conversation, Message } from "@/types/supabase";

type ConversationWithUser = Conversation & {
  profiles: {
    full_name: string | null;
    email: string;
  };
};

export function useAdminChat(conversationId?: string) {
  const supabase = createClient();
  const queryClient = useQueryClient();
  const [realtimeMessages, setRealtimeMessages] = useState<Message[]>([]);

  // 1. Fetch all conversations for admin
  const conversationsQuery = useQuery<ConversationWithUser[]>({
    queryKey: ["admin-conversations"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("conversations")
        .select(`
          *,
          profiles:user_id ( full_name, email )
        `)
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data as any as ConversationWithUser[];
    },
  });

  // 2. Fetch messages for active conversation
  const messagesQuery = useQuery<Message[]>({
    queryKey: ["admin-messages", conversationId],
    enabled: !!conversationId,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("messages")
        .select("*")
        .eq("conversation_id", conversationId)
        .order("created_at", { ascending: true });

      if (error) throw error;
      return data as Message[];
    },
  });

  // Reset realtime messages when conversationId changes
  useEffect(() => {
    setRealtimeMessages([]);
  }, [conversationId]);

  // 3. Realtime Subscription for new messages
  useEffect(() => {
    if (!conversationId) return;

    const channel = supabase
      .channel(`admin-conversation:${conversationId}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "messages",
          filter: `conversation_id=eq.${conversationId}`,
        },
        (payload) => {
          const newMsg = payload.new as Message;
          setRealtimeMessages((prev) => {
            if (prev.some((m) => m.id === newMsg.id)) return prev;
            return [...prev, newMsg];
          });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [conversationId, supabase]);

  // Combined messages list
  const allMessages = [
    ...(messagesQuery.data || []),
    ...realtimeMessages.filter(
      (rm) => !messagesQuery.data?.some((dbm) => dbm.id === rm.id)
    ),
  ].sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime());

  // 4. Mutations
  const updateTicketStatus = useMutation({
    mutationFn: async ({ status }: { status: "open" | "closed" | "escalated" }) => {
      if (!conversationId) throw new Error("No conversation selected");
      const { data, error } = await supabase
        .from("conversations")
        .update({ status })
        .eq("id", conversationId)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-conversations"] });
    },
  });

  const sendReply = useMutation({
    mutationFn: async ({ message, attachmentUrl }: { message: string | null; attachmentUrl?: string | null }) => {
      if (!conversationId) throw new Error("No conversation selected");
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.user) throw new Error("Not logged in");

      const { data, error } = await supabase
        .from("messages")
        .insert([
          {
            conversation_id: conversationId,
            sender_id: session.user.id,
            message,
            attachment_url: attachmentUrl || null,
          },
        ])
        .select()
        .single();

      if (error) throw error;
      return data as Message;
    },
  });

  return {
    conversations: conversationsQuery.data || [],
    messages: allMessages,
    isConversationsLoading: conversationsQuery.isLoading,
    isMessagesLoading: messagesQuery.isLoading,
    updateTicketStatus,
    sendReply,
  };
}
