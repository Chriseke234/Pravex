"use client";

import { Button } from "@/components/ui/button"
import Link from "next/link"
import { FadeIn } from "@/components/animations/fade-in"
import { StaggerContainer, staggerItem } from "@/components/animations/stagger-container"
import { motion } from "framer-motion"

interface HeroProps {
  data: {
    title: string
    subtitle: string
    primaryCTA: { text: string; href: string }
    secondaryCTA: { text: string; href: string }
    stats: Array<{ label: string; value: string }>
  }
}

export function Hero({ data }: HeroProps) {
  return (
    <section className="relative pt-32 pb-20 overflow-hidden">
      {/* Background Orbs */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[600px] bg-primary/5 blur-[120px] rounded-full -z-10" />
      
      <div className="max-w-7xl mx-auto px-4 text-center space-y-8">
        <FadeIn direction="up">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-primary/20 bg-primary/5 text-primary text-xs font-semibold uppercase tracking-wider">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
            </span>
            Next-Gen Institutional Ecosystem
          </div>
        </FadeIn>

        <FadeIn direction="up" delay={0.1}>
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-gradient">
            {data.title}
          </h1>
        </FadeIn>
        
        <FadeIn direction="up" delay={0.2}>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            {data.subtitle}
          </p>
        </FadeIn>

        <FadeIn direction="up" delay={0.3}>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <Link href={data.primaryCTA.href}>
              <Button variant="premium" size="lg" className="h-14 px-8 text-lg">
                {data.primaryCTA.text}
              </Button>
            </Link>
            <Link href={data.secondaryCTA.href}>
              <Button variant="glass" size="lg" className="h-14 px-8 text-lg">
                {data.secondaryCTA.text}
              </Button>
            </Link>
          </div>
        </FadeIn>

        {/* Stats Grid */}
        <StaggerContainer className="grid grid-cols-2 md:grid-cols-3 gap-8 pt-12 border-t border-white/5 mt-12">
          {data.stats.map((stat, i) => (
            <motion.div key={i} variants={staggerItem} className="space-y-1">
              <div className="text-3xl font-bold">{stat.value}</div>
              <div className="text-sm text-muted-foreground uppercase tracking-wider">{stat.label}</div>
            </motion.div>
          ))}
        </StaggerContainer>
      </div>
    </section>
  )
}
