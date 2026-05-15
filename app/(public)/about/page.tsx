"use client";

import { GlassCard } from "@/components/shared/glass-card";
import { Button } from "@/components/ui/button";
import { ArrowRight, Globe2, ShieldCheck, Zap, Users2, Building2, TrendingUp } from "lucide-react";
import { FadeIn } from "@/components/animations/fade-in";
import { StaggerContainer, staggerItem } from "@/components/animations/stagger-container";
import { motion } from "framer-motion";

const VALUES = [
  {
    title: "Institutional Security First",
    description: "We employ MPC cryptography, cold storage segmentation, and zero-trust architectures to ensure assets are mathematically secure.",
    icon: ShieldCheck,
    color: "text-blue-500",
    bg: "bg-blue-500/10"
  },
  {
    title: "Hyper-Performance Infrastructure",
    description: "Our proprietary execution engines and dedicated fiber networks provide microsecond latency for algorithmic trading desks.",
    icon: Zap,
    color: "text-amber-500",
    bg: "bg-amber-500/10"
  },
  {
    title: "Global Compliance Standards",
    description: "Built to exceed the requirements of Tier-1 regulators across the US, EU, and APAC regions with automated reporting.",
    icon: Globe2,
    color: "text-emerald-500",
    bg: "bg-emerald-500/10"
  }
];

const LEADERSHIP = [
  {
    name: "Alexander Vance",
    role: "Chief Executive Officer",
    image: "https://images.unsplash.com/photo-1560250097-0b93528c311a?q=80&w=400&auto=format&fit=crop",
    background: "Former Head of Digital Assets at Goldman Sachs."
  },
  {
    name: "Dr. Elena Rostova",
    role: "Chief Information Security Officer",
    image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=400&auto=format&fit=crop",
    background: "PhD in Cryptography. Pioneer in MPC wallet architecture."
  },
  {
    name: "Marcus Chen",
    role: "Chief Operating Officer",
    image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=400&auto=format&fit=crop",
    background: "Ex-Director of Trading Operations at Citadel."
  },
  {
    name: "Sarah Jenkins",
    role: "Head of Institutional Sales",
    image: "https://images.unsplash.com/photo-1580489944761-15a19d654956?q=80&w=400&auto=format&fit=crop",
    background: "15 years managing sovereign wealth fund portfolios."
  }
];

