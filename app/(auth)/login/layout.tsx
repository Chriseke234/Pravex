import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Client Login",
  description: "Secure access to your Iron Bridge institutional dashboard.",
  alternates: {
    canonical: "/login",
  },
};

export default function LoginLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
