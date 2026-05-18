import { Metadata } from "next";

export const metadata: Metadata = {
  title: "About Pavex",
  description: "Learn about our mission to architect the future of digital capital.",
  alternates: {
    canonical: "/about",
  },
};

export default function AboutLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
