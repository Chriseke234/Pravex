"use client";

import { useState } from "react";
import { FileCheck, Upload, Download, FileText, CheckCircle2, ShieldCheck } from "lucide-react";
import { GlassCard } from "@/components/shared/glass-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { useKyc } from "@/hooks/use-kyc";
import { useWallet } from "@/hooks/use-wallet";
import { KycDocumentType } from "@/types/supabase";
import { StatusBadge } from "@/components/ui/badge";
import { formatDate } from "@/lib/utils/formatters";
import { useToast } from "@/components/ui/toast";

export default function DocumentsPage() {
  const { documents, isLoading, uploadKyc } = useKyc();
  const { transactions } = useWallet();
  const { showToast } = useToast();

  const [docType, setDocType] = useState<KycDocumentType>("passport");
  const [fileName, setFileName] = useState("");
  const [isUploading, setIsUploading] = useState(false);

  const handleSimulatedUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fileName) return;
    setIsUploading(true);
    try {
      const mockUrl = `https://supabase-storage.ironbridge.internal/kyc/${Date.now()}_${fileName}`;
      await uploadKyc.mutateAsync({
        document_type: docType,
        file_url: mockUrl,
        file_name: fileName,
      });

      showToast({
        type: "success",
        title: "Document Uploaded",
        description: `${fileName} has been submitted for compliance verification.`,
      });

      setFileName("");
    } catch (err: any) {
      showToast({
        type: "error",
        title: "Upload Failed",
        description: err.message || "Failed to upload document.",
      });
    } finally {
      setIsUploading(false);
    }
  };

  const handleDownloadStatement = () => {
    const csvContent =
      "Date,Type,Amount,Status,Reference\n" +
      (transactions?.map((t) => `"${t.created_at}","${t.type}","${t.amount}","${t.status}","${t.reference || ""}"`).join("\n") || "");

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `IBB_Statement_${Date.now()}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-8 pb-20">
      <div className="flex items-center gap-3">
        <div className="p-2 bg-amber-500/10 border border-amber-500/20 rounded-xl text-amber-400">
          <FileCheck className="w-5 h-5" />
        </div>
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-white">Documents &amp; Compliance</h1>
          <p className="text-slate-400 text-sm">Upload identity verification files and download official bank statements.</p>
        </div>
      </div>

      <Tabs defaultValue="kyc">
        <TabsList className="mb-6">
          <TabsTrigger value="kyc">KYC Verification Docs</TabsTrigger>
          <TabsTrigger value="statements">Download Statements</TabsTrigger>
        </TabsList>

        {/* KYC Upload Tab */}
        <TabsContent value="kyc" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            <GlassCard className="lg:col-span-6 p-6 bg-slate-900/80 border-slate-800 space-y-4">
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <Upload className="w-4 h-4 text-amber-400" /> Upload Verification Document
              </h2>

              <form onSubmit={handleSimulatedUpload} className="space-y-4">
                <div>
                  <label className="text-xs font-semibold uppercase tracking-wide text-slate-400 mb-1 block">Document Type</label>
                  <select
                    value={docType}
                    onChange={(e) => setDocType(e.target.value as KycDocumentType)}
                    className="w-full h-10 px-3 bg-slate-950 border border-slate-800 rounded-xl text-sm text-white focus:outline-none focus:ring-1 focus:ring-amber-500"
                  >
                    <option value="passport">Passport (Bio Page)</option>
                    <option value="national_id">National ID Card</option>
                    <option value="drivers_license">Driver&apos;s License</option>
                    <option value="utility_bill">Utility Bill (Proof of Address)</option>
                    <option value="bank_statement">Bank Statement (External)</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-semibold uppercase tracking-wide text-slate-400 mb-1 block">File Name / Label</label>
                  <Input
                    placeholder="e.g. Passport_Scan_2026.pdf"
                    value={fileName}
                    onChange={(e) => setFileName(e.target.value)}
                    required
                  />
                </div>

                <Button type="submit" disabled={isUploading || !fileName} className="w-full bg-amber-500 text-slate-950 font-bold hover:bg-amber-600 gap-2">
                  {isUploading ? "Uploading..." : "Upload Document"} <Upload className="w-4 h-4" />
                </Button>
              </form>
            </GlassCard>

            <GlassCard className="lg:col-span-6 p-6 bg-slate-900/80 border-slate-800 space-y-4">
              <h2 className="text-lg font-bold text-white">Submitted Documents</h2>

              {documents.length === 0 ? (
                <div className="py-10 text-center text-slate-500 text-sm">
                  No KYC documents uploaded yet.
                </div>
              ) : (
                <div className="space-y-3">
                  {documents.map((doc) => (
                    <div key={doc.id} className="p-3 bg-slate-950/60 border border-slate-800 rounded-xl flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <FileText className="w-5 h-5 text-amber-400" />
                        <div>
                          <p className="text-sm font-semibold text-white">{doc.file_name || doc.document_type}</p>
                          <p className="text-[11px] text-slate-500">{formatDate(doc.created_at)}</p>
                        </div>
                      </div>
                      <StatusBadge status={doc.status} />
                    </div>
                  ))}
                </div>
              )}
            </GlassCard>
          </div>
        </TabsContent>

        {/* Statements Tab */}
        <TabsContent value="statements" className="space-y-6">
          <GlassCard className="p-8 bg-slate-900/80 border-slate-800 space-y-4 max-w-xl">
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <Download className="w-5 h-5 text-amber-400" /> Official Account Statement
            </h2>
            <p className="text-slate-400 text-sm leading-relaxed">
              Export your full transaction history and wallet ledger into CSV format for tax or accounting purposes.
            </p>
            <div className="pt-2">
              <Button onClick={handleDownloadStatement} className="bg-amber-500 text-slate-950 font-bold hover:bg-amber-600 gap-2">
                Download Latest Statement (CSV) <Download className="w-4 h-4" />
              </Button>
            </div>
          </GlassCard>
        </TabsContent>
      </Tabs>
    </div>
  );
}
