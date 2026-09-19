"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { createClient } from "@/lib/supabase/client";
import { GlassCard } from "@/components/shared/glass-card";
import { DataTable, Column } from "@/components/ui/data-table";
import { ShieldCheck, UserCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/toast";

export default function AdminRolesPage() {
  const supabase = createClient();
  const queryClient = useQueryClient();
  const { showToast } = useToast();

  const usersQuery = useQuery({
    queryKey: ["admin-roles-users"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("profiles")
        .select("id, email, full_name, role, tier, created_at")
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data || [];
    },
  });

  const updateRole = useMutation({
    mutationFn: async ({ userId, role }: { userId: string; role: string }) => {
      const { data, error } = await supabase
        .from("profiles")
        .update({ role })
        .eq("id", userId)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-roles-users"] });
      showToast({ type: "success", title: "Role Updated", description: "User permission level modified." });
    },
  });

  const columns: Column<any>[] = [
    {
      header: "User Profile",
      accessorKey: "email",
      cell: (row) => (
        <div>
          <p className="font-semibold text-white">{row.full_name || "Unnamed User"}</p>
          <p className="text-xs text-slate-400 font-mono">{row.email}</p>
        </div>
      ),
    },
    {
      header: "Current Role",
      accessorKey: "role",
      cell: (row) => (
        <span
          className={`text-xs font-bold uppercase px-2.5 py-1 rounded-full border ${
            ["admin", "super_admin", "superuser"].includes(row.role)
              ? "bg-purple-500/10 text-purple-400 border-purple-500/30"
              : "bg-slate-800 text-slate-300 border-slate-700"
          }`}
        >
          {row.role}
        </span>
      ),
    },
    {
      header: "Account Tier",
      accessorKey: "tier",
      cell: (row) => <span className="text-xs text-slate-300 font-semibold">{row.tier}</span>,
    },
    {
      header: "Change Role",
      cell: (row) => (
        <select
          value={row.role}
          onChange={(e) => updateRole.mutate({ userId: row.id, role: e.target.value })}
          className="h-8 px-2 bg-slate-950 border border-slate-800 rounded-lg text-xs text-white focus:outline-none focus:ring-1 focus:ring-amber-500"
        >
          <option value="user">User (Standard Member)</option>
          <option value="admin">Admin (Desk Operator)</option>
          <option value="superuser">Super Admin (Root Authority)</option>
        </select>
      ),
    },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-white">Roles &amp; Access Control</h1>
        <p className="text-slate-400 text-xs uppercase tracking-widest mt-1">Assign admin privileges and manage security permissions</p>
      </div>

      <GlassCard className="p-6 border-white/5">
        <DataTable
          data={usersQuery.data || []}
          columns={columns}
          searchPlaceholder="Search by email or name..."
          searchField="email"
          emptyTitle="No Profiles Found"
        />
      </GlassCard>
    </div>
  );
}
