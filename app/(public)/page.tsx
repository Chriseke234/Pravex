"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, ShieldCheck, Zap, BarChart3, Coins, Receipt, Headset, CheckCircle2 } from "lucide-react";
import { AnimateIn } from "@/components/ui/AnimateIn";
import { useIntersectionObserver } from "@/hooks/useIntersectionObserver";

function AnimatedCounter({ target, suffix = "" }: { target: number, suffix?: string }) {
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
        
        if (progress < 1) {
          window.requestAnimationFrame(step);
        } else {
          setCount(target);
        }
      };
      
      window.requestAnimationFrame(step);
    }
  }, [isVisible, target]);

  return <span ref={ref}>{count.toLocaleString()}{suffix}</span>;
}

function HeroSection() {
  return (
    <section className="pt-32 pb-16 px-4 max-w-7xl mx-auto flex flex-col md:flex-row items-center gap-12">
      <div className="flex-1 space-y-8">
        <AnimateIn>
          <div className="inline-flex items-center gap-2 bg-gold/10 text-gold text-sm font-semibold px-4 py-2 rounded-full border border-gold/20">
            Trusted by 2,500+ investors worldwide
          </div>
        </AnimateIn>
        
        <AnimateIn delay={100}>
          <h1 className="text-4xl md:text-6xl font-serif font-bold text-foreground leading-tight">
            Buy, trade and grow your crypto. Simply.
          </h1>
        </AnimateIn>
        
        <AnimateIn delay={200}>
          <p className="text-xl text-muted-foreground leading-relaxed max-w-lg">
            Ironbridgemarket makes it easy to invest in Bitcoin, Ethereum and more — with the security and tools that serious investors rely on.
          </p>
        </AnimateIn>
        
        <AnimateIn delay={300}>
          <div className="flex flex-col sm:flex-row gap-4">
            <Link href="/signup" className="flex items-center justify-center gap-2 bg-gold hover:bg-gold-hover text-navy font-bold py-4 px-8 rounded-xl transition-transform hover:scale-[1.02] duration-200">
              Create Free Account <ArrowRight className="w-5 h-5" />
            </Link>
            <Link href="/markets" className="flex items-center justify-center gap-2 bg-transparent border border-border hover:border-foreground/40 text-foreground font-bold py-4 px-8 rounded-xl transition-transform hover:scale-[1.02] duration-200">
              See Live Markets
            </Link>
          </div>
        </AnimateIn>
        
        <AnimateIn delay={400}>
          <div className="flex flex-wrap items-center gap-6 pt-4 text-sm text-muted-foreground font-medium">
            <div className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-gold" /> No hidden fees</div>
            <div className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-gold" /> Withdrawals in 24hrs</div>
            <div className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-gold" /> Regulated &amp; secure</div>
          </div>
        </AnimateIn>
      </div>
      
      <div className="flex-1 w-full">
        <AnimateIn delay={200} className="relative h-[200px] md:h-[600px] w-full rounded-2xl overflow-hidden border border-gold/40 shadow-2xl shadow-gold/10">
          <Image 
            src="https://images.unsplash.com/photo-1642790106117-e829e14a795f?w=800&q=80" 
            alt="Trading Dashboard" 
            fill 
            className="object-cover"
            priority 
            sizes="(max-width: 768px) 100vw, 50vw"
          />
        </AnimateIn>
      </div>
    </section>
  );
}

