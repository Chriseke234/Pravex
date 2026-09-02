"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import {
  ArrowRight,
  Calculator as CalcIcon,
  RefreshCw,
  Calendar,
  Percent,
  Building2,
  Home,
  Coins,
  Clock,
  ShieldCheck,
  CheckCircle2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

type Currency = "USD" | "GBP" | "EUR";

interface LoanPreset {
  name: string;
  icon: React.ElementType;
  amount: number;
  rate: number;
  years: number;
  description: string;
}

const PRESETS: LoanPreset[] = [
  {
    name: "Residential Mortgage",
    icon: Home,
    amount: 350000,
    rate: 5.25,
    years: 25,
    description: "Standard home purchase or remortgage facility",
  },
  {
    name: "Commercial Real Estate",
    icon: Building2,
    amount: 1200000,
    rate: 6.5,
    years: 15,
    description: "Commercial building acquisition or development",
  },
  {
    name: "Portfolio Secured",
    icon: Coins,
    amount: 250000,
    rate: 4.85,
    years: 5,
    description: "Liquidity secured against marketable securities",
  },
  {
    name: "Bridging Loan",
    icon: Clock,
    amount: 150000,
    rate: 7.5,
    years: 2,
    description: "Short-term interim property financing",
  },
];

const CURRENCY_SYMBOLS: Record<Currency, string> = {
  USD: "$",
  GBP: "£",
  EUR: "€",
};

