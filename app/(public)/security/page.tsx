"use client";

import { GlassCard } from "@/components/shared/glass-card";
import { Button } from "@/components/ui/button";
import { 
  ShieldAlert, 
  Key, 
  Lock, 
  Cpu, 
  Eye, 
  CheckCircle2, 
  Activity, 
  Database,
  ArrowRight,
  ShieldCheck,
  UserCheck,
  Zap,
  Globe
} from "lucide-react";
import { FadeIn } from "@/components/animations/fade-in";
import { StaggerContainer, staggerItem } from "@/components/animations/stagger-container";
import { motion } from "framer-motion";
import Link from "next/link";

const TECH_PILLARS = [
  {
    title: "Multi-Party Computation (MPC)",
    description: "Private keys are fragmented into cryptographic shares distributed across secure, isolated nodes. No single key share is ever assembled in one place, eliminating single points of failure.",
    icon: Key,
    color: "text-blue-500",
    bg: "bg-blue-500/10"
  },
  {
    title: "FIPS 140-2 Level 3 HSMs",
    description: "Transaction signing is executed within hardware security modules certified to the highest standards. Key material remains physically protected from logical and side-channel attacks.",
    icon: Cpu,
    color: "text-purple-500",
    bg: "bg-purple-500/10"
  },
  {
    title: "Air-Gapped Cold Storage",
    description: "For long-term treasury custody, we maintain multi-signature offline vaulting systems secured by physical geo-distributed access controls and biometric verification protocols.",
    icon: Lock,
    color: "text-rose-500",
    bg: "bg-rose-500/10"
  },
  {
    title: "Zero-Trust Network Architecture",
    description: "Continuous micro-segmentation and identity verification of all services. Every API request, internal communication, and database query is authenticated, authorized, and logged.",
    icon: Database,
    color: "text-emerald-500",
    bg: "bg-emerald-500/10"
  }
];

const POLICIES = [
  {
    title: "Multi-Signature Approvals",
    description: "Configure role-based sign-off thresholds for corporate actions. Require M-of-N executive approvals before any asset movement takes place.",
    icon: UserCheck
  },
  {
    title: "Destination Whitelisting",
    description: "Restrict asset transfers exclusively to pre-approved addresses. Changes to the whitelist are subject to mandatory multi-signature cooling-off periods.",
    icon: CheckCircle2
  },
  {
    title: "Dynamic Time-Locks",
    description: "Apply customized time delay policies on large withdrawals or administrative changes. Stop fraudulent or unauthorized actions before they execute.",
    icon: Activity
  }
];

const COMPLIANCE_ITEMS = [
  { title: "SOC 2 Type II Certified", desc: "Rigorous independent audit verifying system security, availability, and confidentiality.", badge: "Certified" },
  { title: "ISO 27001 Standards", desc: "Highest international benchmark for robust information security management systems.", badge: "Compliant" },
  { title: "GDPR Compliant", desc: "Strict adherence to European privacy guidelines to protect all customer and transaction data.", badge: "Protected" },
  { title: "FCA Compliance Framework", desc: "Aligned with regulatory capital requirements and operational integrity parameters.", badge: "Aligned" }
];

