"use client";

import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { createClient } from "@/lib/supabase/client";
import { Conversation, Message } from "@/types/supabase";

// Extended message type that includes the sender's profile info
export type MessageWithSender = Message & {
  profiles: {
    full_name: string | null;
    email: string;
    role: string;
    avatar_url: string | null;
  };
};

export function useChat(conversationId?: string) {
  const supabase = createClient();
  const queryClient = useQueryClient();
  const [realtimeMessages, setRealtimeMessages] = useState<MessageWithSender[]>([]);

  // 1. Fetch conversations for the current user
  const conversationsQuery = useQuery<Conversation[]>({
    queryKey: ["conversations"],
    refetchInterval: 30000, // Poll every 30s for new conversations
    queryFn: async () => {
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();
      if (sessionError) throw sessionError;
      if (!session?.user) return [];

      const { data, error } = await supabase
        .from("conversations")
        .select("*")
        .eq("user_id", session.user.id)
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data as Conversation[];
    },
  });

  // 2. Fetch messages for active conversation, joined with sender profile
  const messagesQuery = useQuery<MessageWithSender[]>({
    queryKey: ["messages", conversationId],
    enabled: !!conversationId,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("messages")
        .select(`
          *,
          profiles:sender_id ( full_name, email, role, avatar_url )
        `)
        .eq("conversation_id", conversationId)
        .order("created_at", { ascending: true });

      if (error) throw error;
      return data as any as MessageWithSender[];
    },
  });

  // Reset realtime messages when conversationId changes
  useEffect(() => {
    setRealtimeMessages([]);
  }, [conversationId]);

  // 3. Realtime subscription for new messages
  useEffect(() => {
    if (!conversationId) return;

    const channel = supabase
      .channel(`conversation:${conversationId}`)
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

          // Realtime payloads don't include the joined profile,
          // so we provide a fallback until the next refetch
          const msgWithSender: MessageWithSender = {
            ...newMsg,
            profiles: (newMsg as any).profiles ?? {
              full_name: null,
              email: "",
              role: "user",
              avatar_url: null,
            },
          };

          setRealtimeMessages((prev) => {
            if (prev.some((m) => m.id === msgWithSender.id)) return prev;
            return [...prev, msgWithSender];
          });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [conversationId, supabase]);

  // Combined messages list (DB + realtime, deduplicated & sorted)
  const allMessages: MessageWithSender[] = [
    ...(messagesQuery.data || []),
    ...realtimeMessages.filter(
      (rm) => !messagesQuery.data?.some((dbm) => dbm.id === rm.id)
    ),
  ].sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime());

  // 4. Mutations

  /** Create a new conversation with an optional subject line */
  const createConversation = useMutation({
    mutationFn: async (vars?: { subject?: string }) => {
      const subject = vars?.subject;
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.user) throw new Error("Not logged in");

      const { data, error } = await supabase
        .from("conversations")
        .insert([{
          user_id: session.user.id,
          status: "open",
          ...(subject ? { subject } : {}),
        }])
        .select()
        .single();

      if (error) throw error;
      return data as Conversation;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["conversations"] });
    },
  });

  /** Send a message in the active conversation */
  const sendMessage = useMutation({
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
        .select(`
          *,
          profiles:sender_id ( full_name, email, role, avatar_url )
        `)
        .single();

      if (error) throw error;
      return data as any as MessageWithSender;
    },
  });

  return {
    conversations: conversationsQuery.data || [],
    messages: allMessages,
    isConversationsLoading: conversationsQuery.isLoading,
    isMessagesLoading: messagesQuery.isLoading,
    createConversation,
    sendMessage,
  };
}
