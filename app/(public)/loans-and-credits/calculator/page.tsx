"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { ArrowRight, Calculator as CalcIcon, RefreshCw, DollarSign, Calendar, Percent } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { formatCurrency } from "@/lib/utils/formatters";

export default function LoanCalculatorPage() {
  const [amount, setAmount] = useState<number>(350000);
  const [rate, setRate] = useState<number>(5.5);
  const [years, setYears] = useState<number>(25);

  const calculation = useMemo(() => {
    const p = Number(amount) || 0;
    const r = (Number(rate) || 0) / 100 / 12;
    const n = (Number(years) || 1) * 12;

    if (p <= 0 || n <= 0) {
      return { monthly: 0, total: 0, interest: 0, schedule: [] };
    }

    let monthly = 0;
    if (r === 0) {
      monthly = p / n;
    } else {
      monthly = (p * (r * Math.pow(1 + r, n))) / (Math.pow(1 + r, n) - 1);
    }

    const total = monthly * n;
    const interest = total - p;

    // Build 5-year amortization summary
    let balance = p;
    const schedule = [];
    for (let year = 1; year <= Math.min(5, years); year++) {
      let yearlyInterest = 0;
      let yearlyPrincipal = 0;
      for (let month = 1; month <= 12; month++) {
        const mInterest = balance * r;
        const mPrincipal = monthly - mInterest;
        yearlyInterest += mInterest;
        yearlyPrincipal += mPrincipal;
        balance -= mPrincipal;
      }
      schedule.push({
        year,
        principalPaid: yearlyPrincipal,
        interestPaid: yearlyInterest,
        remainingBalance: Math.max(0, balance),
      });
    }

    return { monthly, total, interest, schedule };
  }, [amount, rate, years]);

  return (
    <div className="bg-slate-950 text-white min-h-screen py-20">
      <div className="max-w-5xl mx-auto px-4 space-y-12">
        {/* Header */}
        <div className="space-y-4 text-center">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-semibold">
            <CalcIcon className="w-4 h-4" /> Interactive Tool
          </div>
          <h1 className="text-4xl md:text-6xl font-serif font-bold">Loan &amp; Mortgage Calculator</h1>
          <p className="text-slate-400 text-lg max-w-2xl mx-auto">
            Estimate your monthly payments, total interest costs, and early amortization schedule in seconds.
          </p>
        </div>

        {/* Calculator Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Inputs Column */}
          <div className="lg:col-span-5 bg-slate-900 border border-slate-800 p-8 rounded-3xl space-y-6">
            <h2 className="text-xl font-bold text-white border-b border-slate-800 pb-4">Calculator Parameters</h2>

            {/* Loan Amount */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-slate-400 uppercase tracking-wide flex justify-between">
                <span>Loan Amount ($)</span>
                <span className="text-amber-400 font-bold">{formatCurrency(amount)}</span>
              </label>
              <Input
                type="number"
                value={amount}
                onChange={(e) => setAmount(Number(e.target.value))}
                min={1000}
                step={5000}
                leftIcon={<DollarSign className="w-4 h-4 text-slate-500" />}
              />
              <input
                type="range"
                min={10000}
                max={2000000}
                step={10000}
                value={amount}
                onChange={(e) => setAmount(Number(e.target.value))}
                className="w-full accent-amber-500 bg-slate-800"
              />
            </div>

            {/* Interest Rate */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-slate-400 uppercase tracking-wide flex justify-between">
                <span>Interest Rate (%)</span>
                <span className="text-amber-400 font-bold">{rate}% APY</span>
              </label>
              <Input
                type="number"
                step="0.1"
                value={rate}
                onChange={(e) => setRate(Number(e.target.value))}
                min={0.1}
                max={20}
                leftIcon={<Percent className="w-4 h-4 text-slate-500" />}
              />
              <input
                type="range"
                min={1}
                max={15}
                step={0.1}
                value={rate}
                onChange={(e) => setRate(Number(e.target.value))}
                className="w-full accent-amber-500 bg-slate-800"
              />
            </div>

            {/* Term Years */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-slate-400 uppercase tracking-wide flex justify-between">
                <span>Term Duration (Years)</span>
                <span className="text-amber-400 font-bold">{years} Years</span>
              </label>
              <Input
                type="number"
                value={years}
                onChange={(e) => setYears(Number(e.target.value))}
                min={1}
                max={40}
                leftIcon={<Calendar className="w-4 h-4 text-slate-500" />}
              />
              <input
                type="range"
                min={5}
                max={35}
                step={1}
                value={years}
                onChange={(e) => setYears(Number(e.target.value))}
                className="w-full accent-amber-500 bg-slate-800"
              />
            </div>
          </div>

          {/* Results Column */}
          <div className="lg:col-span-7 space-y-6">
            {/* Primary KPI Result */}
            <div className="bg-gradient-to-br from-amber-500/20 via-slate-900 to-slate-900 border border-amber-500/40 p-8 rounded-3xl space-y-6">
              <div className="text-xs font-bold uppercase tracking-wider text-amber-400">Estimated Monthly Payment</div>
              <div className="text-5xl md:text-6xl font-bold text-white tracking-tight">
                {formatCurrency(calculation.monthly)} <span className="text-lg font-normal text-slate-400">/ mo</span>
              </div>

              <div className="grid grid-cols-2 gap-4 pt-4 border-t border-slate-800">
                <div>
                  <div className="text-xs text-slate-400">Total Capital Repaid</div>
                  <div className="text-xl font-bold text-white">{formatCurrency(calculation.total)}</div>
                </div>
                <div>
                  <div className="text-xs text-slate-400">Total Interest Cost</div>
                  <div className="text-xl font-bold text-rose-400">{formatCurrency(calculation.interest)}</div>
                </div>
              </div>

              <div className="pt-2">
                <Link href="/signup">
                  <Button size="lg" className="w-full bg-amber-500 text-slate-950 font-bold hover:bg-amber-600 gap-2">
                    Apply With These Parameters <ArrowRight className="w-4 h-4" />
                  </Button>
                </Link>
              </div>
            </div>

            {/* Amortization Table */}
            <div className="bg-slate-900 border border-slate-800 p-6 rounded-3xl space-y-4">
              <h3 className="text-sm font-bold text-slate-300 uppercase tracking-wider">First 5 Years Amortization Schedule</h3>
              <div className="overflow-x-auto">
                <table className="w-full text-xs text-left">
                  <thead>
                    <tr className="border-b border-slate-800 text-slate-500">
                      <th className="py-2">Year</th>
                      <th className="py-2">Principal Paid</th>
                      <th className="py-2">Interest Paid</th>
                      <th className="py-2 text-right">Remaining Balance</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60">
                    {calculation.schedule.map((row) => (
                      <tr key={row.year} className="hover:bg-slate-800/40">
                        <td className="py-2.5 font-bold text-white">Year {row.year}</td>
                        <td className="py-2.5 text-emerald-400">{formatCurrency(row.principalPaid)}</td>
                        <td className="py-2.5 text-rose-400">{formatCurrency(row.interestPaid)}</td>
                        <td className="py-2.5 text-right font-mono text-slate-300">{formatCurrency(row.remainingBalance)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
