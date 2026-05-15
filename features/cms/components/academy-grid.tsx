"use client";

import { GlassCard } from "@/components/shared/glass-card";
import { Button } from "@/components/ui/button";
import { BookOpen, Clock, ArrowRight, Play, FileText, TrendingUp } from "lucide-react";
import { FadeIn } from "@/components/animations/fade-in";
import { StaggerContainer, staggerItem } from "@/components/animations/stagger-container";
import { motion } from "framer-motion";

const ARTICLES = [
  {
    title: "Understanding MPC Wallet Security",
    category: "Security",
    duration: "12 min read",
    type: "Article",
    icon: FileText,
    image: "https://images.unsplash.com/photo-1639762681485-074b7f938ba0?q=80&w=800&auto=format&fit=crop",
  },
  {
    title: "Institutional Digital Asset Custody",
    category: "Market Insights",
    duration: "18 min read",
    type: "Guide",
    icon: BookOpen,
    image: "https://images.unsplash.com/photo-1639322537228-f710d846310a?q=80&w=800&auto=format&fit=crop",
  },
  {
    title: "Regulatory Frameworks in 2024",
    category: "Compliance",
    duration: "15 min read",
    type: "Whitepaper",
    icon: FileText,
    image: "https://images.unsplash.com/photo-1450101499163-c8848c66ca85?q=80&w=800&auto=format&fit=crop",
  },
  {
    title: "Advanced Trading Algorithms",
    category: "Trading",
    duration: "25 min read",
    type: "Course",
    icon: TrendingUp,
    image: "https://images.unsplash.com/photo-1611974715853-2b8ef9a3d136?q=80&w=800&auto=format&fit=crop",
  },
  {
    title: "Platform Onboarding Masterclass",
    category: "Product",
    duration: "45 min video",
    type: "Video",
    icon: Play,
    image: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=800&auto=format&fit=crop",
  },
  {
    title: "The Future of Tokenized Equities",
    category: "Market Insights",
    duration: "10 min read",
    type: "Article",
    icon: BookOpen,
    image: "https://images.unsplash.com/photo-1640341719935-661a69ea3511?q=80&w=800&auto=format&fit=crop",
  },
];

export function AcademyGrid() {
  return (
    <StaggerContainer className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {ARTICLES.map((article) => (
        <motion.div key={article.title} variants={staggerItem}>
          <GlassCard className="p-0 overflow-hidden group border-white/5 flex flex-col h-full">
            <div className="relative h-48 overflow-hidden">
              <img 
                src={article.image} 
                alt={article.title}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
              <div className="absolute bottom-4 left-4">
                <span className="bg-primary/20 backdrop-blur-md text-primary text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-lg border border-primary/20">
                  {article.category}
                </span>
              </div>
              {article.type === "Video" && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-12 h-12 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center border border-white/30 group-hover:bg-primary transition-colors">
                    <Play className="w-6 h-6 fill-white text-white" />
                  </div>
                </div>
              )}
            </div>
            
            <div className="p-6 flex flex-col flex-1 space-y-4">
              <div className="flex items-center gap-4 text-[10px] text-muted-foreground font-bold uppercase tracking-widest">
                <span className="flex items-center gap-1">
                  <article.icon className="w-3 h-3" />
                  {article.type}
                </span>
                <span className="flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  {article.duration}
                </span>
              </div>
              <h3 className="text-xl font-bold leading-tight group-hover:text-primary transition-colors">
                {article.title}
              </h3>
              <div className="mt-auto pt-4 flex items-center justify-between">
                <Button variant="link" className="p-0 h-auto gap-2 text-sm">
                  Read More <ArrowRight className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </GlassCard>
        </motion.div>
      ))}
    </StaggerContainer>
  );
}
