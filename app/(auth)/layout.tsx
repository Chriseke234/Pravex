import Link from "next/link";
import { Logo } from "@/components/shared/logo";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen grid lg:grid-cols-2 bg-slate-950">
      {/* ─── Visual / Hero Side ─────────────────────────────── */}
      <div className="hidden lg:flex flex-col justify-between p-12 relative overflow-hidden">
        {/* Background Image */}
        <div
          className="absolute inset-0 bg-cover bg-center opacity-20"
          style={{
            backgroundImage:
              "url('https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?q=80&w=2000')",
          }}
        />
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-slate-950 via-slate-950/80 to-slate-900/60" />
        {/* Gold glow top-right */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-amber-500/8 rounded-full blur-3xl" />

        {/* Brand mark */}
        <div className="relative z-10">
          <Logo size="lg" href="/" />
        </div>

        {/* Hero copy */}
        <div className="relative z-10 space-y-6">
          <div className="inline-flex items-center gap-2 bg-amber-500/10 border border-amber-500/20 rounded-full px-3 py-1">
            <div className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
            <span className="text-xs font-semibold text-amber-400 tracking-wide">
              Institutional-Grade Platform
            </span>
          </div>
          <h2 className="text-4xl font-bold text-white leading-tight">
            The future of<br />
            <span className="text-gradient-gold">institutional banking</span>
          </h2>
          <p className="text-slate-400 text-lg max-w-sm leading-relaxed">
            Access premium liquidity, multi-signature custody, and real-time analytics trusted by 2,500+ institutions across 120 countries.
          </p>

          {/* Social proof */}
          <div className="grid grid-cols-3 gap-4 pt-4 border-t border-slate-800/60">
            {[
              { label: "AUM", value: "$4.2B+" },
              { label: "Institutions", value: "2,500+" },
              { label: "Countries", value: "120+" },
            ].map((stat) => (
              <div key={stat.label}>
                <p className="text-xl font-bold text-white">{stat.value}</p>
                <p className="text-xs text-slate-500 mt-0.5">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="relative z-10 text-xs text-slate-600">
          &copy; {new Date().getFullYear()} Iron Bridge Finance. All rights reserved.
        </div>
      </div>

      {/* ─── Form Side ──────────────────────────────────────── */}
      <div className="flex flex-col items-center justify-center p-6 sm:p-10 bg-slate-950">
        {/* Mobile brand */}
        <div className="lg:hidden mb-8">
          <Logo size="md" href="/" />
        </div>

        <div className="w-full max-w-md">{children}</div>
      </div>
    </div>
  );
}
