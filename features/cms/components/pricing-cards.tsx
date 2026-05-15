"use client";

import { useState } from "react";
import { GlassCard } from "@/components/shared/glass-card";
import { Button } from "@/components/ui/button";
import { Check, Shield, Zap, Building } from "lucide-react";
import { cn } from "@/lib/utils";

const TIERS = [
  {
    name: "Starter",
    price: { monthly: 0, yearly: 0 },
    description: "For individual investors starting their journey.",
    icon: Zap,
    features: [
      "Real-time market data",
      "Basic portfolio tracking",
      "Standard exchange connectivity",
      "Email support",
      "Community access",
    ],
    cta: "Start for Free",
    popular: false,
  },
  {
    name: "Professional",
    price: { monthly: 99, yearly: 79 },
    description: "Advanced tools for serious traders and managers.",
    icon: Shield,
    features: [
      "All Starter features",
      "Multi-signature vault access",
      "Advanced risk analytics",
      "Priority API access",
      "Institutional-grade reporting",
      "24/7 Priority support",
    ],
    cta: "Get Started",
    popular: true,
  },
  {
    name: "Enterprise",
    price: { monthly: "Custom", yearly: "Custom" },
    description: "Full-scale infrastructure for global institutions.",
    icon: Building,
    features: [
      "All Professional features",
      "Dedicated account manager",
      "Custom node deployment",
      "White-glove onboarding",
      "Unlimited API throughput",
      "SLA-backed performance",
    ],
    cta: "Contact Sales",
    popular: false,
  },
];

export function PricingCards() {
  const [billingCycle, setBillingCycle] = useState<"monthly" | "yearly">("yearly");

  return (
    <div className="space-y-12">
      <div className="flex justify-center">
        <div className="bg-white/5 p-1 rounded-2xl border border-white/10 flex gap-2">
          <button
            onClick={() => setBillingCycle("monthly")}
            className={cn(
              "px-6 py-2 rounded-xl text-sm font-bold transition-all",
              billingCycle === "monthly" ? "bg-white/10 text-white" : "text-muted-foreground hover:text-white"
            )}
          >
            Monthly
          </button>
          <button
            onClick={() => setBillingCycle("yearly")}
            className={cn(
              "px-6 py-2 rounded-xl text-sm font-bold transition-all",
              billingCycle === "yearly" ? "bg-primary text-white" : "text-muted-foreground hover:text-white"
            )}
          >
            Yearly <span className="ml-1 text-[10px] bg-emerald-500/20 text-emerald-400 px-1.5 py-0.5 rounded-full">-20%</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {TIERS.map((tier) => (
          <GlassCard 
            key={tier.name} 
            className={cn(
              "p-8 flex flex-col h-full transition-transform duration-300 hover:-translate-y-2",
              tier.popular ? "border-primary/50 shadow-[0_0_40px_-15px_rgba(var(--primary-rgb),0.3)]" : "border-white/5"
            )}
          >
            {tier.popular && (
              <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-primary text-white text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-full">
                Most Popular
              </div>
            )}
            
            <div className="space-y-4 mb-8">
              <div className="p-3 bg-white/5 w-fit rounded-2xl">
                <tier.icon className={cn("w-6 h-6", tier.popular ? "text-primary" : "text-muted-foreground")} />
              </div>
              <div>
                <h3 className="text-2xl font-bold">{tier.name}</h3>
                <p className="text-sm text-muted-foreground">{tier.description}</p>
              </div>
              <div className="pt-4">
                <span className="text-4xl font-bold">
                  {typeof tier.price[billingCycle] === "number" ? `$${tier.price[billingCycle]}` : tier.price[billingCycle]}
                </span>
                {typeof tier.price[billingCycle] === "number" && (
                  <span className="text-muted-foreground ml-2">/month</span>
                )}
              </div>
            </div>

            <ul className="space-y-4 mb-8 flex-1">
              {tier.features.map((feature) => (
                <li key={feature} className="flex items-center gap-3 text-sm text-muted-foreground">
                  <Check className="w-4 h-4 text-emerald-500 shrink-0" />
                  {feature}
                </li>
              ))}
            </ul>

            <Button 
              variant={tier.popular ? "premium" : "glass"} 
              className="w-full"
              size="lg"
            >
              {tier.cta}
            </Button>
          </GlassCard>
        ))}
      </div>
    </div>
  );
}
