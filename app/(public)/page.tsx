"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  ShieldCheck,
  Zap,
  Building2,
  Users,
  CreditCard,
  Landmark,
  Calculator,
  Briefcase,
  Lock,
  CheckCircle2,
  ChevronRight,
  Headset,
} from "lucide-react";
import { AnimateIn } from "@/components/ui/AnimateIn";
import { useIntersectionObserver } from "@/hooks/useIntersectionObserver";
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion";

function AnimatedCounter({ target, suffix = "" }: { target: number; suffix?: string }) {
  const [count, setCount] = useState(0);
  const { ref, isVisible } = useIntersectionObserver();

  useEffect(() => {
    if (isVisible) {
      let startTimestamp: number | null = null;
      const duration = 2000;
      const step = (timestamp: number) => {
        if (!startTimestamp) startTimestamp = timestamp;
        const progress = Math.min((timestamp - startTimestamp) / duration, 1);
        const easeOut = 1 - Math.pow(1 - progress, 4);
        setCount(Math.floor(easeOut * target));
        if (progress < 1) window.requestAnimationFrame(step);
        else setCount(target);
      };
      window.requestAnimationFrame(step);
    }
  }, [isVisible, target]);

  return <span ref={ref}>{count.toLocaleString()}{suffix}</span>;
}

function HeroSection() {
  return (
    <section className="relative pt-24 pb-20 px-4 max-w-7xl mx-auto flex flex-col md:flex-row items-center gap-12 overflow-hidden">
      <div className="flex-1 space-y-8 z-10">
        <AnimateIn delay={100}>
          <h1 className="text-4xl md:text-6xl font-serif font-bold text-slate-900 leading-tight">
            Enterprise Banking for a <span className="text-gradient-gold">Global Future</span>.
          </h1>
        </AnimateIn>

        <AnimateIn delay={200}>
          <p className="text-lg md:text-xl text-slate-600 leading-relaxed max-w-xl">
            Iron Bridge Banking delivers sophisticated personal banking, private wealth management, commercial financing, and competitive credit solutions.
          </p>
        </AnimateIn>

        <AnimateIn delay={300}>
          <div className="flex flex-col sm:flex-row gap-4">
            <Link
              href="/signup"
              className="flex items-center justify-center gap-2 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold py-4 px-8 rounded-xl transition-all duration-200 shadow-md shadow-amber-500/20 hover:scale-[1.02]"
            >
              Open Account <ArrowRight className="w-5 h-5" />
            </Link>
            <Link
              href="/contact"
              className="flex items-center justify-center gap-2 bg-white border border-slate-300 hover:bg-slate-100 text-slate-900 font-bold py-4 px-8 rounded-xl transition-all duration-200 hover:scale-[1.02] shadow-sm"
            >
              Talk to a Manager
            </Link>
          </div>
        </AnimateIn>

        <AnimateIn delay={400}>
          <div className="flex flex-wrap items-center gap-6 pt-4 text-sm text-slate-700 font-medium">
            <div className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-amber-600" /> No hidden fees</div>
            <div className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-amber-600" /> 24/7 Global Transfers</div>
            <div className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-amber-600" /> Dedicated RM for Private Clients</div>
          </div>
        </AnimateIn>
      </div>

      <div className="flex-1 w-full relative z-10">
        <AnimateIn delay={200} className="relative h-[300px] md:h-[500px] w-full rounded-3xl overflow-hidden border border-slate-200 shadow-xl group">
          <Image
            src="https://images.unsplash.com/photo-1563986768609-322da13575f3?w=1000&q=80"
            alt="Iron Bridge Digital Banking Interface"
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-700"
            priority
            sizes="(max-width: 768px) 100vw, 50vw"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/20 to-transparent" />
          <div className="absolute bottom-6 left-6 right-6 p-6 bg-slate-950/85 backdrop-blur-md rounded-2xl border border-slate-800 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-amber-400">Security Standard</span>
              <span className="text-xs text-emerald-400 font-semibold flex items-center gap-1"><Lock className="w-3 h-3" /> Encrypted</span>
            </div>
            <p className="text-sm font-semibold text-white">Multi-Currency Liquidity &amp; Custody Infrastructure</p>
          </div>
        </AnimateIn>
      </div>
    </section>
  );
}

