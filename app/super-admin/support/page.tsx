"use client";

import { useState, useRef, useEffect, useMemo, useCallback } from "react";
import { useAdminChat } from "@/hooks/use-admin-chat";
import { useProfile } from "@/hooks/use-profile";
import { GlassCard } from "@/components/shared/glass-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  MessageSquare,
  Send,
  Paperclip,
  Loader2,
  User,
  ShieldAlert,
  FolderLock,
  ArrowUpCircle,
  X,
  Clock,
  CheckCircle2,
  Filter,
  ChevronLeft,
  Headphones,
} from "lucide-react";
import { cn } from "@/lib/utils";

/* -------------------------------------------------------------------------- */
/*                              HELPER UTILITIES                              */
/* -------------------------------------------------------------------------- */

/** Returns a compact human-readable time-ago string (e.g. "2m ago", "3h ago"). */
function timeAgo(dateStr: string): string {
  const now = Date.now();
  const then = new Date(dateStr).getTime();
  const diffSeconds = Math.max(0, Math.floor((now - then) / 1000));

  if (diffSeconds < 60) return `${diffSeconds}s ago`;
  const diffMinutes = Math.floor(diffSeconds / 60);
  if (diffMinutes < 60) return `${diffMinutes}m ago`;
  const diffHours = Math.floor(diffMinutes / 60);
  if (diffHours < 24) return `${diffHours}h ago`;
  const diffDays = Math.floor(diffHours / 24);
  if (diffDays < 30) return `${diffDays}d ago`;
  const diffMonths = Math.floor(diffDays / 30);
  return `${diffMonths}mo ago`;
}

/** Deterministic avatar color based on a string seed. */
function avatarColor(seed: string): string {
  const colors = [
    "bg-purple-600", "bg-emerald-600", "bg-amber-600", "bg-sky-600",
    "bg-rose-600", "bg-indigo-600", "bg-teal-600", "bg-fuchsia-600",
  ];
  let hash = 0;
  for (let i = 0; i < seed.length; i++) {
    hash = seed.charCodeAt(i) + ((hash << 5) - hash);
  }
  return colors[Math.abs(hash) % colors.length];
}

/** Extracts initials (first letter of first + last name, or first letter of email). */
function getInitials(name: string | null, email: string): string {
  if (name) {
    const parts = name.trim().split(/\s+/);
    if (parts.length >= 2) return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
    return parts[0][0].toUpperCase();
  }
  return email[0].toUpperCase();
}

/* -------------------------------------------------------------------------- */
/*                              TYPE DEFINITIONS                              */
/* -------------------------------------------------------------------------- */

type StatusFilter = "all" | "open" | "escalated" | "closed";

/* -------------------------------------------------------------------------- */
/*                              MAIN COMPONENT                                */
/* -------------------------------------------------------------------------- */

