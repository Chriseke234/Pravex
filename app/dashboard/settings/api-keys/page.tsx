"use client";

import { useState } from "react";
import { useApiKeys } from "@/hooks/use-api-keys";
import { GlassCard } from "@/components/shared/glass-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Key, 
  Plus, 
  Copy, 
  Trash2, 
  Globe, 
  Terminal,
  ExternalLink,
  Code2,
  AlertCircle
} from "lucide-react";

export default function APIKeysPage() {
  const { apiKeys, isLoading, createApiKey, deleteApiKey } = useApiKeys();
  const [showNewKeyModal, setShowNewKeyModal] = useState(false);
  
  // Form state
  const [newKeyName, setNewKeyName] = useState("");
  const [newKeyScopes, setNewKeyScopes] = useState<string[]>(["read"]);
  
  // Result state
  const [generatedKey, setGeneratedKey] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);

  const toggleScope = (scope: string) => {
    setNewKeyScopes(prev => 
      prev.includes(scope) 
        ? prev.filter(s => s !== scope)
        : [...prev, scope]
    );
  };

  const handleGenerateKey = async () => {
    if (!newKeyName) return;
    setIsGenerating(true);
    try {
      const { rawKey } = await createApiKey.mutateAsync({ name: newKeyName, scopes: newKeyScopes });
      setGeneratedKey(rawKey);
    } catch (e) {
      console.error(e);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleDelete = async (id: string) => {
    await deleteApiKey.mutateAsync(id);
  };

  const handleCloseModal = () => {
    setShowNewKeyModal(false);
    setGeneratedKey("");
    setNewKeyName("");
    setNewKeyScopes(["read"]);
  };

  return (
    <div className="space-y-10 pb-20">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">API Management</h1>
          <p className="text-muted-foreground">Provision secure keys for programmatic access to the Ironbridgemarket infrastructure.</p>
        </div>
        <Button variant="premium" className="gap-2" onClick={() => setShowNewKeyModal(true)}>
          <Plus className="w-4 h-4" /> Create New Key
        </Button>
      </div>

      {/* Security Warning */}
      <div className="p-4 bg-amber-500/10 border border-amber-500/20 rounded-2xl flex gap-4 items-start">
        <AlertCircle className="w-5 h-5 text-amber-500 mt-0.5" />
        <div className="space-y-1">
          <p className="text-sm font-bold text-amber-500">Institutional Security Protocol</p>
          <p className="text-xs text-amber-200/60 leading-relaxed">
            API keys grant full access to your scoped assets. Never share your secret keys or commit them to version control. 
            We recommend rotating keys every 90 days.
          </p>
        </div>
      </div>

      {/* Active Keys */}
      <section className="space-y-6">
        <h2 className="text-xl font-bold px-2">Active API Keys</h2>
        <div className="space-y-4">
          {isLoading ? (
            <div className="p-6 text-muted-foreground">Loading keys...</div>
          ) : apiKeys?.length === 0 ? (
            <div className="p-6 text-muted-foreground border border-white/10 rounded-2xl">No API keys provisioned.</div>
          ) : (
            apiKeys?.map((key) => (
              <GlassCard key={key.id} className="p-6">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                  <div className="flex gap-4 items-center">
                    <div className="p-3 bg-white/5 rounded-2xl border border-white/10">
                      <Key className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-bold">{key.name}</h3>
                      <div className="flex gap-2 items-center mt-1">
                        <code className="text-xs text-muted-foreground bg-white/5 px-2 py-0.5 rounded">{key.key_prefix}...</code>
                        <span className="text-[10px] text-muted-foreground">• Created {new Date(key.created_at).toLocaleDateString()}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-3 w-full md:w-auto">
                    <div className="flex gap-1">
                      {key.scopes.map(s => (
                        <span key={s} className="text-[10px] px-2 py-0.5 rounded-full bg-primary/10 text-primary border border-primary/20">
                          {s}
                        </span>
                      ))}
                    </div>
                    <Button variant="glass" size="icon" className="h-9 w-9" onClick={() => handleDelete(key.id)}>
                      <Trash2 className="w-4 h-4 text-rose-500" />
                    </Button>
                  </div>
                </div>
              </GlassCard>
            ))
          )}
        </div>
      </section>

      {/* Developer Resources */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <GlassCard className="p-8 space-y-6 bg-gradient-to-br from-primary/5 to-transparent border-primary/10">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-primary/20 rounded-2xl">
              <Code2 className="w-6 h-6 text-primary" />
            </div>
            <h3 className="text-xl font-bold">API Documentation</h3>
          </div>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Integrate Ironbridgemarket into your proprietary trading systems, order management software, or institutional custodians. 
            Supports REST and WebSocket streams.
          </p>
          <Button variant="outline" className="w-full gap-2">
            View Docs <ExternalLink className="w-4 h-4" />
          </Button>
        </GlassCard>

        <GlassCard className="p-8 space-y-6">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-indigo-500/20 rounded-2xl">
              <Globe className="w-6 h-6 text-indigo-500" />
            </div>
            <h3 className="text-xl font-bold">Webhook Endpoints</h3>
          </div>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Receive real-time notifications for vault approvals, transaction completions, and security alerts 
            directly to your backend infrastructure.
          </p>
          <Button variant="outline" className="w-full gap-2">
            Configure Webhooks <Terminal className="w-4 h-4" />
          </Button>
        </GlassCard>
      </div>

      {/* New Key Modal */}
      {showNewKeyModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <GlassCard className="max-w-xl w-full p-8 space-y-6 relative border-primary/20">
            <h2 className="text-2xl font-bold">Create Institutional API Key</h2>
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Key Name</label>
                <Input 
                  placeholder="e.g. Trading Desk Bot A" 
                  value={newKeyName}
                  onChange={(e) => setNewKeyName(e.target.value)}
                  className="bg-white/5 border-white/10" 
                  disabled={!!generatedKey}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Permissions (Scopes)</label>
                <div className="grid grid-cols-2 gap-3">
                  {["read", "write", "vault_approve", "transfer"].map(s => (
                    <label key={s} className="flex items-center gap-3 p-3 bg-white/5 rounded-xl border border-white/10 cursor-pointer hover:bg-white/10 transition-colors">
                      <input 
                        type="checkbox" 
                        className="rounded border-white/20 bg-transparent text-primary" 
                        checked={newKeyScopes.includes(s)}
                        onChange={() => toggleScope(s)}
                        disabled={!!generatedKey}
                      />
                      <span className="text-sm capitalize">{s.replace('_', ' ')}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
            {!generatedKey && (
              <div className="flex gap-3 pt-4">
                <Button variant="glass" className="flex-1" onClick={handleCloseModal}>Cancel</Button>
                <Button variant="premium" className="flex-1" onClick={handleGenerateKey} disabled={!newKeyName || isGenerating}>
                  {isGenerating ? "Generating..." : "Generate Key"}
                </Button>
              </div>
            )}

            {generatedKey && (
              <div className="mt-6 p-4 bg-primary/10 border border-primary/20 rounded-2xl space-y-3 animate-in fade-in slide-in-from-top-2">
                <p className="text-xs font-bold text-primary uppercase">Your New API Key</p>
                <div className="flex gap-2">
                  <code className="flex-1 bg-black/40 p-3 rounded-xl text-xs break-all border border-white/5">
                    {generatedKey}
                  </code>
                  <Button variant="glass" size="icon" onClick={() => navigator.clipboard.writeText(generatedKey)}>
                    <Copy className="w-4 h-4" />
                  </Button>
                </div>
                <p className="text-[10px] text-muted-foreground italic">
                  Copy this key now. It will not be shown again for security reasons.
                </p>
                <Button variant="glass" className="w-full mt-4" onClick={handleCloseModal}>Done</Button>
              </div>
            )}
          </GlassCard>
        </div>
      )}
    </div>
  );
}
