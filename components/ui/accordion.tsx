"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { ChevronDown } from "lucide-react";

interface AccordionItemContextValue {
  isOpen: boolean;
  toggle: () => void;
  id: string;
}

const AccordionItemContext = React.createContext<AccordionItemContextValue | null>(null);

function useAccordionItem() {
  const ctx = React.useContext(AccordionItemContext);
  if (!ctx) throw new Error("AccordionItem subcomponent must be used within <AccordionItem>");
  return ctx;
}

export function Accordion({ children, className }: { children: React.ReactNode; className?: string }) {
  return <div className={cn("space-y-3", className)}>{children}</div>;
}

export function AccordionItem({
  value,
  children,
  className,
}: {
  value: string;
  children: React.ReactNode;
  className?: string;
}) {
  const [isOpen, setIsOpen] = React.useState(false);
  const toggle = React.useCallback(() => setIsOpen((prev) => !prev), []);

  return (
    <AccordionItemContext.Provider value={{ isOpen, toggle, id: value }}>
      <div className={cn("border border-border rounded-2xl overflow-hidden transition-all bg-card/50", className)}>
        {children}
      </div>
    </AccordionItemContext.Provider>
  );
}

export function AccordionTrigger({ children, className }: { children: React.ReactNode; className?: string }) {
  const { isOpen, toggle } = useAccordionItem();
  return (
    <button
      type="button"
      onClick={toggle}
      className={cn(
        "flex w-full items-center justify-between p-5 text-left font-semibold text-foreground transition-colors hover:text-primary",
        className
      )}
    >
      <span>{children}</span>
      <ChevronDown className={cn("w-5 h-5 shrink-0 text-muted-foreground transition-transform duration-200", isOpen && "rotate-180 text-primary")} />
    </button>
  );
}

export function AccordionContent({ children, className }: { children: React.ReactNode; className?: string }) {
  const { isOpen } = useAccordionItem();
  if (!isOpen) return null;

  return (
    <div className={cn("px-5 pb-5 pt-0 text-sm text-muted-foreground leading-relaxed animate-fade-in", className)}>
      {children}
    </div>
  );
}
