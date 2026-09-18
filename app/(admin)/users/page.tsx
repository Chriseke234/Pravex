"use client";

import { UserTable } from "@/features/admin/components/user-table";
import { Users } from "lucide-react";

export default function AdminUsersPage() {
  return (
    <div className="p-8 space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight flex items-center gap-2">
            <Users className="w-8 h-8 text-rose-500" /> User Management
          </h1>
          <p className="text-muted-foreground text-sm mt-1">
            Oversee user accounts, directly increase balances, and create or edit transaction history records.
          </p>
        </div>
      </div>

      <UserTable />
    </div>
  );
}
