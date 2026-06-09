import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Open Institutional Account",
  description: "Start your institutional investment journey with Ironbridgemarket.",
  alternates: {
    canonical: "/signup",
  },
};

export default function SignupLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
