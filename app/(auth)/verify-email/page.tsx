import Link from "next/link";
import { Mail, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function VerifyEmailPage() {
  return (
    <div className="space-y-7 text-center">
      <div className="w-16 h-16 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center mx-auto">
        <Mail className="w-8 h-8" />
      </div>

      <div className="space-y-2">
        <h1 className="text-3xl font-bold text-white tracking-tight">Check Your Email</h1>
        <p className="text-slate-400 text-sm max-w-sm mx-auto leading-relaxed">
          We have sent a verification link to your email address. Please click the link to verify your account and activate your banking portal.
        </p>
      </div>

      <div className="p-4 bg-slate-900 border border-slate-800 rounded-2xl text-xs text-slate-400">
        <p>Didn&apos;t receive an email? Check your spam/junk folder or contact support.</p>
      </div>

      <div className="pt-2">
        <Link href="/login">
          <Button variant="outline" className="w-full">Return to Sign In</Button>
        </Link>
      </div>
    </div>
  );
}
