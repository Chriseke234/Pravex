"use client";

import { useState, useRef, useEffect } from "react";
import { useChat } from "@/hooks/use-chat";
import { useProfile } from "@/hooks/use-profile";
import { GlassCard } from "@/components/shared/glass-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  MessageSquare,
  Plus,
  Send,
  Paperclip,
  Loader2,
  Shield,
  X,
  Clock,
  CheckCircle2,
  Headphones,
  ChevronLeft,
} from "lucide-react";
import { cn } from "@/lib/utils";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

/** Extended message type with joined sender profile data */
type MessageWithSender = {
  id: string;
  conversation_id: string;
  sender_id: string;
  message: string | null;
  attachment_url: string | null;
  created_at: string;
  profiles?: {
    full_name: string | null;
    email: string;
    role: string;
    avatar_url: string | null;
  };
};

/** Roles considered as admin / support staff */
const ADMIN_ROLES = ["admin", "superuser", "super_admin"];

/** Check whether a message was sent by an admin */
function isAdminMessage(msg: MessageWithSender): boolean {
  return ADMIN_ROLES.includes(msg.profiles?.role ?? "");
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export default function UserSupportPage() {
  const { profile } = useProfile();

  // Conversation & messaging state
  const [selectedConversationId, setSelectedConversationId] = useState<
    string | undefined
  >(undefined);

  const {
    conversations,
    messages,
    isConversationsLoading,
    isMessagesLoading,
    createConversation,
    sendMessage,
  } = useChat(selectedConversationId);

  // Input state
  const [messageText, setMessageText] = useState("");
  const [attachmentUrl, setAttachmentUrl] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  // New‑chat modal state
  const [isNewChatOpen, setIsNewChatOpen] = useState(false);
  const [newChatSubject, setNewChatSubject] = useState("");

  // Mobile panel toggle – true = show chat, false = show conversation list
  const [showChat, setShowChat] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto‑scroll to latest message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Auto‑select first conversation when list loads
  useEffect(() => {
    if (conversations.length > 0 && !selectedConversationId) {
      setSelectedConversationId(conversations[0].id);
    }
  }, [conversations, selectedConversationId]);

  // -----------------------------------------------------------------------
  // Handlers
  // -----------------------------------------------------------------------

  /** Create a new conversation and navigate to it */
  const handleStartChat = async () => {
    try {
      const newConversation = await createConversation.mutateAsync({
        subject: newChatSubject || undefined,
      });
      setSelectedConversationId(newConversation.id);
      setIsNewChatOpen(false);
      setNewChatSubject("");
      setShowChat(true); // switch to chat on mobile
    } catch (e) {
      console.error(e);
    }
  };

  /** Send a message (text and/or attachment) */
  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!messageText.trim() && !attachmentUrl) return;

    try {
      await sendMessage.mutateAsync({
        message: messageText,
        attachmentUrl,
      });
      setMessageText("");
      setAttachmentUrl(null);
    } catch (e) {
      console.error(e);
    }
  };

  /** Simulate a file upload (placeholder for real upload logic) */
  const handleSimulateUpload = () => {
    setIsUploading(true);
    setTimeout(() => {
      setAttachmentUrl(
        "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=600&q=80"
      );
      setIsUploading(false);
    }, 1200);
  };

  /** Select a conversation from the list */
  const handleSelectConversation = (id: string) => {
    setSelectedConversationId(id);
    setShowChat(true); // switch to chat panel on mobile
  };

  const activeConversation = conversations.find(
    (c) => c.id === selectedConversationId
  );

  // Cast messages to our extended type (hook may return base Message[])
  const typedMessages = messages as MessageWithSender[];

  // -----------------------------------------------------------------------
  // Sub‑renders
  // -----------------------------------------------------------------------

  /** Render the left conversations panel */
  const renderConversationList = () => (
    <div className="flex flex-col h-full">
      {/* Panel header */}
      <div className="flex items-center justify-between p-4 border-b border-white/5">
        <h2 className="text-lg font-bold tracking-tight">Messages</h2>
        <Button
          onClick={() => setIsNewChatOpen(true)}
          variant="premium"
          size="sm"
          className="gap-1.5 rounded-xl text-xs"
          disabled={createConversation.isPending}
        >
          {createConversation.isPending ? (
            <Loader2 className="w-3.5 h-3.5 animate-spin" />
          ) : (
            <Plus className="w-3.5 h-3.5" />
          )}
          New Chat
        </Button>
      </div>

      {/* Conversation cards */}
      <div className="flex-1 overflow-y-auto p-3 space-y-2">
        {isConversationsLoading ? (
          <div className="flex justify-center py-12">
            <Loader2 className="w-5 h-5 text-primary animate-spin" />
          </div>
        ) : conversations.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-center space-y-2">
            <MessageSquare className="w-6 h-6 text-white/10" />
            <p className="text-xs text-muted-foreground">
              No conversations yet.
            </p>
          </div>
        ) : (
          conversations.map((c) => {
            const isActive = c.id === selectedConversationId;
            const isOpen = c.status === "open";

            return (
              <button
                key={c.id}
                onClick={() => handleSelectConversation(c.id)}
                className={cn(
                  "w-full text-left p-3 rounded-xl border transition-all duration-200 group",
                  isActive
                    ? "bg-primary/10 border-primary/30"
                    : "bg-white/[0.01] border-white/5 hover:bg-white/5"
                )}
              >
                <div className="flex items-start gap-2.5">
                  {/* Online indicator */}
                  <div className="mt-1.5 shrink-0">
                    <span
                      className={cn(
                        "block w-2.5 h-2.5 rounded-full border",
                        isOpen
                          ? "bg-emerald-500 border-emerald-400 shadow-[0_0_6px_rgba(16,185,129,.45)]"
                          : "bg-white/10 border-white/20"
                      )}
                    />
                  </div>

                  <div className="flex-1 min-w-0 space-y-1">
                    {/* Conversation title */}
                    <div className="flex items-center justify-between gap-2">
                      <span
                        className={cn(
                          "text-xs font-semibold truncate",
                          isActive ? "text-white" : "text-white/70 group-hover:text-white"
                        )}
                      >
                        Chat #{c.id.slice(0, 8)}
                      </span>

                      {/* Status badge */}
                      <span
                        className={cn(
                          "shrink-0 inline-flex items-center px-1.5 py-0.5 rounded text-[8px] font-bold border uppercase tracking-wider",
                          c.status === "open" &&
                            "bg-emerald-500/10 text-emerald-500 border-emerald-500/20",
                          c.status === "escalated" &&
                            "bg-amber-500/10 text-amber-500 border-amber-500/20",
                          c.status === "closed" &&
                            "bg-muted/10 text-muted-foreground border-white/5"
                        )}
                      >
                        {c.status}
                      </span>
                    </div>

                    {/* Last message preview (truncated) */}
                    <p className="text-[11px] text-muted-foreground truncate leading-snug">
                      {c.subject ? `Subject: ${c.subject}` : "Tap to view conversation"}
                    </p>

                    {/* Timestamp */}
                    <p className="text-[10px] text-muted-foreground/60">
                      {new Date(c.created_at).toLocaleDateString(undefined, {
                        month: "short",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                  </div>
                </div>
              </button>
            );
          })
        )}
      </div>
    </div>
  );

  /** Render the chat header bar */
  const renderChatHeader = () => (
    <div className="flex items-center justify-between gap-3 p-4 border-b border-white/5 bg-white/[0.02]">
      <div className="flex items-center gap-3 min-w-0">
        {/* Back button – mobile only */}
        <button
          onClick={() => setShowChat(false)}
          className="lg:hidden shrink-0 p-1 -ml-1 rounded-lg hover:bg-white/5 transition-colors"
          aria-label="Back to conversations"
        >
          <ChevronLeft className="w-5 h-5 text-muted-foreground" />
        </button>

        {/* Shield icon */}
        <div className="w-9 h-9 rounded-full bg-primary/20 flex items-center justify-center border border-primary/30 shrink-0">
          <Shield className="w-4 h-4 text-primary" />
        </div>

        <div className="min-w-0">
          <div className="text-sm font-bold truncate">
            Ironbridge Market Support
          </div>
          <div className="flex items-center gap-1.5 mt-0.5">
            <span className="block w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_6px_rgba(16,185,129,.45)]" />
            <span className="text-[10px] text-emerald-400 font-medium">
              Online
            </span>
          </div>
        </div>
      </div>

      {/* Conversation status badge */}
      {activeConversation && (
        <span
          className={cn(
            "shrink-0 inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold border",
            activeConversation.status === "open" &&
              "bg-emerald-500/10 text-emerald-500 border-emerald-500/20",
            activeConversation.status === "escalated" &&
              "bg-amber-500/10 text-amber-500 border-amber-500/20",
            activeConversation.status === "closed" &&
              "bg-rose-500/10 text-rose-500 border-rose-500/20"
          )}
        >
          {activeConversation.status === "open" ? (
            <CheckCircle2 className="w-3 h-3" />
          ) : activeConversation.status === "escalated" ? (
            <Clock className="w-3 h-3" />
          ) : (
            <X className="w-3 h-3" />
          )}
          {activeConversation.status}
        </span>
      )}
    </div>
  );

  /** Render the scrollable messages area */
  const renderMessagesArea = () => (
    <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-5">
      {isMessagesLoading ? (
        <div className="flex justify-center items-center h-full">
          <Loader2 className="w-8 h-8 text-primary animate-spin" />
        </div>
      ) : typedMessages.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-full text-muted-foreground space-y-2">
          <MessageSquare className="w-8 h-8 text-white/10" />
          <p className="text-sm">
            No messages yet. Send a message to start the conversation.
          </p>
        </div>
      ) : (
        typedMessages.map((m) => {
          const isMe = m.sender_id === profile?.id;
          const isAdmin = isAdminMessage(m);

          // Determine sender display name
          const senderName = isMe
            ? "You"
            : m.profiles?.full_name ?? "Support Agent";

          return (
            <div
              key={m.id}
              className={cn(
                "flex flex-col max-w-[80%] md:max-w-[70%]",
                isMe ? "ml-auto items-end" : "mr-auto items-start"
              )}
            >
              {/* Sender label */}
              <div
                className={cn(
                  "flex items-center gap-1 mb-1 px-1",
                  isMe ? "flex-row-reverse" : "flex-row"
                )}
              >
                {/* Admin shield badge */}
                {isAdmin && !isMe && (
                  <div className="w-4 h-4 rounded-full bg-primary/20 flex items-center justify-center">
                    <Shield className="w-2.5 h-2.5 text-primary" />
                  </div>
                )}
                <span className="text-[10px] font-medium text-muted-foreground">
                  {senderName}
                </span>
              </div>

              {/* Message bubble */}
              <div
                className={cn(
                  "p-3 rounded-2xl border leading-relaxed text-sm",
                  isMe
                    ? "bg-primary/20 border-primary/30 text-white rounded-br-sm"
                    : "bg-white/5 border-white/10 text-white/80 rounded-bl-sm"
                )}
              >
                {m.message && <p>{m.message}</p>}
                {m.attachment_url && (
                  <div className="mt-2 rounded-xl overflow-hidden border border-white/10 max-w-[220px]">
                    <img
                      src={m.attachment_url}
                      alt="Attachment"
                      className="object-cover w-full h-auto"
                    />
                  </div>
                )}
              </div>

              {/* Timestamp */}
              <span className="text-[10px] text-muted-foreground/60 mt-1 px-1">
                {new Date(m.created_at).toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </span>
            </div>
          );
        })
      )}
      <div ref={messagesEndRef} />
    </div>
  );

  /** Render the message input footer */
  const renderInputArea = () => {
    // Closed conversation – show notice
    if (activeConversation?.status === "closed") {
      return (
        <div className="p-4 border-t border-white/5 bg-white/[0.01] text-center text-xs text-muted-foreground">
          This conversation has been closed. Start a new chat if you need
          further assistance.
        </div>
      );
    }

    return (
      <form
        onSubmit={handleSendMessage}
        className="p-4 border-t border-white/5 bg-white/[0.01] space-y-2"
      >
        {/* Attachment preview */}
        {attachmentUrl && (
          <div className="flex items-center gap-2 p-2 bg-white/5 rounded-xl border border-white/10 text-xs w-fit">
            <Paperclip className="w-3.5 h-3.5 text-primary" />
            <span className="text-muted-foreground truncate max-w-[120px]">
              Screenshot attachment
            </span>
            <button
              type="button"
              onClick={() => setAttachmentUrl(null)}
              className="text-rose-500 hover:text-white transition-colors"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        )}

        {/* Input row */}
        <div className="flex gap-2">
          {/* Attachment button */}
          <Button
            type="button"
            variant="glass"
            size="icon"
            className="rounded-xl shrink-0"
            onClick={handleSimulateUpload}
            disabled={isUploading}
          >
            {isUploading ? (
              <Loader2 className="w-4 h-4 animate-spin text-primary" />
            ) : (
              <Paperclip className="w-4 h-4" />
            )}
          </Button>

          {/* Text input */}
          <Input
            value={messageText}
            onChange={(e) => setMessageText(e.target.value)}
            placeholder="Type your message..."
            className="bg-black/20 border-white/10 rounded-xl flex-1 text-sm"
          />

          {/* Send button */}
          <Button
            type="submit"
            variant="premium"
            size="icon"
            className="rounded-xl shrink-0"
            disabled={sendMessage.isPending}
          >
            {sendMessage.isPending ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Send className="w-4 h-4" />
            )}
          </Button>
        </div>
      </form>
    );
  };

  /** Render the empty state when no conversation is selected */
  const renderEmptyState = () => (
    <div className="flex flex-col items-center justify-center h-full text-center p-6 space-y-5">
      <div className="w-16 h-16 bg-white/[0.02] border border-white/5 rounded-full flex items-center justify-center">
        <Headphones className="w-8 h-8 text-muted-foreground" />
      </div>

      <div className="space-y-1.5 max-w-sm">
        <h3 className="font-bold text-xl">Chat with our support team</h3>
        <p className="text-sm text-muted-foreground leading-relaxed">
          Select an existing conversation or start a new chat to speak with a
          support agent in real time.
        </p>
      </div>

      <Button
        onClick={() => setIsNewChatOpen(true)}
        variant="premium"
        className="gap-2 rounded-xl"
      >
        <MessageSquare className="w-4 h-4" />
        Start a new conversation
      </Button>
    </div>
  );

  /** Render the "New Chat" modal dialog */
  const renderNewChatModal = () => {
    if (!isNewChatOpen) return null;

    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Backdrop */}
        <div
          className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          onClick={() => setIsNewChatOpen(false)}
        />

        {/* Modal card */}
        <GlassCard
          hover={false}
          className="relative z-10 w-full max-w-md bg-black/80 backdrop-blur-xl border border-white/10 p-6 space-y-5"
        >
          {/* Close button */}
          <button
            onClick={() => setIsNewChatOpen(false)}
            className="absolute top-4 right-4 text-muted-foreground hover:text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>

          <div className="space-y-1">
            <h3 className="text-lg font-bold">New Conversation</h3>
            <p className="text-xs text-muted-foreground">
              Start a live chat with our support team.
            </p>
          </div>

          {/* Subject input */}
          <div className="space-y-2">
            <label
              htmlFor="chat-subject"
              className="text-xs font-medium text-muted-foreground"
            >
              Subject / Topic
            </label>
            <Input
              id="chat-subject"
              value={newChatSubject}
              onChange={(e) => setNewChatSubject(e.target.value)}
              placeholder="e.g. Account verification issue"
              className="bg-black/30 border-white/10 rounded-xl text-sm"
            />
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-2 pt-1">
            <Button
              variant="ghost"
              className="rounded-xl text-xs"
              onClick={() => setIsNewChatOpen(false)}
            >
              Cancel
            </Button>
            <Button
              variant="premium"
              className="gap-1.5 rounded-xl text-xs"
              onClick={handleStartChat}
              disabled={createConversation.isPending}
            >
              {createConversation.isPending ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
              ) : (
                <MessageSquare className="w-3.5 h-3.5" />
              )}
              Start Chat
            </Button>
          </div>
        </GlassCard>
      </div>
    );
  };

  // -----------------------------------------------------------------------
  // Main render
  // -----------------------------------------------------------------------

  return (
    <div className="space-y-6 pb-12">
      {/* Page header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Live Support</h1>
        <p className="text-muted-foreground">
          Chat directly with our support team for instant help.
        </p>
      </div>

      {/* Main layout: conversation list + chat window */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-0 lg:gap-6 min-h-[560px]">
        {/* ── Left panel: Conversations list ── */}
        <div
          className={cn(
            "lg:col-span-1 lg:block",
            // On mobile, hide list when a chat is being viewed
            showChat && selectedConversationId ? "hidden" : "block"
          )}
        >
          <GlassCard
            hover={false}
            className="p-0 h-[560px] overflow-hidden border-white/5 bg-black/40 backdrop-blur-xl"
          >
            {renderConversationList()}
          </GlassCard>
        </div>

        {/* ── Right panel: Chat window ── */}
        <div
          className={cn(
            "lg:col-span-3 flex flex-col h-[560px] lg:block",
            // On mobile, hide chat when conversation list is shown
            !showChat && selectedConversationId
              ? "hidden lg:flex"
              : !selectedConversationId
                ? "hidden lg:flex"
                : "flex"
          )}
        >
          <GlassCard
            hover={false}
            className="flex-1 flex flex-col p-0 overflow-hidden h-full border-white/5 bg-black/40 backdrop-blur-xl"
          >
            {selectedConversationId ? (
              <>
                {renderChatHeader()}
                {renderMessagesArea()}
                {renderInputArea()}
              </>
            ) : (
              renderEmptyState()
            )}
          </GlassCard>
        </div>

        {/* On mobile, show empty state when nothing is selected and list is hidden */}
        {!selectedConversationId && (
          <div className="lg:col-span-3 hidden lg:flex h-[560px]">
            {/* Desktop empty state is already handled above */}
          </div>
        )}
      </div>

      {/* New‑chat modal */}
      {renderNewChatModal()}
    </div>
  );
}
