"use client";

import { GlassCard } from "@/components/shared/glass-card"
import * as Icons from "lucide-react"
import { FadeIn } from "@/components/animations/fade-in"
import { StaggerContainer, staggerItem } from "@/components/animations/stagger-container"
import { motion } from "framer-motion"

interface FeaturesGridProps {
  data: {
    title: string
    description: string
    items: Array<{
      icon: string
      title: string
      description: string
    }>
  }
}

export function FeaturesGrid({ data }: FeaturesGridProps) {
  return (
    <section className="py-24 bg-white/[0.01]">
      <div className="max-w-7xl mx-auto px-4 space-y-16">
        <FadeIn direction="up">
          <div className="text-center space-y-4 max-w-3xl mx-auto">
            <h2 className="text-4xl font-bold">{data.title}</h2>
            <p className="text-lg text-muted-foreground">{data.description}</p>
          </div>
        </FadeIn>

        <StaggerContainer className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {data.items.map((item, i) => {
            const Icon = (Icons as any)[item.icon]
            return (
              <motion.div key={i} variants={staggerItem}>
                <GlassCard className="space-y-6 h-full">
                  <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                    {Icon && <Icon className="w-6 h-6" />}
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-xl font-bold">{item.title}</h3>
                    <p className="text-muted-foreground leading-relaxed">
                      {item.description}
                    </p>
                  </div>
                </GlassCard>
              </motion.div>
            )
          })}
        </StaggerContainer>
      </div>
    </section>
  )
}
