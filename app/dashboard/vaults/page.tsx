"use client";

import { useState } from "react";
import { VaultCard } from "@/features/vaults/components/vault-card";
import { ApprovalWorkflow } from "@/features/vaults/components/approval-workflow";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { GlassCard } from "@/components/shared/glass-card";
import { Plus, ShieldPlus, Search, Filter, ShieldCheck, Loader2, X } from "lucide-react";
import { useVaults } from "@/hooks/use-vaults";
import { Vault } from "@/types/supabase";

export default function VaultsPage() {
  const { vaults, isLoading, error, createVault } = useVaults();
  
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [vaultType, setVaultType] = useState<"Single-Sig" | "Multi-Sig">("Single-Sig");
  const [newVaultName, setNewVaultName] = useState("");
  const [isCreating, setIsCreating] = useState(false);

  const handleCreateVault = async () => {
    if (!newVaultName) return;
    setIsCreating(true);
    try {
      await createVault.mutateAsync({
        name: newVaultName,
        type: "Institutional",
        threshold_n: vaultType === "Single-Sig" ? 1 : 2,
        threshold_m: vaultType === "Single-Sig" ? 1 : 3,
      });
      setShowCreateModal(false);
      setNewVaultName("");
    } catch (e) {
      console.error(e);
    } finally {
      setIsCreating(false);
    }
  };

  if (isLoading) {
    return (
      <div className="h-[60vh] flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-primary animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-12 pb-20">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-primary/20 rounded-lg">
              <ShieldCheck className="w-5 h-5 text-primary" />
            </div>
            <h1 className="text-3xl font-bold tracking-tight">Institutional Vaults</h1>
          </div>
          <p className="text-muted-foreground">Secure multi-signature asset management and governance.</p>
        </div>
        <div className="flex gap-3">
          <Button 
            variant="glass" 
            size="sm" 
            className="gap-2"
            onClick={() => { setVaultType("Single-Sig"); setShowCreateModal(true); }}
          >
            <Plus className="w-4 h-4" /> New Single-Sig
          </Button>
          <Button 
            variant="premium" 
            size="sm" 
            className="gap-2"
            onClick={() => { setVaultType("Multi-Sig"); setShowCreateModal(true); }}
          >
            <ShieldPlus className="w-4 h-4" /> Create Multi-Sig Vault
          </Button>
        </div>
      </div>

      {/* Approval Queue */}
      <ApprovalWorkflow />

      {/* Vault Grid */}
      <section className="space-y-6">
        <div className="flex justify-between items-center px-2">
          <h2 className="text-xl font-bold">Your Vaults</h2>
          <div className="flex gap-2">
            <div className="relative hidden md:block">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input 
                type="text" 
                placeholder="Search vaults..." 
                className="bg-white/5 border border-white/10 rounded-xl py-1.5 pl-10 pr-4 text-sm focus:outline-none"
              />
            </div>
            <Button variant="glass" size="sm">
              <Filter className="w-4 h-4 mr-2" /> Filter
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {vaults?.length === 0 ? (
            <div className="col-span-full py-20 text-center space-y-4 border-2 border-dashed border-white/5 rounded-[2rem]">
              <p className="text-muted-foreground">No institutional vaults found.</p>
              <Button variant="premium">Create Your First Vault</Button>
            </div>
          ) : (
            vaults?.map((vault: Vault) => (
              <VaultCard 
                key={vault.id} 
                id={vault.id.slice(0, 8)}
                name={vault.name}
                balance={`$${vault.balance_usd?.toLocaleString() || "0"}`}
                threshold={`${vault.threshold_n}-of-${vault.threshold_m}`}
                signers={vault.vault_signers?.length || 0}
                pendingActions={0} // Logic for pending actions would go here
                type={vault.type}
              />
            ))
          )}
        </div>
      </section>

      {/* Policy Management Preview */}
      <div className="glassmorphism p-8 rounded-[2.5rem] border border-white/5 bg-gradient-to-br from-primary/5 to-transparent relative overflow-hidden">
        <div className="flex flex-col md:flex-row items-center gap-8 relative z-10">
          <div className="p-6 bg-white/5 rounded-3xl border border-white/10 flex items-center justify-center">
            <ShieldPlus className="w-12 h-12 text-primary" />
          </div>
          <div className="flex-1 space-y-2 text-center md:text-left">
            <h3 className="text-2xl font-bold">Advanced Policy Engine</h3>
            <p className="text-muted-foreground leading-relaxed">
              Define granular spending limits, whitelists, and time-locks for your institutional assets. 
              Our multi-signature protocol ensures that no single point of failure can compromise your capital.
            </p>
          </div>
          <Button variant="outline" className="w-full md:w-auto h-12 px-8">Configure Policies</Button>
        </div>
      </div>

      {/* Create Vault Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <GlassCard className="max-w-md w-full p-8 space-y-6 relative border-primary/20">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold">Create {vaultType} Vault</h2>
              <Button variant="ghost" size="icon" onClick={() => setShowCreateModal(false)}>
                <X className="w-4 h-4" />
              </Button>
            </div>
            
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Vault Name</label>
                <Input 
                  placeholder="e.g. Treasury Fund Alpha" 
                  value={newVaultName}
                  onChange={(e) => setNewVaultName(e.target.value)}
                  className="bg-white/5 border-white/10" 
                />
              </div>
              <div className="p-4 bg-white/5 border border-white/10 rounded-2xl">
                <h4 className="text-sm font-bold mb-1">Configuration Overview</h4>
                {vaultType === "Single-Sig" ? (
                  <p className="text-xs text-muted-foreground">1-of-1 Signature Threshold. Ideal for high-frequency trading or individual active accounts.</p>
                ) : (
                  <p className="text-xs text-muted-foreground">2-of-3 Signature Threshold. Institutional security for cold storage and large treasuries.</p>
                )}
              </div>
            </div>

            <div className="flex gap-3 pt-4">
              <Button variant="glass" className="flex-1" onClick={() => setShowCreateModal(false)}>Cancel</Button>
              <Button 
                variant="premium" 
                className="flex-1" 
                onClick={handleCreateVault}
                disabled={!newVaultName || isCreating}
              >
                {isCreating ? "Creating..." : "Create Vault"}
              </Button>
            </div>
          </GlassCard>
        </div>
      )}
    </div>
  );
}
