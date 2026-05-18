import { Metadata } from "next";
import { MarketsClient } from "./markets-client";

export const metadata: Metadata = {
  title: "Live Markets",
  description: "Real-time institutional market data, pricing, and analytics.",
  alternates: {
    canonical: "/markets",
  },
};

export default function MarketsPage() {
  return <MarketsClient />;
}
