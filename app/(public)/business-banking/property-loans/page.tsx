import Link from "next/link";
import { ArrowRight, Home } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function BusinessPropertyLoansPage() {
  return (
    <div className="bg-slate-950 text-white min-h-screen py-20">
      <div className="max-w-5xl mx-auto px-4 space-y-16">
        <div className="space-y-4 text-center">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-semibold">
            <Home className="w-4 h-4" /> Commercial Real Estate
          </div>
          <h1 className="text-4xl md:text-6xl font-serif font-bold">Commercial Property Loans</h1>
          <p className="text-slate-400 text-lg max-w-2xl mx-auto">
            Financing for commercial office buildings, industrial logistics parks, retail real estate, and residential property development projects.
          </p>
          <div className="pt-4">
            <Link href="/contact">
              <Button size="lg" className="bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold gap-2">
                Submit Property Application <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
