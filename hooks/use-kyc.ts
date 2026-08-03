"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { createClient } from "@/lib/supabase/client";
import { KycDocument, KycDocumentType } from "@/types/supabase";

export function useKyc() {
  const supabase = createClient();
  const queryClient = useQueryClient();

  const kycQuery = useQuery<KycDocument[]>({
    queryKey: ["kyc-documents"],
    queryFn: async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.user) return [];

      const { data, error } = await supabase
        .from("kyc_documents")
        .select("*")
        .eq("user_id", session.user.id)
        .order("created_at", { ascending: false });

      if (error) throw error;
      return (data || []) as KycDocument[];
    },
  });

  const uploadKyc = useMutation({
    mutationFn: async ({ document_type, file_url, file_name }: { document_type: KycDocumentType; file_url: string; file_name: string }) => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.user) throw new Error("Not authenticated");

      const { data, error } = await supabase
        .from("kyc_documents")
        .insert([{
          user_id: session.user.id,
          document_type,
          file_url,
          file_name,
          status: "pending",
        }])
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["kyc-documents"] });
    },
  });

  return {
    documents: kycQuery.data || [],
    isLoading: kycQuery.isLoading,
    uploadKyc,
  };
}
