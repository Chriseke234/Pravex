"use client";

import { GlassCard } from "@/components/shared/glass-card";
import { FadeIn } from "@/components/animations/fade-in";
import { StaggerContainer, staggerItem } from "@/components/animations/stagger-container";
import { motion } from "framer-motion";
import { Quote } from "lucide-react";

interface TestimonialsProps {
  data: {
    title: string;
    description: string;
    items: Array<{
      name: string;
      role: string;
      company: string;
      quote: string;
    }>;
  };
}

export function Testimonials({ data }: TestimonialsProps) {
  return (
    <section className="py-24 bg-primary/[0.01]">
      <div className="max-w-7xl mx-auto px-4 space-y-16">
        <FadeIn direction="up">
          <div className="text-center space-y-4 max-w-3xl mx-auto">
            <h2 className="text-4xl font-bold">{data.title}</h2>
            <p className="text-lg text-muted-foreground">{data.description}</p>
          </div>
        </FadeIn>

        <StaggerContainer className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {data.items.map((item, i) => (
            <motion.div key={i} variants={staggerItem}>
              <GlassCard className="space-y-6 h-full flex flex-col">
                <div className="text-primary opacity-50">
                  <Quote className="w-8 h-8" />
                </div>
                <p className="text-lg leading-relaxed flex-grow italic">
                  "{item.quote}"
                </p>
                <div className="pt-6 border-t border-white/10 mt-auto">
                  <div className="font-bold text-foreground">{item.name}</div>
                  <div className="text-sm text-primary font-medium">{item.role}</div>
                  <div className="text-xs text-muted-foreground uppercase tracking-wider mt-1">{item.company}</div>
                </div>
              </GlassCard>
            </motion.div>
          ))}
        </StaggerContainer>
      </div>
    </section>
  );
}