function LiveTickerBar() {
  const assets = [
    { symbol: "BTC", price: "$64,230.00", change: "+2.4%", up: true },
    { symbol: "ETH", price: "$3,450.20", change: "+1.8%", up: true },
    { symbol: "SOL", price: "$145.60", change: "-0.5%", up: false },
    { symbol: "BNB", price: "$590.10", change: "+0.2%", up: true },
    { symbol: "AAPL", price: "$189.40", change: "+1.1%", up: true },
    { symbol: "TSLA", price: "$175.20", change: "-2.3%", up: false },
    { symbol: "GOLD", price: "$2,340.50", change: "+0.8%", up: true },
    { symbol: "EUR/USD", price: "1.0840", change: "+0.1%", up: true },
  ];

  return (
    <div className="w-full bg-background border-y border-border/30 overflow-hidden py-4 flex">
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes ticker {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .animate-ticker {
          display: flex;
          width: fit-content;
          animation: ticker 30s linear infinite;
        }
        .animate-ticker:hover {
          animation-play-state: paused;
        }
      `}} />
      <div className="animate-ticker shrink-0">
        {[...assets, ...assets, ...assets].map((asset, i) => (
          <div key={i} className="flex items-center gap-3 px-8 border-r border-border/30 whitespace-nowrap">
            <span className="font-bold text-foreground">{asset.symbol}</span>
            <span className="text-muted-foreground">{asset.price}</span>
            <span className={`text-xs font-bold px-2 py-1 rounded-md ${asset.up ? 'bg-emerald-500/10 text-emerald-400' : 'bg-red-500/10 text-red-400'}`}>
              {asset.change}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

function StatsBar() {
  return (
    <section className="py-16 border-b border-border/30">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:divide-x divide-border/30">
          <AnimateIn className="text-center space-y-2">
            <div className="text-4xl md:text-5xl font-bold text-foreground">$<AnimatedCounter target={120} suffix="B+" /></div>
            <div className="text-sm text-muted-foreground font-medium uppercase tracking-wide">moved through Ironbridgemarket</div>
          </AnimateIn>
          <AnimateIn delay={100} className="text-center space-y-2">
            <div className="text-4xl md:text-5xl font-bold text-foreground"><AnimatedCounter target={2500} suffix="+" /></div>
            <div className="text-sm text-muted-foreground font-medium uppercase tracking-wide">investors &amp; institutions</div>
          </AnimateIn>
          <AnimateIn delay={200} className="text-center space-y-2">
            <div className="text-4xl md:text-5xl font-bold text-foreground"><AnimatedCounter target={120} suffix="+" /></div>
            <div className="text-sm text-muted-foreground font-medium uppercase tracking-wide">countries served</div>
          </AnimateIn>
          <AnimateIn delay={300} className="text-center space-y-2">
            <div className="text-4xl md:text-5xl font-bold text-foreground"><AnimatedCounter target={99} suffix=".99%" /></div>
            <div className="text-sm text-muted-foreground font-medium uppercase tracking-wide">platform uptime</div>
          </AnimateIn>
        </div>
      </div>
    </section>
  );
}

function HowItWorks() {
  const steps = [
    {
      num: "01",
      title: "Create your account",
      desc: "Sign up with your email. Verify your identity in under 2 minutes.",
      img: "https://images.unsplash.com/photo-1633265486064-086b219458ec?w=400&q=80"
    },
    {
      num: "02",
      title: "Add your funds",
      desc: "Deposit via bank transfer or card. Funds appear in your account instantly.",
      img: "https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=400&q=80"
    },
    {
      num: "03",
      title: "Start investing",
      desc: "Buy Bitcoin, Ethereum, or any of 200+ assets with one tap.",
      img: "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=400&q=80"
    }
  ];

  return (
    <section className="py-24 px-4 max-w-7xl mx-auto">
      <div className="text-center space-y-4 mb-16">
        <AnimateIn>
          <h2 className="text-4xl md:text-5xl font-serif font-bold text-foreground">Get started in minutes</h2>
        </AnimateIn>
        <AnimateIn delay={100}>
          <p className="text-xl text-muted-foreground">No paperwork. No complexity. Just three simple steps.</p>
        </AnimateIn>
      </div>

      <div className="relative flex flex-col md:flex-row gap-8 justify-between">
        {steps.map((step, i) => (
          <AnimateIn key={i} delay={i * 200} className="flex-1 z-10">
            <div className="bg-card/[0.03] border border-border/30 rounded-3xl overflow-hidden h-full transform transition-transform hover:-translate-y-1 duration-200">
              <div className="relative h-[160px] w-full">
                <Image src={step.img} alt={step.title} fill className="object-cover" sizes="(max-width: 768px) 100vw, 33vw" />
              </div>
              <div className="p-8 relative">
                <div className="absolute -top-6 left-8 w-12 h-12 bg-gold rounded-full flex items-center justify-center text-navy font-bold text-lg border-4 border-background">
                  {step.num}
                </div>
                <h3 className="text-2xl font-bold text-foreground mt-4 mb-2">{step.title}</h3>
                <p className="text-muted-foreground">{step.desc}</p>
              </div>
            </div>
          </AnimateIn>
        ))}
        {/* Desktop Connectors */}
        <div className="hidden md:flex absolute top-1/2 left-0 w-full justify-between px-[16%] -translate-y-1/2 pointer-events-none z-0">
          <div className="text-gold text-4xl">→</div>
          <div className="text-gold text-4xl">→</div>
        </div>
      </div>
    </section>
  );
}

function FeaturesGrid() {
  const features = [
    {
      title: "Security First",
      desc: "Your money is protected by bank-grade security. We've never had a breach — and we intend to keep it that way.",
      icon: ShieldCheck
    },
    {
      title: "Lightning Fast",
      desc: "Trades go through in milliseconds. No spinning wheels, no timeouts — just instant execution.",
      icon: Zap
    },
    {
      title: "Smart Insights",
      desc: "See your full portfolio at a glance. Simple charts. Clear numbers. No finance degree needed.",
      icon: BarChart3
    },
    {
      title: "200+ Assets",
      desc: "Trade Bitcoin, Ethereum, top altcoins, stocks, and commodities — all from one account.",
      icon: Coins
    },
    {
      title: "Low Fees",
      desc: "We charge 0.10% per trade. No monthly fees. No withdrawal fees. What you see is what you pay.",
      icon: Receipt
    },
    {
      title: "24/7 Support",
      desc: "Real humans available around the clock via live chat. Average response time: 4 minutes.",
      icon: Headset
    }
  ];

  return (
    <section className="py-24 bg-background border-y border-border/30">
      <div className="max-w-7xl mx-auto px-4">
        <AnimateIn>
          <div className="text-center mb-16">
            <h2 className="text-4xl font-serif font-bold text-foreground">Everything you need. Nothing you don't.</h2>
          </div>
        </AnimateIn>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feat, i) => (
            <AnimateIn key={i} delay={i * 100} className="h-full">
              <div className="bg-card/[0.02] border border-border/30 p-8 rounded-3xl h-full transition-transform hover:-translate-y-2 duration-300">
                <feat.icon className="w-8 h-8 text-gold mb-6" />
                <h3 className="text-xl font-bold text-foreground mb-3">{feat.title}</h3>
                <p className="text-muted-foreground leading-relaxed">{feat.desc}</p>
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
      name: "Sarah K.", role: "Fund Manager, Lagos",
      avatar: "https://i.pravatar.cc/80?img=47",
      quote: "Switched from Coinbase last year. Night and day difference in execution speed and fees. Highly recommend."
    },
    {
      name: "Michael T.", role: "Portfolio Manager, Accra",
      avatar: "https://i.pravatar.cc/80?img=12",
      quote: "Finally a platform that doesn't make you feel like you need a PhD to use it. The dashboard is brilliant."
    },
    {
      name: "Amara D.", role: "Private Investor, Nairobi",
      avatar: "https://i.pravatar.cc/80?img=32",
      quote: "Customer support actually picks up. I had an issue at 2am and someone helped me within minutes."
    }
  ];

  return (
    <section className="py-24 px-4 max-w-7xl mx-auto">
      <AnimateIn className="text-center mb-16">
        <h2 className="text-4xl md:text-5xl font-serif font-bold text-foreground">Investors love Ironbridgemarket</h2>
      </AnimateIn>

      <div className="flex flex-col md:flex-row gap-6">
        {reviews.map((rev, i) => (
          <AnimateIn key={i} delay={i * 150} className="flex-1">
            <div className="bg-card border border-border/30 p-8 rounded-3xl h-full relative">
              <div className="text-gold text-xl mb-4 tracking-widest">★★★★★</div>
              <p className="text-muted-foreground italic mb-10 text-lg">&quot;{rev.quote}&quot;</p>
              <div className="flex items-center gap-4 mt-auto absolute bottom-8">
                <Image src={rev.avatar} alt={rev.name} width={48} height={48} className="rounded-full bg-muted" />
                <div>
                  <div className="font-bold text-foreground">{rev.name}</div>
                  <div className="text-sm text-muted-foreground">{rev.role}</div>
                </div>
              </div>
              <div className="h-16"></div> {/* Spacer for absolute positioning */}
            </div>
          </AnimateIn>
        ))}
      </div>
    </section>
  );
}

function MarketsPreview() {
  const topAssets = [
    { name: "Bitcoin", sym: "BTC", price: "$64,230.00", change: "+2.4%" },
    { name: "Ethereum", sym: "ETH", price: "$3,450.20", change: "+1.8%" },
    { name: "Solana", sym: "SOL", price: "$145.60", change: "-0.5%" },
    { name: "Binance Coin", sym: "BNB", price: "$590.10", change: "+0.2%" },
    { name: "Gold", sym: "XAU", price: "$2,340.50", change: "+0.8%" },
  ];

  return (
    <section className="py-24 bg-background border-y border-border/30">
      <div className="max-w-4xl mx-auto px-4">
        <AnimateIn className="text-center mb-12">
          <h2 className="text-3xl font-serif font-bold text-foreground">What&apos;s moving today</h2>
        </AnimateIn>
        
        <AnimateIn delay={100} className="bg-card/[0.02] border border-border/30 rounded-3xl overflow-hidden">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-border/30 text-muted-foreground text-sm">
                <th className="py-4 px-6 font-medium">Asset</th>
                <th className="py-4 px-6 font-medium text-right">Price</th>
                <th className="py-4 px-6 font-medium text-right">24h Change</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/20">
              {topAssets.map((asset, i) => (
                <tr key={i} className="hover:bg-accent/30 transition-colors">
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-accent flex items-center justify-center text-xs font-bold text-foreground">{asset.sym[0]}</div>
                      <div>
                        <div className="font-bold text-foreground">{asset.name}</div>
                        <div className="text-xs text-muted-foreground">{asset.sym}</div>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-6 text-right font-medium text-foreground">{asset.price}</td>
                  <td className={`py-4 px-6 text-right font-medium ${asset.change.startsWith('+') ? 'text-emerald-400' : 'text-red-400'}`}>
                    {asset.change}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </AnimateIn>
        
        <AnimateIn delay={200} className="text-center mt-8">
          <Link href="/markets" className="text-gold font-bold hover:underline inline-flex items-center gap-1">
            View all 200+ markets <ArrowRight className="w-4 h-4" />
          </Link>
        </AnimateIn>
      </div>
    </section>
  );
}

function CTABanner() {
  return (
    <section className="py-32 relative overflow-hidden">
      <div 
        className="absolute inset-0 z-0 bg-cover bg-center"
        style={{ backgroundImage: "url('https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=1200&q=60')" }}
      >
        <div className="absolute inset-0 bg-black/75"></div>
      </div>
      
      <div className="relative z-10 max-w-3xl mx-auto px-4 text-center space-y-8">
        <AnimateIn>
          <h2 className="text-4xl md:text-5xl font-serif font-bold text-white">Ready to start investing?</h2>
        </AnimateIn>
        <AnimateIn delay={100}>
          <p className="text-xl text-gray-300">Create your free account in 2 minutes. No minimum deposit required.</p>
        </AnimateIn>
        <AnimateIn delay={200}>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/signup" className="flex items-center justify-center gap-2 bg-gold hover:bg-gold-hover text-navy font-bold py-4 px-8 rounded-xl transition-transform hover:scale-[1.02] duration-200">
              Open Free Account <ArrowRight className="w-5 h-5" />
            </Link>
            <Link href="/contact" className="flex items-center justify-center gap-2 bg-transparent border border-white/20 hover:border-white/40 text-white font-bold py-4 px-8 rounded-xl transition-transform hover:scale-[1.02] duration-200">
              Talk to our team
            </Link>
          </div>
        </AnimateIn>
      </div>
    </section>
  );
}

export default function Homepage() {
  return (
    <div className="bg-background min-h-screen font-sans">
      <HeroSection />
      <LiveTickerBar />
      <StatsBar />
      <HowItWorks />
      <FeaturesGrid />
      <Testimonials />
      <MarketsPreview />
      <CTABanner />
      
      <div className="max-w-7xl mx-auto px-4 py-8 text-[11px] text-muted-foreground text-center border-t border-border/30">
        Ironbridgemarket Institutional Ltd. Digital assets are high-risk investments. The value of your investments can go up as well as down and you may get back less than you put in. This is not financial advice. Past performance is not a reliable indicator of future results.
      </div>
    </div>
  );
}
