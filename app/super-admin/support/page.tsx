"use client";

import { useState, useRef, useEffect } from "react";
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
  AlertCircle, 
  Clock, 
  CheckCircle2, 
  ArrowRight,
  User,
  ShieldAlert,
  FolderLock,
  ArrowUpCircle,
  X
} from "lucide-react";
import { cn } from "@/lib/utils";

export default function AdminSupportQueuePage() {
  const { profile } = useProfile();
  const [selectedConversationId, setSelectedConversationId] = useState<string | undefined>(undefined);
  
  const { 
    conversations, 
    messages, 
    isConversationsLoading, 
    isMessagesLoading, 
    updateTicketStatus, 
    sendReply 
  } = useAdminChat(selectedConversationId);

  const [replyText, setReplyText] = useState("");
  const [attachmentUrl, setAttachmentUrl] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Set default active conversation if any exist
  useEffect(() => {
    if (conversations.length > 0 && !selectedConversationId) {
      setSelectedConversationId(conversations[0].id);
    }
  }, [conversations, selectedConversationId]);

  const handleSendReply = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyText.trim() && !attachmentUrl) return;

    try {
      await sendReply.mutateAsync({
        message: replyText,
        attachmentUrl: attachmentUrl
      });
      setReplyText("");
      setAttachmentUrl(null);
    } catch (e) {
      console.error(e);
    }
  };

  // Simulate file upload
  const handleSimulateUpload = () => {
    setIsUploading(true);
    setTimeout(() => {
      setAttachmentUrl("https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=600&q=80");
      setIsUploading(false);
    }, 1200);
  };

  const activeConversation = conversations.find(c => c.id === selectedConversationId);

  return (
    <div className="space-y-6 pb-12">
      <div>
        <h1 className="text-3xl font-extrabold tracking-tight">Support Queue</h1>
        <p className="text-muted-foreground text-xs uppercase tracking-widest mt-1">Institutional Help Desk Tickets</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 min-h-[500px]">
        {/* Left Side: Tickets List */}
        <div className="lg:col-span-1 space-y-4">
          <GlassCard className="p-4 space-y-4 h-[550px] flex flex-col">
            <h3 className="text-sm font-bold uppercase tracking-wider text-muted-foreground border-b border-white/5 pb-2">All Active Tickets</h3>
            {isConversationsLoading ? (
              <div className="flex justify-center py-8">
                <Loader2 className="w-5 h-5 text-purple-500 animate-spin" />
              </div>
            ) : conversations.length === 0 ? (
              <p className="text-xs text-muted-foreground text-center py-8">No tickets opened in system.</p>
            ) : (
              <div className="space-y-2 overflow-y-auto flex-1 pr-1">
                {conversations.map((c) => {
                  const isActive = c.id === selectedConversationId;
                  return (
                    <button
                      key={c.id}
                      onClick={() => setSelectedConversationId(c.id)}
                      className={cn(
                        "w-full text-left p-3 rounded-xl border transition-all text-xs flex flex-col gap-2",
                        isActive 
                          ? "bg-purple-600/10 border-purple-500/30 text-white" 
                          : "bg-white/[0.01] border-white/5 text-muted-foreground hover:bg-white/5 hover:text-white"
                      )}
                    >
                      <div className="flex justify-between items-start w-full">
                        <span className="font-bold flex items-center gap-1.5 truncate">
                          <MessageSquare className="w-3.5 h-3.5" /> #{c.id.slice(0, 8)}
                        </span>
                        <span className={cn(
                          "inline-flex items-center px-1.5 py-0.5 rounded text-[8px] font-bold border uppercase tracking-wider",
                          c.status === "open" && "bg-emerald-500/10 text-emerald-500 border-emerald-500/20",
                          c.status === "escalated" && "bg-amber-500/10 text-amber-500 border-amber-500/20",
                          c.status === "closed" && "bg-rose-500/10 text-rose-500 border-rose-500/20"
                        )}>
                          {c.status}
                        </span>
                      </div>
                      <div className="text-[10px] text-muted-foreground truncate">
                        {c.profiles?.full_name || c.profiles?.email}
                      </div>
                    </button>
                  );
                })}
              </div>
            )}
          </GlassCard>
        </div>

        {/* Right Side: Chat Window */}
        <div className="lg:col-span-3 flex flex-col h-[550px] relative">
          <GlassCard className="flex-1 flex flex-col p-0 overflow-hidden h-full border-white/5 bg-black/40 backdrop-blur-xl">
            {selectedConversationId ? (
              <>
                {/* Chat Header */}
                <div className="p-4 border-b border-white/5 bg-white/[0.02] flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-purple-600/20 flex items-center justify-center border border-purple-600/30">
                      <User className="w-4 h-4 text-purple-400" />
                    </div>
                    <div>
                      <div className="text-sm font-bold">{activeConversation?.profiles?.full_name || "New Institution"}</div>
                      <div className="text-[10px] text-muted-foreground">{activeConversation?.profiles?.email}</div>
                    </div>
                  </div>

                  {/* Action Controls */}
                  <div className="flex items-center gap-2">
                    {activeConversation?.status !== "closed" && (
                      <Button 
                        size="sm" 
                        variant="glass" 
                        className="text-[10px] gap-1 hover:bg-rose-500/10 hover:text-rose-500 h-8 rounded-lg"
                        onClick={() => updateTicketStatus.mutate({ status: "closed" })}
                        disabled={updateTicketStatus.isPending}
                      >
                        <FolderLock className="w-3.5 h-3.5" /> Close Ticket
                      </Button>
                    )}
                    {activeConversation?.status !== "escalated" && activeConversation?.status !== "closed" && (
                      <Button 
                        size="sm" 
                        variant="glass" 
                        className="text-[10px] gap-1 hover:bg-amber-500/10 hover:text-amber-500 h-8 rounded-lg border-amber-500/20"
                        onClick={() => updateTicketStatus.mutate({ status: "escalated" })}
                        disabled={updateTicketStatus.isPending}
                      >
                        <ArrowUpCircle className="w-3.5 h-3.5 text-amber-500" /> Escalate
                      </Button>
                    )}
                    {activeConversation?.status === "closed" && (
                      <Button 
                        size="sm" 
                        variant="glass" 
                        className="text-[10px] gap-1 hover:bg-emerald-500/10 hover:text-emerald-500 h-8 rounded-lg"
                        onClick={() => updateTicketStatus.mutate({ status: "open" })}
                        disabled={updateTicketStatus.isPending}
                      >
                        <Clock className="w-3.5 h-3.5 text-emerald-500" /> Re-open
                      </Button>
                    )}
                  </div>

                </div>

                {/* Messages Body */}
                <div className="flex-1 overflow-y-auto p-6 space-y-4">
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
                      const isMe = m.sender_id === profile?.id;
                      return (
                        <div key={m.id} className={cn("flex flex-col max-w-[70%] text-xs", isMe ? "ml-auto items-end" : "mr-auto items-start")}>
                          <div className={cn(
                            "p-3 rounded-2xl border leading-relaxed",
                            isMe 
                              ? "bg-purple-600/20 border-purple-500/30 text-white rounded-br-none" 
                              : "bg-white/5 border-white/10 text-muted-foreground rounded-bl-none"
                          )}>
                            {m.message && <p>{m.message}</p>}
                            {m.attachment_url && (
                              <div className="mt-2 rounded-xl overflow-hidden border border-white/10 max-w-[200px]">
                                <img src={m.attachment_url} alt="Attachment" className="object-cover w-full h-auto" />
                              </div>
                            )}
                          </div>
                          <span className="text-[9px] text-muted-foreground mt-1">
                            {new Date(m.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </span>
                        </div>
                      );
                    })
                  )}
                  <div ref={messagesEndRef} />
                </div>

                {/* Message Input Footer */}
                {activeConversation?.status === "closed" ? (
                  <div className="p-4 border-t border-white/5 bg-white/[0.01] text-center text-xs text-muted-foreground">
                    This support ticket has been closed. Re-open it using the top control to reply.
                  </div>
                ) : (
                  <form onSubmit={handleSendReply} className="p-4 border-t border-white/5 bg-white/[0.01] space-y-2">
                    {attachmentUrl && (
                      <div className="flex items-center gap-2 p-2 bg-white/5 rounded-xl border border-white/10 text-xs w-fit">
                        <Paperclip className="w-3.5 h-3.5 text-purple-400" />
                        <span className="text-muted-foreground truncate max-w-[120px]">Attachment uploaded</span>
                        <button type="button" onClick={() => setAttachmentUrl(null)} className="text-rose-500 hover:text-white">
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    )}

                    <div className="flex gap-2">
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

                      <Input
                        value={replyText}
                        onChange={(e) => setReplyText(e.target.value)}
                        placeholder="Type a compliance response..."
                        className="bg-black/20 border-white/10 rounded-xl flex-1 text-xs"
                      />

                      <Button
                        type="submit"
                        variant="premium"
                        size="icon"
                        className="rounded-xl shrink-0 bg-purple-600 hover:bg-purple-500"
                        disabled={sendReply.isPending}
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
              <div className="flex flex-col items-center justify-center h-full text-center p-6 space-y-4">
                <div className="w-16 h-16 bg-white/[0.02] border border-white/5 rounded-full flex items-center justify-center">
                  <MessageSquare className="w-8 h-8 text-muted-foreground" />
                </div>
                <div className="space-y-1 max-w-sm">
                  <h3 className="font-bold text-lg">No Ticket Selected</h3>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    Select a support ticket from the queue list to review and reply to user queries.
                  </p>
                </div>
              </div>
            )}
          </GlassCard>
        </div>
      </div>
    </div>
  );
}
