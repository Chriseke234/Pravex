"use client";

import { useState } from "react";
import { Mail, Phone, MapPin, Headset, Send, CheckCircle2, Clock } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/toast";

export default function ContactPage() {
  const { showToast } = useToast();
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    name: "",
    email: "",
    subject: "General Inquiry",
    message: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.email || !form.message) return;
    setLoading(true);

    setTimeout(() => {
      setLoading(false);
      setSubmitted(true);
      showToast({
        type: "success",
        title: "Message Transmitted",
        description: "An Iron Bridge client manager will respond within 4 business hours.",
      });
    }, 1000);
  };

  return (
    <div className="bg-slate-950 text-white min-h-screen py-20">
      <div className="max-w-6xl mx-auto px-4 space-y-16">
        <div className="space-y-4 text-center">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-semibold">
            <Headset className="w-4 h-4" /> Client Advisory &amp; Support
          </div>
          <h1 className="text-4xl md:text-6xl font-serif font-bold">Contact Iron Bridge Banking</h1>
          <p className="text-slate-400 text-lg max-w-xl mx-auto">
            Get in touch with our personal advisors, private wealth managers, or corporate trade desk.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Contact Details */}
          <div className="lg:col-span-5 space-y-8 bg-slate-900 border border-slate-800 p-8 rounded-3xl">
            <h2 className="text-xl font-bold text-white border-b border-slate-800 pb-4">Global Offices &amp; Desks</h2>

            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="p-3 bg-amber-500/10 border border-amber-500/20 text-amber-400 rounded-2xl shrink-0">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-white text-sm">Global Headquarters</h3>
                  <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                    Iron Bridge Tower, 25 Bank Street<br />Canary Wharf, London, E14 5JP, UK
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="p-3 bg-amber-500/10 border border-amber-500/20 text-amber-400 rounded-2xl shrink-0">
                  <Phone className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-white text-sm">Client Services Hotline</h3>
                  <p className="text-xs text-slate-400 mt-1">+44 (0) 20 7946 0912 (UK / Global)</p>
                  <p className="text-xs text-slate-400">+1 (800) 555-0192 (US Toll Free)</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="p-3 bg-amber-500/10 border border-amber-500/20 text-amber-400 rounded-2xl shrink-0">
                  <Mail className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-white text-sm">Email Advisory</h3>
                  <p className="text-xs text-slate-400 mt-1">privatebanking@ironbridgebanking.com</p>
                  <p className="text-xs text-slate-400">corporatetrade@ironbridgebanking.com</p>
                </div>
              </div>

              <div className="flex items-start gap-4 pt-4 border-t border-slate-800">
                <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-2xl shrink-0">
                  <Clock className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-white text-sm">Operating Hours</h3>
                  <p className="text-xs text-slate-400 mt-1">24/7 Digital Platform &amp; Phone Support for Private Clients</p>
                </div>
              </div>
            </div>
          </div>

          {/* Form */}
          <div className="lg:col-span-7 bg-slate-900 border border-slate-800 p-8 rounded-3xl">
            {submitted ? (
              <div className="py-16 text-center space-y-4">
                <div className="w-16 h-16 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <h3 className="text-2xl font-bold text-white">Thank You for Reaching Out</h3>
                <p className="text-slate-400 text-sm max-w-sm mx-auto">
                  Your inquiry has been routed to the appropriate department manager. We will contact you shortly.
                </p>
                <Button variant="outline" onClick={() => setSubmitted(false)}>Send Another Message</Button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <h2 className="text-xl font-bold text-white border-b border-slate-800 pb-4">Transmit a Message</h2>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold uppercase tracking-wider text-slate-400">Full Name</label>
                    <Input
                      placeholder="e.g. Eleanor Vance"
                      value={form.name}
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                      required
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold uppercase tracking-wider text-slate-400">Email Address</label>
                    <Input
                      type="email"
                      placeholder="you@company.com"
                      value={form.email}
                      onChange={(e) => setForm({ ...form, email: e.target.value })}
                      required
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold uppercase tracking-wider text-slate-400">Subject / Department</label>
                  <select
                    value={form.subject}
                    onChange={(e) => setForm({ ...form, subject: e.target.value })}
                    className="w-full h-10 px-3 bg-slate-950 border border-slate-800 rounded-xl text-sm text-white focus:outline-none focus:ring-1 focus:ring-amber-500"
                  >
                    <option value="Personal Accounts">Personal Banking Inquiry</option>
                    <option value="Private Banking">Private Wealth &amp; Concierge</option>
                    <option value="Business Accounts">Business &amp; Trade Finance</option>
                    <option value="Mortgages">Mortgages &amp; Property Loans</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold uppercase tracking-wider text-slate-400">Message</label>
                  <textarea
                    rows={5}
                    placeholder="How can our financial team assist you?"
                    value={form.message}
                    onChange={(e) => setForm({ ...form, message: e.target.value })}
                    required
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-sm text-white placeholder:text-slate-600 focus:outline-none focus:ring-1 focus:ring-amber-500"
                  />
                </div>

                <Button type="submit" disabled={loading} className="w-full h-11 bg-amber-500 text-slate-950 font-bold hover:bg-amber-600 gap-2">
                  {loading ? "Transmitting..." : "Send Message"} <Send className="w-4 h-4" />
                </Button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