export default function AboutPage() {
  return (
    <div className="min-h-screen pt-32 pb-24 overflow-hidden">
      <main className="max-w-7xl mx-auto px-4 space-y-32">
        
        {/* Hero Section */}
        <section className="relative">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/20 rounded-full blur-[120px] -z-10 pointer-events-none" />
          
          <div className="text-center max-w-4xl mx-auto space-y-8">
            <FadeIn direction="up">
              <div className="inline-flex items-center gap-2 bg-white/5 border border-white/10 rounded-full px-4 py-2 text-sm font-medium mb-4">
                <Building2 className="w-4 h-4 text-primary" />
                <span>Founded 2026</span>
              </div>
              <h1 className="text-5xl md:text-7xl font-bold tracking-tight leading-tight">
                Architecting the Future of <span className="text-gradient">Digital Capital</span>
              </h1>
            </FadeIn>
            <FadeIn direction="up" delay={0.1}>
              <p className="text-xl md:text-2xl text-muted-foreground leading-relaxed">
                Pavex bridges the gap between traditional high finance and decentralized infrastructure. We provide the most secure, high-performance operating system for institutional digital assets.
              </p>
            </FadeIn>
            <FadeIn direction="up" delay={0.2} className="pt-4 flex justify-center gap-4">
              <Button variant="premium" size="lg">Join the Mission</Button>
              <Button variant="glass" size="lg">View Open Roles</Button>
            </FadeIn>
          </div>
        </section>

        {/* Global Scale Stats */}
        <FadeIn direction="up">
          <section className="relative">
            <GlassCard className="p-12 border-primary/20 bg-primary/[0.02]">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 divide-y md:divide-y-0 md:divide-x divide-white/10 text-center">
                <div className="space-y-2 pt-8 md:pt-0">
                  <div className="text-4xl font-bold text-white">$120B+</div>
                  <div className="text-sm text-muted-foreground uppercase tracking-widest font-semibold">Assets Under Custody</div>
                </div>
                <div className="space-y-2 pt-8 md:pt-0">
                  <div className="text-4xl font-bold text-white">45+</div>
                  <div className="text-sm text-muted-foreground uppercase tracking-widest font-semibold">Global Institutions</div>
                </div>
                <div className="space-y-2 pt-8 md:pt-0">
                  <div className="text-4xl font-bold text-white">&lt; 1ms</div>
                  <div className="text-sm text-muted-foreground uppercase tracking-widest font-semibold">Trade Execution Latency</div>
                </div>
                <div className="space-y-2 pt-8 md:pt-0">
                  <div className="text-4xl font-bold text-white">100%</div>
                  <div className="text-sm text-muted-foreground uppercase tracking-widest font-semibold">Uptime SLA</div>
                </div>
              </div>
            </GlassCard>
          </section>
        </FadeIn>

        {/* Core Values */}
        <section className="space-y-12">
          <div className="text-center max-w-2xl mx-auto space-y-4">
            <h2 className="text-3xl md:text-4xl font-bold">Our Core Philosophy</h2>
            <p className="text-muted-foreground">We don't compromise on security, performance, or compliance. These are the pillars of the Pavex ecosystem.</p>
          </div>
          
          <StaggerContainer className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {VALUES.map((value) => (
              <motion.div key={value.title} variants={staggerItem}>
                <GlassCard className="p-8 h-full space-y-6 hover:bg-white/5 transition-colors">
                  <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${value.bg}`}>
                    <value.icon className={`w-7 h-7 ${value.color}`} />
                  </div>
                  <h3 className="text-2xl font-bold">{value.title}</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    {value.description}
                  </p>
                </GlassCard>
              </motion.div>
            ))}
          </StaggerContainer>
        </section>

        {/* Leadership Team */}
        <section className="space-y-12">
          <div className="flex justify-between items-end">
            <div className="space-y-2">
              <h2 className="text-3xl md:text-4xl font-bold">Leadership Team</h2>
              <p className="text-muted-foreground">Wall Street experience meets cryptography experts.</p>
            </div>
          </div>
          
          <StaggerContainer className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {LEADERSHIP.map((leader) => (
              <motion.div key={leader.name} variants={staggerItem}>
                <GlassCard className="p-0 overflow-hidden group">
                  <div className="h-64 overflow-hidden relative">
                    <img 
                      src={leader.image} 
                      alt={leader.name} 
                      className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
                  </div>
                  <div className="p-6 relative bg-background/50 backdrop-blur-md border-t border-white/5 -mt-12">
                    <h3 className="text-xl font-bold">{leader.name}</h3>
                    <p className="text-primary text-sm font-semibold mb-4">{leader.role}</p>
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      {leader.background}
                    </p>
                  </div>
                </GlassCard>
              </motion.div>
            ))}
          </StaggerContainer>
        </section>
        
        {/* Office Locations */}
        <FadeIn direction="up">
          <section className="relative rounded-[3rem] overflow-hidden border border-white/10">
            <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1508345228785-f1d1912c0198?q=80&w=2000&auto=format&fit=crop')] bg-cover bg-center opacity-30" />
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
            
            <div className="relative z-10 py-24 px-8 text-center space-y-12">
              <h2 className="text-4xl font-bold">Global Presence</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
                <div className="space-y-2">
                  <div className="text-2xl font-bold text-white">New York</div>
                  <p className="text-muted-foreground">Global Headquarters</p>
                </div>
                <div className="space-y-2">
                  <div className="text-2xl font-bold text-white">London</div>
                  <p className="text-muted-foreground">EMEA Operations</p>
                </div>
                <div className="space-y-2">
                  <div className="text-2xl font-bold text-white">Singapore</div>
                  <p className="text-muted-foreground">APAC Operations</p>
                </div>
              </div>
            </div>
          </section>
        </FadeIn>

      </main>
    </div>
  );
}
