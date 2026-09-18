"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { createClient } from "@/lib/supabase/client";
import { GlassCard } from "@/components/shared/glass-card";
import { DataTable, Column } from "@/components/ui/data-table";
import { StatusBadge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Modal } from "@/components/ui/modal";
import { useToast } from "@/components/ui/toast";
import { 
  Send, 
  ArrowDownLeft, 
  ArrowUpRight, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  Plus, 
  User, 
  Building2, 
  DollarSign, 
  RefreshCw 
} from "lucide-react";
import { formatCurrency, formatDate } from "@/lib/utils/formatters";

export default function AdminTransfersPage() {
  const supabase = createClient();
  const queryClient = useQueryClient();
  const { showToast } = useToast();

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState("");
  const [transferType, setTransferType] = useState<"inward" | "outward">("inward");
  const [amount, setAmount] = useState("");
  const [recipientName, setRecipientName] = useState("");
  const [recipientAccount, setRecipientAccount] = useState("");
  const [bankName, setBankName] = useState("");
  const [reference, setReference] = useState("");
  const [description, setDescription] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Fetch all transfers
  const transfersQuery = useQuery({
    queryKey: ["admin-transfers"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("transfers")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data || [];
    },
  });

  // Fetch users for transfer injection
  const usersQuery = useQuery({
    queryKey: ["admin-users-list"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("profiles")
        .select("id, email, full_name")
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data || [];
    },
  });

  // Update status mutation
  const updateStatusMutation = useMutation({
    mutationFn: async ({ id, status, senderId, amount, isCredit }: { id: string; status: string; senderId?: string; amount?: number; isCredit?: boolean }) => {
      const { error } = await supabase
        .from("transfers")
        .update({ status })
        .eq("id", id);

      if (error) throw error;

      // Also sync wallet transaction if available
      if (senderId && amount) {
        const { data: wallet } = await supabase
          .from("wallets")
          .select("*")
          .eq("user_id", senderId)
          .maybeSingle();

        if (wallet) {
          if (status === "completed") {
            const newBal = isCredit ? (wallet.balance || 0) + amount : Math.max(0, (wallet.balance || 0) - amount);
            await supabase.from("wallets").update({ balance: newBal }).eq("id", wallet.id);
          }
        }
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-transfers"] });
      showToast({ type: "success", title: "Status Updated", description: "Transfer status successfully updated." });
    },
    onError: (err: any) => {
      showToast({ type: "error", title: "Update Failed", description: err.message || "Failed to update status." });
    },
  });

  // Admin Transfer Creation Mutation (Inward / Outward)
  const handleCreateAdminTransfer = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedUser || !amount || Number(amount) <= 0) {
      showToast({ type: "error", title: "Missing Fields", description: "Please specify target client and amount." });
      return;
    }

    setIsSubmitting(true);
    try {
      const numAmount = Number(amount);
      const ref = reference || "ADM-" + Math.random().toString(36).substring(2, 8).toUpperCase();
      const desc = description || (transferType === "inward" ? "Inward Wire Settlement" : "Commercial Wire Transfer");

      // 1. Create transfer record
      const { data: transferRecord, error: trfErr } = await supabase
        .from("transfers")
        .insert([{
          sender_id: selectedUser,
          recipient_name: recipientName || "Iron Bridge Finance Client",
          recipient_account: recipientAccount || "ACC-PRIMARY",
          bank_name: bankName || "Clearing House",
          amount: numAmount,
          currency: "USD",
          type: transferType === "inward" ? "domestic" : "domestic",
          description: desc,
          reference: ref,
          status: "completed",
        }])
        .select()
        .single();

      if (trfErr) throw trfErr;

      // 2. Reflect on User's Wallet
      const { data: wallet } = await supabase
        .from("wallets")
        .select("*")
        .eq("user_id", selectedUser)
        .maybeSingle();

      if (wallet) {
        const txType = transferType === "inward" ? "credit" : "debit";
        await supabase.from("wallet_transactions").insert([{
          wallet_id: wallet.id,
          amount: numAmount,
          type: txType,
          status: "completed",
          reference: ref,
          description: desc,
        }]);

        const updatedBal = transferType === "inward" 
          ? (wallet.balance || 0) + numAmount 
          : Math.max(0, (wallet.balance || 0) - numAmount);

        await supabase
          .from("wallets")
          .update({ balance: updatedBal, updated_at: new Date().toISOString() })
          .eq("id", wallet.id);
      }

      showToast({
        type: "success",
        title: "Transfer Processed",
        description: `${transferType === "inward" ? "Inward Credit" : "Outward Wire"} of ${formatCurrency(numAmount)} applied and reflected on client dashboard.`,
      });

      setShowCreateModal(false);
      setAmount("");
      setRecipientName("");
      setRecipientAccount("");
      setBankName("");
      setReference("");
      setDescription("");
      queryClient.invalidateQueries({ queryKey: ["admin-transfers"] });
    } catch (err: any) {
      showToast({
        type: "error",
        title: "Operation Failed",
        description: err.message || "Failed to process transfer instruction.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const columns: Column<any>[] = [
    {
      header: "Reference",
      accessorKey: "reference",
      cell: (row) => <span className="font-mono text-xs text-white">{row.reference || row.id.slice(0, 8)}</span>,
    },
    {
      header: "Beneficiary & Bank",
      accessorKey: "recipient_name",
      cell: (row) => (
        <div>
          <p className="font-semibold text-white">{row.recipient_name}</p>
          <p className="text-[11px] text-slate-400">{row.bank_name} • {row.recipient_account}</p>
        </div>
      ),
    },
    {
      header: "Transfer Type",
      accessorKey: "type",
      cell: (row) => <span className="text-xs uppercase font-bold text-amber-400">{row.type}</span>,
    },
    {
      header: "Amount",
      accessorKey: "amount",
      sortable: true,
      cell: (row) => <span className="font-bold text-white">{formatCurrency(row.amount)}</span>,
    },
    {
      header: "Status",
      accessorKey: "status",
      cell: (row) => <StatusBadge status={row.status} />,
    },
    {
      header: "Timestamp",
      accessorKey: "created_at",
      sortable: true,
      cell: (row) => <span className="text-xs text-slate-400">{formatDate(row.created_at)}</span>,
    },
    {
      header: "Admin Action",
      accessorKey: "id",
      cell: (row) => (
        <div className="flex items-center gap-2">
          {row.status !== "completed" && (
            <Button
              size="sm"
              variant="outline"
              onClick={() => updateStatusMutation.mutate({ id: row.id, status: "completed", senderId: row.sender_id, amount: row.amount })}
              className="h-7 text-[11px] bg-emerald-500/10 border-emerald-500/30 text-emerald-400 hover:bg-emerald-500 hover:text-slate-950 gap-1 px-2"
            >
              <CheckCircle2 className="w-3.5 h-3.5" /> Approve
            </Button>
          )}
          {row.status !== "failed" && (
            <Button
              size="sm"
              variant="outline"
              onClick={() => updateStatusMutation.mutate({ id: row.id, status: "failed" })}
              className="h-7 text-[11px] bg-rose-500/10 border-rose-500/30 text-rose-400 hover:bg-rose-500 hover:text-slate-950 gap-1 px-2"
            >
              <XCircle className="w-3.5 h-3.5" /> Reject
            </Button>
          )}
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-white">Wire &amp; Transfer Management</h1>
          <p className="text-slate-400 text-xs uppercase tracking-widest mt-1">Real-time domestic, SWIFT, and internal transfer control panel</p>
        </div>
        <Button
          onClick={() => setShowCreateModal(true)}
          className="bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold gap-2"
        >
          <Plus className="w-4 h-4" /> Process Inward / Outward Transfer
        </Button>
      </div>

      <GlassCard className="p-6 border-white/5">
        <DataTable
          data={transfersQuery.data || []}
          columns={columns}
          searchPlaceholder="Search by beneficiary or bank..."
          searchField="recipient_name"
          emptyTitle="No Transfers Recorded"
          emptyDescription="Platform transfers will appear here in real time."
        />
      </GlassCard>

      {/* Admin Transfer Process Modal */}
      <Modal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        title="Admin Transfer Initiation &amp; Settlement"
        description="Process instant inward credits or outward debits directly to a client account."
        maxWidth="lg"
      >
        <form onSubmit={handleCreateAdminTransfer} className="space-y-4">
          {/* Transfer Type Switch */}
          <div className="grid grid-cols-2 gap-2 p-1 bg-[#080F1A] rounded-xl border border-[#17293F]">
            <button
              type="button"
              onClick={() => setTransferType("inward")}
              className={`py-2 px-3 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-2 ${
                transferType === "inward"
                  ? "bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              <ArrowDownLeft className="w-4 h-4" />
              <span>Inward Credit (Deposit)</span>
            </button>
            <button
              type="button"
              onClick={() => setTransferType("outward")}
              className={`py-2 px-3 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-2 ${
                transferType === "outward"
                  ? "bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              <ArrowUpRight className="w-4 h-4" />
              <span>Outward Debit (Wire Transfer)</span>
            </button>
          </div>

          {/* Client Selection */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wide text-slate-400 mb-1.5">
              Select Client / Account *
            </label>
            <select
              value={selectedUser}
              onChange={(e) => setSelectedUser(e.target.value)}
              required
              className="w-full h-10 px-3 bg-[#080F1A] border border-[#17293F] rounded-xl text-sm text-white focus:outline-none focus:ring-1 focus:ring-amber-500"
            >
              <option value="">-- Choose Client --</option>
              {(usersQuery.data || []).map((u) => (
                <option key={u.id} value={u.id}>
                  {u.full_name || "Unnamed"} ({u.email})
                </option>
              ))}
            </select>
          </div>

          {/* Amount & Reference */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wide text-slate-400 mb-1.5">
                Amount ($ USD) *
              </label>
              <Input
                type="number"
                step="0.01"
                min="1"
                placeholder="10000.00"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                required
              />
            </div>
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wide text-slate-400 mb-1.5">
                Transfer Reference / ID
              </label>
              <Input
                placeholder="e.g. SETTLE-2026-99"
                value={reference}
                onChange={(e) => setReference(e.target.value)}
              />
            </div>
          </div>

          {/* Beneficiary Details */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wide text-slate-400 mb-1.5">
                Sender / Recipient Name
              </label>
              <Input
                placeholder="e.g. JPMorgan Chase Treasury"
                value={recipientName}
                onChange={(e) => setRecipientName(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wide text-slate-400 mb-1.5">
                Account Number / IBAN
              </label>
              <Input
                placeholder="e.g. US88CHAS12345678"
                value={recipientAccount}
                onChange={(e) => setRecipientAccount(e.target.value)}
              />
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wide text-slate-400 mb-1.5">
              Settlement Description / Memo
            </label>
            <Input
              placeholder="e.g. Inward Commercial Settlement Wire"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          <div className="flex gap-3 pt-3 border-t border-[#17293F]">
            <Button
              type="button"
              variant="outline"
              className="flex-1 bg-[#080F1A] border-[#17293F] text-slate-300"
              onClick={() => setShowCreateModal(false)}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting || !selectedUser || !amount}
              className="flex-1 bg-amber-500 text-slate-950 font-bold hover:bg-amber-600"
            >
              {isSubmitting ? "Executing Transfer..." : "Execute & Reflect on Dashboard"}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
