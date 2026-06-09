"use client";

import { useState, useEffect } from "react";
import { useProfile } from "@/hooks/use-profile";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Save, User, Shield, AlertTriangle } from "lucide-react";

export default function SettingsPage() {
  const { profile, isLoading, updateProfile } = useProfile();
  
  const [fullName, setFullName] = useState("");
  const [tier, setTier] = useState("Starter");
  const [riskScore, setRiskScore] = useState("Low");
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (profile) {
      setFullName(profile.full_name || "");
      setTier(profile.tier || "Starter");
      setRiskScore(profile.risk_score || "Low");
    }
  }, [profile]);

  const handleSave = async () => {
    setIsSaving(true);
    await updateProfile({
      full_name: fullName,
      tier,
      risk_score: riskScore
    });
    setIsSaving(false);
  };

  if (isLoading) {
    return <div className="p-8 animate-pulse text-muted-foreground">Loading profile data...</div>;
  }

  return (
    <div className="space-y-10 pb-20 max-w-4xl">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">User Profile & Settings</h1>
        <p className="text-muted-foreground">Manage your personal information, institutional tier, and risk limits.</p>
      </div>

      <div className="glassmorphism rounded-3xl p-8 border border-white/10 space-y-8">
        <div className="flex items-center gap-4 border-b border-white/5 pb-6">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-primary to-blue-500 flex items-center justify-center font-bold text-2xl text-white">
            {fullName?.charAt(0) || profile?.email?.charAt(0) || "U"}
          </div>
          <div>
            <h2 className="text-xl font-bold">{profile?.email}</h2>
            <p className="text-sm text-muted-foreground capitalize">Role: {profile?.role || "user"}</p>
          </div>
        </div>

        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-medium flex items-center gap-2">
                <User className="w-4 h-4 text-primary" /> Full Name
              </label>
              <Input 
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="bg-black/20 border-white/10"
                placeholder="Institutional Representative"
              />
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium flex items-center gap-2">
                <Shield className="w-4 h-4 text-emerald-500" /> Account Tier
              </label>
              <select 
                value={tier}
                onChange={(e) => setTier(e.target.value)}
                className="w-full h-10 px-3 bg-black/20 border border-white/10 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-primary/50 text-white"
              >
                <option value="Starter">Starter</option>
                <option value="Professional">Professional</option>
                <option value="Enterprise">Enterprise</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-medium flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-amber-500" /> Risk Score
              </label>
              <select 
                value={riskScore}
                onChange={(e) => setRiskScore(e.target.value)}
                className="w-full h-10 px-3 bg-black/20 border border-white/10 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-primary/50 text-white"
              >
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
              </select>
              <p className="text-xs text-muted-foreground mt-1">
                Affects margin requirements and exposure limits.
              </p>
            </div>
          </div>
        </div>

        <div className="pt-6 border-t border-white/5 flex justify-end">
          <Button onClick={handleSave} disabled={isSaving} className="gap-2 bg-primary hover:bg-primary/90 text-navy font-bold">
            {isSaving ? "Saving..." : <><Save className="w-4 h-4" /> Save Changes</>}
          </Button>
        </div>
      </div>
    </div>
  );
}
