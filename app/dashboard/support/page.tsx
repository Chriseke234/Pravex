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
  AlertCircle, 
  Clock, 
  CheckCircle2, 
  ArrowRight,
  Shield,
  X
} from "lucide-react";
import { cn } from "@/lib/utils";


export default function UserSupportPage() {
  const { profile } = useProfile();
  const [selectedConversationId, setSelectedConversationId] = useState<string | undefined>(undefined);
  
  const { 
    conversations, 
    messages, 
    isConversationsLoading, 
    isMessagesLoading, 
    createConversation, 
    sendMessage 
  } = useChat(selectedConversationId);

  const [messageText, setMessageText] = useState("");
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

  const handleStartTicket = async () => {
    try {
      const newTicket = await createConversation.mutateAsync();
      setSelectedConversationId(newTicket.id);
    } catch (e) {
      console.error(e);
    }
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!messageText.trim() && !attachmentUrl) return;

    try {
      await sendMessage.mutateAsync({
        message: messageText,
        attachmentUrl: attachmentUrl
      });
      setMessageText("");
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
        <h1 className="text-3xl font-bold tracking-tight">Institutional Support</h1>
        <p className="text-muted-foreground">Open a secure channel to our administrators for platform help or compliance issues.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 min-h-[500px]">
        {/* Left Side: Tickets List */}
        <div className="lg:col-span-1 space-y-4">
          <Button 
            onClick={handleStartTicket} 
            className="w-full gap-2 rounded-xl py-6 font-bold" 
            variant="premium"
            disabled={createConversation.isPending}
          >
            {createConversation.isPending ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Plus className="w-4 h-4" />
            )}
            Open Support Ticket
          </Button>

          <GlassCard className="p-4 space-y-4">
            <h3 className="text-sm font-bold uppercase tracking-wider text-muted-foreground border-b border-white/5 pb-2">Active Tickets</h3>
            {isConversationsLoading ? (
              <div className="flex justify-center py-8">
                <Loader2 className="w-5 h-5 text-primary animate-spin" />
              </div>
            ) : conversations.length === 0 ? (
              <p className="text-xs text-muted-foreground text-center py-8">No tickets opened yet.</p>
            ) : (
              <div className="space-y-2 max-h-[300px] overflow-y-auto pr-1">
                {conversations.map((c) => {
                  const isActive = c.id === selectedConversationId;
                  return (
                    <button
                      key={c.id}
                      onClick={() => setSelectedConversationId(c.id)}
                      className={cn(
                        "w-full text-left p-3 rounded-xl border transition-all text-xs flex justify-between items-center gap-2",
                        isActive 
                          ? "bg-primary/10 border-primary/30 text-white" 
                          : "bg-white/[0.01] border-white/5 text-muted-foreground hover:bg-white/5 hover:text-white"
                      )}
                    >
                      <div className="space-y-1 overflow-hidden">
                        <div className="font-bold flex items-center gap-1.5 truncate">
                          <MessageSquare className="w-3.5 h-3.5" /> Ticket #{c.id.slice(0, 8)}
                        </div>
                        <div className="text-[10px] text-muted-foreground">
                          {new Date(c.created_at).toLocaleDateString()}
                        </div>
                      </div>
                      <span className={cn(
                        "inline-flex items-center gap-1 px-2 py-0.5 rounded text-[8px] font-bold border uppercase tracking-wider",
                        c.status === "open" && "bg-emerald-500/10 text-emerald-500 border-emerald-500/20",
                        c.status === "escalated" && "bg-amber-500/10 text-amber-500 border-amber-500/20",
                        c.status === "closed" && "bg-muted/10 text-muted-foreground border-white/5"
                      )}>
                        {c.status}
                      </span>
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
                    <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center border border-primary/30">
                      <Shield className="w-4 h-4 text-primary" />
                    </div>
                    <div>
                      <div className="text-sm font-bold">Secure Support Channel</div>
                      <div className="text-[10px] text-muted-foreground">Ticket ID: {selectedConversationId}</div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className={cn(
                      "inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold border",
                      activeConversation?.status === "open" && "bg-emerald-500/10 text-emerald-500 border-emerald-500/20",
                      activeConversation?.status === "escalated" && "bg-amber-500/10 text-amber-500 border-amber-500/20",
                      activeConversation?.status === "closed" && "bg-rose-500/10 text-rose-500 border-rose-500/20"
                    )}>
                      {activeConversation?.status === "open" ? <CheckCircle2 className="w-3 h-3" /> : 
                       activeConversation?.status === "escalated" ? <Clock className="w-3 h-3" /> : 
                       <AlertCircle className="w-3 h-3" />}
                      Status: {activeConversation?.status}
                    </span>
                  </div>
                </div>

                {/* Messages Body */}
                <div className="flex-1 overflow-y-auto p-6 space-y-4">
                  {isMessagesLoading ? (
                    <div className="flex justify-center items-center h-full">
                      <Loader2 className="w-8 h-8 text-primary animate-spin" />
                    </div>
                  ) : messages.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-full text-muted-foreground space-y-2">
                      <MessageSquare className="w-8 h-8 text-white/10" />
                      <p className="text-sm">No messages yet. Send a message to start conversation.</p>
                    </div>
                  ) : (
                    messages.map((m) => {
                      const isMe = m.sender_id === profile?.id;
                      return (
                        <div key={m.id} className={cn("flex flex-col max-w-[70%] text-xs", isMe ? "ml-auto items-end" : "mr-auto items-start")}>
                          <div className={cn(
                            "p-3 rounded-2xl border leading-relaxed",
                            isMe 
                              ? "bg-primary/20 border-primary/30 text-white rounded-br-none" 
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
                    This support ticket has been closed. If you need further assistance, please open a new ticket.
                  </div>
                ) : (
                  <form onSubmit={handleSendMessage} className="p-4 border-t border-white/5 bg-white/[0.01] space-y-2">
                    {attachmentUrl && (
                      <div className="flex items-center gap-2 p-2 bg-white/5 rounded-xl border border-white/10 text-xs w-fit">
                        <Paperclip className="w-3.5 h-3.5 text-primary" />
                        <span className="text-muted-foreground truncate max-w-[120px]">Screenshot attachment</span>
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
                        disabled={isUploading || isUploading}
                      >
                        {isUploading ? (
                          <Loader2 className="w-4 h-4 animate-spin text-primary" />
                        ) : (
                          <Paperclip className="w-4 h-4" />
                        )}
                      </Button>

                      <Input
                        value={messageText}
                        onChange={(e) => setMessageText(e.target.value)}
                        placeholder="Type a secure message..."
                        className="bg-black/20 border-white/10 rounded-xl flex-1 text-xs"
                      />

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
                )}
              </>
            ) : (
              <div className="flex flex-col items-center justify-center h-full text-center p-6 space-y-4">
                <div className="w-16 h-16 bg-white/[0.02] border border-white/5 rounded-full flex items-center justify-center">
                  <MessageSquare className="w-8 h-8 text-muted-foreground" />
                </div>
                <div className="space-y-1 max-w-sm">
                  <h3 className="font-bold text-lg">No Active Ticket Selected</h3>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    Select an existing support conversation from the active list or open a new one to speak directly to a compliance manager.
                  </p>
                </div>
                <Button onClick={handleStartTicket} variant="premium" className="gap-2 rounded-xl">
                  Open Support Ticket <ArrowRight className="w-4 h-4" />
                </Button>
              </div>
            )}
          </GlassCard>
        </div>
      </div>
    </div>
  );
}