function StatsBar() {
  return (
    <section className="py-16 border-y border-slate-200 bg-slate-100/70">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:divide-x divide-slate-200">
          <AnimateIn className="text-center space-y-2">
            <div className="text-4xl md:text-5xl font-bold text-slate-900">$<AnimatedCounter target={45} suffix="B+" /></div>
            <div className="text-xs text-slate-600 font-bold uppercase tracking-wider">Client Assets Managed</div>
          </AnimateIn>
          <AnimateIn delay={100} className="text-center space-y-2">
            <div className="text-4xl md:text-5xl font-bold text-slate-900"><AnimatedCounter target={180} suffix="k+" /></div>
            <div className="text-xs text-slate-600 font-bold uppercase tracking-wider">Active Personal &amp; Corporate Clients</div>
          </AnimateIn>
          <AnimateIn delay={200} className="text-center space-y-2">
            <div className="text-4xl md:text-5xl font-bold text-slate-900"><AnimatedCounter target={95} suffix="+" /></div>
            <div className="text-xs text-slate-600 font-bold uppercase tracking-wider">Global Countries Served</div>
          </AnimateIn>
          <AnimateIn delay={300} className="text-center space-y-2">
            <div className="text-4xl md:text-5xl font-bold text-slate-900"><AnimatedCounter target={99} suffix=".99%" /></div>
            <div className="text-xs text-slate-600 font-bold uppercase tracking-wider">Platform &amp; Payment Uptime</div>
          </AnimateIn>
        </div>
      </div>
    </section>
  );
}

