import { TransactionHistory } from "@/features/dashboard/components/transaction-history";
import { AnalyticsWidgets } from "@/features/dashboard/components/analytics-widgets";
import { Button } from "@/components/ui/button";
import { Search, Filter, Download, ArrowUpRight } from "lucide-react";

export default function TransactionsPage() {
  return (
    <div className="space-y-8 pb-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Transactions & Analytics</h1>
          <p className="text-muted-foreground">Comprehensive oversight of your institutional capital flows.</p>
        </div>
        <div className="flex gap-3">
          <Button variant="glass" size="sm" className="gap-2">
            <Download className="w-4 h-4" /> Export All
          </Button>
          <Button variant="premium" size="sm" className="gap-2">
            New Transaction <ArrowUpRight className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Analytics Section */}
      <section className="space-y-4">
        <h2 className="text-xl font-bold px-2">Portfolio Insights</h2>
        <AnalyticsWidgets />
      </section>

      {/* Transactions Section */}
      <section className="space-y-4">
        <div className="flex justify-between items-center px-2">
          <h2 className="text-xl font-bold">Audit Log</h2>
          <div className="flex gap-2">
            <div className="relative hidden md:block">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input 
                type="text" 
                placeholder="Search by ID or Hash..." 
                className="bg-white/5 border border-white/10 rounded-xl py-1.5 pl-10 pr-4 text-sm focus:outline-none"
              />
            </div>
            <Button variant="glass" size="sm">
              <Filter className="w-4 h-4 mr-2" /> Filter
            </Button>
          </div>
        </div>
        <TransactionHistory />
      </section>
    </div>
  );
}
