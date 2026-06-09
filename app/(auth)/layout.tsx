import { GlassCard } from "@/components/shared/glass-card"

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen grid lg:grid-cols-2 bg-background">
      {/* Visual Side */}
      <div className="hidden lg:flex flex-col justify-between p-12 bg-primary/5 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1639322537228-f710d846310a?q=80&w=2000')] bg-cover bg-center opacity-10" />
        <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-transparent to-background" />
        
        <div className="relative z-10">
          <div className="flex items-center gap-2 text-2xl font-bold">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center text-white">I</div>
            <span>Ironbridgemarket</span>
          </div>
        </div>

        <div className="relative z-10 space-y-4">
          <h2 className="text-4xl font-bold leading-tight">
            Institutional-grade <br />
            <span className="text-primary">Wealth Management</span>
          </h2>
          <p className="text-muted-foreground text-lg max-w-md">
            Join the elite circle of institutional investors. 
            Access premium liquidity, real-time analytics, and secure custody.
          </p>
        </div>

        <div className="relative z-10 text-sm text-muted-foreground">
          © 2020 Ironbridgemarket Institutional. All rights reserved.
        </div>
      </div>

      {/* Form Side */}
      <div className="flex items-center justify-center p-8">
        <div className="w-full max-w-md space-y-8">
          {children}
        </div>
      </div>
    </div>
  )
}
