"use client";

import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { createClient } from "@/lib/supabase/client";
import { GlassCard } from "@/components/shared/glass-card";
import { Settings, Save, ShieldAlert } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/toast";

export default function AdminSystemSettingsPage() {
  const supabase = createClient();
  const queryClient = useQueryClient();
  const { showToast } = useToast();

  const [maxDeposit, setMaxDeposit] = useState("100000");
  const [maxWithdrawal, setMaxWithdrawal] = useState("50000");
  const [maintenance, setMaintenance] = useState("false");
  const [isSaving, setIsSaving] = useState(false);

  const settingsQuery = useQuery({
    queryKey: ["admin-system-settings"],
    queryFn: async () => {
      const { data, error } = await supabase.from("platform_settings").select("*");
      if (error) throw error;
      return data || [];
    },
  });

  useEffect(() => {
    if (settingsQuery.data) {
      settingsQuery.data.forEach((s) => {
        if (s.key === "max_deposit_amount") setMaxDeposit(s.value);
        if (s.key === "max_withdrawal_amount") setMaxWithdrawal(s.value);
        if (s.key === "maintenance_mode") setMaintenance(s.value);
      });
    }
  }, [settingsQuery.data]);

  const saveSettings = useMutation({
    mutationFn: async () => {
      await supabase.from("platform_settings").upsert([
        { key: "max_deposit_amount", value: maxDeposit },
        { key: "max_withdrawal_amount", value: maxWithdrawal },
        { key: "maintenance_mode", value: maintenance },
      ]);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-system-settings"] });
      showToast({ type: "success", title: "Settings Saved", description: "Platform operating parameters updated." });
    },
  });

  const handleSave = async () => {
    setIsSaving(true);
    await saveSettings.mutateAsync();
    setIsSaving(false);
  };

  return (
    <div className="space-y-8 max-w-4xl">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-white">System Settings &amp; Limits</h1>
        <p className="text-slate-400 text-xs uppercase tracking-widest mt-1">Configure global deposit caps, withdrawal limits, and maintenance locks</p>
      </div>

      <GlassCard className="p-8 border-white/5 space-y-6">
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold uppercase tracking-wider text-slate-400">Max Single Deposit Limit ($)</label>
              <Input value={maxDeposit} onChange={(e) => setMaxDeposit(e.target.value)} />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold uppercase tracking-wider text-slate-400">Max Single Withdrawal Limit ($)</label>
              <Input value={maxWithdrawal} onChange={(e) => setMaxWithdrawal(e.target.value)} />
            </div>
          </div>

          <div className="space-y-1.5 pt-2">
            <label className="text-xs font-semibold uppercase tracking-wider text-slate-400">Maintenance Mode</label>
            <select
              value={maintenance}
              onChange={(e) => setMaintenance(e.target.value)}
              className="w-full h-10 px-3 bg-slate-950 border border-slate-800 rounded-xl text-sm text-white focus:outline-none focus:ring-1 focus:ring-amber-500"
            >
              <option value="false">Disabled (Normal Operations)</option>
              <option value="true">Enabled (Block Outbound Transactions)</option>
            </select>
          </div>
        </div>

        <div className="pt-4 border-t border-slate-800 flex justify-end">
          <Button onClick={handleSave} disabled={isSaving} className="bg-amber-500 text-slate-950 font-bold hover:bg-amber-600 gap-2">
            <Save className="w-4 h-4" /> Save System Settings
          </Button>
        </div>
      </GlassCard>
    </div>
  );
}
