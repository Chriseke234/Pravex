"use client";

import { GlassCard } from "@/components/shared/glass-card";
import { Button } from "@/components/ui/button";
import { ArrowRight, Calendar, User } from "lucide-react";
import { FadeIn } from "@/components/animations/fade-in";
import { StaggerContainer, staggerItem } from "@/components/animations/stagger-container";
import { motion } from "framer-motion";

const BLOG_POSTS = [
  {
    title: "The Evolution of Institutional Custody in 2026",
    category: "Infrastructure",
    date: "May 14, 2026",
    author: "Sarah Chen",
    image: "https://images.unsplash.com/photo-1639322537228-f710d846310a?q=80&w=800&auto=format&fit=crop",
    excerpt: "How multi-party computation and distributed ledgers are reshaping the way tier-1 banks secure digital assets."
  },
  {
    title: "Navigating Global Regulatory Frameworks",
    category: "Compliance",
    date: "May 10, 2026",
    author: "Michael Roberts",
    image: "https://images.unsplash.com/photo-1450101499163-c8848c66ca85?q=80&w=800&auto=format&fit=crop",
    excerpt: "A comprehensive guide to MiCA, SEC guidelines, and the emerging standards for digital asset institutions."
  },
  {
    title: "Algorithmic Trading: Strategies for High Volatility",
    category: "Trading",
    date: "May 05, 2026",
    author: "David Kim",
    image: "https://images.unsplash.com/photo-1611974715853-2b8ef9a3d136?q=80&w=800&auto=format&fit=crop",
    excerpt: "Optimizing execution algorithms to minimize slippage during macro-economic news events."
  },
  {
    title: "Security Deep Dive: Zero-Trust Architectures",
    category: "Security",
    date: "April 28, 2026",
    author: "Elena Rodriguez",
    image: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=800&auto=format&fit=crop",
    excerpt: "Implementing strict access controls and continuous authentication in decentralized environments."
  },
  {
    title: "Tokenization of Real-World Assets",
    category: "Market Insights",
    date: "April 21, 2026",
    author: "James Wilson",
    image: "https://images.unsplash.com/photo-1640341719935-661a69ea3511?q=80&w=800&auto=format&fit=crop",
    excerpt: "The multi-trillion dollar opportunity in bringing traditional financial instruments on-chain."
  },
  {
    title: "Pavex Platform Update: V2.5 Release Notes",
    category: "Product Updates",
    date: "April 15, 2026",
    author: "The Pavex Team",
    image: "https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=800&auto=format&fit=crop",
    excerpt: "Introducing predictive analytics forecasting and expanded webhook configurations for enterprise users."
  }
];

export default function BlogPage() {
  return (
    <div className="min-h-screen pt-32 pb-24">
      <main className="max-w-7xl mx-auto px-4 space-y-20">
        {/* Hero Section */}
        <section className="text-center max-w-3xl mx-auto space-y-6">
          <FadeIn direction="up">
            <h1 className="text-5xl md:text-6xl font-bold tracking-tight">
              Pavex <span className="text-gradient">Blog</span>
            </h1>
          </FadeIn>
          <FadeIn direction="up" delay={0.1}>
            <p className="text-xl text-muted-foreground leading-relaxed">
              Institutional insights, technical deep-dives, and company updates from the leaders in digital asset infrastructure.
            </p>
          </FadeIn>
        </section>

        {/* Featured Post */}
        <FadeIn direction="up" delay={0.2}>
          <GlassCard className="p-0 overflow-hidden group">
            <div className="flex flex-col lg:flex-row">
              <div className="relative w-full lg:w-1/2 h-64 lg:h-[400px] overflow-hidden">
                <img 
                  src={BLOG_POSTS[0].image} 
                  alt={BLOG_POSTS[0].title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute top-4 left-4">
                  <span className="bg-primary/90 text-white text-xs font-bold uppercase tracking-widest px-3 py-1.5 rounded-lg">
                    Featured
                  </span>
                </div>
              </div>
              <div className="flex-1 p-8 lg:p-12 flex flex-col justify-center">
                <div className="flex items-center gap-4 text-xs font-semibold uppercase tracking-widest text-primary mb-4">
                  <span>{BLOG_POSTS[0].category}</span>
                </div>
                <h2 className="text-3xl lg:text-4xl font-bold mb-4 group-hover:text-primary transition-colors">
                  {BLOG_POSTS[0].title}
                </h2>
                <p className="text-muted-foreground text-lg mb-8 leading-relaxed">
                  {BLOG_POSTS[0].excerpt}
                </p>
                <div className="mt-auto flex items-center justify-between">
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <span className="flex items-center gap-2"><User className="w-4 h-4" /> {BLOG_POSTS[0].author}</span>
                    <span className="flex items-center gap-2"><Calendar className="w-4 h-4" /> {BLOG_POSTS[0].date}</span>
                  </div>
                  <Button variant="outline" className="gap-2">Read Article <ArrowRight className="w-4 h-4" /></Button>
                </div>
              </div>
            </div>
          </GlassCard>
        </FadeIn>

        {/* Blog Grid */}
        <section>
          <div className="flex justify-between items-end mb-8">
            <h3 className="text-2xl font-bold">Latest Articles</h3>
          </div>
          
          <StaggerContainer className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {BLOG_POSTS.slice(1).map((post) => (
              <motion.div key={post.title} variants={staggerItem}>
                <GlassCard className="p-0 overflow-hidden group border-white/5 flex flex-col h-full">
                  <div className="relative h-48 overflow-hidden">
                    <img 
                      src={post.image} 
                      alt={post.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-80" />
                    <div className="absolute bottom-4 left-4">
                      <span className="bg-white/10 backdrop-blur-md text-white border border-white/20 text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-lg">
                        {post.category}
                      </span>
                    </div>
                  </div>
                  
                  <div className="p-6 flex flex-col flex-1">
                    <h3 className="text-xl font-bold leading-tight mb-3 group-hover:text-primary transition-colors">
                      {post.title}
                    </h3>
                    <p className="text-sm text-muted-foreground mb-6 line-clamp-2">
                      {post.excerpt}
                    </p>
                    <div className="mt-auto pt-4 border-t border-white/5 flex items-center justify-between text-xs text-muted-foreground">
                      <span className="flex items-center gap-1.5"><Calendar className="w-3.5 h-3.5" /> {post.date}</span>
                      <Button variant="link" className="p-0 h-auto gap-1 text-xs text-primary">
                        Read More <ArrowRight className="w-3 h-3" />
                      </Button>
                    </div>
                  </div>
                </GlassCard>
              </motion.div>
            ))}
          </StaggerContainer>
        </section>
      </main>
    </div>
  );
}
