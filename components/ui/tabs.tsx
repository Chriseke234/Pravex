"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

/* ─── Types ─────────────────────────────────────────────────── */
interface TabsContextValue {
  activeTab: string;
  setActiveTab: (value: string) => void;
}
const TabsContext = React.createContext<TabsContextValue | null>(null);

function useTabsContext() {
  const ctx = React.useContext(TabsContext);
  if (!ctx) throw new Error("Tabs subcomponent must be used inside <Tabs>");
  return ctx;
}

/* ─── Root ───────────────────────────────────────────────────── */
interface TabsProps {
  defaultValue: string;
  value?: string;
  onValueChange?: (value: string) => void;
  children: React.ReactNode;
  className?: string;
}

export function Tabs({ defaultValue, value, onValueChange, children, className }: TabsProps) {
  const [internalValue, setInternalValue] = React.useState(defaultValue);
  const activeTab = value ?? internalValue;
  const setActiveTab = (v: string) => {
    setInternalValue(v);
    onValueChange?.(v);
  };
  return (
    <TabsContext.Provider value={{ activeTab, setActiveTab }}>
      <div className={cn("w-full", className)}>{children}</div>
    </TabsContext.Provider>
  );
}

/* ─── Tab List ───────────────────────────────────────────────── */
interface TabsListProps {
  children: React.ReactNode;
  className?: string;
}

export function TabsList({ children, className }: TabsListProps) {
  return (
    <div
      role="tablist"
      className={cn(
        "inline-flex items-center rounded-xl bg-slate-900/60 border border-slate-800/60 p-1 gap-0.5",
        className
      )}
    >
      {children}
    </div>
  );
}

/* ─── Tab Trigger ────────────────────────────────────────────── */
interface TabsTriggerProps {
  value: string;
  children: React.ReactNode;
  className?: string;
  disabled?: boolean;
}

export function TabsTrigger({ value, children, className, disabled }: TabsTriggerProps) {
  const { activeTab, setActiveTab } = useTabsContext();
  const isActive = activeTab === value;
  return (
    <button
      role="tab"
      aria-selected={isActive}
      disabled={disabled}
      onClick={() => setActiveTab(value)}
      className={cn(
        "relative px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 focus-visible:ring-offset-1",
        "disabled:opacity-50 disabled:pointer-events-none",
        isActive
          ? "bg-slate-800 text-white shadow-sm"
          : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/50",
        className
      )}
    >
      {children}
    </button>
  );
}

/* ─── Tab Content ────────────────────────────────────────────── */
interface TabsContentProps {
  value: string;
  children: React.ReactNode;
  className?: string;
}

export function TabsContent({ value, children, className }: TabsContentProps) {
  const { activeTab } = useTabsContext();
  if (activeTab !== value) return null;
  return (
    <div
      role="tabpanel"
      className={cn("focus-visible:outline-none", className)}
    >
      {children}
    </div>
  );
}
