import { MFAChallenge } from "@/features/auth/components/mfa-challenge";

export default function MFAVerifyPage() {
  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <MFAChallenge />
    </div>
  );
}