export default function LoanCalculatorPage() {
  const [currency, setCurrency] = useState<Currency>("GBP");
  const [amount, setAmount] = useState<number>(350000);
  const [rate, setRate] = useState<number>(5.25);
  const [years, setYears] = useState<number>(25);
  const [activePreset, setActivePreset] = useState<string>("Residential Mortgage");

  const sym = CURRENCY_SYMBOLS[currency];

  const formatMoney = (val: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: currency,
      maximumFractionDigits: 0,
    }).format(val || 0);
  };

  const applyPreset = (preset: LoanPreset) => {
    setActivePreset(preset.name);
    setAmount(preset.amount);
    setRate(preset.rate);
    setYears(preset.years);
  };

  const resetToDefault = () => {
    applyPreset(PRESETS[0]);
  };

  const calculation = useMemo(() => {
    const p = Math.max(0, Number(amount) || 0);
    const annualRate = Math.max(0, Number(rate) || 0);
    const r = annualRate / 100 / 12;
    const totalMonths = Math.max(1, (Number(years) || 1) * 12);

    if (p <= 0) {
      return {
        monthly: 0,
        total: 0,
        interest: 0,
        principalPercent: 100,
        interestPercent: 0,
        schedule: [],
      };
    }

    let monthly = 0;
    if (r === 0) {
      monthly = p / totalMonths;
    } else {
      const compound = Math.pow(1 + r, totalMonths);
      monthly = (p * (r * compound)) / (compound - 1);
    }

    const total = monthly * totalMonths;
    const interest = Math.max(0, total - p);
    const principalPercent = total > 0 ? Math.round((p / total) * 100) : 100;
    const interestPercent = 100 - principalPercent;

    // First 5 Years Amortization Table
    let balance = p;
    const schedule = [];
    const maxYearsToDisplay = Math.min(5, Math.ceil(totalMonths / 12));

    for (let yr = 1; yr <= maxYearsToDisplay; yr++) {
      let yearlyInterest = 0;
      let yearlyPrincipal = 0;
      for (let m = 1; m <= 12; m++) {
        if (balance <= 0) break;
        const mInterest = balance * r;
        const mPrincipal = Math.min(balance, monthly - mInterest);
        yearlyInterest += mInterest;
        yearlyPrincipal += mPrincipal;
        balance -= mPrincipal;
      }
      schedule.push({
        year: yr,
        principalPaid: yearlyPrincipal,
        interestPaid: yearlyInterest,
        remainingBalance: Math.max(0, balance),
      });
    }

    return {
      monthly,
      total,
      interest,
      principalPercent,
      interestPercent,
      schedule,
    };
  }, [amount, rate, years]);

  return (
    <div className="bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white min-h-screen py-16 md:py-24 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Header */}
        <div className="space-y-4 text-center max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-600 dark:text-amber-400 text-xs font-semibold">
            <CalcIcon className="w-4 h-4" /> Interactive Financing Engine
          </div>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-serif font-bold tracking-tight">
            Loan &amp; Mortgage <span className="text-gradient-gold">Calculator</span>
          </h1>
          <p className="text-slate-600 dark:text-slate-400 text-base sm:text-lg leading-relaxed">
            Estimate monthly payments, total repayment capital, and amortization schedules across multi-currency financing products.
          </p>
        </div>

        {/* Currency & Preset Toolbar */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
          {/* Preset Buttons */}
          <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto pb-2 md:pb-0 custom-scrollbar">
            {PRESETS.map((p) => {
              const Icon = p.icon;
              const isSelected = activePreset === p.name;
              return (
                <button
                  key={p.name}
                  type="button"
                  onClick={() => applyPreset(p)}
                  className={`inline-flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold shrink-0 transition-all ${
                    isSelected
                      ? "bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20"
                      : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white"
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  {p.name}
                </button>
              );
            })}
          </div>

          {/* Currency Toggle + Reset */}
          <div className="flex items-center gap-2 shrink-0 self-end md:self-auto">
            <div className="flex items-center bg-slate-100 dark:bg-slate-800 p-1 rounded-xl border border-slate-200 dark:border-slate-700">
              {(["GBP", "USD", "EUR"] as Currency[]).map((c) => (
                <button
                  key={c}
                  type="button"
                  onClick={() => setCurrency(c)}
                  className={`px-2.5 py-1 text-xs font-bold rounded-lg transition-colors ${
                    currency === c
                      ? "bg-white dark:bg-slate-900 text-amber-600 dark:text-amber-400 shadow-sm"
                      : "text-slate-500 hover:text-slate-900 dark:hover:text-white"
                  }`}
                >
                  {c} ({CURRENCY_SYMBOLS[c]})
                </button>
              ))}
            </div>

            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={resetToDefault}
              className="h-8 border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-600 dark:text-slate-300 gap-1.5"
              title="Reset parameters"
            >
              <RefreshCw className="w-3 h-3" /> Reset
            </Button>
          </div>
        </div>

        {/* Main Calculator Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Inputs Column */}
          <div className="lg:col-span-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 sm:p-8 rounded-3xl space-y-6 shadow-sm dark:shadow-xl">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
              <h2 className="text-xl font-bold text-slate-900 dark:text-white">Facility Parameters</h2>
              <span className="text-xs font-bold text-amber-600 dark:text-amber-400 bg-amber-500/10 px-2.5 py-1 rounded-full">
                {activePreset}
              </span>
            </div>

            {/* Loan Amount Input */}
            <div className="space-y-3">
              <div className="flex justify-between items-center text-xs">
                <label htmlFor="loan-amount-input" className="font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wide">
                  Loan Principal ({sym})
                </label>
                <span className="text-sm font-bold text-amber-600 dark:text-amber-400">
                  {formatMoney(amount)}
                </span>
              </div>
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-sm font-bold text-slate-400">
                  {sym}
                </span>
                <Input
                  id="loan-amount-input"
                  type="number"
                  value={amount || ""}
                  onChange={(e) => {
                    const val = e.target.value === "" ? 0 : Number(e.target.value);
                    setAmount(val);
                  }}
                  min={5000}
                  max={10000000}
                  step={5000}
                  className="pl-9 bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white font-semibold text-base"
                />
              </div>
              <input
                type="range"
                min={10000}
                max={5000000}
                step={10000}
                value={amount}
                onChange={(e) => setAmount(Number(e.target.value))}
                className="w-full accent-amber-500 bg-slate-200 dark:bg-slate-800 cursor-pointer h-2 rounded-lg"
              />
              <div className="flex justify-between text-[11px] text-slate-400 font-mono">
                <span>{sym}10k</span>
                <span>{sym}2.5M</span>
                <span>{sym}5.0M+</span>
              </div>
            </div>

            {/* Interest Rate Input */}
            <div className="space-y-3 pt-2 border-t border-slate-100 dark:border-slate-800">
              <div className="flex justify-between items-center text-xs">
                <label htmlFor="interest-rate-input" className="font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wide">
                  Annual Interest Rate (%)
                </label>
                <span className="text-sm font-bold text-amber-600 dark:text-amber-400">
                  {rate}% APY
                </span>
              </div>
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400">
                  <Percent className="w-4 h-4" />
                </span>
                <Input
                  id="interest-rate-input"
                  type="number"
                  step="0.05"
                  value={rate || ""}
                  onChange={(e) => {
                    const val = e.target.value === "" ? 0 : Number(e.target.value);
                    setRate(val);
                  }}
                  min={0.1}
                  max={25}
                  className="pl-9 bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white font-semibold text-base"
                />
              </div>
              <input
                type="range"
                min={1}
                max={15}
                step={0.05}
                value={rate}
                onChange={(e) => setRate(Number(e.target.value))}
                className="w-full accent-amber-500 bg-slate-200 dark:bg-slate-800 cursor-pointer h-2 rounded-lg"
              />
              <div className="flex justify-between text-[11px] text-slate-400 font-mono">
                <span>1.0%</span>
                <span>7.5%</span>
                <span>15.0%</span>
              </div>
            </div>

            {/* Term Duration Input */}
            <div className="space-y-3 pt-2 border-t border-slate-100 dark:border-slate-800">
              <div className="flex justify-between items-center text-xs">
                <label htmlFor="term-years-input" className="font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wide">
                  Term Duration (Years)
                </label>
                <span className="text-sm font-bold text-amber-600 dark:text-amber-400">
                  {years} Years ({years * 12} Months)
                </span>
              </div>
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400">
                  <Calendar className="w-4 h-4" />
                </span>
                <Input
                  id="term-years-input"
                  type="number"
                  value={years || ""}
                  onChange={(e) => {
                    const val = e.target.value === "" ? 0 : Number(e.target.value);
                    setYears(val);
                  }}
                  min={1}
                  max={40}
                  className="pl-9 bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white font-semibold text-base"
                />
              </div>
              <input
                type="range"
                min={1}
                max={35}
                step={1}
                value={years}
                onChange={(e) => setYears(Number(e.target.value))}
                className="w-full accent-amber-500 bg-slate-200 dark:bg-slate-800 cursor-pointer h-2 rounded-lg"
              />
              <div className="flex justify-between text-[11px] text-slate-400 font-mono">
                <span>1 Yr</span>
                <span>15 Yrs</span>
                <span>35 Yrs</span>
              </div>
            </div>
          </div>

          {/* Results Column */}
          <div className="lg:col-span-7 space-y-6">
            {/* Primary KPI Result Card */}
            <div className="bg-gradient-to-br from-amber-500/10 via-white to-slate-50 dark:from-amber-500/20 dark:via-slate-900 dark:to-slate-900 border border-amber-500/30 dark:border-amber-500/40 p-6 sm:p-8 rounded-3xl space-y-6 shadow-md dark:shadow-2xl">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400">
                  Estimated Monthly Payment
                </span>
                <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                  Fixed Rate Model
                </span>
              </div>

              <div className="text-4xl sm:text-5xl lg:text-6xl font-bold text-slate-900 dark:text-white tracking-tight">
                {formatMoney(calculation.monthly)}{" "}
                <span className="text-base sm:text-lg font-normal text-slate-500 dark:text-slate-400">
                  / month
                </span>
              </div>

              {/* Visual Breakdown Bar */}
              <div className="space-y-2 pt-2">
                <div className="flex justify-between text-xs font-semibold text-slate-600 dark:text-slate-400">
                  <span>Principal: {calculation.principalPercent}%</span>
                  <span>Total Interest: {calculation.interestPercent}%</span>
                </div>
                <div className="w-full h-3 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden flex">
                  <div
                    className="bg-amber-500 h-full transition-all duration-300"
                    style={{ width: `${calculation.principalPercent}%` }}
                  />
                  <div
                    className="bg-rose-500 h-full transition-all duration-300"
                    style={{ width: `${calculation.interestPercent}%` }}
                  />
                </div>
              </div>

              {/* Repayment Key Metrics */}
              <div className="grid grid-cols-2 gap-4 pt-4 border-t border-slate-200 dark:border-slate-800">
                <div className="space-y-1">
                  <div className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                    Total Capital Repaid
                  </div>
                  <div className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
                    {formatMoney(calculation.total)}
                  </div>
                </div>
                <div className="space-y-1">
                  <div className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                    Total Interest Cost
                  </div>
                  <div className="text-xl sm:text-2xl font-bold text-rose-600 dark:text-rose-400">
                    {formatMoney(calculation.interest)}
                  </div>
                </div>
              </div>

              {/* CTA */}
              <div className="pt-2">
                <Link href={`/signup?product=loan&amount=${amount}&currency=${currency}&term=${years}`}>
                  <Button size="lg" className="w-full bg-amber-500 text-slate-950 font-bold hover:bg-amber-600 shadow-md shadow-amber-500/20 gap-2">
                    Apply for this Facility <ArrowRight className="w-4 h-4" />
                  </Button>
                </Link>
              </div>
            </div>

            {/* Amortization Table Card */}
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 sm:p-8 rounded-3xl space-y-4 shadow-sm">
              <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
                <h3 className="text-sm font-bold text-slate-900 dark:text-slate-200 uppercase tracking-wider">
                  Initial 5-Year Amortization Schedule
                </h3>
                <span className="text-xs text-slate-500">Fixed Monthly Payments</span>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-xs text-left">
                  <thead>
                    <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-500">
                      <th className="py-2.5">Year</th>
                      <th className="py-2.5">Principal Paid</th>
                      <th className="py-2.5">Interest Paid</th>
                      <th className="py-2.5 text-right">Remaining Balance</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
                    {calculation.schedule.map((row) => (
                      <tr key={row.year} className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors">
                        <td className="py-3 font-bold text-slate-900 dark:text-white">Year {row.year}</td>
                        <td className="py-3 text-emerald-600 dark:text-emerald-400 font-medium">{formatMoney(row.principalPaid)}</td>
                        <td className="py-3 text-rose-600 dark:text-rose-400 font-medium">{formatMoney(row.interestPaid)}</td>
                        <td className="py-3 text-right font-mono font-semibold text-slate-800 dark:text-slate-200">{formatMoney(row.remainingBalance)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Regulatory & Advisory Notice */}
            <div className="flex items-start gap-3 p-4 rounded-2xl bg-slate-100 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              <ShieldCheck className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
              <p>
                Calculations are illustrative estimates based on a standard compounding annuity model. Final underwriting terms, interest rates, and loan-to-value (LTV) limits are subject to credit status and collateral appraisal.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