export default function SecurityPage() {
  return (
    <div className="min-h-screen pt-32 pb-24 bg-[#0A1628] text-white">
      <main className="max-w-7xl mx-auto px-4 space-y-32">
        
        {/* Hero Section */}
        <section className="relative text-center max-w-4xl mx-auto space-y-8">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/20 rounded-full blur-[120px] -z-10 pointer-events-none" />
          
          <FadeIn direction="up">
            <div className="inline-flex items-center gap-2 bg-[#D4AF37]/10 border border-[#D4AF37]/30 rounded-full px-4 py-2 text-sm font-medium text-[#D4AF37] mb-4">
              <ShieldCheck className="w-4 h-4" />
              <span>Institutional-Grade Custody & Protection</span>
            </div>
            <h1 className="text-5xl md:text-7xl font-bold tracking-tight leading-tight font-serif text-white">
              Securing the Future of <span className="text-gradient">Digital Capital</span>
            </h1>
          </FadeIn>
          
          <FadeIn direction="up" delay={0.1}>
            <p className="text-xl text-gray-300 leading-relaxed max-w-3xl mx-auto">
              Pavex utilizes next-generation multi-party computation (MPC), physical hardware security modules (HSMs), and strict zero-trust parameters to safeguard digital assets at scale.
            </p>
          </FadeIn>
          
          <FadeIn direction="up" delay={0.2} className="pt-4 flex justify-center gap-4">
            <Link href="/signup">
              <Button variant="premium" size="lg">Talk to a Security Expert</Button>
            </Link>
            <Link href="/about">
              <Button variant="glass" size="lg">Read Compliance Details</Button>
            </Link>
          </FadeIn>
        </section>

        {/* Tech Pillars Section */}
        <section className="space-y-12">
          <div className="text-center max-w-2xl mx-auto space-y-4">
            <FadeIn direction="up">
              <h2 className="text-3xl md:text-4xl font-bold font-serif text-white">Security Architecture</h2>
              <p className="text-gray-400">Our deep-tech infrastructure eliminates logical and physical vectors of asset loss.</p>
            </FadeIn>
          </div>
          
          <StaggerContainer className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {TECH_PILLARS.map((pillar) => (
              <motion.div key={pillar.title} variants={staggerItem}>
                <GlassCard className="p-8 h-full space-y-6 border-white/5 bg-white/[0.01] hover:bg-white/5 transition-all duration-300 hover:scale-[1.01]">
                  <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${pillar.bg}`}>
                    <pillar.icon className={`w-7 h-7 ${pillar.color}`} />
                  </div>
                  <h3 className="text-2xl font-bold text-white">{pillar.title}</h3>
                  <p className="text-gray-400 leading-relaxed text-sm">
                    {pillar.description}
                  </p>
                </GlassCard>
              </motion.div>
            ))}
          </StaggerContainer>
        </section>

        {/* Custom Policy Controls Section */}
        <section className="relative rounded-[2.5rem] overflow-hidden border border-white/5 bg-gradient-to-b from-[#0F1F35] to-[#0A1628] p-12 md:p-20 space-y-12">
          <div className="absolute top-0 left-0 w-96 h-96 bg-[#D4AF37]/5 blur-3xl rounded-full -z-10" />
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-5 space-y-6">
              <FadeIn direction="up">
                <h2 className="text-3xl md:text-4xl font-bold font-serif text-white">
                  Advanced Policy & <br />
                  Governance Engines
                </h2>
                <p className="text-gray-400 leading-relaxed text-sm">
                  We empower operations teams with robust administrative dashboard controls. Define customized workflow policies that adapt dynamically to your institution's governance hierarchy.
                </p>
              </FadeIn>
            </div>
            
            <div className="lg:col-span-7 space-y-6">
              <StaggerContainer className="space-y-4">
                {POLICIES.map((policy) => (
                  <motion.div key={policy.title} variants={staggerItem}>
                    <GlassCard className="p-6 flex gap-4 items-start border-white/5 bg-white/[0.01]">
                      <div className="p-3 bg-white/5 rounded-xl text-[#D4AF37] shrink-0">
                        <policy.icon className="w-5 h-5" />
                      </div>
                      <div>
                        <h4 className="font-bold text-white text-base">{policy.title}</h4>
                        <p className="text-xs text-gray-400 mt-1 leading-relaxed">{policy.description}</p>
                      </div>
                    </GlassCard>
                  </motion.div>
                ))}
              </StaggerContainer>
            </div>
          </div>
        </section>

        {/* Regulatory & Certifications */}
        <section className="space-y-12">
          <div className="text-center max-w-2xl mx-auto space-y-4">
            <FadeIn direction="up">
              <h2 className="text-3xl md:text-4xl font-bold font-serif text-white">Compliance & Governance</h2>
              <p className="text-gray-400">Regular audits and operational standards aligned with industry frameworks.</p>
            </FadeIn>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {COMPLIANCE_ITEMS.map((item, i) => (
              <FadeIn key={item.title} direction="up" delay={i * 0.1}>
                <GlassCard className="p-6 h-full flex flex-col justify-between border-white/5 bg-white/[0.01]">
                  <div className="space-y-4">
                    <div className="p-2 bg-emerald-500/10 text-emerald-400 w-fit rounded-lg">
                      <ShieldCheck className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="font-bold text-white text-base">{item.title}</h3>
                      <p className="text-xs text-gray-400 mt-1.5 leading-relaxed">{item.desc}</p>
                    </div>
                  </div>
                  <div className="mt-4 pt-4 border-t border-white/5">
                    <span className="text-[10px] uppercase font-bold tracking-wider text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-full border border-emerald-500/20">
                      {item.badge}
                    </span>
                  </div>
                </GlassCard>
              </FadeIn>
            ))}
          </div>
        </section>

        {/* FAQs */}
        <section className="space-y-12">
          <div className="text-center max-w-2xl mx-auto space-y-4">
            <FadeIn direction="up">
              <h2 className="text-3xl md:text-4xl font-bold font-serif text-white">Frequently Asked Questions</h2>
              <p className="text-gray-400">Common questions from institutional compliance officers and treasury managers.</p>
            </FadeIn>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <FadeIn direction="up">
              <GlassCard className="p-6 space-y-3 border-white/5 bg-white/[0.01]">
                <h4 className="font-bold text-white">How does MPC replace traditional private keys?</h4>
                <p className="text-sm text-gray-400 leading-relaxed">
                  MPC splits the cryptographic private key into separate "key shares" generated by independent nodes. In normal operation, these shares compute signatures collaboratively without ever bringing the complete private key onto a single computer. Even if a node is compromised, the security of the overall asset is maintained.
                </p>
              </GlassCard>
            </FadeIn>
            
            <FadeIn direction="up" delay={0.1}>
              <GlassCard className="p-6 space-y-3 border-white/5 bg-white/[0.01]">
                <h4 className="font-bold text-white">Where are the hardware security modules located?</h4>
                <p className="text-sm text-gray-400 leading-relaxed">
                  Our FIPS 140-2 Level 3 certified HSMs are hosted in enterprise-grade Tier-IV data centers located in globally secure, politically stable jurisdictions. The data centers feature armed security personnel, biometric access verification, and 24/7 monitoring.
                </p>
              </GlassCard>
            </FadeIn>

            <FadeIn direction="up" delay={0.2}>
              <GlassCard className="p-6 space-y-3 border-white/5 bg-white/[0.01]">
                <h4 className="font-bold text-white">How does the transfer whitelisting protect us?</h4>
                <p className="text-sm text-gray-400 leading-relaxed">
                  Any outbound transaction is mathematically blocked unless the destination address is part of your whitelisted database. Changes to the whitelisted addresses require a multi-signature approval path and are subjected to cooling-off periods to mitigate compromised administration attacks.
                </p>
              </GlassCard>
            </FadeIn>

            <FadeIn direction="up" delay={0.3}>
              <GlassCard className="p-6 space-y-3 border-white/5 bg-white/[0.01]">
                <h4 className="font-bold text-white">What redundancy measures are in place?</h4>
                <p className="text-sm text-gray-400 leading-relaxed">
                  We use an active-active deployment schema distributed geographically. Even if multiple key share nodes experience infrastructure failure or denial of service, backup key shares can be dynamically engaged to sign transactions without data corruption or lockouts.
                </p>
              </GlassCard>
            </FadeIn>
          </div>
        </section>

        {/* CTA */}
        <FadeIn direction="up">
          <section className="relative rounded-[2.5rem] overflow-hidden border border-white/5 bg-gradient-to-r from-primary/10 via-[#0A1628] to-[#D4AF37]/5 p-12 md:p-20 text-center space-y-8">
            <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 blur-3xl rounded-full -z-10" />
            <div className="max-w-2xl mx-auto space-y-6">
              <ShieldAlert className="w-12 h-12 text-[#D4AF37] mx-auto mb-2" />
              <h2 className="text-3xl md:text-5xl font-bold font-serif text-white">Verify Our Integrity</h2>
              <p className="text-gray-400 text-lg leading-relaxed">
                Contact our compliance and security engineering desk to request our SOC 2 Type II audit report, ISO certifications, and detailed architecture whitepapers.
              </p>
              <div className="pt-4 flex justify-center gap-4">
                <Link href="/signup">
                  <Button variant="premium" size="lg" className="gap-2">
                    Request Security Review <ArrowRight className="w-5 h-5" />
                  </Button>
                </Link>
              </div>
            </div>
          </section>
        </FadeIn>

      </main>
    </div>
  );
}
