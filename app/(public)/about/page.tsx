"use client";

import { GlassCard } from "@/components/shared/glass-card";
import { Button } from "@/components/ui/button";
import { 
  ShieldCheck, 
  Eye, 
  Zap, 
  Building2, 
  ArrowUpRight, 
  CheckCircle2, 
  FileText,
  Lock,
  Globe,
  Briefcase
} from "lucide-react";
import { AnimateIn } from "@/components/ui/AnimateIn";
import Link from "next/link";

const TEAM = [
  {
    name: "Alexandra Chen",
    role: "Chief Executive Officer",
    bio: "Former Managing Director of Digital Assets at Goldman Sachs with 20+ years in institutional markets.",
    initials: "AC",
    gradient: "from-blue-600 to-indigo-700 border-blue-500/30"
  },
  {
    name: "Marcus Okonkwo",
    role: "Chief Technology Officer",
    bio: "Former Lead Security Engineer at Fireblocks. Architect of multi-party computation protocol standards.",
    initials: "MO",
    gradient: "from-emerald-600 to-teal-700 border-emerald-500/30"
  },
  {
    name: "James Harrington",
    role: "Chief Revenue Officer",
    bio: "Ex-JPMorgan Executive Director of Institutional Sales. Head of prime brokerage expansion.",
    initials: "JH",
    gradient: "from-purple-600 to-pink-700 border-purple-500/30"
  },
  {
    name: "Sophie Laurent",
    role: "Head of Compliance",
    bio: "Former Senior Regulator at the Financial Conduct Authority (FCA), specializing in digital asset policy.",
    initials: "SL",
    gradient: "from-amber-500 to-orange-600 border-amber-400/30"
  },
  {
    name: "David Park",
    role: "Head of Custody Solutions",
    bio: "Ex-BitGo Principal Security Architect. Pioneer in HSM integrations and cold storage segmentation.",
    initials: "DP",
    gradient: "from-rose-600 to-red-700 border-rose-500/30"
  },
  {
    name: "Priya Mehta",
    role: "Chief Financial Officer",
    bio: "Former Director of Quantitative Finance at Citadel Securities, managing capital allocation strategies.",
    initials: "PM",
    gradient: "from-cyan-500 to-blue-600 border-cyan-400/30"
  }
];

const VALUES = [
  {
    title: "Uncompromising Security",
    description: "We employ MPC cryptography, cold storage segmentation, and zero-trust architectures to ensure assets are mathematically secure and operationally isolated.",
    icon: ShieldCheck,
    color: "text-blue-500",
    bg: "bg-blue-500/10"
  },
  {
    title: "Radical Transparency",
    description: "Every order routing, execution metric, and asset storage address is fully auditable. Real-time proof of reserves ensures institutional trust at all times.",
    icon: Eye,
    color: "text-amber-500",
    bg: "bg-amber-500/10"
  },
  {
    title: "Hyper-Performance",
    description: "Our proprietary execution engines and dedicated network configurations deliver microsecond latency, enabling high-frequency algos to perform flawlessly.",
    icon: Zap,
    color: "text-emerald-500",
    bg: "bg-emerald-500/10"
  }
];

const COMPLIANCE_CARDS = [
  {
    title: "FCA Registration",
    description: "Registered cryptoasset business conforming to strict anti-money laundering regulations.",
    icon: CheckCircle2,
    badge: "Active"
  },
  {
    title: "SOC 2 Type II",
    description: "Independent audit validating our security, availability, and processing integrity controls.",
    icon: Lock,
    badge: "Certified"
  },
  {
    title: "ISO 27001",
    description: "Global standard for managing information security risks and protecting institutional data.",
    icon: FileText,
    badge: "Certified"
  },
  {
    title: "GDPR Compliant",
    description: "Strict adherence to privacy standards governing data protection across all jurisdictions.",
    icon: Globe,
    badge: "Compliant"
  }
];

