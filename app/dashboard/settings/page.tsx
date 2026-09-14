"use client";

import { useState, useEffect } from "react";
import { useProfile } from "@/hooks/use-profile";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Save, User, Shield, Lock, Bell, Sparkles } from "lucide-react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { GlassCard } from "@/components/shared/glass-card";
import { useToast } from "@/components/ui/toast";

export default function SettingsPage() {
  const { profile, isLoading, updateProfile } = useProfile();
  const { showToast } = useToast();

  const [fullName, setFullName] = useState("");
  const [tier, setTier] = useState("Commercial Banking");
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (profile) {
      setFullName(profile.full_name || "");
      setTier(profile.tier || "Commercial Banking");
    }
  }, [profile]);

  const handleSaveProfile = async () => {
    setIsSaving(true);
    try {
      await updateProfile({
        full_name: fullName,
        tier,
      });
      showToast({ type: "success", title: "Profile Saved", description: "Your account details have been updated." });
    } catch (e: any) {
      showToast({ type: "error", title: "Update Failed", description: e.message || "Failed to update profile." });
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return <div className="p-8 text-slate-500">Loading settings...</div>;
  }

  return (
    <div className="space-y-8 pb-20 max-w-4xl">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-white">Account Settings &amp; Security</h1>
        <p className="text-slate-400 text-sm">Manage profile credentials, account tier, and security preferences.</p>
      </div>

      <Tabs defaultValue="profile">
        <TabsList className="mb-6">
          <TabsTrigger value="profile">Personal Profile</TabsTrigger>
          <TabsTrigger value="security">Security &amp; 2FA</TabsTrigger>
          <TabsTrigger value="preferences">Preferences</TabsTrigger>
        </TabsList>

        {/* Profile Tab */}
        <TabsContent value="profile">
          <GlassCard className="p-8 bg-slate-900/80 border-slate-800 space-y-6">
            <div className="flex items-center gap-4 border-b border-slate-800 pb-6">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-amber-500 to-amber-600 flex items-center justify-center font-bold text-xl text-slate-950">
                {fullName?.charAt(0) || profile?.email?.charAt(0) || "U"}
              </div>
              <div>
                <h2 className="text-lg font-bold text-white">{profile?.email}</h2>
                <p className="text-xs text-slate-400">Role: <span className="text-amber-400 uppercase font-semibold">{profile?.role || "user"}</span></p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5 text-amber-400" /> Full Name
                </label>
                <Input
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="e.g. Marcus Vance"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                  <Shield className="w-3.5 h-3.5 text-amber-400" /> Account Tier
                </label>
                <select
                  value={tier}
                  onChange={(e) => setTier(e.target.value)}
                  className="w-full h-10 px-3 bg-slate-950 border border-slate-800 rounded-xl text-sm text-white focus:outline-none focus:ring-1 focus:ring-amber-500"
                >
                  <option value="Commercial Banking">Commercial Banking</option>
                  <option value="Professional Banking">Professional Banking</option>
                  <option value="Enterprise / Private Client">Enterprise / Private Client</option>
                </select>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-800 flex justify-end">
              <Button onClick={handleSaveProfile} disabled={isSaving} className="gap-2 bg-amber-500 text-slate-950 font-bold hover:bg-amber-600">
                <Save className="w-4 h-4" /> Save Profile
              </Button>
            </div>
          </GlassCard>
        </TabsContent>

        {/* Security Tab */}
        <TabsContent value="security">
          <GlassCard className="p-8 bg-slate-900/80 border-slate-800 space-y-6">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <Lock className="w-5 h-5 text-amber-400" /> Multi-Factor Authentication (MFA)
            </h2>
            <p className="text-slate-400 text-sm leading-relaxed">
              Protect your online bank transfers with TOTP authenticator apps (Google Authenticator, Authy).
            </p>
            <div className="p-4 bg-slate-950 border border-slate-800 rounded-2xl flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-white">MFA Status: <span className="text-emerald-400">ENABLED</span></p>
                <p className="text-xs text-slate-500">Required for high-value wire transfers</p>
              </div>
              <Button variant="outline" size="sm">Manage 2FA</Button>
            </div>
          </GlassCard>
        </TabsContent>

        {/* Preferences Tab */}
        <TabsContent value="preferences">
          <GlassCard className="p-8 bg-slate-900/80 border-slate-800 space-y-6">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <Bell className="w-5 h-5 text-amber-400" /> Notification Preferences
            </h2>
            <div className="space-y-4 text-sm text-slate-300">
              <label className="flex items-center gap-3">
                <input type="checkbox" defaultChecked className="accent-amber-500 rounded" />
                <span>Receive instant SMS for transactions over $1,000</span>
              </label>
              <label className="flex items-center gap-3">
                <input type="checkbox" defaultChecked className="accent-amber-500 rounded" />
                <span>Email monthly PDF account statements automatically</span>
              </label>
            </div>
          </GlassCard>
        </TabsContent>
      </Tabs>
    </div>
  );
}