export default function AdminSupportChatPage() {
  const { profile } = useProfile();
  const [selectedConversationId, setSelectedConversationId] = useState<string | undefined>(undefined);

  const {
    conversations,
    messages,
    isConversationsLoading,
    isMessagesLoading,
    updateTicketStatus,
    sendReply,
  } = useAdminChat(selectedConversationId);

  /* ---- Local state ---- */
  const [replyText, setReplyText] = useState("");
  const [attachmentUrl, setAttachmentUrl] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [showMobileChat, setShowMobileChat] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  /* ---- Derived data ---- */
  const activeConversation = useMemo(
    () => conversations.find((c) => c.id === selectedConversationId),
    [conversations, selectedConversationId]
  );

  /** Filter conversations by the selected status tab. */
  const filteredConversations = useMemo(() => {
    if (statusFilter === "all") return conversations;
    return conversations.filter((c) => c.status === statusFilter);
  }, [conversations, statusFilter]);

  /** Count per status for filter tab badges. */
  const statusCounts = useMemo(() => {
    const counts = { all: conversations.length, open: 0, escalated: 0, closed: 0 };
    conversations.forEach((c) => {
      if (c.status === "open") counts.open++;
      else if (c.status === "escalated") counts.escalated++;
      else if (c.status === "closed") counts.closed++;
    });
    return counts;
  }, [conversations]);

  /* ---- Auto-scroll to latest message ---- */
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  /* ---- Select first conversation by default ---- */
  useEffect(() => {
    if (conversations.length > 0 && !selectedConversationId) {
      setSelectedConversationId(conversations[0].id);
    }
  }, [conversations, selectedConversationId]);

  /* ---- Handlers ---- */
  const handleSelectConversation = useCallback((id: string) => {
    setSelectedConversationId(id);
    setShowMobileChat(true); // switch to chat view on mobile
  }, []);

  const handleSendReply = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyText.trim() && !attachmentUrl) return;

    try {
      await sendReply.mutateAsync({
        message: replyText,
        attachmentUrl: attachmentUrl,
      });
      setReplyText("");
      setAttachmentUrl(null);
    } catch (err) {
      console.error("Failed to send reply:", err);
    }
  };

  /** Simulated file upload – mirrors the existing pattern. */
  const handleSimulateUpload = () => {
    setIsUploading(true);
    setTimeout(() => {
      setAttachmentUrl(
        "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=600&q=80"
      );
      setIsUploading(false);
    }, 1200);
  };

  /* ======================================================================== */
  /*                       SUB-COMPONENT: FILTER TABS                         */
  /* ======================================================================== */

  const filterTabs: { key: StatusFilter; label: string }[] = [
    { key: "all", label: "All" },
    { key: "open", label: "Open" },
    { key: "escalated", label: "Escalated" },
    { key: "closed", label: "Closed" },
  ];

  /* ======================================================================== */
  /*                        SUB-COMPONENT: LEFT PANEL                         */
  /* ======================================================================== */

  const LeftPanel = (
    <div
      className={cn(
        "flex flex-col h-full",
        /* On mobile: hide when chat is active */
        showMobileChat ? "hidden lg:flex" : "flex"
      )}
    >
      <GlassCard hover={false} className="flex-1 flex flex-col p-0 overflow-hidden">
        {/* ----- Inbox header ----- */}
        <div className="p-4 border-b border-white/5 bg-white/[0.02]">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Headphones className="w-4 h-4 text-purple-400" />
              <h2 className="text-sm font-bold uppercase tracking-wider">Support Inbox</h2>
            </div>
            <span className="text-[10px] font-semibold bg-purple-600/20 text-purple-400 px-2 py-0.5 rounded-full border border-purple-500/20">
              {statusCounts.open} open
            </span>
          </div>

          {/* ----- Status filter tabs ----- */}
          <div className="flex gap-1 mt-3">
            {filterTabs.map((tab) => (
              <button
                key={tab.key}
                onClick={() => setStatusFilter(tab.key)}
                className={cn(
                  "px-2.5 py-1 rounded-lg text-[10px] font-semibold transition-all border",
                  statusFilter === tab.key
                    ? "bg-purple-600/20 text-purple-400 border-purple-500/30"
                    : "bg-transparent text-muted-foreground border-transparent hover:bg-white/5 hover:text-white"
                )}
              >
                {tab.label}
                <span className="ml-1 opacity-60">{statusCounts[tab.key]}</span>
              </button>
            ))}
          </div>
        </div>

        {/* ----- Conversation list ----- */}
        <div className="flex-1 overflow-y-auto p-2 space-y-1">
          {isConversationsLoading ? (
            <div className="flex justify-center py-12">
              <Loader2 className="w-5 h-5 text-purple-500 animate-spin" />
            </div>
          ) : filteredConversations.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center px-4">
              <Filter className="w-5 h-5 text-white/10 mb-2" />
              <p className="text-xs text-muted-foreground">
                No {statusFilter === "all" ? "" : statusFilter} conversations found.
              </p>
            </div>
          ) : (
            filteredConversations.map((c) => {
              const isActive = c.id === selectedConversationId;
              const displayName = c.profiles?.full_name || c.profiles?.email || "Unknown";
              const initials = getInitials(c.profiles?.full_name ?? null, c.profiles?.email ?? "U");
              const colorClass = avatarColor(c.user_id);

              return (
                <button
                  key={c.id}
                  onClick={() => handleSelectConversation(c.id)}
                  className={cn(
                    "w-full text-left p-3 rounded-xl border transition-all flex items-start gap-3 group",
                    isActive
                      ? "bg-purple-600/10 border-purple-500/30"
                      : "bg-white/[0.01] border-white/5 hover:bg-white/5"
                  )}
                >
                  {/* User avatar */}
                  <div
                    className={cn(
                      "w-8 h-8 rounded-full flex items-center justify-center text-[11px] font-bold text-white shrink-0",
                      colorClass
                    )}
                  >
                    {initials}
                  </div>

                  {/* Conversation info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <span
                        className={cn(
                          "text-xs font-semibold truncate",
                          isActive ? "text-white" : "text-white/80 group-hover:text-white"
                        )}
                      >
                        {displayName}
                      </span>
                      {/* Status badge */}
                      <span
                        className={cn(
                          "inline-flex items-center px-1.5 py-0.5 rounded text-[8px] font-bold border uppercase tracking-wider shrink-0",
                          c.status === "open" && "bg-emerald-500/10 text-emerald-500 border-emerald-500/20",
                          c.status === "escalated" && "bg-amber-500/10 text-amber-500 border-amber-500/20",
                          c.status === "closed" && "bg-rose-500/10 text-rose-500 border-rose-500/20"
                        )}
                      >
                        {c.status}
                      </span>
                    </div>

                    {c.subject && (
                      <p className="text-[11px] text-muted-foreground/80 truncate leading-snug mt-0.5">
                        Subject: {c.subject}
                      </p>
                    )}

                    {/* Timestamp */}
                    <div className="flex items-center justify-between mt-1.5">
                      <span className="text-[10px] text-muted-foreground flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {timeAgo(c.created_at)}
                      </span>
                      {/* Unread indicator – subtle dot for open/escalated conversations */}
                      {c.status !== "closed" && (
                        <span className="w-2 h-2 rounded-full bg-purple-500 shrink-0" />
                      )}
                    </div>
                  </div>
                </button>
              );
            })
          )}
        </div>
      </GlassCard>
    </div>
  );

  /* ======================================================================== */
  /*                       SUB-COMPONENT: RIGHT PANEL                         */
  /* ======================================================================== */

  const RightPanel = (
    <div
      className={cn(
        "flex flex-col h-full",
        /* On mobile: hide when conversation list is active */
        !showMobileChat ? "hidden lg:flex" : "flex"
      )}
    >
      <GlassCard hover={false} className="flex-1 flex flex-col p-0 overflow-hidden border-white/5 bg-black/40 backdrop-blur-xl">
        {selectedConversationId && activeConversation ? (
          <>
            {/* ---- Chat header ---- */}
            <div className="p-4 border-b border-white/5 bg-white/[0.02] flex justify-between items-center gap-2">
              <div className="flex items-center gap-3 min-w-0">
                {/* Back button for mobile */}
                <button
                  onClick={() => setShowMobileChat(false)}
                  className="lg:hidden p-1 rounded-lg hover:bg-white/5 transition-colors shrink-0"
                  aria-label="Back to conversations"
                >
                  <ChevronLeft className="w-5 h-5 text-muted-foreground" />
                </button>

                {/* User avatar */}
                <div
                  className={cn(
                    "w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold text-white shrink-0",
                    avatarColor(activeConversation.user_id)
                  )}
                >
                  {getInitials(
                    activeConversation.profiles?.full_name ?? null,
                    activeConversation.profiles?.email ?? "U"
                  )}
                </div>

                {/* Name / email + status badge */}
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold truncate">
                      {activeConversation.profiles?.full_name || "User"}
                    </span>
                    <span
                      className={cn(
                        "inline-flex items-center px-1.5 py-0.5 rounded text-[8px] font-bold border uppercase tracking-wider shrink-0",
                        activeConversation.status === "open" && "bg-emerald-500/10 text-emerald-500 border-emerald-500/20",
                        activeConversation.status === "escalated" && "bg-amber-500/10 text-amber-500 border-amber-500/20",
                        activeConversation.status === "closed" && "bg-rose-500/10 text-rose-500 border-rose-500/20"
                      )}
                    >
                      {activeConversation.status}
                    </span>
                  </div>
                  <p className="text-[10px] text-muted-foreground truncate">
                    {activeConversation.profiles?.email}
                  </p>
                </div>
              </div>

              {/* Action buttons – contextual based on ticket status */}
              <div className="flex items-center gap-2 shrink-0">
                {activeConversation.status !== "closed" && (
                  <Button
                    size="sm"
                    variant="glass"
                    className="text-[10px] gap-1 hover:bg-rose-500/10 hover:text-rose-500 h-8 rounded-lg"
                    onClick={() => updateTicketStatus.mutate({ status: "closed" })}
                    disabled={updateTicketStatus.isPending}
                  >
                    <FolderLock className="w-3.5 h-3.5" />
                    <span className="hidden sm:inline">Close Ticket</span>
                  </Button>
                )}

                {activeConversation.status === "open" && (
                  <Button
                    size="sm"
                    variant="glass"
                    className="text-[10px] gap-1 hover:bg-amber-500/10 hover:text-amber-500 h-8 rounded-lg border-amber-500/20"
                    onClick={() => updateTicketStatus.mutate({ status: "escalated" })}
                    disabled={updateTicketStatus.isPending}
                  >
                    <ArrowUpCircle className="w-3.5 h-3.5 text-amber-500" />
                    <span className="hidden sm:inline">Escalate</span>
                  </Button>
                )}

                {activeConversation.status === "closed" && (
                  <Button
                    size="sm"
                    variant="glass"
                    className="text-[10px] gap-1 hover:bg-emerald-500/10 hover:text-emerald-500 h-8 rounded-lg"
                    onClick={() => updateTicketStatus.mutate({ status: "open" })}
                    disabled={updateTicketStatus.isPending}
                  >
                    <Clock className="w-3.5 h-3.5 text-emerald-500" />
                    <span className="hidden sm:inline">Re-open</span>
                  </Button>
                )}
              </div>
            </div>

            {/* ---- Messages area ---- */}
            <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-3">
              {isMessagesLoading ? (
                <div className="flex justify-center items-center h-full">
                  <Loader2 className="w-8 h-8 text-purple-500 animate-spin" />
                </div>
              ) : messages.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-muted-foreground space-y-2">
                  <MessageSquare className="w-8 h-8 text-white/10" />
                  <p className="text-sm">No messages yet. Send a reply to start the conversation.</p>
                </div>
              ) : (
                messages.map((m) => {
                  /*
                   * Determine message ownership:
                   * - If sender_id matches the conversation's user_id → it's a USER message (left).
                   * - Otherwise → it's an ADMIN message (right).
                   * For sender label: if the admin is "me" show "You", else show generic "Admin".
                   */
                  const isUserMessage = m.sender_id === activeConversation.user_id;
                  const isMe = m.sender_id === profile?.id;

                  // Determine display name for the sender
                  let senderName: string;
                  if (isUserMessage) {
                    senderName = activeConversation.profiles?.full_name || activeConversation.profiles?.email || "User";
                  } else if (isMe) {
                    senderName = "You";
                  } else {
                    // Another admin sent this message
                    senderName = "Admin";
                  }

                  return (
                    <div
                      key={m.id}
                      className={cn(
                        "flex flex-col max-w-[75%] md:max-w-[65%] text-xs",
                        isUserMessage ? "mr-auto items-start" : "ml-auto items-end"
                      )}
                    >
                      {/* Sender label */}
                      <span
                        className={cn(
                          "text-[10px] font-semibold mb-1 px-1",
                          isUserMessage ? "text-muted-foreground" : "text-purple-400"
                        )}
                      >
                        {senderName}
                      </span>

                      {/* Message bubble */}
                      <div
                        className={cn(
                          "p-3 rounded-2xl border leading-relaxed",
                          isUserMessage
                            ? "bg-white/5 border-white/10 text-muted-foreground rounded-bl-none"
                            : "bg-purple-600/20 border-purple-500/30 text-white rounded-br-none"
                        )}
                      >
                        {m.message && <p className="whitespace-pre-wrap">{m.message}</p>}
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
                      <span className="text-[9px] text-muted-foreground mt-1 px-1">
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

            {/* ---- Message input footer ---- */}
            {activeConversation.status === "closed" ? (
              <div className="p-4 border-t border-white/5 bg-white/[0.01] flex items-center justify-center gap-2 text-xs text-muted-foreground">
                <FolderLock className="w-3.5 h-3.5 text-rose-400 shrink-0" />
                <span>Ticket closed. Re-open to continue the conversation.</span>
              </div>
            ) : (
              <form onSubmit={handleSendReply} className="p-4 border-t border-white/5 bg-white/[0.01] space-y-2">
                {/* Attachment preview */}
                {attachmentUrl && (
                  <div className="flex items-center gap-2 p-2 bg-white/5 rounded-xl border border-white/10 text-xs w-fit">
                    <Paperclip className="w-3.5 h-3.5 text-purple-400" />
                    <span className="text-muted-foreground truncate max-w-[140px]">Attachment uploaded</span>
                    <button
                      type="button"
                      onClick={() => setAttachmentUrl(null)}
                      className="text-rose-500 hover:text-white transition-colors"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                )}

                <div className="flex gap-2">
                  {/* Attach file button */}
                  <Button
                    type="button"
                    variant="glass"
                    size="icon"
                    className="rounded-xl shrink-0"
                    onClick={handleSimulateUpload}
                    disabled={isUploading}
                  >
                    {isUploading ? (
                      <Loader2 className="w-4 h-4 animate-spin text-purple-500" />
                    ) : (
                      <Paperclip className="w-4 h-4" />
                    )}
                  </Button>

                  {/* Text input */}
                  <Input
                    value={replyText}
                    onChange={(e) => setReplyText(e.target.value)}
                    placeholder="Type your reply..."
                    className="bg-black/20 border-white/10 rounded-xl flex-1 text-xs"
                  />

                  {/* Send button */}
                  <Button
                    type="submit"
                    variant="premium"
                    size="icon"
                    className="rounded-xl shrink-0 bg-purple-600 hover:bg-purple-500"
                    disabled={sendReply.isPending || (!replyText.trim() && !attachmentUrl)}
                  >
                    {sendReply.isPending ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <Send className="w-4 h-4" />
                    )}
                  </Button>
                </div>
              </form>
            )}
          </>
        ) : (
          /* ---- Empty state when no conversation is selected ---- */
          <div className="flex flex-col items-center justify-center h-full text-center p-6 space-y-4">
            {/* Back button for mobile */}
            <button
              onClick={() => setShowMobileChat(false)}
              className="lg:hidden absolute top-4 left-4 p-1 rounded-lg hover:bg-white/5 transition-colors"
              aria-label="Back to conversations"
            >
              <ChevronLeft className="w-5 h-5 text-muted-foreground" />
            </button>

            <div className="w-16 h-16 bg-white/[0.02] border border-white/5 rounded-full flex items-center justify-center">
              <Headphones className="w-8 h-8 text-muted-foreground" />
            </div>
            <div className="space-y-1 max-w-sm">
              <h3 className="font-bold text-lg">Select a Conversation</h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Choose a support conversation from the inbox to view the full chat history and reply to the user.
              </p>
            </div>
          </div>
        )}
      </GlassCard>
    </div>
  );

  /* ======================================================================== */
  /*                               MAIN RENDER                                */
  /* ======================================================================== */

  return (
    <div className="space-y-6 pb-12">
      {/* Page header */}
      <div>
        <h1 className="text-3xl font-extrabold tracking-tight">Support Chat</h1>
        <p className="text-muted-foreground text-xs uppercase tracking-widest mt-1">
          Live conversations with users
        </p>
      </div>

      {/* Two-panel layout */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 lg:gap-6 h-[calc(100vh-220px)] min-h-[500px]">
        {/* Left panel – 1/4 width on desktop */}
        <div className="lg:col-span-1 h-full">{LeftPanel}</div>

        {/* Right panel – 3/4 width on desktop */}
        <div className="lg:col-span-3 h-full relative">{RightPanel}</div>
      </div>
    </div>
  );
}
