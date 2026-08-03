import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Open Institutional Account",
  description: "Start your institutional investment journey with Iron Bridge Banking.",
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