function PillarsGrid() {
  const pillars = [
    {
      title: "Personal Banking",
      desc: "Checking, high-yield savings, fixed deposits, and daily notice deposit accounts tailored for your everyday financial freedom.",
      icon: Users,
      href: "/personal-banking",
      badge: "Everyday Finance",
      subItems: ["Savings Account", "Current Account", "Fixed Deposit", "Notice Deposit"],
    },
    {
      title: "Private Banking",
      desc: "Exclusive wealth management, credit card services, discretionary portfolios, investor visa funds, and portfolio-secured lending for HNW clients.",
      icon: Landmark,
      href: "/private-banking",
      badge: "Bespoke Wealth",
      subItems: ["Credit Card Services", "Discretionary Portfolios", "Investor Visa", "Portfolio Lending"],
    },
    {
      title: "Business Banking",
      desc: "Corporate business accounts, international trade finance, commercial property loans, and direct lending facilities for growth.",
      icon: Building2,
      href: "/business-banking",
      badge: "Corporate & SME",
      subItems: ["Business Account", "Trade Finance", "Direct Lending", "Corporate Notice Deposit"],
    },
    {
      title: "Loans & Credits",
      desc: "Competitive mortgage loans, property bridging finance, custom terms, and an interactive payment calculator.",
      icon: Calculator,
      href: "/loans-and-credits",
      badge: "Credit Solutions",
      subItems: ["Mortgage Loans", "Property Loans", "Loan Calculator"],
    },
  ];

  return (
    <section className="py-24 px-4 max-w-7xl mx-auto">
      <div className="text-center space-y-4 mb-16">
        <AnimateIn>
          <h2 className="text-3xl md:text-5xl font-serif font-bold text-slate-900">Four Core Banking Pillars</h2>
        </AnimateIn>
        <AnimateIn delay={100}>
          <p className="text-slate-600 max-w-2xl mx-auto text-base md:text-lg">
            Whether you need a daily current account or complex international trade finance, Iron Bridge Banking has a solution engineered for you.
          </p>
        </AnimateIn>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {pillars.map((p, i) => (
          <AnimateIn key={i} delay={i * 100} className="h-full">
            <div className="bg-white border border-slate-200 p-6 rounded-3xl h-full flex flex-col justify-between hover:border-amber-500/40 transition-all duration-300 group hover:-translate-y-1 shadow-sm">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-600 group-hover:bg-amber-500 group-hover:text-slate-950 transition-all">
                    <p.icon className="w-6 h-6" />
                  </div>
                  <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 bg-amber-500/10 text-amber-700 border border-amber-500/20 rounded-full">
                    {p.badge}
                  </span>
                </div>
                <h3 className="text-xl font-bold text-slate-900">{p.title}</h3>
                <p className="text-sm text-slate-600 leading-relaxed">{p.desc}</p>

                <div className="pt-2 border-t border-slate-100 space-y-1.5">
                  {p.subItems.map((item, idx) => (
                    <div key={idx} className="flex items-center gap-2 text-xs text-slate-700 font-medium">
                      <ChevronRight className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-6">
                <Link
                  href={p.href}
                  className="w-full inline-flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-slate-100 border border-slate-200 hover:bg-amber-500 hover:text-slate-950 text-slate-900 font-semibold text-sm transition-all duration-200"
                >
                  Explore Pillar <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </AnimateIn>
        ))}
      </div>
    </section>
  );
}

function WhyChooseUs() {
  const features = [
    { title: "FCA Regulated & Protected", desc: "Your deposits are protected up to £85,000 under the Financial Services Compensation Scheme.", icon: ShieldCheck },
    { title: "Instant International Transfers", desc: "Send money across 95+ countries with competitive FX rates and real-time tracking.", icon: Zap },
    { title: "24/7 Dedicated Support", desc: "Personal relationship managers for private clients and 24/7 live assistance for all members.", icon: Headset },
    { title: "Multi-Currency Accounts", desc: "Hold, manage, and exchange USD, EUR, GBP, CHF, and JPY from a single digital vault.", icon: Landmark },
    { title: "Custom Credit & Loans", desc: "Access mortgages, property bridging, and portfolio-secured lending with flexible terms.", icon: Calculator },
    { title: "256-Bit Bank Grade Encryption", desc: "Continuous biometric authentication, hardware security modules, and automated fraud prevention.", icon: Lock },
  ];

  return (
    <section className="py-24 bg-slate-100/70 border-y border-slate-200">
      <div className="max-w-7xl mx-auto px-4">
        <AnimateIn className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-serif font-bold text-slate-900">Engineered for Absolute Trust</h2>
          <p className="text-slate-600 mt-2 max-w-xl mx-auto">Bank-grade security coupled with modern financial technology.</p>
        </AnimateIn>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((f, i) => (
            <AnimateIn key={i} delay={i * 100} className="h-full">
              <div className="bg-white border border-slate-200 p-8 rounded-3xl h-full shadow-sm hover:border-amber-500/40 transition-all">
                <f.icon className="w-8 h-8 text-amber-600 mb-5" />
                <h3 className="text-lg font-bold text-slate-900 mb-2">{f.title}</h3>
                <p className="text-sm text-slate-600 leading-relaxed">{f.desc}</p>
              </div>
            </AnimateIn>
          ))}
        </div>
      </div>
    </section>
  );
}

function Testimonials() {
  const reviews = [
    {
      name: "Marcus Vance",
      role: "Managing Director, Vance Group",
      quote: "Iron Bridge Banking's Trade Finance team processed our cross-border machinery letter of credit in under 24 hours. Phenomenal efficiency.",
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&q=80",
    },
    {
      name: "Helena Rostova",
      role: "Private Client & Investor Visa Holder",
      quote: "The discretionary portfolio and investor visa guidance were seamlessly integrated. My dedicated RM handles every request with precision.",
      avatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=200&q=80",
    },
    {
      name: "David Chen",
      role: "Founder, Apex Logistics",
      quote: "Switching our business accounts and corporate notice deposits to Iron Bridge increased our yield significantly while keeping funds liquid.",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&q=80",
    },
  ];

  return (
    <section className="py-24 px-4 max-w-7xl mx-auto">
      <AnimateIn className="text-center mb-16">
        <h2 className="text-3xl md:text-5xl font-serif font-bold text-slate-900">Trusted by Personal &amp; Institutional Clients</h2>
      </AnimateIn>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {reviews.map((r, i) => (
          <AnimateIn key={i} delay={i * 150} className="h-full">
            <div className="bg-white border border-slate-200 p-8 rounded-3xl h-full flex flex-col justify-between shadow-sm">
              <div className="space-y-4">
                <div className="text-amber-500 text-sm tracking-widest">★★★★★</div>
                <p className="text-slate-700 italic text-base leading-relaxed">&quot;{r.quote}&quot;</p>
              </div>
              <div className="flex items-center gap-4 pt-6 mt-6 border-t border-slate-100">
                <div className="relative w-12 h-12 rounded-full overflow-hidden shrink-0 border border-amber-500/30">
                  <Image src={r.avatar} alt={r.name} fill className="object-cover" />
                </div>
                <div>
                  <div className="font-bold text-slate-900 text-sm">{r.name}</div>
                  <div className="text-xs text-slate-600">{r.role}</div>
                </div>
              </div>
            </div>
          </AnimateIn>
        ))}
      </div>
    </section>
  );
}

function FAQsSection() {
  const faqs = [
    { q: "What accounts are available under Personal Banking?", a: "We offer Savings Accounts (high-yield flexible savings), Current Accounts (daily transactions with contactless debit cards), Fixed Deposit Accounts (locked terms for maximum interest), and Notice Deposit Accounts." },
    { q: "What sub-services do you offer for Private Banking?", a: "Private clients enjoy access to Credit Card Services, Discretionary Portfolios, Investor Visa Portfolios, Execution Only Portfolios, Portfolio Secured Lending, Luxury Property Loans, and Notice Deposit Accounts with bespoke rates." },
    { q: "How can my business apply for Trade Finance or Direct Lending?", a: "Business customers can open a Corporate Business Account online, then request Trade Finance letters of credit or Direct Lending facilities directly via the dashboard or with your assigned corporate manager." },
    { q: "How does the Loan & Mortgage Calculator work?", a: "Our interactive calculator allows you to test various loan amounts, repayment terms, and interest rates for mortgages or property loans, producing an estimated monthly schedule before you apply." },
  ];

  return (
    <section className="py-24 bg-slate-100/70 border-t border-slate-200">
      <div className="max-w-4xl mx-auto px-4 space-y-12">
        <AnimateIn className="text-center space-y-3">
          <h2 className="text-3xl font-serif font-bold text-slate-900">Frequently Asked Questions</h2>
          <p className="text-slate-600 text-sm">Everything you need to know about banking with Iron Bridge.</p>
        </AnimateIn>

        <AnimateIn delay={100}>
          <Accordion>
            {faqs.map((faq, i) => (
              <AccordionItem key={i} value={`item-${i}`}>
                <AccordionTrigger>{faq.q}</AccordionTrigger>
                <AccordionContent>{faq.a}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </AnimateIn>
      </div>
    </section>
  );
}

function CTABanner() {
  return (
    <section className="py-24 relative overflow-hidden bg-slate-50 border-t border-slate-200">
      <div className="relative z-10 max-w-4xl mx-auto px-4 text-center space-y-8">
        <AnimateIn>
          <h2 className="text-3xl md:text-5xl font-serif font-bold text-slate-900">Open Your Iron Bridge Account Today</h2>
        </AnimateIn>
        <AnimateIn delay={100}>
          <p className="text-slate-600 text-lg max-w-xl mx-auto">
            Experience next-generation digital banking. Seamless onboarding, bank-grade protection, and dedicated support.
          </p>
        </AnimateIn>
        <AnimateIn delay={200}>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/signup"
              className="flex items-center justify-center gap-2 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold py-4 px-8 rounded-xl transition-transform hover:scale-[1.02] shadow-md shadow-amber-500/20"
            >
              Open Digital Account <ArrowRight className="w-5 h-5" />
            </Link>
            <Link
              href="/contact"
              className="flex items-center justify-center gap-2 bg-white border border-slate-300 hover:bg-slate-100 text-slate-900 font-bold py-4 px-8 rounded-xl transition-transform hover:scale-[1.02] shadow-sm"
            >
              Contact Advisory Team
            </Link>
          </div>
        </AnimateIn>
      </div>
    </section>
  );
}

export default function Homepage() {
  return (
    <div className="bg-slate-50 min-h-screen text-slate-900">
      <HeroSection />
      <StatsBar />
      <PillarsGrid />
      <WhyChooseUs />
      <Testimonials />
      <FAQsSection />
      <CTABanner />
    </div>
  );
}
