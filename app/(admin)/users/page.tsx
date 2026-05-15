import { UserTable } from "@/features/admin/components/user-table";
import { Button } from "@/components/ui/button";
import { UserPlus, Search, Filter, Download } from "lucide-react";

export default function AdminUsersPage() {
  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">User Management</h1>
          <p className="text-muted-foreground">Oversee institutional accounts, manage tiers, and monitor risk profiles.</p>
        </div>
        <div className="flex gap-3">
          <Button variant="ghost" size="sm" className="gap-2">
            <Download className="w-4 h-4" /> Export Directory
          </Button>
          <Button variant="premium" size="sm" className="gap-2">
            <UserPlus className="w-4 h-4" /> Invite Institution
          </Button>
        </div>
      </div>

      {/* Stats Summary */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/5 space-y-2">
          <div className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Total Institutions</div>
          <div className="text-3xl font-bold">1,245</div>
        </div>
        <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/5 space-y-2">
          <div className="text-[10px] font-bold text-emerald-500 uppercase tracking-widest">Verified Accounts</div>
          <div className="text-3xl font-bold">98.2%</div>
        </div>
        <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/5 space-y-2">
          <div className="text-[10px] font-bold text-rose-500 uppercase tracking-widest">High Risk Flagged</div>
          <div className="text-3xl font-bold">12</div>
        </div>
        <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/5 space-y-2">
          <div className="text-[10px] font-bold text-primary uppercase tracking-widest">Enterprise Tier</div>
          <div className="text-3xl font-bold">42</div>
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex justify-between items-center px-2">
          <h2 className="text-xl font-bold text-muted-foreground">Account Directory</h2>
          <div className="flex gap-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input 
                type="text" 
                placeholder="Search users..." 
                className="bg-white/5 border border-white/10 rounded-xl py-1.5 pl-10 pr-4 text-sm focus:outline-none focus:ring-1 focus:ring-primary/50"
              />
            </div>
            <Button variant="ghost" size="sm" className="border border-white/5">
              <Filter className="w-4 h-4 mr-2" /> Filter
            </Button>
          </div>
        </div>
        <UserTable />
      </div>
    </div>
  );
}
