"use client";

import { useState } from "react";
import Link from "next/link";
import { HelpCircle, Search, ArrowRight } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion";

const FAQ_CATEGORIES = [
  {
    name: "General & Security",
    items: [
      { q: "What is Iron Bridge?", a: "Iron Bridge is a licensed digital banking and wealth platform providing personal current accounts, private wealth management, business trade finance, and mortgage lending." },
      { q: "How is my account secured online?", a: "We enforce multi-factor authentication (MFA), 256-bit AES data encryption, hardware security modules, and automated anomaly detection on all client accounts." },
    ],
  },
  {
    name: "Personal & Private Banking",
    items: [
      { q: "What is the difference between Savings and Notice Deposit accounts?", a: "Savings accounts offer instant access to your funds anytime with flexible withdrawals. Notice Deposit accounts pay higher interest in exchange for agreeing to give 35, 60, or 95 days notice before withdrawing." },
      { q: "Who qualifies for Private Banking?", a: "Private Banking services, including luxury metal credit cards and discretionary portfolio management, are available to clients maintaining a minimum relationship balance of $500,000 or equivalent." },
      { q: "How do Investor Visa Portfolios work?", a: "Our Private Wealth desk structures portfolios compliant with national residency and citizenship by investment programs (e.g. UK Golden Visa, European Investor schemes)." },
    ],
  },
  {
    name: "Business Banking & Loans",
    items: [
      { q: "What documents are required to open a Business Account?", a: "You will need Certificate of Incorporation, Memorandum & Articles of Association, Proof of Address for the business, and photo ID/KYC documents for all directors and ultimate beneficial owners (UBOs holding 25%+)." },
      { q: "How do Trade Finance Letters of Credit work?", a: "Iron Bridge issues an irrevocable Letter of Credit guaranteeing payment to your overseas supplier upon presentation of verified shipping documents (Bill of Lading, Commercial Invoice)." },
      { q: "What loan types do you provide?", a: "We offer Residential Mortgages, Commercial Real Estate Loans, Property Bridging Finance, Corporate Direct Lending, and Portfolio-Secured Lines of Credit." },
    ],
  },
];

export default function FAQsPage() {
  const [search, setSearch] = useState("");

  return (
    <div className="bg-slate-950 text-white min-h-screen py-20">
      <div className="max-w-4xl mx-auto px-4 space-y-12">
        <div className="space-y-4 text-center">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-semibold">
            <HelpCircle className="w-4 h-4" /> Knowledge Base
          </div>
          <h1 className="text-4xl md:text-6xl font-serif font-bold">Frequently Asked Questions</h1>
          <p className="text-slate-400 text-lg max-w-xl mx-auto">
            Find immediate answers regarding personal accounts, private wealth, business trade finance, and credit products.
          </p>

          <div className="pt-4 max-w-md mx-auto">
            <Input
              placeholder="Search questions (e.g. Trade Finance, Notice Deposit)..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              leftIcon={<Search className="w-4 h-4 text-slate-500" />}
            />
          </div>
        </div>

        <div className="space-y-10">
          {FAQ_CATEGORIES.map((cat, catIdx) => {
            const filteredItems = cat.items.filter(
              (item) =>
                item.q.toLowerCase().includes(search.toLowerCase()) ||
                item.a.toLowerCase().includes(search.toLowerCase())
            );

            if (filteredItems.length === 0) return null;

            return (
              <div key={catIdx} className="space-y-4">
                <h2 className="text-xl font-bold text-amber-400 border-b border-slate-800 pb-2">{cat.name}</h2>
                <Accordion>
                  {filteredItems.map((item, i) => (
                    <AccordionItem key={i} value={`${catIdx}-${i}`}>
                      <AccordionTrigger>{item.q}</AccordionTrigger>
                      <AccordionContent>{item.a}</AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </div>
            );
          })}
        </div>

        <div className="bg-slate-900 border border-slate-800 p-8 rounded-3xl text-center space-y-4">
          <h3 className="text-xl font-bold">Still have questions?</h3>
          <p className="text-slate-400 text-sm max-w-md mx-auto">Our advisory team and 24/7 client support desk are ready to assist you.</p>
          <div className="pt-2">
            <Link href="/contact">
              <Button className="bg-amber-500 text-slate-950 font-bold hover:bg-amber-600 gap-2">
                Contact Support Team <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
