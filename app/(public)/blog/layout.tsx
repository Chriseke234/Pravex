import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Institutional Insights Blog",
  description: "Expert analysis, product updates, and technical deep-dives.",
  alternates: {
    canonical: "/blog",
  },
};

export default function BlogLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