export default function AboutPage() {
  return (
    <div className="min-h-screen pt-32 pb-24 bg-background text-foreground">
      <main className="max-w-7xl mx-auto px-4 space-y-32">
        
        {/* Hero & Founding Story */}
        <section className="relative">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/20 rounded-full blur-[120px] -z-10 pointer-events-none" />
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
            <div className="lg:col-span-6 space-y-6">
              <AnimateIn direction="up">
                <div className="inline-flex items-center gap-2 bg-card/5 border border-border/30 rounded-full px-4 py-2 text-sm font-medium mb-4">
                  <Building2 className="w-4 h-4 text-gold" />
                  <span>Founded 2020</span>
                </div>
                <h1 className="text-4xl md:text-6xl font-bold tracking-tight leading-tight font-serif text-foreground">
                  Built by Finance Veterans, <br />
                  <span className="text-gradient">Engineered for Institutions</span>
                </h1>
              </AnimateIn>
            </div>
            
            <div className="lg:col-span-6 space-y-6 text-muted-foreground text-lg leading-relaxed pt-2">
              <AnimateIn direction="up" delay={100}>
                <p>
                  Ironbridgemarket Institutional was founded in 2020 by a group of veteran financial systems engineers and quantitative traders who saw a critical gap in the market. While digital assets promised to revolutionize global capital markets, the underlying infrastructure lacked the safety, predictability, and compliance required by institutional allocators.
                </p>
              </AnimateIn>
              <AnimateIn direction="up" delay={200}>
                <p>
                  We set out to build a bridge between traditional high finance and decentralized technologies. Over the past four years, our team has engineered a zero-trust custodial framework and a microsecond-latency execution engine designed specifically to meet the rigorous compliance standards of sovereign wealth funds, asset managers, and Tier-1 banks.
                </p>
              </AnimateIn>
              <AnimateIn direction="up" delay={300}>
                <p>
                  Today, Ironbridgemarket is a leading digital capital operating system, securing billions of dollars in transaction volume. Our platform enables institutions to access deep aggregated liquidity, manage multi-party approval custody workflows, and execute trading strategies with absolute operational certainty.
                </p>
              </AnimateIn>
            </div>
          </div>
        </section>

        {/* Mission & Values */}
        <section className="space-y-12">
          <div className="text-center max-w-2xl mx-auto space-y-4">
            <AnimateIn direction="up">
              <h2 className="text-3xl md:text-4xl font-bold font-serif text-foreground">Our Core Pillars</h2>
              <p className="text-muted-foreground">We do not compromise. The integrity of our infrastructure stands on three fundamental operational values.</p>
            </AnimateIn>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {VALUES.map((value, idx) => (
              <AnimateIn key={value.title} delay={idx * 100} className="h-full">
                <GlassCard className="p-8 h-full space-y-6 border-border/20 bg-card/[0.01] hover:bg-card/5 transition-all duration-300 hover:scale-[1.02]">
                  <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${value.bg}`}>
                    <value.icon className={`w-7 h-7 ${value.color}`} />
                  </div>
                  <h3 className="text-2xl font-bold text-foreground">{value.title}</h3>
                  <p className="text-muted-foreground leading-relaxed text-sm">
                    {value.description}
                  </p>
                </GlassCard>
              </AnimateIn>
            ))}
          </div>
        </section>

        {/* Leadership Team */}
        <section className="space-y-12">
          <div className="text-center max-w-2xl mx-auto space-y-4">
            <AnimateIn direction="up">
              <h2 className="text-3xl md:text-4xl font-bold font-serif text-foreground">Leadership Team</h2>
              <p className="text-muted-foreground">Our executives bring decades of experience from Tier-1 financial institutions and digital asset innovators.</p>
            </AnimateIn>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {TEAM.map((member, idx) => (
              <AnimateIn key={member.name} delay={idx * 100} className="h-full">
                <GlassCard className="p-6 h-full flex flex-col justify-between border-border/20 bg-card/[0.01] hover:bg-card/5 transition-all duration-300">
                  <div className="space-y-6">
                    <div className="flex items-center gap-4">
                      <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${member.gradient} flex items-center justify-center text-xl font-bold text-white shadow-lg border border-white/10 shrink-0`}>
                        {member.initials}
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-foreground">{member.name}</h3>
                        <p className="text-xs text-gold font-semibold">{member.role}</p>
                      </div>
                    </div>
                    
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {member.bio}
                    </p>
                  </div>

                  <div className="pt-6 mt-6 border-t border-border/25 flex justify-end">
                    <a 
                      href="https://linkedin.com" 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="text-muted-foreground hover:text-foreground transition-colors"
                      title={`${member.name} on LinkedIn`}
                    >
                      <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                        <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.779-1.75-1.75s.784-1.75 1.75-1.75 1.75.779 1.75 1.75-.784 1.75-1.75 1.75zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
                      </svg>
                    </a>
                  </div>
                </GlassCard>
              </AnimateIn>
            ))}
          </div>
        </section>

        {/* Regulatory & Compliance Section */}
        <section className="space-y-12">
          <div className="text-center max-w-2xl mx-auto space-y-4">
            <AnimateIn direction="up">
              <h2 className="text-3xl md:text-4xl font-bold font-serif text-foreground">Our Regulatory Standing</h2>
              <p className="text-muted-foreground">Strict adherence to regulatory standards across major global jurisdictions.</p>
            </AnimateIn>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {COMPLIANCE_CARDS.map((card, i) => (
              <AnimateIn key={card.title} direction="up" delay={i * 100}>
                <GlassCard className="p-6 h-full flex flex-col justify-between border-border/20 bg-card/[0.01]">
                  <div className="space-y-4">
                    <div className="p-3 bg-card/5 w-fit rounded-xl">
                      <card.icon className="w-5 h-5 text-gold" />
                    </div>
                    <div>
                      <h3 className="font-bold text-foreground text-base">{card.title}</h3>
                      <p className="text-xs text-muted-foreground mt-1.5 leading-relaxed">{card.description}</p>
                    </div>
                  </div>
                  <div className="mt-4 pt-4 border-t border-border/20">
                    <span className="text-[10px] uppercase font-bold tracking-wider text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-full border border-emerald-500/20">
                      {card.badge}
                    </span>
                  </div>
                </GlassCard>
              </AnimateIn>
            ))}
          </div>

          <AnimateIn direction="up" delay={400}>
            <div className="bg-card/[0.02] border border-border/20 p-6 rounded-2xl max-w-3xl mx-auto text-center">
              <p className="text-sm text-muted-foreground leading-relaxed">
                Ironbridgemarket Institutional Ltd is authorised and regulated by the Financial Conduct Authority (FCA), reference number XXXXXXX.
              </p>
            </div>
          </AnimateIn>
        </section>

        {/* Press / Media */}
        <section className="space-y-12">
          <div className="text-center max-w-2xl mx-auto">
            <AnimateIn direction="up">
              <h2 className="text-2xl font-bold font-serif text-foreground mb-2">As Featured In</h2>
              <p className="text-sm text-muted-foreground">Major financial publication coverage and industry insights.</p>
            </AnimateIn>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-5xl mx-auto items-center">
            {[
              { name: "Financial Times", code: "FT" },
              { name: "Bloomberg", code: "BBG" },
              { name: "CoinDesk", code: "COINDESK" },
              { name: "The Block", code: "THE BLOCK" }
            ].map((media, i) => (
              <AnimateIn key={media.name} direction="up" delay={i * 100}>
                <div className="h-16 flex items-center justify-center border border-border/20 bg-card/[0.01] rounded-2xl text-muted-foreground font-bold hover:text-foreground hover:border-foreground/20 transition-colors uppercase tracking-wider text-sm select-none">
                  {media.name}
                </div>
              </AnimateIn>
            ))}
          </div>
        </section>

        {/* Join Us CTA */}
        <AnimateIn direction="up">
          <section className="relative rounded-[2.5rem] overflow-hidden border border-border/25 bg-gradient-to-r from-primary/10 via-background to-emerald-500/5 p-12 md:p-20 text-center space-y-8">
            <div className="absolute top-0 right-0 w-64 h-64 bg-gold/5 blur-3xl rounded-full -z-10" />
            <div className="max-w-2xl mx-auto space-y-6">
              <Briefcase className="w-12 h-12 text-gold mx-auto mb-2" />
              <h2 className="text-3xl md:text-5xl font-bold font-serif text-foreground">Join Our Team</h2>
              <p className="text-muted-foreground text-lg leading-relaxed">
                We are constantly looking for exceptional software engineers, security architects, and quantitative analysts to help build the future of decentralized capital infrastructure.
              </p>
              <div className="pt-4">
                <Link href="/careers">
                  <Button variant="premium" size="lg" className="gap-2">
                    Explore Open Roles <ArrowUpRight className="w-5 h-5" />
                  </Button>
                </Link>
              </div>
            </div>
          </section>
        </AnimateIn>

      </main>
    </div>
  );
}
